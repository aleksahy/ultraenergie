import { secteurParSlug, SECTEURS } from './secteurs';
import { famillesDuSecteur, segmentDe, verifieFamille, FAMILLES } from './familles';
import type { Calcul } from './calcul';
import * as BAREMES from './baremes';
import catalogue from '@/data/fiches.json';

/**
 * Le catalogue des fiches CEE, et le détail de celles qui en ont un.
 *
 * ⚠️ DEUX NIVEAUX, ET C'EST VOULU. Le CATALOGUE (code + secteur) vient du tableur fourni : il
 * est complet, 216 lignes, et c'est lui qui bâtit les hubs. Le DÉTAIL (barème, conditions,
 * documents…) arrivera par un second export ; tant qu'une fiche n'en a pas, elle n'a pas de
 * page. Une page de fiche sans barème ni conditions ne dirait rien de plus que la ligne du
 * hub, et il y en aurait 216.
 *
 * ⛔ NE PAS INVENTER DE DÉTAIL POUR REMPLIR. Un barème plausible attaché à un code réel est
 * plus dangereux qu'une page absente : il se lit comme une information.
 */

/* ── Le catalogue ──────────────────────────────────────────────────────── */

export interface EntreeCatalogue {
  /** Le code officiel, en majuscules. Le slug d'URL en est la version minuscule. */
  code: string;
  secteur: string;
}

/**
 * ⚠️ GÉNÉRÉ PAR `npm run fiches` DEPUIS `data/fiches_cee.xlsx`. Ne pas éditer `data/fiches.json`
 * à la main : la prochaine importation l'écraserait. Le tableur est la source.
 */
export const CATALOGUE: EntreeCatalogue[] = catalogue;

/* ── Le détail, par code ───────────────────────────────────────────────── */

export type ZoneApplication = 'metropole' | 'dom' | 'metropole_et_dom';

export const LIBELLE_ZONE: Record<ZoneApplication, string> = {
  metropole: 'France métropolitaine',
  dom: "Départements d'outre-mer",
  metropole_et_dom: "France métropolitaine et départements d'outre-mer",
};

export interface DureeVie {
  valeurAnnees: number;
  /** Absent quand la fiche n'a qu'une durée de vie, sans condition. */
  condition?: string;
}

export type NatureDocument = 'fiche' | 'partie_a' | 'annexe' | 'feuille_recap';

export const LIBELLE_NATURE: Record<NatureDocument, string> = {
  fiche: "Fiche d'opération standardisée",
  partie_a: 'Attestation sur l’honneur, partie A',
  annexe: 'Annexe',
  feuille_recap: 'Feuille de calcul récapitulative',
};

export interface DocumentFiche {
  nature: NatureDocument;
  version: string;
  /** Date de prise d'effet, ISO. Plusieurs versions d'une même nature peuvent coexister. */
  dateEffet: string;
  /**
   * ⚠️ FACULTATIVE, ET C'EST VOULU : quelques fiches n'ont pas leur Partie A ou leur fiche
   * principale en ligne. Sans URL, le document est listé sans être lié — on ne fabrique pas
   * un lien mort pour que la ligne ait l'air complète.
   */
  url?: string;
}

/** Le cumul engagé sur la fiche depuis son ouverture, tel qu'affiché en synthèse. */
export interface VolumeEngage {
  twhCumac: number;
  depuis: number;
}

/** Tout ce qui vient du second export, et qui donne sa page à une fiche. */
export interface DetailFiche {
  /** Le libellé officiel complet. Il sert au <title>, jamais au H1. */
  intitule: string;
  /**
   * Le H1 : dénomination courte tirée du §2, plus le contexte secteur tiré du §1.
   *
   * ⚠️ IL NE DOIT PARTAGER AUCUN MOT AVEC L'INTITULÉ OFFICIEL, HORMIS LE CODE. Sa raison
   * d'être est de couvrir le vocabulaire que le titre officiel n'emploie pas ; reprendre ses
   * mots revient à écrire deux fois la même chose et à ne rien couvrir de plus.
   * `verifieCoherence()` signale les mots communs au build, sans bloquer.
   */
  h1Edite: string;
  /** Dernière révision connue. Déduite du document le plus récent si elle n'est pas donnée. */
  dateMaj?: string;
  version: string;
  dateApplication: string;
  /**
   * ⚠️ DATE FUTURE = DATE LIMITE D'ENGAGEMENT, pas une alarme. Elle s'affiche en synthèse
   * (« Engageable jusqu'au … ») sans bandeau : une fiche encore en vigueur pendant huit mois
   * n'a rien d'anormal, et un avertissement rouge ferait fuir une opération éligible.
   * Date passée : la page n'est plus servie, 301 vers le hub du secteur.
   */
  dateAbrogation?: string;
  zoneApplication: ZoneApplication;
  dureeVie: DureeVie[];
  calcul: Calcul;
  documents: DocumentFiche[];
  jumelles: string[];
  /** Opérations complémentaires. Déduites de la famille si absentes. */
  voisines?: string[];
  /** §1 du PDF. */
  secteurApplication?: string;
  /** §2 du PDF. */
  denomination?: string;
  /** §3 du PDF. */
  conditions?: { titre: string; texte: string }[];
  /** Ce que la Partie A réclame en plus des champs du calcul. */
  justificatifs?: string[];
  coupDePouce?: { nom: string; texte: string };
  /** Ce qui distingue la fiche de ses jumelles, affiché en section 10. */
  noteJumelles?: string;
  volumeEngage?: VolumeEngage;
}

export type Fiche = EntreeCatalogue & DetailFiche;

/**
 * 🚨 VIDE POUR L'INSTANT, EN ATTENDANT L'EXPORT DÉTAILLÉ. Le gabarit de page de fiche est
 * écrit et éprouvé (cf. README) ; il ne rend aucune page tant que cette table est vide, et
 * les hubs listent les 216 codes sans les lier.
 *
 * ⛔ Ne pas y remettre les données d'amorce qui vivaient ici : elles décrivaient des codes
 * inventés, dont plusieurs n'existent pas dans le catalogue réel.
 */
export const DETAILS: Record<string, DetailFiche> = {
  'BAR-EN-101': {
    intitule: 'Isolation de combles ou de toitures',
    h1Edite: 'Isolation en comble perdu ou rampant de toiture dans un logement existant',
    version: 'A64-6',
    dateApplication: '2025-01-01',
    dateAbrogation: '2027-05-01',
    zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 30 }],
    calcul: BAREMES.BAR_EN_101,
    documents: [
      { nature: 'fiche', version: 'A64-6', dateEffet: '2025-01-01' },
      { nature: 'partie_a', version: 'révisée', dateEffet: '2026-07-01' },
    ],
    jumelles: ['BAT-EN-101'],
    noteJumelles:
      "Même intitulé, secteur tertiaire. Les montants et le facteur correctif de secteur d'activité diffèrent.",
    voisines: ['BAR-EN-102', 'BAR-EN-103', 'BAR-EN-105', 'BAR-EN-106'],
    secteurApplication: 'Bâtiments résidentiels existants.',
    conditions: [
      {
        titre: 'Résistance thermique',
        texte:
          "R ≥ 7 m².K/W en comble perdu, R ≥ 6 m².K/W en rampant de toiture. La résistance de l'isolation existante n'est pas prise en compte.",
      },
      {
        titre: 'Évaluation de la résistance',
        texte:
          'Selon NF EN 12664, NF EN 12667 ou NF EN 12939 pour les isolants non réfléchissants, NF EN ISO 22097 pour les isolants réfléchissants.',
      },
      {
        titre: 'Protection contre l’humidité',
        texte:
          "Pare-vapeur ou dispositif équivalent lorsqu'il est nécessaire de protéger l'isolant des transferts d'humidité.",
      },
      {
        titre: 'Professionnel',
        texte:
          'Mise en place réalisée par un professionnel titulaire d’un signe de qualité au sens du décret n° 2014-812 du 16 juillet 2014.',
      },
      {
        titre: 'Visite technique préalable',
        texte:
          "Visite technique du bâtiment par le professionnel avant l'établissement du devis, avec validation de l'adéquation du procédé et du sort de l'isolation existante.",
      },
      {
        titre: 'Délai de réflexion',
        texte: 'Délai minimal de sept jours francs entre l’acceptation du devis et le début des travaux.',
      },
    ],
    justificatifs: [
      "la mise en place d'une isolation de combles ou de toiture",
      "les marque, référence, épaisseur et surface d'isolant",
      'la résistance thermique évaluée selon la norme applicable',
      "les aménagements réalisés : coffrage autour des conduits de fumées et des éclairages encastrés, rehausse rigide au-dessus de la trappe d'accès, pare-vapeur",
      'la date de la visite du bâtiment',
    ],
    volumeEngage: { twhCumac: 95.3, depuis: 2022 },
  },
};

/**
 * Les intitulés connus de fiches qui n'ont pas encore de détail complet.
 *
 * ⚠️ ILS SERVENT AUX ANCRES DE LIENS, qui doivent porter « CODE — intitulé » et jamais le code
 * seul. Une fiche voisine citée sans son intitulé donnerait une carte illisible.
 *
 * 🚨 Table provisoire : elle disparaît le jour où l'export détaillé fournit les 216 intitulés.
 * Rien ici n'est inventé — ce sont les libellés transmis avec la spécification.
 */
const INTITULES: Record<string, string> = {
  'BAT-EN-101': 'Isolation de combles ou de toitures',
  'BAR-EN-102': 'Isolation des murs',
  'BAR-EN-103': "Isolation d'un plancher",
  'BAR-EN-105': 'Isolation des toitures terrasses',
  'BAR-EN-106': "Isolation de combles ou de toitures (France d'outre-mer)",
};

/** L'intitulé d'un code, qu'il ait son détail complet ou seulement son libellé. */
export function intituleDe(code: string): string | undefined {
  return DETAILS[code.toUpperCase()]?.intitule ?? INTITULES[code.toUpperCase()];
}

export const FICHES: Fiche[] = CATALOGUE.flatMap((entree) => {
  const detail = DETAILS[entree.code];
  return detail ? [{ ...entree, ...detail }] : [];
});

/* ── Accès au catalogue ────────────────────────────────────────────────── */

/** Le slug d'URL d'une fiche : son code en minuscules, et rien d'autre. */
export function slugFiche(code: string): string {
  return code.toLowerCase();
}

export function entreeParCode(code: string): EntreeCatalogue | undefined {
  const c = code.toUpperCase();
  return CATALOGUE.find((e) => e.code === c);
}

export function catalogueDuSecteur(slugSecteur: string): EntreeCatalogue[] {
  return CATALOGUE.filter((e) => e.secteur === slugSecteur);
}

/**
 * Les entrées d'un secteur, groupées par famille, dans l'ordre du tableau des familles.
 *
 * ⚠️ Les groupes sont DÉDUITS des codes présents, pas d'une liste de sections déclarée : un
 * hub ne peut donc pas afficher une section vide, ni oublier une famille dont il a des
 * fiches. `famillesDuSecteur` ne sert qu'à fixer l'ordre.
 */
export function catalogueParFamille(slugSecteur: string) {
  const entrees = catalogueDuSecteur(slugSecteur);
  return famillesDuSecteur(slugSecteur)
    .map((famille) => ({
      ...famille,
      entrees: entrees.filter((e) => segmentDe(e.code) === famille.segment),
    }))
    .filter((famille) => famille.entrees.length > 0);
}

/* ── Accès au détail ───────────────────────────────────────────────────── */

export function ficheParCode(code: string): Fiche | undefined {
  const c = code.toUpperCase();
  return FICHES.find((f) => f.code === c);
}

/** Vrai quand la fiche a une page, donc quand on a le droit de la lier. */
export function aUnePage(code: string): boolean {
  const fiche = ficheParCode(code);
  return Boolean(fiche && !estAbrogee(fiche));
}

/**
 * L'ancre d'un lien vers une fiche : le code ET l'intitulé.
 *
 * ⛔ JAMAIS LE CODE SEUL quand l'intitulé existe. « IND-UT-102 » ne dit rien à qui ne l'a pas
 * déjà cherché ; le code situe, l'intitulé annonce, et un lien a besoin des deux. Le fil
 * d'Ariane, lui, n'affiche que le code : il situe une position, il n'annonce pas une
 * destination.
 */
export function ancreFiche(code: string): string {
  const intitule = intituleDe(code);
  return intitule ? `${code} — ${intitule}` : code;
}

/* ── Abrogation ─────────────────────────────────────────────────────────
   ⚠️ LA DATE DE RÉFÉRENCE EST CELLE DU BUILD, pas celle de la visite : le site est
   entièrement statique, il n'y a personne pour évaluer une condition au moment du clic. Une
   fiche abrogée cesse donc d'exister au premier déploiement qui suit sa date d'abrogation,
   et `scripts/verifie-routes.mjs` écrit la 301 vers le hub de son secteur. */

export const DATE_BUILD = new Date().toISOString().slice(0, 10);

export function estAbrogee(f: Fiche, aLaDate = DATE_BUILD): boolean {
  return Boolean(f.dateAbrogation && f.dateAbrogation <= aLaDate);
}

/** Les fiches qui ont une page. C'est cette liste, et pas `CATALOGUE`, que le registre emploie. */
export const FICHES_EN_LIGNE = FICHES.filter((f) => !estAbrogee(f));

/** Les fiches retirées : elles alimentent les redirections vers le hub de leur secteur. */
export const FICHES_ABROGEES = FICHES.filter((f) => estAbrogee(f));

export function fichesDuSecteur(slugSecteur: string): Fiche[] {
  return FICHES_EN_LIGNE.filter((f) => f.secteur === slugSecteur);
}

/* ── Documents ─────────────────────────────────────────────────────────── */

/**
 * Le document en vigueur pour chaque nature : la version la plus récente dont la date d'effet
 * est passée.
 *
 * ⛔ NE JAMAIS AFFICHER TOUTES LES VERSIONS DANS LA SECTION TÉLÉCHARGEMENT. Proposer deux
 * versions d'une même Partie A, c'est laisser quelqu'un déposer un dossier avec la mauvaise.
 * L'historique a sa propre section.
 */
export function documentsEnVigueur(f: Fiche, aLaDate = DATE_BUILD): DocumentFiche[] {
  const natures: NatureDocument[] = ['fiche', 'partie_a', 'annexe', 'feuille_recap'];
  return natures
    .map((nature) => {
      const candidats = f.documents
        .filter((d) => d.nature === nature && d.dateEffet <= aLaDate)
        .sort((a, b) => b.dateEffet.localeCompare(a.dateEffet));
      return candidats[0];
    })
    .filter(Boolean);
}

/**
 * La date de mise à jour affichée sous le H1. Déduite du document le plus récent déjà
 * applicable quand la fiche ne la porte pas : c'est la dernière chose qui ait bougé sur
 * cette fiche, donc la seule fraîcheur qu'on puisse annoncer sans l'inventer.
 */
export function dateMajDe(f: Fiche, aLaDate = DATE_BUILD): string | undefined {
  if (f.dateMaj) return f.dateMaj;
  const effets = f.documents.map((d) => d.dateEffet).filter((d) => d <= aLaDate).sort();
  return effets.at(-1) ?? f.dateApplication;
}

/** Tous les documents, du plus récent au plus ancien : la matière de la section Versions. */
export function historiqueDocuments(f: Fiche): DocumentFiche[] {
  return [...f.documents].sort((a, b) => b.dateEffet.localeCompare(a.dateEffet));
}

/** Vrai quand l'historique apprend quelque chose : une version passée, ou une version à venir. */
export function aUnHistorique(f: Fiche, aLaDate = DATE_BUILD): boolean {
  const enVigueur = new Set(documentsEnVigueur(f, aLaDate));
  return f.documents.some((d) => !enVigueur.has(d));
}

/* ── Maillage ──────────────────────────────────────────────────────────── */

/** Les voisines déclarées, ou à défaut les autres fiches en ligne de la même famille. */
export function voisinesDe(f: Fiche): Fiche[] {
  if (f.voisines) {
    return f.voisines.map(ficheParCode).filter((x): x is Fiche => Boolean(x) && !estAbrogee(x!));
  }
  const segment = segmentDe(f.code);
  return FICHES_EN_LIGNE.filter(
    (x) => x.code !== f.code && x.secteur === f.secteur && segmentDe(x.code) === segment && !f.jumelles.includes(x.code),
  );
}

/**
 * Le bloc de six liens du pied de page : jumelles d'abord (0 à 3), voisines pour compléter.
 *
 * Le complément par le reste du secteur est un filet, pas une règle : un bloc « fixe » qui
 * rend quatre liens sur une fiche isolée laisse un trou dans la page.
 */
export function fichesLiees(code: string, combien = 6): Fiche[] {
  const depart = ficheParCode(code);
  if (!depart) return [];

  const vues = new Set([depart.code]);
  const retenues: Fiche[] = [];
  const ajoute = (candidates: Fiche[], plafond = combien) => {
    for (const f of candidates) {
      if (retenues.length >= plafond || retenues.length >= combien) return;
      if (vues.has(f.code)) continue;
      vues.add(f.code);
      retenues.push(f);
    }
  };

  ajoute(depart.jumelles.map(ficheParCode).filter((f): f is Fiche => Boolean(f) && !estAbrogee(f!)), 3);
  ajoute(voisinesDe(depart));
  ajoute(FICHES_EN_LIGNE.filter((f) => f.secteur === depart.secteur));
  ajoute(FICHES_EN_LIGNE.filter((f) => segmentDe(f.code) === segmentDe(depart.code)));

  return retenues;
}

/* ── Contrôles, exécutés à l'import donc au build ──────────────────────── */

/** Les mots pleins présents dans les deux chaînes. Les outils grammaticaux sont ignorés. */
const VIDES = new Set(['de', 'des', 'du', 'la', 'le', 'les', 'un', 'une', 'et', 'ou', 'en', 'dans', 'a', 'au', 'aux', 'd', 'l', 'pour', 'par', 'sur']);

function motsCommuns(a: string, b: string): string[] {
  const decoupe = (t: string) =>
    new Set(
      t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .split(/[^a-z0-9]+/).filter((m) => m.length > 2 && !VIDES.has(m)),
    );
  const mots = decoupe(b);
  return [...decoupe(a)].filter((m) => mots.has(m));
}

function verifieCoherence() {
  const codes = new Set<string>();
  for (const e of CATALOGUE) {
    if (codes.has(e.code)) throw new Error(`Fiche en double : ${e.code}`);
    codes.add(e.code);
    if (e.code !== e.code.toUpperCase()) throw new Error(`Code non capitalisé : ${e.code}`);
    if (!/^[A-Z]+(-[A-Z0-9]+){2}$/.test(e.code)) throw new Error(`Code de forme inattendue : ${e.code}`);
    if (!secteurParSlug(e.secteur)) throw new Error(`Fiche ${e.code} : secteur inconnu « ${e.secteur} »`);
    // La famille se lit dans le code, et le tableau dit dans quels secteurs elle existe :
    // `IND-TH-101` se compilerait et s'afficherait, alors que la famille thermique n'existe
    // pas en industrie. C'est exactement à quoi ressemble une ligne mal recopiée.
    verifieFamille(e.code, e.secteur);
  }

  for (const [code, d] of Object.entries(DETAILS)) {
    if (!codes.has(code)) throw new Error(`Détail sans entrée au catalogue : ${code}`);
    // Le <title> vaut « CODE : intitulé — prime CEE AAAA ». Au-delà d'environ 70 caractères
    // les moteurs le tronquent, et ce qu'ils coupent est la fin : « prime CEE 2026 », soit
    // précisément ce qu'on y a mis. Signalé, pas bloquant : l'intitulé officiel s'impose à nous.
    const longueurTitre = `${code} : ${d.intitule} — prime CEE 2026`.length;
    if (longueurTitre > 70) {
      console.warn(`⚠ ${code} : <title> de ${longueurTitre} caractères, il sera tronqué (70 au plus).`);
    }
    if (d.dureeVie.length === 0) throw new Error(`Fiche ${code} : aucune durée de vie`);
    if (d.dureeVie.length > 1 && d.dureeVie.some((v) => !v.condition)) {
      throw new Error(`Fiche ${code} : plusieurs durées de vie, chacune doit porter sa condition`);
    }
    if (d.volumeEngage && d.volumeEngage.twhCumac <= 0) {
      throw new Error(`Fiche ${code} : volume engagé nul — l'absence se dit en omettant le champ`);
    }
    // Le H1 sert à couvrir le vocabulaire que le titre officiel n'emploie pas. Un mot commun
    // n'est pas une faute bloquante — la fiche fournie en partage un — mais c'est du
    // rendement perdu, et personne ne le verra jamais sans un signal ici.
    const communs = motsCommuns(d.intitule, d.h1Edite);
    if (communs.length) {
      console.warn(
        `⚠ ${code} : le H1 et l'intitulé officiel partagent ${communs.map((m) => `« ${m} »`).join(', ')}.`,
      );
    }
    // La relation jumelle est symétrique : sans ça, une fiche apparaît dans le bloc de
    // l'autre mais pas l'inverse, et le maillage devient un aller sans retour.
    for (const jumelle of d.jumelles) {
      if (!codes.has(jumelle)) throw new Error(`Fiche ${code} : jumelle absente du catalogue « ${jumelle} »`);
      const detailJumelle = DETAILS[jumelle];
      if (detailJumelle && !detailJumelle.jumelles.includes(code)) {
        throw new Error(`Relation jumelle non réciproque : ${code} → ${jumelle}, mais pas l'inverse`);
      }
    }
    for (const voisine of d.voisines ?? []) {
      if (!codes.has(voisine)) throw new Error(`Fiche ${code} : voisine absente du catalogue « ${voisine} »`);
    }
  }

  for (const s of SECTEURS) {
    if (catalogueDuSecteur(s.slug).length === 0) throw new Error(`Secteur sans aucune fiche : ${s.slug}`);
  }
  for (const famille of FAMILLES) {
    for (const secteur of famille.secteurs) {
      if (!secteurParSlug(secteur)) {
        throw new Error(`Famille ${famille.segment} : secteur inconnu « ${secteur} » dans lib/familles.ts`);
      }
    }
  }
}
verifieCoherence();
