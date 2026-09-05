import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/Page';
import FilAriane from '@/components/FilAriane';
import RetourParent from '@/components/RetourParent';
import ListeLiens from '@/components/ListeLiens';
import GrilleCalcul from '@/components/GrilleCalcul';
import Simulateur from '@/components/Simulateur';
import FicheSynthese from '@/components/FicheSynthese';
import { DocumentsEnVigueur, HistoriqueVersions } from '@/components/FicheDocuments';
import Terme from '@/components/Terme';
import { BoutonModale } from '@/components/Modales';
import { secteurParSlug, familleLabel } from '@/lib/secteurs';
import {
  FICHES_EN_LIGNE, LIBELLE_ZONE, ancreFiche, aUnHistorique, ficheParCode, fichesLiees,
  slugFiche,
} from '@/lib/fiches';
import { champs } from '@/lib/calcul';
import { url } from '@/lib/routes';
import { dateFr, anneeCourante } from '@/lib/dates';
import { nombreFr } from '@/lib/site';

/**
 * Le gabarit unique des pages de fiche.
 *
 * ⚠️ LE NOMBRE DE SECTIONS SUIT LA MATIÈRE, ET C'EST LA RÈGLE CENTRALE DE CE FICHIER. Six
 * sections sur une fiche pauvre, douze sur une fiche riche. Rien n'est rendu à vide, et
 * surtout rien n'est comblé par du texte générique : une section « Conditions d'éligibilité »
 * qui dirait « nous consulter » sur cent pages coûterait la crédibilité des cent autres.
 *
 * Les sections conditionnelles sont marquées ci-dessous. Les six qui restent toujours :
 * synthèse, montant, documents, durée de vie, opérations complémentaires, appel à l'action.
 */

export function generateStaticParams() {
  return FICHES_EN_LIGNE.map((f) => ({ secteur: f.secteur, code: slugFiche(f.code) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const fiche = ficheParCode(code);
  if (!fiche) return {};
  const secteur = secteurParSlug(fiche.secteur);
  return {
    // ⚠️ `titreCourt`, jamais l'intitulé : il dépasse 100 caractères sur une vingtaine de
    // fiches, et un <title> tronqué par le moteur perd justement le code et l'année.
    title: `${fiche.code} : ${fiche.titreCourt} — prime CEE ${anneeCourante()}`,
    description:
      `Montant, conditions et justificatifs de la fiche ${fiche.code} (${secteur?.label.toLowerCase()}). ` +
      `Version ${fiche.version}, applicable depuis le ${dateFr(fiche.dateApplication)}.`,
  };
}

export default async function PageFiche({ params }: { params: Promise<{ secteur: string; code: string }> }) {
  const { secteur: slugSecteur, code } = await params;
  const fiche = ficheParCode(code);
  if (!fiche || fiche.secteur !== slugSecteur) notFound();

  const secteur = secteurParSlug(fiche.secteur)!;

  /* Le bloc de six liens, réparti sur deux sections : les jumelles disent ce qu'il ne faut
     pas confondre, les voisines ce qu'on fait souvent en même temps. Six au total, jumelles
     prioritaires, trois au plus. */
  const liees = fichesLiees(fiche.code, 6);
  const jumelles = liees.filter((f) => fiche.jumelles.includes(f.code)).slice(0, 3);
  const complementaires = liees.filter((f) => !jumelles.includes(f));

  const entrees = champs(fiche.calcul);
  const enveloppe = [...entrees.map((c) => c.libelle), ...(fiche.justificatifs ?? [])];
  const aPartieA = fiche.documents.some((d) => d.nature === 'partie_a');

  return (
    <>
      <FilAriane chemin={url.fiche(fiche.secteur, fiche.code)} />

      <main className="page page-fiche">
        {/* Tant que la date n'est pas atteinte, la page reste en ligne et prévient. Une fois
            passée, la fiche sort du registre et une 301 mène au hub du secteur. */}
        {fiche.dateAbrogation && (
          <p className="bandeau-abrogation" role="status">
            <strong>Fiche abrogée au {dateFr(fiche.dateAbrogation)}.</strong> Les opérations
            engagées après cette date ne seront plus éligibles au titre de {fiche.code}.
          </p>
        )}

        <RetourParent chemin={url.fiche(fiche.secteur, fiche.code)} />
        <div className="fiche-code">
          {familleLabel(fiche.secteur, fiche.famille)} · {secteur.label}
        </div>
        <h1 className="page-titre">{fiche.code} — {fiche.intitule}</h1>

        {/* §2 du PDF : la définition officielle de l'opération, en chapô. Elle n'a pas de
            section à elle, c'est la phrase qui dit de quoi la page parle. */}
        {fiche.denomination && <p className="page-chapo">{fiche.denomination}</p>}

        {/* 1 — Encadré de synthèse */}
        <FicheSynthese fiche={fiche} />

        {/* 2 — Montant : la grille officielle, puis le simulateur */}
        <Section titre={`Quel montant de prime pour ${fiche.code} ?`} id="montant">
          <p className="page-texte">
            Le barème ci-dessous donne le forfait en{' '}
            <Terme slug="kwh-cumac">kWh cumac</Terme> retenu par la fiche
            {fiche.calcul.type === 'croisement' &&
              fiche.calcul.dimensions.some((d) => d.nom.includes('Zone climatique')) && (
                <> selon la <Terme slug="zone-climatique">zone climatique</Terme></>
              )}
            .
          </p>

          <GrilleCalcul calcul={fiche.calcul} />
          <Simulateur calcul={fiche.calcul} code={fiche.code} />

          {/* Volumes engagés : masqués quand la fiche n'en a pas. On n'affiche jamais 0. */}
          {fiche.volumeEngage && (
            <div className="volumes">
              <h3 className="grille-sous-titre">Volumes engagés sur cette fiche</h3>
              <div className="tableau-cadre">
                <table className="tableau">
                  <thead>
                    <tr>
                      <th scope="col">Période</th>
                      <th scope="col">kWh cumac classiques</th>
                      <th scope="col">kWh cumac précarité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fiche.volumeEngage.map((v) => (
                      <tr key={`${v.annee}-${v.trimestre}`}>
                        <th scope="row">T{v.trimestre} {v.annee}</th>
                        <td>{nombreFr.format(v.kwhClassique)}</td>
                        <td>{v.kwhPrecarite === 0 ? '—' : nombreFr.format(v.kwhPrecarite)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Section>

        {/* 3 — Documents en vigueur */}
        <Section titre={`Télécharger la fiche ${fiche.code} et ses annexes`} id="documents">
          <DocumentsEnVigueur fiche={fiche} />
        </Section>

        {/* 4 — §1, conditionnelle */}
        {fiche.secteurApplication && (
          <Section titre="Qui peut en bénéficier ?" id="beneficiaires">
            <p className="page-texte">{fiche.secteurApplication}</p>
            <p className="page-texte">
              Zone d’application : {LIBELLE_ZONE[fiche.zoneApplication].toLowerCase()}.
            </p>
          </Section>
        )}

        {/* 5 — §3, conditionnelle */}
        {fiche.conditions && (
          <Section titre="Conditions d’éligibilité" id="conditions">
            <dl className="conditions">
              {fiche.conditions.map((c) => (
                <div key={c.titre}>
                  <dt>{c.titre}</dt>
                  <dd>{c.texte}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {/* 6 — Justificatifs, conditionnelle.
            ⚠️ ELLE TIENT À `justificatifs`, PAS À LA PRÉSENCE D'UNE PARTIE A. Toutes les
            fiches ou presque ont une Partie A : la conditionner là-dessus rendrait la section
            partout, et une fiche pauvre en compterait sept au lieu de six. Ce qui mérite une
            section, ce sont les pièces que la Partie A réclame EN PLUS des champs du calcul,
            lesquels sont déjà sous les yeux dans le simulateur. */}
        {fiche.justificatifs && (
          <Section titre="Justificatifs et attestation sur l’honneur" id="justificatifs">
            <p className="page-texte">
              L’attestation sur l’honneur, partie A, réclame les éléments suivants.
            </p>
            <ul className="liste-puces">
              {enveloppe.map((j) => <li key={j}>{j}</li>)}
            </ul>
            {!aPartieA && (
              <p className="page-texte page-texte-gris">
                La partie A de cette fiche n’est pas publiée en ligne à ce jour.
              </p>
            )}
          </Section>
        )}

        {/* 7 — Historique, conditionnelle */}
        {aUnHistorique(fiche) && (
          <Section titre="Versions et dates d’application" id="versions">
            <HistoriqueVersions fiche={fiche} />
          </Section>
        )}

        {/* 8 — Durée de vie */}
        <Section titre="Durée de vie conventionnelle" id="duree-de-vie">
          {fiche.dureeVie.length === 1 ? (
            <p className="page-texte">
              La <Terme slug="duree-de-vie-conventionnelle">durée de vie conventionnelle</Terme>{' '}
              retenue par la fiche {fiche.code} est de <strong>{fiche.dureeVie[0].valeurAnnees} ans</strong>.
            </p>
          ) : (
            <>
              <p className="page-texte">
                La <Terme slug="duree-de-vie-conventionnelle">durée de vie conventionnelle</Terme>{' '}
                dépend du cas de figure.
              </p>
              <dl className="conditions">
                {fiche.dureeVie.map((d) => (
                  <div key={d.condition}>
                    <dt>{d.valeurAnnees} ans</dt>
                    <dd>{d.condition}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </Section>

        {/* 9 — Coup de pouce, conditionnelle */}
        {fiche.coupDePouce && (
          <Section titre={`${fiche.code} et le Coup de pouce`} id="coup-de-pouce">
            <p className="page-texte">
              <strong>{fiche.coupDePouce.nom}</strong>
            </p>
            <p className="page-texte">
              {fiche.coupDePouce.texte} Voir <Terme slug="coup-de-pouce">le Coup de pouce</Terme>{' '}
              dans le glossaire.
            </p>
          </Section>
        )}

        {/* 10 — Jumelles, conditionnelle */}
        {jumelles.length > 0 && (
          <Section titre="À ne pas confondre avec" id="jumelles">
            <p className="page-texte">
              {jumelles.length > 1 ? 'Ces fiches couvrent' : 'Cette fiche couvre'} la même
              opération dans un autre secteur : le montant et les conditions diffèrent.
            </p>
            <ListeLiens
              liens={jumelles.map((f) => ({
                href: url.fiche(f.secteur, f.code),
                label: ancreFiche(f),
                note: secteurParSlug(f.secteur)?.label,
              }))}
              colonnes={1}
            />
          </Section>
        )}

        {/* 11 — Voisines */}
        {complementaires.length > 0 && (
          <Section titre={`Opérations complémentaires en ${secteur.label.toLowerCase()}`} id="complementaires">
            <ListeLiens
              liens={complementaires.map((f) => ({
                href: url.fiche(f.secteur, f.code),
                label: ancreFiche(f),
                note: familleLabel(f.secteur, f.famille),
              }))}
            />
          </Section>
        )}

        {/* 12 — Appel à l'action. ⛔ Jamais vers /contact : la page de contact reçoit des
            questions, pas des opérations. Le code part avec la demande. */}
        <Section titre={`Faire valoriser une opération ${fiche.code}`} id="valoriser">
          <p className="page-texte">
            Nous mettons plusieurs obligés en concurrence sur votre dossier et vous
            transmettons l’engagement de prime avant la signature du devis.
          </p>
          <BoutonModale modale="estimation" contexte={`Fiche ${fiche.code}`} className="pilule pilule-accent">
            Estimer ma prime {fiche.code} →
          </BoutonModale>
        </Section>
      </main>
    </>
  );
}
