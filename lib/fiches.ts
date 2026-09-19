import { secteurParSlug, SECTEURS } from './secteurs';
import { famillesDuSecteur, segmentDe, verifieFamille, FAMILLES } from './familles';
import type { Calcul } from './calcul';
import * as BAREMES from './baremes';
import catalogue from '@/data/fiches.json';
import detailsImportes from '@/data/details.json';

/**
 * Le catalogue des fiches CEE, et le détail de celles qui en ont un.
 *
 * ⚠️ DEUX NIVEAUX, ET C'EST VOULU. Le CATALOGUE (code + secteur) vient du tableur fourni : il
 * est complet, 216 lignes, et c'est lui qui bâtit les hubs. Le DÉTAIL vient de deux sources
 * fondues champ par champ :
 *   · `data/details.json`, GÉNÉRÉ par `npm run details` depuis les PDF officiels (texte des
 *     sections 1 à 5, tableaux de barème tels que publiés, Partie A). Ne pas l'éditer.
 *   · `DETAILS` ci-dessous, écrit à la main : le barème MODÉLISÉ pour le simulateur, des
 *     conditions titrées, une note sur les jumelles. Il l'emporte sur l'import, champ par
 *     champ, et n'existe que pour les fiches où quelqu'un a fait ce travail.
 * Une fiche n'a de page que si le PDF a livré au moins son intitulé et ses conditions.
 *
 * ⛔ NE PAS INVENTER DE DÉTAIL POUR REMBLAYER. Un barème plausible attaché à un code réel est
 * plus dangereux qu'une page absente : il se lit comme une information. Le simulateur ne
 * s'ouvre que sur un `calcul` écrit à la main et vérifié contre le PDF.
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

/** Un tableau de barème tel que publié dans la fiche : la première ligne est l'en-tête. */
export type TableauBareme = string[][];

/** Le barème tel que le PDF le donne, quand il n'est pas (encore) modélisé pour le simulateur. */
export interface BaremePublie {
  tableaux: TableauBareme[];
  /** Ce que la fiche écrit avant ses tableaux (« Pour un système de classe A : »). */
  avant: string[];
  /** Le texte de la section 5 qui suit les tableaux : formules, définitions, renvois. */
  notes: string[];
  /** Vrai quand la détection a manqué un tableau, ou n'en a trouvé aucun : le PDF fait foi. */
  incomplet: boolean;
}

/** Tout ce qui donne sa page à une fiche. */
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
  /** Absente quand la source ne la donne pas : l'encadré n'affiche alors pas la ligne. */
  dateApplication?: string;
  /**
   * ⚠️ DATE FUTURE = DATE LIMITE D'ENGAGEMENT, pas une alarme. Elle s'affiche en synthèse
   * (« Engageable jusqu'au … ») sans bandeau : une fiche encore en vigueur pendant huit mois
   * n'a rien d'anormal, et un avertissement rouge ferait fuir une opération éligible.
   * Date passée : la page n'est plus servie, 301 vers le hub du secteur.
   */
  dateAbrogation?: string;
  zoneApplication: ZoneApplication;
  dureeVie: DureeVie[];
  /** Le texte officiel de la durée de vie, quand il dit plus qu'un nombre d'années. */
  dureeVieTexte?: string;
  /**
   * Le barème MODÉLISÉ, écrit à la main dans lib/baremes.ts et vérifié contre le PDF. C'est
   * lui qui ouvre le simulateur. Absent, la page rend `bareme`, le tableau tel que publié.
   */
  calcul?: Calcul;
  bareme?: BaremePublie;
  /** L'URL du PDF officiel de la fiche, tel qu'importé. */
  pdf?: string;
  documents: DocumentFiche[];
  jumelles: string[];
  /** Opérations complémentaires. Déduites de la famille si absentes. */
  voisines?: string[];
  /** §1 du PDF. */
  secteurApplication?: string;
  /** §2 du PDF, en paragraphes. Le premier sert de chapo, les suivants (exclusions,
      précisions de périmètre) rejoignent la section « Qui peut en bénéficier ? ». */
  denomination?: string[];
  /** §3 du PDF. Titrées quand quelqu'un les a découpées à la main ; sinon des paragraphes. */
  conditions?: { titre?: string; texte: string }[];
  /** Ce que la Partie A réclame en plus des champs du calcul. */
  justificatifs?: string[];
  coupDePouce?: { nom: string; texte: string };
  /** Ce qui distingue la fiche de ses jumelles, affiché dans la section « À ne pas confondre ». */
  noteJumelles?: string;
  /**
   * La qualification exigée du professionnel, en clair (« Professionnel RGE »). Affichée en
   * synthèse : c'est le premier motif de refus d'un dossier, il ne doit pas se lire qu'au
   * détour des conditions. Absente quand la fiche n'exige rien.
   */
  qualification?: string;
}

export type Fiche = EntreeCatalogue & DetailFiche;

/**
 * Le détail ÉDITÉ À LA MAIN, fiche par fiche, qui l'emporte sur l'import champ par champ.
 * C'est ici que vit un barème modélisé (`calcul`), des conditions titrées, une note sur les
 * jumelles. Une entrée peut être partielle : ce qu'elle ne dit pas vient du PDF.
 *
 * ⛔ Ne pas y remettre des données d'amorce inventées : un code réel avec un barème faux se
 * lit comme une information.
 */
export const DETAILS_EDITES: Record<string, Partial<DetailFiche>> = {
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
    // Le « signe de qualité au sens du décret 2014-812 » de la condition « Professionnel »
    // est la définition réglementaire du RGE.
    qualification: 'Professionnel RGE',
  },
};

/* ── L'import des PDF, et sa fusion avec le détail édité ───────────────── */

interface DetailImporte {
  code: string;
  pdf: string;
  intitule?: string;
  secteurApplication?: string;
  denomination?: string[];
  conditions?: string[];
  dureeVieAns?: number[];
  dureeVieTexte?: string;
  bareme?: BaremePublie;
  dateAbrogation?: string;
  version?: string;
  dateApplication?: string;
  justificatifs?: string[];
  qualification?: string;
}

const IMPORTES = detailsImportes as Record<string, DetailImporte>;

/** Le H1 édité : la première phrase de la dénomination si elle tient, sinon l'intitulé. */
function h1Depuis(d: DetailImporte): string {
  const premiere = d.denomination?.[0]?.split(/(?<=[a-zé\)])\. /)[0]?.trim();
  if (premiere && premiere.length <= 140) return premiere.replace(/\.$/, '');
  return d.intitule ?? d.code;
}

/** Les fiches d'un autre secteur qui portent le même intitulé : la relation jumelle. */
function jumellesDepuis(code: string, intitule: string | undefined): string[] {
  if (!intitule) return [];
  const cle = intitule.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
  return Object.values(IMPORTES)
    .filter((x) => x.code !== code && x.intitule && x.intitule.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim() === cle)
    .map((x) => x.code)
    .sort();
}

/** Un détail importé, mis dans la forme du modèle. `null` si le PDF n'a pas livré l'essentiel. */
function depuisImport(d: DetailImporte): DetailFiche | null {
  if (!d.intitule || !d.conditions) return null;
  const ans = d.dureeVieAns ?? [];
  const dureeVie: DureeVie[] = ans.length === 1 ? [{ valeurAnnees: ans[0] }] : ans.length > 1 ? [{ valeurAnnees: Math.max(...ans) }] : [];
  const version = d.version ?? 'n. c.';
  return {
    intitule: d.intitule,
    h1Edite: h1Depuis(d),
    version,
    dateApplication: d.dateApplication,
    dateAbrogation: d.dateAbrogation,
    zoneApplication: /outre-mer/i.test(d.intitule) ? 'dom' : 'metropole',
    dureeVie,
    dureeVieTexte: ans.length > 1 || ans.length === 0 ? d.dureeVieTexte : undefined,
    bareme: d.bareme,
    pdf: d.pdf,
    documents: d.dateApplication ? [{ nature: 'fiche', version, dateEffet: d.dateApplication, url: d.pdf }] : [],
    jumelles: jumellesDepuis(d.code, d.intitule),
    secteurApplication: d.secteurApplication,
    denomination: d.denomination,
    conditions: d.conditions.map((texte) => ({ texte })),
    justificatifs: d.justificatifs,
    qualification: d.qualification,
  };
}

/** Le détail complet par code : l'import, recouvert champ par champ par l'édité. */
export const DETAILS: Record<string, DetailFiche> = Object.fromEntries(
  CATALOGUE.flatMap((e) => {
    const importe = IMPORTES[e.code] ? depuisImport(IMPORTES[e.code]) : null;
    const edite = DETAILS_EDITES[e.code];
    if (!importe && !edite) return [];
    const fusion = { ...(importe ?? {}), ...(edite ?? {}) } as DetailFiche;
    if (!fusion.intitule || !fusion.h1Edite || !fusion.dureeVie) return [];
    return [[e.code, fusion]];
  }),
);

/* ⚠️ LA RELATION JUMELLE EST SYMÉTRIQUE PAR CONSTRUCTION. Une jumelle déclarée à la main sur
   une fiche est reportée sur l'autre : l'intitulé importé peut différer d'une lettre
   (« toiture » / « toitures ») et l'appariement automatique ne suffirait pas. Le contrôle de
   réciprocité, plus bas, reste : il attrape une déclaration vers un code sans page. */
for (const [code, d] of Object.entries(DETAILS)) {
  for (const j of d.jumelles) {
    const autre = DETAILS[j];
    if (autre && !autre.jumelles.includes(code)) autre.jumelles = [...autre.jumelles, code].sort();
  }
}

/** L'intitulé d'un code, qu'il ait sa page ou seulement son libellé importé. */
export function intituleDe(code: string): string | undefined {
  const c = code.toUpperCase();
  return DETAILS[c]?.intitule ?? IMPORTES[c]?.intitule;
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

  const titresLongs: string[] = [];
  const h1Communs: string[] = [];
  for (const code of Object.keys(DETAILS_EDITES)) {
    if (!codes.has(code)) throw new Error(`Détail édité sans entrée au catalogue : ${code}`);
  }
  for (const [code, d] of Object.entries(DETAILS)) {
    // Le <title> vaut « CODE : intitulé, prime CEE AAAA ». Au-delà d'environ 70 caractères
    // les moteurs le tronquent, et ce qu'ils coupent est la fin : « prime CEE 2026 », soit
    // précisément ce qu'on y a mis. Signalé, pas bloquant : l'intitulé officiel s'impose à nous.
    const longueurTitre = `${code} : ${d.intitule}, prime CEE 2026`.length;
    if (longueurTitre > 70) titresLongs.push(code);
    if (d.dureeVie.length === 0 && !d.dureeVieTexte) console.warn(`⚠ ${code} : aucune durée de vie lue dans le PDF.`);
    if (d.dureeVie.length > 1 && d.dureeVie.some((v) => !v.condition)) {
      throw new Error(`Fiche ${code} : plusieurs durées de vie, chacune doit porter sa condition`);
    }
    // Le H1 sert à couvrir le vocabulaire que le titre officiel n'emploie pas. Un mot commun
    // n'est pas une faute bloquante — la fiche fournie en partage un — mais c'est du
    // rendement perdu, et personne ne le verra jamais sans un signal ici.
    if (motsCommuns(d.intitule, d.h1Edite).length) h1Communs.push(code);
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

  // Deux signaux agrégés plutôt que deux cents lignes : ce sont des rendements perdus, pas
  // des fautes, et une liste par build suffit à savoir où reprendre.
  if (titresLongs.length) console.warn(`⚠ ${titresLongs.length} <title> de plus de 70 caractères (tronqués par les moteurs) : ${titresLongs.slice(0, 8).join(', ')}${titresLongs.length > 8 ? '…' : ''}`);
  if (h1Communs.length) console.warn(`⚠ ${h1Communs.length} fiches dont le H1 partage un mot plein avec l'intitulé officiel.`);
  const sansPage = CATALOGUE.filter((e) => !DETAILS[e.code]).map((e) => e.code);
  if (sansPage.length) console.warn(`⚠ ${sansPage.length} fiche(s) du catalogue sans page (PDF non lu) : ${sansPage.join(', ')}`);
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
