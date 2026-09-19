import { Section } from '@/components/Page';
import FilAriane from '@/components/FilAriane';
import ListeLiens from '@/components/ListeLiens';
import GrilleCalcul from '@/components/GrilleCalcul';
import TableauBareme from '@/components/TableauBareme';
import FicheSynthese from '@/components/FicheSynthese';
import FicheRail, { FicheSources } from '@/components/FicheRail';
import Terme from '@/components/Terme';
import { BoutonModale } from '@/components/Modales';
import { secteurParSlug } from '@/lib/secteurs';
import { ancreFiche, aUnePage, fichesLiees, intituleDe, type Fiche } from '@/lib/fiches';
import { champs } from '@/lib/calcul';
import { url } from '@/lib/routes';
import { dateCourte, dateFr, anneeCourante } from '@/lib/dates';

/**
 * Le gabarit des pages de fiche : neuf sections possibles, rendues seulement si leur donnée
 * existe.
 *
 * ⚠️ DE LA PROSE, MAIS PAS DE GÉNÉRALITÉS. Une page qui enchaîne donnée sur donnée se lit
 * comme un export ; une page qui explique ce qu'est une fiche CEE à chaque section se lit
 * comme un cours. La prose de ce gabarit parle de CETTE fiche : elle est composée depuis la
 * donnée (code, intitulé, forfait, qualification, dates, jumelles), et une phrase qui serait
 * vraie sur n'importe quelle page du site n'a pas sa place ici — elle va dans « Comprendre
 * les CEE ». ⛔ Aucun fait propre à une fiche n'est écrit en dur : tout passe par le modèle.
 *
 * L'INTRODUCTION SOUS LE H1 est le texte de référencement de la page : le code, l'intitulé
 * officiel, « prime CEE », le champ d'application et le forfait, dans les cent premiers mots.
 *
 * ⛔ PLUS DE SECTIONS « DURÉE DE VIE » NI « VERSIONS » (retirées le 19/09/2026). La durée de
 * vie et la version applicable restent dans l'encadré de synthèse ; l'historique des
 * versions intéresse le PNCEE, pas un maître d'ouvrage. Les documents restent dans le modèle
 * et donnent encore la date de mise à jour de la bande latérale.
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


  /* La quantité par laquelle le forfait se multiplie (« Surface d'isolant »), s'il y en a une. */
  const quantite = fiche.calcul ? champs(fiche.calcul).find((c) => c.nature === 'nombre') : undefined;

  /* ⚠️ UNE SEULE LISTE POUR LE RENDU ET LE SOMMAIRE. Le nombre de sections varie de cinq à
     neuf selon la matière : une table des matières construite à part finirait par annoncer
     une section absente, ou par en oublier une. `court` est le libellé de la bande latérale,
     où les titres longs ne tiendraient pas. */
  const sections: SectionFiche[] = [
    {
      id: 'bref',
      titre: 'La fiche en bref',
      court: 'La fiche en bref',
      contenu: <FicheSynthese fiche={fiche} />,
    },
  ];

  /* Le barème : modélisé (grille + simulateur) quand quelqu'un l'a écrit et vérifié, sinon
     les tableaux tels que le PDF les publie. Une fiche sans l'un ni l'autre n'a pas de
     section : on ne remplace pas un barème absent par une phrase. */
  if (fiche.calcul || fiche.bareme) {
    sections.push({
      id: 'bareme',
      titre: `Le barème de ${fiche.code}`,
      court: 'Barème',
      contenu: fiche.calcul ? (
        <>
          <p className="page-texte">
            Le forfait de {fiche.code} est exprimé en <Terme slug="kwh-cumac">kWh cumac</Terme>
            {estParZone(fiche) && <> et dépend de la <Terme slug="zone-climatique">zone climatique</Terme> du bâtiment</>}.
            {quantite && <> Multiplié par la {quantite.libelle.toLowerCase()}, il donne le volume de certificats de l’opération, dont dépend la prime.</>}
          </p>

          <GrilleCalcul calcul={fiche.calcul} />

          {/* ⛔ NI EXEMPLE CHIFFRÉ NI APPEL À L'ACTION SOUS LA GRILLE. La section dit le
              barème, et rien d'autre : le calcul appartient au simulateur, et l'appel à
              l'action est porté par la bande latérale, qui reste visible tout du long. Trois
              blocs empilés sous le tableau repoussaient les conditions d'éligibilité hors de
              l'écran, alors que ce sont elles qu'on lit juste après un montant. */}
          <p className="mention">Volume indicatif, sous réserve de validation du dossier.</p>
        </>
      ) : (
        <>
          <p className="page-texte">
            Le montant de {fiche.code} en <Terme slug="kwh-cumac">kWh cumac</Terme>, tel que la
            fiche officielle le publie.
          </p>
          {fiche.bareme!.avant.map((n) => <p key={n} className="page-texte">{n}</p>)}
          {fiche.bareme!.tableaux.map((t, i) => <TableauBareme key={i} lignes={t} />)}
          {fiche.bareme!.notes.map((n) => <p key={n} className="page-texte">{n}</p>)}
          {/* Un tableau manqué par l'extraction ne se remplace pas par une phrase : on renvoie
              au texte officiel, et on le dit. */}
          {fiche.bareme!.incomplet && fiche.pdf && (
            <p className="page-texte">
              Une partie du barème n’est pas reproduite ici : le montant complet figure dans{' '}
              <a className="lien-terme" href={fiche.pdf} target="_blank" rel="noopener noreferrer">la fiche officielle (PDF)</a>.
            </p>
          )}
          <p className="mention">
            Volume indicatif, sous réserve de validation du dossier.
            {fiche.pdf && !fiche.bareme!.incomplet && (
              <> Texte officiel : <a href={fiche.pdf} target="_blank" rel="noopener noreferrer">la fiche {fiche.code} (PDF)</a>.</>
            )}
          </p>
        </>
      ),
    });
  }

  const perimetre = fiche.denomination?.slice(1) ?? [];
  if (fiche.secteurApplication || perimetre.length > 0) {
    sections.push({
      id: 'beneficiaires',
      titre: 'Qui peut en bénéficier ?',
      court: 'Bénéficiaires',
      contenu: (
        <>
          {fiche.secteurApplication && <p className="page-texte">{fiche.secteurApplication}</p>}
          {perimetre.map((p) => <p key={p} className="page-texte">{p}</p>)}
          {jumelles.length > 0 && (
            <p className="page-texte">
              Hors de ce champ, la même opération relève de {jumelles.join(', ')}, décrite plus bas.
            </p>
          )}
        </>
      ),
    });
  }

  if (fiche.conditions) {
    sections.push({
      id: 'conditions',
      titre: 'Conditions d’éligibilité',
      court: 'Conditions d’éligibilité',
      contenu: (
        <>
          <p className="page-texte">
            {fiche.conditions.length} conditions, toutes à remplir : un seul écart et l’opération
            est refusée en bloc, sans prime partielle.
          </p>
          {fiche.conditions.every((c) => c.titre) ? (
            <dl className="conditions">
              {fiche.conditions.map((c) => (
                <div key={c.titre}>
                  <dt>{c.titre}</dt>
                  <dd>{c.texte}</dd>
                </div>
              ))}
            </dl>
          ) : (
            fiche.conditions.map((c) => <p key={c.texte} className="page-texte">{c.texte}</p>)
          )}
        </>
      ),
    });
  }

  if (fiche.justificatifs) {
    sections.push({
      id: 'justificatifs',
      titre: 'Justificatifs et attestation sur l’honneur',
      court: 'Justificatifs',
      contenu: (
        <>
          <p className="page-texte">
            L’attestation sur l’honneur de {fiche.code}, signée par le bénéficiaire et par le
            professionnel, doit mentionner :
          </p>
          <ul className="liste-puces">
            {fiche.justificatifs.map((j) => <li key={j}>{j}</li>)}
          </ul>
          <p className="page-texte">
            Le dossier comprend aussi le devis, la facture et la preuve que l’engagement de prime
            a précédé la signature du devis.
          </p>
        </>
      ),
    });
  }

  if (fiche.coupDePouce) {
    sections.push({
      id: 'coup-de-pouce',
      titre: `${fiche.code} et le Coup de pouce`,
      court: 'Coup de pouce',
      contenu: (
        <>
          <p className="page-texte"><strong>{fiche.coupDePouce.nom}</strong></p>
          <p className="page-texte">{fiche.coupDePouce.texte}</p>
        </>
      ),
    });
  }

  /* ⛔ PAS DE SECTION TÉLÉCHARGEMENT POUR L'INSTANT (retirée le 05/09/2026). Les documents
     restent dans le modèle et donnent la date de mise à jour de la bande latérale : c'est la
     SECTION qui est retirée, pas la donnée. Le jour où elle revient, elle reprend sa place
     après l'appel à l'action — c'est une sortie, elle ne doit pas le précéder. */

  if (jumelles.length > 0) {
    sections.push({
      id: 'jumelles',
      titre: `À ne pas confondre avec ${jumelles.join(', ')}`,
      court: 'À ne pas confondre',
      contenu: (
        <>
          <p className="page-texte">
            {jumelles.join(', ')} : {fiche.noteJumelles ?? 'même intitulé, autre champ d’application.'}{' '}
            Un dossier monté sur la mauvaise fiche est refusé.
          </p>
          <ListeFichesLiees codes={jumelles} />
        </>
      ),
    });
  }

  if (complementaires.length > 0) {
    sections.push({
      id: 'complementaires',
      titre: `Opérations complémentaires en ${secteur.label.toLowerCase()}`,
      court: 'Opérations complémentaires',
      contenu: (
        <>
          <p className="page-texte">
            Ces opérations se montent souvent avec {fiche.code} sur le même chantier, chacune sur
            sa fiche, sous un seul engagement de prime.
          </p>
          <ListeFichesLiees codes={complementaires} />
        </>
      ),
    });
  }

  sections.push({
    id: 'valoriser',
    titre: `Faire valoriser une opération ${fiche.code}`,
    court: 'Faire valoriser',
    contenu: (
      <>
        <p className="page-texte">
          Contactez-nous avant de signer le devis : nous mettons plusieurs obligés en concurrence
          sur votre opération {fiche.code}, vous transmettons l’engagement de prime, puis montons
          et déposons le dossier.
        </p>
        <BoutonModale modale="estimation" contexte={`Fiche ${fiche.code}`} className="pilule pilule-accent">
          Faire valoriser {fiche.code} →
        </BoutonModale>
      </>
    ),
  });

  return (
    <>
      <FilAriane chemin={url.fiche(fiche.secteur, fiche.code)} />

      <main className="page page-fiche">
        <h1 className="page-titre">{fiche.code} — {fiche.h1Edite}</h1>
        {fiche.denomination?.[0] && <p className="page-chapo">{fiche.denomination[0]}</p>}

        <div className="fiche-intro">
          <p>
            {fiche.code} est la fiche d’opération standardisée des certificats d’économies
            d’énergie pour « {fiche.intitule.toLowerCase()} », dans le secteur {secteur.label.toLowerCase()}.
          </p>
          {(fiche.dateApplication || fiche.dateAbrogation) && (
            <p>
              La fiche est en version {fiche.version}
              {fiche.dateApplication && <>, applicable depuis le {dateCourte(fiche.dateApplication)}</>}
              {fiche.dateAbrogation && <>, et reste engageable jusqu’au {dateFr(fiche.dateAbrogation)}</>}.
            </p>
          )}
        </div>

        <div className="fiche-corps">
          <div className="fiche-colonne">
            {sections.map((s, i) => (
              <Section key={s.id} id={s.id} titre={s.titre} numero={i + 1}>
                {s.contenu}
              </Section>
            ))}

            {/* La bande disparaît sous 1120px, mais la provenance des chiffres ne peut pas
                disparaître avec elle : elle revient ici, en pied de colonne. */}
            <FicheSources fiche={fiche} enPied />
          </div>

          <FicheRail fiche={fiche} sections={sections} />
        </div>
      </main>
    </>
  );
}

/** Une section de page de fiche : rendue dans le corps, listée dans la bande latérale. */
export interface SectionFiche {
  id: string;
  titre: string;
  /** Libellé court, pour le sommaire de la bande latérale. */
  court: string;
  contenu: React.ReactNode;
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
    fiche.calcul?.type === 'croisement' &&
    fiche.calcul.dimensions.some((d) => d.nom.toLowerCase().includes('zone climatique'))
  );
}

/** Le <title> et la description d'une fiche, à passer à `generateMetadata`. */
export function metadataFiche(fiche: Fiche) {
  const secteur = secteurParSlug(fiche.secteur);
  return {
    // ⚠️ L'INTITULÉ OFFICIEL DANS LE <title>, LE H1 ÉDITÉ DANS LE H1 : les deux couvrent des
    // vocabulaires différents. Les intervertir revient à n'en couvrir qu'un.
    title: `${fiche.code} : ${fiche.intitule}, prime CEE ${anneeCourante()}`,
    description:
      `Montant, conditions et justificatifs de la fiche ${fiche.code} (${secteur?.label}). ` +
      (fiche.dateApplication
        ? `Version ${fiche.version}, applicable depuis le ${dateCourte(fiche.dateApplication)}.`
        : `Version ${fiche.version}.`),
  };
}
