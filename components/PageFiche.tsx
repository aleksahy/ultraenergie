import Link from 'next/link';
import { Section } from '@/components/Page';
import FilAriane from '@/components/FilAriane';
import RetourParent from '@/components/RetourParent';
import ListeLiens from '@/components/ListeLiens';
import GrilleCalcul from '@/components/GrilleCalcul';
import FicheSynthese from '@/components/FicheSynthese';
import { DocumentsEnVigueur, HistoriqueVersions } from '@/components/FicheDocuments';
import Terme from '@/components/Terme';
import { BoutonModale } from '@/components/Modales';
import { secteurParSlug } from '@/lib/secteurs';
import { ancreFiche, aUnePage, fichesLiees, intituleDe, type Fiche } from '@/lib/fiches';
import { exemple } from '@/lib/calcul';
import { url } from '@/lib/routes';
import { dateFr, dateCourte, anneeCourante } from '@/lib/dates';
import { nombreFr, euroFr, enEuros, TAUX_CEE } from '@/lib/site';

/**
 * Le gabarit des pages de fiche : douze sections, rendues seulement si leur donnée existe.
 *
 * ⚠️ L'ORDRE EST UN ORDRE D'INTENTION, PAS UN ORDRE LOGIQUE.
 *   · Le montant vient en 2, et le CTA JUSTE DESSOUS : c'est le pic d'intention de la page,
 *     le moment où quelqu'un vient de voir ce que ça rapporte.
 *   · Le téléchargement vient en 9, tout en bas : c'est une SORTIE. Le placer avant le CTA,
 *     c'est faire partir le visiteur avec un PDF au lieu d'une demande.
 * ⛔ Ne pas remonter la section 9 pour « rendre les documents plus accessibles » : l'ancre de
 * l'encadré de synthèse y mène en un clic, et le défilement traverse le CTA au passage.
 */
export default function PageFiche({ fiche }: { fiche: Fiche }) {
  const secteur = secteurParSlug(fiche.secteur)!;

  /* Le bloc de six liens, réparti sur deux sections : les jumelles disent ce qu'il ne faut
     pas confondre, les voisines ce qu'on fait souvent en même temps. */
  const liees = fichesLiees(fiche.code, 6);
  const jumelles = fiche.jumelles.slice(0, 3);
  const complementaires = fiche.voisines ?? liees.filter((f) => !fiche.jumelles.includes(f.code)).map((f) => f.code);

  const chiffre = exemple(fiche.calcul);
  const documents = fiche.documents.length > 0;

  return (
    <>
      <FilAriane chemin={url.fiche(fiche.secteur, fiche.code)} />

      <main className="page page-fiche">
        <RetourParent chemin={url.fiche(fiche.secteur, fiche.code)} />
        <h1 className="page-titre">{fiche.code} — {fiche.h1Edite}</h1>

        {fiche.denomination && <p className="page-chapo">{fiche.denomination}</p>}

        {/* 1 — Encadré de synthèse */}
        <FicheSynthese fiche={fiche} />

        {/* 2 — Montant, puis le CTA */}
        <Section titre={`Quel montant de prime pour ${fiche.code} ?`} id="montant">
          <p className="page-texte">
            Le barème donne le forfait en <Terme slug="kwh-cumac">kWh cumac</Terme> retenu par la
            fiche{estParZone(fiche) && <> selon la <Terme slug="zone-climatique">zone climatique</Terme></>}.
          </p>

          <GrilleCalcul calcul={fiche.calcul} />

          {chiffre && (
            <p className="exemple">
              <span className="exemple-etiquette">Exemple</span>
              {chiffre.hypothese} → <strong>{nombreFr.format(chiffre.kwhCumac)} kWh cumac</strong>,
              soit environ <strong>{euroFr.format(enEuros(chiffre.kwhCumac))}</strong> sur la base
              de {TAUX_CEE.euroParMwhCumac} €/MWh cumac relevés le {dateFr(TAUX_CEE.releveLe)}.
            </p>
          )}

          <p className="mention">
            Montant indicatif, sous réserve de validation du dossier.
          </p>

          {/* ⚠️ LE PIC D'INTENTION EST ICI, pas en bas de page. */}
          <Link className="pilule pilule-accent" href={`${url.simulateur}?fiche=${fiche.code.toLowerCase()}`}>
            Estimer précisément ma prime →
          </Link>
        </Section>

        {/* 3 — §1, conditionnelle */}
        {fiche.secteurApplication && (
          <Section titre="Qui peut en bénéficier ?" id="beneficiaires">
            <p className="page-texte">{fiche.secteurApplication}</p>
          </Section>
        )}

        {/* 4 — §3, conditionnelle */}
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

        {/* 5 — Justificatifs, conditionnelle */}
        {fiche.justificatifs && (
          <Section titre="Justificatifs et attestation sur l’honneur" id="justificatifs">
            <p className="page-texte">La preuve de réalisation mentionne :</p>
            <ul className="liste-puces">
              {fiche.justificatifs.map((j) => <li key={j}>{j}</li>)}
            </ul>
          </Section>
        )}

        {/* 6 — Durée de vie */}
        <Section titre="Durée de vie conventionnelle" id="duree-de-vie">
          {fiche.dureeVie.length === 1 ? (
            <p className="page-texte">
              La <Terme slug="duree-de-vie-conventionnelle">durée de vie conventionnelle</Terme>{' '}
              retenue par la fiche {fiche.code} est de <strong>{fiche.dureeVie[0].valeurAnnees} ans</strong>.
            </p>
          ) : (
            <dl className="conditions">
              {fiche.dureeVie.map((d) => (
                <div key={d.condition}>
                  <dt>{d.valeurAnnees} ans</dt>
                  <dd>{d.condition}</dd>
                </div>
              ))}
            </dl>
          )}
        </Section>

        {/* 7 — Coup de pouce, conditionnelle */}
        {fiche.coupDePouce && (
          <Section titre={`${fiche.code} et le Coup de pouce`} id="coup-de-pouce">
            <p className="page-texte"><strong>{fiche.coupDePouce.nom}</strong></p>
            <p className="page-texte">{fiche.coupDePouce.texte}</p>
          </Section>
        )}

        {/* 8 — Versions */}
        <Section titre="Versions et dates d’application" id="versions">
          <HistoriqueVersions fiche={fiche} />
        </Section>

        {/* 9 — Téléchargement. Une sortie : elle reste après le CTA. */}
        {documents && (
          <Section titre={`Télécharger la fiche ${fiche.code} et ses annexes`} id="documents">
            <DocumentsEnVigueur fiche={fiche} />
          </Section>
        )}

        {/* 10 — Jumelles, conditionnelle. Le titre porte les codes : « à ne pas confondre »
            sans dire avec quoi n'apprend rien à qui parcourt les intertitres. */}
        {jumelles.length > 0 && (
          <Section titre={`À ne pas confondre avec ${jumelles.join(', ')}`} id="jumelles">
            {fiche.noteJumelles && <p className="page-texte">{fiche.noteJumelles}</p>}
            <ListeFichesLiees codes={jumelles} />
          </Section>
        )}

        {/* 11 — Voisines */}
        {complementaires.length > 0 && (
          <Section titre={`Opérations complémentaires en ${secteur.label.toLowerCase()}`} id="complementaires">
            <ListeFichesLiees codes={complementaires} />
          </Section>
        )}

        {/* 12 — Appel à l'action de clôture. Le code part avec la demande. */}
        <Section titre={`Faire valoriser une opération ${fiche.code}`} id="valoriser">
          <p className="page-texte">
            Nous mettons plusieurs obligés en concurrence sur votre dossier et vous
            transmettons l’engagement de prime avant la signature du devis.
          </p>
          <BoutonModale modale="estimation" contexte={`Fiche ${fiche.code}`} className="pilule pilule-accent">
            Faire valoriser {fiche.code} →
          </BoutonModale>
        </Section>
      </main>
    </>
  );
}

/**
 * Les liens vers d'autres fiches. Une fiche sans page publiée est rendue en texte plutôt
 * qu'en lien mort — l'ancre porte toujours « CODE — intitulé », jamais le code seul.
 */
function ListeFichesLiees({ codes }: { codes: string[] }) {
  const liables = codes.filter(aUnePage);
  const inertes = codes.filter((c) => !aUnePage(c));

  return (
    <>
      {liables.length > 0 && (
        <ListeLiens
          liens={liables.map((code) => ({
            href: url.fiche(secteurDe(code), code),
            label: ancreFiche(code),
          }))}
        />
      )}
      {inertes.length > 0 && (
        <ul className="fiches-liste">
          {inertes.map((code) => (
            <li key={code}>
              <span className="fiche-entree fiche-entree-inerte">
                <span className="fiche-entree-code">{code}</span>
                {intituleDe(code) && <span className="fiche-entree-titre">{intituleDe(code)}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function secteurDe(code: string): string {
  const prefixes: Record<string, string> = {
    AGRI: 'agriculture', IND: 'industrie', RES: 'reseau',
    BAR: 'residentiel', BAT: 'tertiaire', TRA: 'transport',
  };
  return prefixes[code.split('-')[0]] ?? '';
}

/** Vrai quand le barème est indexé sur la zone climatique : conditionne un lien contextuel. */
function estParZone(fiche: Fiche): boolean {
  return (
    fiche.calcul.type === 'croisement' &&
    fiche.calcul.dimensions.some((d) => d.nom.toLowerCase().includes('zone climatique'))
  );
}

/** Le <title> et la description d'une fiche, à passer à `generateMetadata`. */
export function metadataFiche(fiche: Fiche) {
  const secteur = secteurParSlug(fiche.secteur);
  return {
    // ⚠️ L'INTITULÉ OFFICIEL DANS LE <title>, LE H1 ÉDITÉ DANS LE H1 : les deux couvrent des
    // vocabulaires différents. Les intervertir revient à n'en couvrir qu'un.
    title: `${fiche.code} : ${fiche.intitule} — prime CEE ${anneeCourante()}`,
    description:
      `Montant, conditions et justificatifs de la fiche ${fiche.code} (${secteur?.label}). ` +
      `Version ${fiche.version}, applicable depuis le ${dateCourte(fiche.dateApplication)}.`,
  };
}
