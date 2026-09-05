import { Section } from '@/components/Page';
import FilAriane from '@/components/FilAriane';
import RetourParent from '@/components/RetourParent';
import ListeLiens from '@/components/ListeLiens';
import GrilleCalcul from '@/components/GrilleCalcul';
import FicheSynthese from '@/components/FicheSynthese';
import FicheRail, { FicheSources } from '@/components/FicheRail';
import { HistoriqueVersions } from '@/components/FicheDocuments';
import Terme from '@/components/Terme';
import { BoutonModale } from '@/components/Modales';
import { secteurParSlug } from '@/lib/secteurs';
import { ancreFiche, aUnePage, fichesLiees, intituleDe, type Fiche } from '@/lib/fiches';
import { url } from '@/lib/routes';
import { dateCourte, anneeCourante } from '@/lib/dates';

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


  /* ⚠️ UNE SEULE LISTE POUR LE RENDU ET LE SOMMAIRE. Le nombre de sections varie de six à
     douze selon la matière : une table des matières construite à part finirait par annoncer
     une section absente, ou par en oublier une. `court` est le libellé de la bande latérale,
     où « Quel montant de prime pour BAR-EN-101 ? » ne tiendrait pas. */
  const sections: SectionFiche[] = [
    {
      id: 'bref',
      titre: 'La fiche en bref',
      court: 'La fiche en bref',
      contenu: <FicheSynthese fiche={fiche} />,
    },
    {
      id: 'montant',
      titre: `Quel montant de prime pour ${fiche.code} ?`,
      court: 'Montant de la prime',
      contenu: (
        <>
          <p className="page-texte">
            Le barème donne le forfait en <Terme slug="kwh-cumac">kWh cumac</Terme> retenu par la
            fiche{estParZone(fiche) && <> selon la <Terme slug="zone-climatique">zone climatique</Terme></>}.
          </p>

          <GrilleCalcul calcul={fiche.calcul} />

          {/* ⛔ NI EXEMPLE CHIFFRÉ NI APPEL À L'ACTION SOUS LA GRILLE. La section dit le
              barème, et rien d'autre : le calcul appartient au simulateur, et l'appel à
              l'action est porté par la bande latérale, qui reste visible tout du long. Trois
              blocs empilés sous le tableau repoussaient les conditions d'éligibilité hors de
              l'écran, alors que ce sont elles qu'on lit juste après un montant. */}
          <p className="mention">Montant indicatif, sous réserve de validation du dossier.</p>
        </>
      ),
    },
  ];

  if (fiche.secteurApplication) {
    sections.push({
      id: 'beneficiaires',
      titre: 'Qui peut en bénéficier ?',
      court: 'Bénéficiaires',
      contenu: <p className="page-texte">{fiche.secteurApplication}</p>,
    });
  }

  if (fiche.conditions) {
    sections.push({
      id: 'conditions',
      titre: 'Conditions d’éligibilité',
      court: 'Conditions d’éligibilité',
      contenu: (
        <dl className="conditions">
          {fiche.conditions.map((c) => (
            <div key={c.titre}>
              <dt>{c.titre}</dt>
              <dd>{c.texte}</dd>
            </div>
          ))}
        </dl>
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
          <p className="page-texte">La preuve de réalisation mentionne :</p>
          <ul className="liste-puces">
            {fiche.justificatifs.map((j) => <li key={j}>{j}</li>)}
          </ul>
        </>
      ),
    });
  }

  sections.push({
    id: 'duree-de-vie',
    titre: 'Durée de vie conventionnelle',
    court: 'Durée de vie',
    contenu: fiche.dureeVie.length === 1 ? (
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
    ),
  });

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

  sections.push({
    id: 'versions',
    titre: 'Versions et dates d’application',
    court: 'Versions',
    contenu: <HistoriqueVersions fiche={fiche} />,
  });

  /* ⛔ PAS DE SECTION TÉLÉCHARGEMENT POUR L'INSTANT (retirée le 05/09/2026). Les documents
     restent dans le modèle et alimentent la section « Versions » ainsi que la date de mise à
     jour : c'est la SECTION qui est retirée, pas la donnée. Le jour où elle revient, elle
     reprend sa place après l'appel à l'action — c'est une sortie, elle ne doit pas le
     précéder — et l'encadré de synthèse retrouve son ancre vers elle. */

  if (jumelles.length > 0) {
    sections.push({
      id: 'jumelles',
      titre: `À ne pas confondre avec ${jumelles.join(', ')}`,
      court: 'À ne pas confondre',
      contenu: (
        <>
          {fiche.noteJumelles && <p className="page-texte">{fiche.noteJumelles}</p>}
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
      contenu: <ListeFichesLiees codes={complementaires} />,
    });
  }

  sections.push({
    id: 'valoriser',
    titre: `Faire valoriser une opération ${fiche.code}`,
    court: 'Faire valoriser',
    contenu: (
      <>
        <p className="page-texte">
          Nous mettons plusieurs obligés en concurrence sur votre dossier et vous transmettons
          l’engagement de prime avant la signature du devis.
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
        <RetourParent chemin={url.fiche(fiche.secteur, fiche.code)} />
        <h1 className="page-titre">{fiche.code} — {fiche.h1Edite}</h1>
        {fiche.denomination && <p className="page-chapo">{fiche.denomination}</p>}

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
