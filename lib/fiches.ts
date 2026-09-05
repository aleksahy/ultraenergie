import { SECTEURS, secteurParSlug } from './secteurs';
import { famillesDuSecteur, segmentDe, verifieFamille, FAMILLES } from './familles';
import type { Calcul } from './calcul';
import * as C from './calculs-seed';

/**
 * Le catalogue des fiches d'opérations standardisées. Une ligne = une page.
 *
 * 🚨 CE JEU DE DONNÉES EST UNE AMORCE, PAS LE CATALOGUE OFFICIEL. Codes, intitulés, versions,
 * dates, barèmes et URL de documents n'ont PAS été vérifiés contre la liste en vigueur
 * (ATEE / arrêtés publiés au Journal officiel). Ils servent à poser le gabarit et à en
 * éprouver tous les cas.
 *
 * ⚠️ ET C'EST URGENT À REPRENDRE, parce que LE SLUG EST LE CODE : `/fiches-cee/industrie/
 * ind-ut-102/`. Un code corrigé après mise en ligne est une URL changée, or la règle du
 * projet est qu'un slug de fiche est stable à vie. Remplacer cette amorce par le catalogue
 * réel AVANT la première indexation, pas après.
 *
 * ⛔ LE SLUG EST LE CODE, JAMAIS L'INTITULÉ, même si l'intitulé officiel est reformulé.
 */

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
   * ⚠️ FACULTATIVE, ET C'EST VOULU : deux fiches du catalogue n'ont pas leur Partie A ou leur
   * fiche principale en ligne. Sans URL, le document est listé sans être lié — on ne fabrique
   * pas un lien mort pour que la ligne ait l'air complète.
   */
  url?: string;
}

export interface VolumeEngage {
  annee: number;
  trimestre: number;
  kwhClassique: number;
  kwhPrecarite: number;
}

export interface Fiche {
  /** Le code officiel, en majuscules. Le slug d'URL en est la version minuscule. */
  code: string;
  secteur: string;
  /** Le libellé officiel complet. Sert au H1, quelle que soit sa longueur. */
  intitule: string;
  /** Libellé édité, 60 caractères au plus, pour le <title>. */
  titreCourt: string;
  version: string;
  dateApplication: string;
  /** Renseignée : bandeau d'avertissement, puis retrait de la page et 301 vers le hub. */
  dateAbrogation?: string;
  zoneApplication: ZoneApplication;
  dureeVie: DureeVie[];
  calcul: Calcul;
  documents: DocumentFiche[];
  jumelles: string[];
  /** Opérations complémentaires du même secteur. Déduites de la famille si absentes. */
  voisines?: string[];

  /** §1 du PDF. */
  secteurApplication?: string;
  /** §2 du PDF. */
  denomination?: string;
  /** §3 du PDF. */
  conditions?: { titre: string; texte: string }[];
  /** Ce que la Partie A réclame en plus des champs du calcul. */
  justificatifs?: string[];
  /** Bonification Coup de pouce applicable. */
  coupDePouce?: { nom: string; texte: string };
  volumeEngage?: VolumeEngage[];
}

/* ── Fabrique ──────────────────────────────────────────────────────────────
   Les colonnes que TOUTES les fiches portent sont écrites une fois ici ; les colonnes
   conditionnelles restent absentes tant qu'on n'a pas la matière.

   ⛔ AUCUNE VALEUR DE REMPLISSAGE. Une `conditions` inventée pour étoffer une page produirait
   exactement ce que le gabarit doit éviter : une section rendue sans rien à dire. Une fiche
   pauvre rend six sections, et c'est la bonne réponse. */

type Entree = Omit<Fiche, 'documents'> & {
  /** Documents supplémentaires : annexes, feuille récapitulative, versions antérieures. */
  documents?: DocumentFiche[];
  /** `false` quand la fiche ou la Partie A ne sont pas en ligne. */
  fichePdf?: boolean;
  partieAPdf?: boolean;
};

const BASE_PDF = 'https://www.ecologie.gouv.fr/certificats-economies-energie/fiches';

function fiche(e: Entree): Fiche {
  const socle: DocumentFiche[] = [];
  if (e.fichePdf !== false) {
    socle.push({ nature: 'fiche', version: e.version, dateEffet: e.dateApplication, url: `${BASE_PDF}/${e.code.toLowerCase()}.pdf` });
  }
  if (e.partieAPdf !== false) {
    socle.push({ nature: 'partie_a', version: e.version, dateEffet: e.dateApplication, url: `${BASE_PDF}/${e.code.toLowerCase()}-partie-a.pdf` });
  }
  // Les deux drapeaux ne servent qu'à la fabrique : ils ne doivent pas se retrouver dans
  // l'objet `Fiche`, où rien ne les lit.
  const { documents = [], ...reste } = e;
  delete (reste as Partial<Entree>).fichePdf;
  delete (reste as Partial<Entree>).partieAPdf;
  return { ...reste, documents: [...socle, ...documents] };
}

export const FICHES: Fiche[] = [
  /* ── Agriculture ──────────────────────────────────────────────────────── */
  fiche({
    code: 'AGRI-TH-102',
    secteur: 'agriculture',
    intitule: "Système de récupération de chaleur sur un groupe de production de froid",
    titreCourt: 'Récupération de chaleur sur groupe de froid',
    version: 'A45-2',
    dateApplication: '2024-04-01',
    zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 12 }],
    calcul: C.AGRI_TH_102,
    jumelles: ['IND-UT-134'],
    secteurApplication: "Exploitations agricoles disposant d'un groupe de production de froid en fonctionnement.",
    denomination:
      "Mise en place d'un système de récupération de chaleur sur le circuit de refroidissement d'un groupe de production de froid, destiné au préchauffage d'eau chaude sanitaire ou de procédé.",
    conditions: [
      { titre: 'Équipement', texte: "Le système récupère la chaleur sur le circuit de fluide frigorigène ou sur le condenseur du groupe de froid." },
      { titre: 'Mise en service', texte: "La preuve de réalisation mentionne la puissance frigorifique du groupe et la destination de la chaleur récupérée." },
      { titre: 'Professionnel', texte: "L'installation est réalisée par un professionnel, la facture précisant la marque et la référence du récupérateur." },
    ],
    justificatifs: ['Facture mentionnant la marque et la référence du récupérateur'],
    volumeEngage: [
      { annee: 2025, trimestre: 4, kwhClassique: 41_200_000, kwhPrecarite: 0 },
      { annee: 2026, trimestre: 1, kwhClassique: 38_900_000, kwhPrecarite: 0 },
    ],
  }),
  fiche({
    code: 'AGRI-TH-104', secteur: 'agriculture',
    intitule: 'Pré-refroidisseur laitier', titreCourt: 'Pré-refroidisseur laitier',
    version: 'A22-1', dateApplication: '2023-01-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 12 }], calcul: C.AGRI_TH_104, jumelles: [],
  }),
  fiche({
    code: 'AGRI-EQ-102', secteur: 'agriculture',
    intitule: 'Système de régulation sur un groupe de froid', titreCourt: 'Régulation sur groupe de froid',
    version: 'A31-1', dateApplication: '2023-07-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 10 }], calcul: C.AGRI_EQ_102, jumelles: [],
  }),
  fiche({
    code: 'AGRI-TH-108', secteur: 'agriculture',
    intitule: "Isolation thermique des parois d'un bâtiment d'élevage", titreCourt: "Isolation d'un bâtiment d'élevage",
    version: 'A18-2', dateApplication: '2022-10-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 25 }], calcul: C.AGRI_TH_108, jumelles: [],
  }),
  fiche({
    code: 'AGRI-UT-103', secteur: 'agriculture',
    intitule: 'Variateur de vitesse sur pompe de nettoyage', titreCourt: 'Variateur sur pompe de nettoyage',
    version: 'A29-1', dateApplication: '2024-01-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 10 }], calcul: C.AGRI_UT_103, jumelles: ['IND-UT-102'],
  }),

  /* ── Industrie ────────────────────────────────────────────────────────── */
  fiche({
    code: 'IND-UT-102',
    secteur: 'industrie',
    intitule: "Système de variation électronique de vitesse sur un moteur asynchrone",
    titreCourt: 'Variation de vitesse sur moteur asynchrone',
    version: 'A73-3',
    dateApplication: '2025-09-01',
    zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 10 }],
    calcul: C.IND_UT_102,
    jumelles: ['AGRI-UT-103'],
    secteurApplication: "Sites industriels soumis ou non au régime des installations classées, ainsi que les réseaux et les bâtiments tertiaires disposant d'un moteur asynchrone.",
    denomination:
      "Mise en place d'un système de variation électronique de vitesse sur un moteur asynchrone existant ou neuf, entraînant une pompe, un ventilateur ou un compresseur.",
    conditions: [
      { titre: 'Équipement', texte: "Le variateur est associé à un moteur asynchrone dont la puissance nominale est comprise entre 0,75 kW et 500 kW." },
      { titre: 'Usage', texte: "L'entraînement concerne une pompe, un ventilateur ou un compresseur dont le débit est variable au cours du fonctionnement." },
      { titre: 'Preuve de réalisation', texte: "La facture mentionne la mise en place du variateur, la puissance nominale du moteur et sa durée annuelle de fonctionnement." },
    ],
    justificatifs: [
      'Facture mentionnant la puissance nominale du moteur en kW',
      "Durée annuelle de fonctionnement retenue, justifiée par l'exploitant",
    ],
    coupDePouce: {
      nom: 'Coup de pouce Chauffage des bâtiments tertiaires',
      texte: "Cette opération n'est pas bonifiée à ce jour ; elle peut en revanche être valorisée dans un programme d'efficacité énergétique industrielle.",
    },
    documents: [
      { nature: 'annexe', version: 'A73-3', dateEffet: '2025-09-01', url: `${BASE_PDF}/ind-ut-102-annexe.pdf` },
      // Version antérieure : elle alimente la section « Versions et dates d'application ».
      { nature: 'fiche', version: 'A61-2', dateEffet: '2022-04-01', url: `${BASE_PDF}/ind-ut-102-a61.pdf` },
    ],
    volumeEngage: [
      { annee: 2025, trimestre: 3, kwhClassique: 1_284_000_000, kwhPrecarite: 0 },
      { annee: 2025, trimestre: 4, kwhClassique: 1_402_500_000, kwhPrecarite: 0 },
      { annee: 2026, trimestre: 1, kwhClassique: 1_190_300_000, kwhPrecarite: 0 },
    ],
  }),
  fiche({
    code: 'IND-UT-117', secteur: 'industrie',
    intitule: "Système de récupération de chaleur sur un compresseur d'air",
    titreCourt: 'Récupération de chaleur sur compresseur',
    version: 'A54-2', dateApplication: '2024-07-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 15 }], calcul: C.IND_UT_117, jumelles: [],
  }),
  fiche({
    code: 'IND-UT-121', secteur: 'industrie',
    intitule: 'Moto-variateur synchrone à aimants permanents', titreCourt: 'Moto-variateur à aimants permanents',
    version: 'A44-1', dateApplication: '2023-04-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 10 }], calcul: C.IND_UT_121, jumelles: [],
  }),
  fiche({
    code: 'IND-UT-134', secteur: 'industrie',
    intitule: 'Système de récupération de chaleur sur un groupe de production de froid',
    titreCourt: 'Récupération de chaleur sur groupe de froid',
    version: 'A46-1', dateApplication: '2024-04-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 12 }], calcul: C.IND_UT_134, jumelles: ['AGRI-TH-102'],
  }),
  fiche({
    code: 'IND-BA-112', secteur: 'industrie',
    intitule: "Isolation de points singuliers d'un réseau", titreCourt: 'Isolation de points singuliers',
    version: 'A38-2', dateApplication: '2023-10-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 10 }], calcul: C.IND_BA_112, jumelles: ['BAT-TH-155'],
  }),
  fiche({
    code: 'IND-BA-110', secteur: 'industrie',
    intitule: "Déstratificateur ou brasseur d'air", titreCourt: "Déstratificateur ou brasseur d'air",
    version: 'A25-1', dateApplication: '2022-07-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 12 }], calcul: C.IND_BA_110, jumelles: [],
  }),

  /* ── Réseau ───────────────────────────────────────────────────────────── */
  fiche({
    code: 'RES-CH-103', secteur: 'reseau',
    intitule: "Réhabilitation d'un poste de livraison de chaleur", titreCourt: 'Réhabilitation de poste de livraison',
    version: 'A33-1', dateApplication: '2023-04-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 20 }], calcul: C.RES_CH_103, jumelles: [],
  }),
  fiche({
    code: 'RES-CH-104', secteur: 'reseau',
    intitule: "Passage d'un réseau de chaleur en basse température", titreCourt: 'Réseau de chaleur en basse température',
    version: 'A28-2', dateApplication: '2024-01-01', zoneApplication: 'metropole',
    // Deux durées de vie conditionnelles : le gabarit doit rendre une liste, pas une valeur.
    dureeVie: [
      { valeurAnnees: 25, condition: 'Réseau dont la puissance souscrite dépasse 1 MW' },
      { valeurAnnees: 20, condition: 'Autres réseaux' },
    ],
    calcul: C.RES_CH_104, jumelles: [],
  }),
  fiche({
    code: 'RES-CH-106', secteur: 'reseau',
    intitule: "Optimisation d'un réseau de chaleur existant", titreCourt: "Optimisation d'un réseau de chaleur",
    version: 'A21-1', dateApplication: '2022-10-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 15 }], calcul: C.RES_CH_106, jumelles: [],
    // Fiche dont le PDF principal n'est pas en ligne : le document est listé, non lié.
    fichePdf: false,
  }),
  fiche({
    code: 'RES-EC-104', secteur: 'reseau',
    intitule: "Rénovation d'un éclairage extérieur", titreCourt: "Rénovation d'un éclairage extérieur",
    version: 'A41-2', dateApplication: '2024-01-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 20 }], calcul: C.RES_EC_104, jumelles: ['BAT-EQ-127'],
  }),
  fiche({
    code: 'RES-EC-107', secteur: 'reseau',
    intitule: 'Régulation de tension en éclairage extérieur', titreCourt: 'Régulation de tension en éclairage',
    version: 'A19-1', dateApplication: '2022-04-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 15 }], calcul: C.RES_EC_107, jumelles: [],
  }),

  /* ── Résidentiel ──────────────────────────────────────────────────────── */
  fiche({
    code: 'BAR-EN-101',
    secteur: 'residentiel',
    intitule: 'Isolation de combles ou de toitures',
    titreCourt: 'Isolation de combles ou de toitures',
    version: 'A64-4',
    dateApplication: '2025-04-01',
    zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 25 }],
    calcul: C.BAR_EN_101,
    jumelles: ['BAT-EN-101'],
    secteurApplication: "Bâtiments résidentiels existants achevés depuis plus de deux ans à la date d'engagement de l'opération.",
    denomination:
      "Mise en place d'une isolation thermique en comble perdu ou en rampant de toiture d'un bâtiment résidentiel existant.",
    conditions: [
      { titre: 'Performance', texte: "La résistance thermique de l'isolation posée est supérieure ou égale à 7 m²·K/W en comble perdu, et à 6 m²·K/W en rampant de toiture." },
      { titre: 'Professionnel', texte: "L'opération est réalisée par un professionnel titulaire d'un signe de qualité RGE correspondant aux travaux." },
      { titre: 'Preuve de réalisation', texte: "La facture mentionne la surface isolée en m², la résistance thermique et la référence de l'isolant posé." },
    ],
    justificatifs: [
      "Facture mentionnant la surface isolée, la résistance thermique et la référence de l'isolant",
      "Attestation RGE du professionnel, en cours de validité à la date d'engagement",
    ],
    coupDePouce: {
      nom: 'Coup de pouce Rénovation performante',
      texte: "L'isolation de combles peut être intégrée à un bouquet de travaux relevant du Coup de pouce Rénovation performante d'un bâtiment résidentiel collectif.",
    },
    volumeEngage: [
      { annee: 2025, trimestre: 3, kwhClassique: 8_940_000_000, kwhPrecarite: 4_120_000_000 },
      { annee: 2025, trimestre: 4, kwhClassique: 9_610_000_000, kwhPrecarite: 4_480_000_000 },
      { annee: 2026, trimestre: 1, kwhClassique: 7_205_000_000, kwhPrecarite: 3_390_000_000 },
    ],
  }),
  fiche({
    code: 'BAR-EN-102', secteur: 'residentiel',
    intitule: 'Isolation des murs', titreCourt: 'Isolation des murs',
    version: 'A52-3', dateApplication: '2024-10-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 25 }], calcul: C.BAR_EN_102, jumelles: ['BAT-EN-102'],
  }),
  fiche({
    code: 'BAR-TH-171', secteur: 'residentiel',
    intitule: 'Pompe à chaleur de type air/eau', titreCourt: 'Pompe à chaleur air/eau',
    version: 'A57-2', dateApplication: '2025-01-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 17 }], calcul: C.BAR_TH_171, jumelles: [],
    coupDePouce: {
      nom: 'Coup de pouce Chauffage',
      texte: "Le remplacement d'une chaudière au charbon, au fioul ou au gaz par cette pompe à chaleur ouvre droit à la bonification Coup de pouce Chauffage.",
    },
  }),
  fiche({
    code: 'BAR-TH-113', secteur: 'residentiel',
    intitule: 'Chaudière biomasse individuelle', titreCourt: 'Chaudière biomasse individuelle',
    version: 'A48-2', dateApplication: '2024-07-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 17 }], calcul: C.BAR_TH_113, jumelles: [],
  }),
  fiche({
    code: 'BAR-TH-160', secteur: 'residentiel',
    intitule: "Isolation d'un réseau hydraulique de chauffage", titreCourt: 'Isolation de réseau hydraulique',
    version: 'A35-2', dateApplication: '2023-10-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 12 }], calcul: C.BAR_TH_160, jumelles: ['BAT-TH-155'],
  }),

  /* ── Tertiaire ────────────────────────────────────────────────────────── */
  fiche({
    code: 'BAT-EN-101', secteur: 'tertiaire',
    intitule: 'Isolation de combles ou de toitures', titreCourt: 'Isolation de combles ou de toitures',
    version: 'A59-3', dateApplication: '2025-01-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 25 }], calcul: C.BAT_EN_101, jumelles: ['BAR-EN-101'],
  }),
  fiche({
    code: 'BAT-EN-102', secteur: 'tertiaire',
    intitule: 'Isolation des murs', titreCourt: 'Isolation des murs',
    version: 'A47-2', dateApplication: '2024-10-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 25 }], calcul: C.BAT_EN_102, jumelles: ['BAR-EN-102'],
  }),
  fiche({
    code: 'BAT-TH-102', secteur: 'tertiaire',
    intitule: 'Chaudière collective à haute performance énergétique', titreCourt: 'Chaudière collective HPE',
    version: 'A40-2', dateApplication: '2024-04-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 20 }], calcul: C.BAT_TH_102, jumelles: [],
    // Abrogation à venir : bandeau d'avertissement tant que la date n'est pas passée, puis
    // retrait de la page et 301 vers le hub du secteur.
    dateAbrogation: '2027-06-30',
  }),
  fiche({
    code: 'BAT-TH-155', secteur: 'tertiaire',
    intitule: "Isolation de points singuliers d'un réseau", titreCourt: 'Isolation de points singuliers',
    version: 'A37-2', dateApplication: '2023-10-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 10 }], calcul: C.BAT_TH_155, jumelles: ['IND-BA-112', 'BAR-TH-160'],
  }),
  fiche({
    code: 'BAT-TH-116',
    secteur: 'tertiaire',
    // Intitulé long : le <title> prend `titreCourt`, le H1 garde l'officiel.
    intitule:
      "Système de gestion technique du bâtiment pour le pilotage de l'éclairage, du chauffage, de la ventilation et de la production d'eau chaude sanitaire",
    titreCourt: 'Système de gestion technique du bâtiment',
    version: 'A66-3',
    dateApplication: '2025-07-01',
    zoneApplication: 'metropole_et_dom',
    dureeVie: [
      { valeurAnnees: 10, condition: 'Système de classe A' },
      { valeurAnnees: 8, condition: 'Système de classe B' },
    ],
    calcul: C.BAT_TH_116,
    jumelles: [],
    secteurApplication: "Bâtiments tertiaires existants, quel que soit leur usage, disposant d'installations techniques pilotables.",
    denomination:
      "Mise en place d'un système de gestion technique du bâtiment assurant le pilotage et la régulation d'au moins deux usages énergétiques parmi l'éclairage, le chauffage, la ventilation et l'eau chaude sanitaire.",
    conditions: [
      { titre: 'Classe du système', texte: "Le système installé relève de la classe A ou de la classe B au sens de la norme NF EN ISO 52120-1." },
      { titre: 'Usages pilotés', texte: "Le système pilote au moins deux des quatre usages visés, et permet le suivi des consommations par usage." },
      { titre: 'Mise en service', texte: "La mise en service du système est attestée par le professionnel, avec la liste des usages effectivement raccordés." },
    ],
    justificatifs: [
      'Attestation de mise en service précisant la classe du système',
      'Liste des usages raccordés et surface pilotée en m²',
    ],
    documents: [
      { nature: 'annexe', version: 'A66-3', dateEffet: '2025-07-01', url: `${BASE_PDF}/bat-th-116-annexe.pdf` },
      { nature: 'feuille_recap', version: 'A66-3', dateEffet: '2025-07-01', url: `${BASE_PDF}/bat-th-116-recap.xlsx` },
      { nature: 'fiche', version: 'A58-2', dateEffet: '2023-01-01', url: `${BASE_PDF}/bat-th-116-a58.pdf` },
      // Version publiée mais pas encore applicable : elle apparaît en « à venir ».
      { nature: 'fiche', version: 'A70-1', dateEffet: '2027-01-01', url: `${BASE_PDF}/bat-th-116-a70.pdf` },
    ],
    volumeEngage: [
      { annee: 2025, trimestre: 3, kwhClassique: 3_410_000_000, kwhPrecarite: 0 },
      { annee: 2025, trimestre: 4, kwhClassique: 4_020_000_000, kwhPrecarite: 0 },
    ],
  }),
  fiche({
    code: 'BAT-EQ-127', secteur: 'tertiaire',
    intitule: "Luminaire d'éclairage général à modules LED", titreCourt: 'Luminaire à modules LED',
    version: 'A50-3', dateApplication: '2024-10-01', zoneApplication: 'metropole_et_dom',
    dureeVie: [{ valeurAnnees: 12 }], calcul: C.BAT_EQ_127, jumelles: ['RES-EC-104'],
    // Partie A non publiée : la section Justificatifs le dit au lieu de lier dans le vide.
    partieAPdf: false,
  }),

  /* ── Transport ────────────────────────────────────────────────────────── */
  fiche({
    code: 'TRA-EQ-101', secteur: 'transport',
    intitule: 'Unité de transport frigorifique', titreCourt: 'Unité de transport frigorifique',
    version: 'A42-2', dateApplication: '2024-04-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 8 }], calcul: C.TRA_EQ_101, jumelles: [],
  }),
  fiche({
    code: 'TRA-EQ-117', secteur: 'transport',
    intitule: 'Groupe frigorifique autonome', titreCourt: 'Groupe frigorifique autonome',
    version: 'A26-1', dateApplication: '2023-01-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 8 }], calcul: C.TRA_EQ_117, jumelles: [],
  }),
  fiche({
    code: 'TRA-EQ-114', secteur: 'transport',
    intitule: 'Pneus à basse résistance au roulement', titreCourt: 'Pneus à basse résistance',
    version: 'A30-2', dateApplication: '2023-07-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 3 }], calcul: C.TRA_EQ_114, jumelles: [],
  }),
  fiche({
    code: 'TRA-SE-101', secteur: 'transport',
    intitule: "Formation d'un chauffeur à la conduite économe", titreCourt: 'Formation à la conduite économe',
    version: 'A23-1', dateApplication: '2022-10-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 3 }], calcul: C.TRA_SE_101, jumelles: [],
  }),
  fiche({
    code: 'TRA-EQ-124', secteur: 'transport',
    intitule: 'Télématique embarquée', titreCourt: 'Télématique embarquée',
    version: 'A20-1', dateApplication: '2022-07-01', zoneApplication: 'metropole',
    dureeVie: [{ valeurAnnees: 5 }], calcul: C.TRA_EQ_124, jumelles: [],
  }),
];

/* ── Accès ─────────────────────────────────────────────────────────────── */

/** Le slug d'URL d'une fiche : son code en minuscules, et rien d'autre. */
export function slugFiche(code: string): string {
  return code.toLowerCase();
}

/**
 * L'ancre d'un lien vers une fiche : le code ET l'intitulé.
 *
 * ⛔ JAMAIS LE CODE SEUL. « IND-UT-102 » ne dit rien à qui ne l'a pas déjà cherché ; le code
 * situe, l'intitulé annonce, et un lien a besoin des deux. Le fil d'Ariane, lui, n'affiche
 * que le code : il situe une position, il n'annonce pas une destination.
 */
export function ancreFiche(f: Fiche): string {
  return `${f.code} — ${f.intitule}`;
}

export function ficheParCode(code: string): Fiche | undefined {
  const c = code.toUpperCase();
  return FICHES.find((f) => f.code === c);
}

/* ── Abrogation ─────────────────────────────────────────────────────────
   ⚠️ LA DATE DE RÉFÉRENCE EST CELLE DU BUILD, pas celle de la visite : le site est
   entièrement statique, il n'y a personne pour évaluer une condition au moment du clic. Une
   fiche abrogée cesse donc d'exister au premier déploiement qui suit sa date d'abrogation,
   et `scripts/verifie-routes.mjs` écrit la 301 vers le hub de son secteur. Tant que la date
   n'est pas atteinte, la page reste en ligne avec son bandeau d'avertissement. */

export const DATE_BUILD = new Date().toISOString().slice(0, 10);

export function estAbrogee(f: Fiche, aLaDate = DATE_BUILD): boolean {
  return Boolean(f.dateAbrogation && f.dateAbrogation <= aLaDate);
}

/** Les fiches qui ont une page. C'est cette liste, et pas `FICHES`, que le registre emploie. */
export const FICHES_EN_LIGNE = FICHES.filter((f) => !estAbrogee(f));

/** Les fiches retirées : elles alimentent les redirections vers le hub de leur secteur. */
export const FICHES_ABROGEES = FICHES.filter((f) => estAbrogee(f));

export function fichesDuSecteur(slugSecteur: string): Fiche[] {
  return FICHES_EN_LIGNE.filter((f) => f.secteur === slugSecteur);
}

/**
 * Les fiches d'un secteur, groupées par famille, dans l'ordre du tableau des familles.
 *
 * ⚠️ Les groupes sont DÉDUITS des codes présents, pas d'une liste de sections déclarée : un
 * hub ne peut donc pas afficher une section vide, ni oublier une famille dont il a des
 * fiches. `famillesDuSecteur` ne sert qu'à fixer l'ordre.
 */
export function fichesParFamille(slugSecteur: string) {
  const fiches = fichesDuSecteur(slugSecteur);
  return famillesDuSecteur(slugSecteur)
    .map((fam) => ({ ...fam, id: fam.slug, fiches: fiches.filter((f) => segmentDe(f.code) === fam.segment) }))
    .filter((fam) => fam.fiches.length > 0);
}

/* ── Documents ─────────────────────────────────────────────────────────── */

/**
 * Le document en vigueur pour chaque nature : la version la plus récente dont la date d'effet
 * est passée. Plusieurs versions d'une même nature coexistent dans la base, et une fiche peut
 * porter une version déjà publiée mais applicable plus tard.
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

/** Les voisines déclarées, ou à défaut les autres fiches de la même famille. */
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
 * Le complément par le reste du secteur est un filet, pas une règle : sur le catalogue réel il
 * ne servira presque jamais, mais un bloc « fixe » qui rend quatre liens sur une fiche isolée
 * laisse un trou dans la page.
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

function verifieCoherence() {
  const codes = new Set<string>();
  for (const f of FICHES) {
    if (codes.has(f.code)) throw new Error(`Fiche en double : ${f.code}`);
    codes.add(f.code);

    if (f.code !== f.code.toUpperCase()) throw new Error(`Code non capitalisé : ${f.code}`);
    if (!/^[A-Z]+(-[A-Z0-9]+)+$/.test(f.code)) throw new Error(`Code de forme inattendue : ${f.code}`);

    // Le <title> est bâti sur `titreCourt` précisément parce que l'intitulé officiel déborde
    // sur une vingtaine de fiches. Un titre court qui déborde à son tour ne servirait à rien.
    if (f.titreCourt.length > 60) {
      throw new Error(`Titre court de ${f.code} : ${f.titreCourt.length} caractères, 60 au plus`);
    }
    if (f.dureeVie.length === 0) throw new Error(`Fiche ${f.code} : aucune durée de vie`);
    if (f.dureeVie.length > 1 && f.dureeVie.some((d) => !d.condition)) {
      throw new Error(`Fiche ${f.code} : plusieurs durées de vie, chacune doit porter sa condition`);
    }
    if (f.volumeEngage?.length === 0) {
      throw new Error(`Fiche ${f.code} : volumeEngage vide — l'absence se dit en omettant le champ`);
    }

    if (!secteurParSlug(f.secteur)) throw new Error(`Fiche ${f.code} : secteur inconnu « ${f.secteur} »`);
    // La famille se lit dans le code, et le tableau dit dans quels secteurs elle existe :
    // `IND-TH-101` se compilerait et s'afficherait, alors que la famille thermique n'existe
    // pas en industrie. C'est exactement à quoi ressemble une ligne mal recopiée.
    verifieFamille(f.code, f.secteur);
  }

  // La relation jumelle est symétrique : sans ça, une fiche apparaît dans le bloc de l'autre
  // mais pas l'inverse, et le maillage devient un aller sans retour.
  for (const f of FICHES) {
    for (const code of f.jumelles) {
      const jumelle = FICHES.find((x) => x.code === code);
      if (!jumelle) throw new Error(`Fiche ${f.code} : jumelle inconnue « ${code} »`);
      if (!jumelle.jumelles.includes(f.code)) {
        throw new Error(`Relation jumelle non réciproque : ${f.code} → ${code}, mais pas l'inverse`);
      }
    }
    for (const code of f.voisines ?? []) {
      if (!FICHES.some((x) => x.code === code)) throw new Error(`Fiche ${f.code} : voisine inconnue « ${code} »`);
    }
  }

  for (const s of SECTEURS) {
    if (fichesDuSecteur(s.slug).length === 0) throw new Error(`Secteur sans aucune fiche en ligne : ${s.slug}`);
  }

  // Un segment déclaré pour un secteur qui n'a aucune fiche de cette famille n'est pas une
  // faute : le catalogue est partiel. L'inverse en serait une, et `verifieFamille` la couvre.
  for (const fam of FAMILLES) {
    for (const secteur of fam.secteurs) {
      if (!secteurParSlug(secteur)) {
        throw new Error(`Famille ${fam.segment} : secteur inconnu « ${secteur} » dans lib/familles.ts`);
      }
    }
  }
}
verifieCoherence();
