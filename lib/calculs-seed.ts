import type { Calcul, CalculCroisement } from './calcul';
import { cleGrille } from './calcul';

/**
 * Les barèmes de l'amorce de catalogue, sortis de `lib/fiches.ts` pour que la table de fiches
 * reste lisible ligne à ligne.
 *
 * 🚨 VALEURS NON VÉRIFIÉES, comme les codes et les versions qu'elles accompagnent. Elles
 * éprouvent le gabarit : les cinq formes de calcul y sont représentées, ainsi que les notes
 * de bas de tableau et les grilles à plusieurs dimensions.
 */

/** Construit la grille d'un croisement à deux dimensions, sans écrire les clefs à la main. */
function grille2(lignes: string[], colonnes: string[], valeurs: number[][]): Record<string, number> {
  const sortie: Record<string, number> = {};
  lignes.forEach((l, i) => colonnes.forEach((c, j) => { sortie[cleGrille([l, c])] = valeurs[i][j]; }));
  return sortie;
}

const ZONES = ['H1', 'H2', 'H3'];

/* ── Forfaits ─────────────────────────────────────────────────────────────
   La forme la plus courante : un coefficient, une quantité. */

const forfait = (coefficient: number, variable: string, variableUnite: string, notes?: string[]): Calcul => ({
  type: 'forfait', coefficient, unite: 'kWh cumac', variable, variableUnite, notes,
});

export const AGRI_TH_102 = forfait(2_600, 'Puissance frigorifique du groupe de froid', 'kW');
export const AGRI_TH_104 = forfait(14_800, 'Nombre de pré-refroidisseurs installés', 'unité');
export const AGRI_EQ_102 = forfait(9_400, 'Puissance frigorifique du groupe de froid', 'kW');
export const AGRI_TH_108 = forfait(710, 'Surface de paroi isolée', 'm²');
export const AGRI_UT_103 = forfait(3_100, 'Puissance nominale du moteur', 'kW');

export const IND_UT_117 = forfait(5_900, "Puissance électrique du compresseur d'air", 'kW');
export const IND_UT_121 = forfait(4_250, 'Puissance nominale du moto-variateur', 'kW');
export const IND_UT_134 = forfait(2_600, 'Puissance frigorifique du groupe de froid', 'kW');
export const IND_BA_112 = forfait(3_800, 'Nombre de points singuliers isolés', 'unité');
export const IND_BA_110 = forfait(1_150, 'Surface au sol traitée', 'm²');

export const RES_CH_103 = forfait(18_200, 'Puissance du poste de livraison', 'kW');
export const RES_CH_106 = forfait(640, 'Longueur de réseau optimisée', 'm');
export const RES_EC_107 = forfait(2_050, "Nombre de points lumineux régulés", 'unité');

export const BAR_TH_113 = forfait(52_000, 'Nombre de chaudières installées', 'unité');
export const BAR_TH_160 = forfait(1_900, 'Longueur de réseau isolée', 'm');
export const BAT_TH_155 = forfait(3_800, 'Nombre de points singuliers isolés', 'unité');

export const TRA_EQ_117 = forfait(31_500, 'Nombre de groupes installés', 'unité');
export const TRA_SE_101 = forfait(8_600, 'Nombre de chauffeurs formés', 'chauffeur');
export const TRA_EQ_124 = forfait(12_300, 'Nombre de véhicules équipés', 'véhicule');

/* ── Croisements ──────────────────────────────────────────────────────────
   Une grille officielle, un montant par combinaison, parfois à multiplier par une quantité. */

export const BAR_EN_101: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Zone climatique', valeurs: ZONES },
    { nom: 'Partie isolée', valeurs: ['Comble perdu', 'Rampant de toiture'] },
  ],
  grille: grille2(ZONES, ['Comble perdu', 'Rampant de toiture'], [
    [1_300, 1_000],
    [1_100, 850],
    [700, 550],
  ]),
  multiplicateur: { libelle: 'Surface isolée', unite: 'm²' },
  notes: [
    "Résistance thermique minimale : 7 m²·K/W en comble perdu, 6 m²·K/W en rampant de toiture.",
    "Les montants s'entendent par mètre carré d'isolant posé, hors bonification.",
  ],
};

export const BAT_EN_101: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Zone climatique', valeurs: ZONES },
    { nom: 'Partie isolée', valeurs: ['Comble perdu', 'Rampant de toiture'] },
  ],
  grille: grille2(ZONES, ['Comble perdu', 'Rampant de toiture'], [
    [1_150, 890],
    [980, 760],
    [620, 480],
  ]),
  multiplicateur: { libelle: 'Surface isolée', unite: 'm²' },
  notes: ["Les montants s'entendent par mètre carré d'isolant posé."],
};

export const BAR_EN_102: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Zone climatique', valeurs: ZONES },
    { nom: 'Type de pose', valeurs: ["Isolation par l'extérieur", "Isolation par l'intérieur"] },
  ],
  grille: grille2(ZONES, ["Isolation par l'extérieur", "Isolation par l'intérieur"], [
    [3_800, 2_700],
    [3_100, 2_200],
    [2_100, 1_500],
  ]),
  multiplicateur: { libelle: 'Surface isolée', unite: 'm²' },
  notes: ['Résistance thermique minimale : 3,7 m²·K/W.'],
};

export const BAT_EN_102: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Zone climatique', valeurs: ZONES },
    { nom: 'Type de pose', valeurs: ["Isolation par l'extérieur", "Isolation par l'intérieur"] },
  ],
  grille: grille2(ZONES, ["Isolation par l'extérieur", "Isolation par l'intérieur"], [
    [3_400, 2_450],
    [2_800, 2_000],
    [1_900, 1_350],
  ]),
  multiplicateur: { libelle: 'Surface isolée', unite: 'm²' },
};

export const BAR_TH_171: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Zone climatique', valeurs: ZONES },
    { nom: 'Efficacité énergétique saisonnière', valeurs: ['ETAS ≥ 111 %', '102 % ≤ ETAS < 111 %'] },
  ],
  grille: grille2(ZONES, ['ETAS ≥ 111 %', '102 % ≤ ETAS < 111 %'], [
    [780_000, 630_000],
    [640_000, 515_000],
    [430_000, 345_000],
  ]),
  notes: [
    "L'efficacité énergétique saisonnière est celle déclarée par le fabricant pour une application à moyenne température.",
    "Montants pour une maison individuelle ; se reporter à la fiche pour l'habitat collectif.",
  ],
};

export const BAT_TH_102: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Zone climatique', valeurs: ZONES },
    { nom: 'Puissance de la chaudière', valeurs: ['≤ 400 kW', '> 400 kW'] },
  ],
  grille: grille2(ZONES, ['≤ 400 kW', '> 400 kW'], [
    [1_450, 1_180],
    [1_200, 970],
    [810, 650],
  ]),
  multiplicateur: { libelle: 'Puissance installée', unite: 'kW' },
};

export const RES_CH_104: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Température de retour visée', valeurs: ['< 50 °C', '50 à 60 °C'] },
    { nom: 'Puissance souscrite', valeurs: ['≤ 1 MW', '> 1 MW'] },
  ],
  grille: grille2(['< 50 °C', '50 à 60 °C'], ['≤ 1 MW', '> 1 MW'], [
    [2_900_000, 6_400_000],
    [1_800_000, 3_950_000],
  ]),
};

export const RES_EC_104: CalculCroisement = {
  type: 'croisement',
  dimensions: [
    { nom: 'Puissance du luminaire remplacé', valeurs: ['< 100 W', '100 à 250 W', '> 250 W'] },
    { nom: 'Durée annuelle de fonctionnement', valeurs: ['≤ 3 500 h', '> 3 500 h'] },
  ],
  grille: grille2(['< 100 W', '100 à 250 W', '> 250 W'], ['≤ 3 500 h', '> 3 500 h'], [
    [1_400, 1_950],
    [3_100, 4_300],
    [5_800, 8_050],
  ]),
  multiplicateur: { libelle: 'Nombre de luminaires remplacés', unite: 'luminaire' },
};

/* ── Correspondances ──────────────────────────────────────────────────────
   Une liste fermée de cas, un montant par cas. */

export const TRA_EQ_101: Calcul = {
  type: 'correspondance',
  libelleEntree: 'Catégorie du véhicule',
  entrees: [
    { libelle: 'Fourgon réfrigéré ≤ 3,5 t', montant: 18_400 },
    { libelle: 'Porteur 3,5 à 7,5 t', montant: 34_900 },
    { libelle: 'Porteur 7,5 à 12 t', montant: 52_300 },
    { libelle: 'Porteur 12 à 19 t', montant: 71_600 },
    { libelle: 'Porteur > 19 t', montant: 94_200 },
    { libelle: 'Semi-remorque mono-température', montant: 118_500 },
    { libelle: 'Semi-remorque bi-température', montant: 141_000 },
    { libelle: 'Semi-remorque tri-température', montant: 162_800 },
  ],
  notes: ["La catégorie retenue est celle mentionnée sur la carte grise du véhicule porteur."],
};

export const TRA_EQ_114: Calcul = {
  type: 'correspondance',
  libelleEntree: 'Catégorie de pneumatique',
  entrees: [
    { libelle: 'Véhicule utilitaire léger', montant: 1_100 },
    { libelle: 'Poids lourd, essieu directeur', montant: 4_300 },
    { libelle: 'Poids lourd, essieu moteur', montant: 5_100 },
    { libelle: 'Remorque et semi-remorque', montant: 3_800 },
  ],
};

export const BAT_EQ_127: Calcul = {
  type: 'correspondance',
  libelleEntree: "Usage du local éclairé",
  entrees: [
    { libelle: 'Bureau', montant: 5_400 },
    { libelle: 'Commerce', montant: 8_900 },
    { libelle: 'Entrepôt', montant: 12_600 },
    { libelle: 'Atelier', montant: 14_100 },
    { libelle: 'Parking couvert', montant: 19_700 },
  ],
  notes: ["Montant par luminaire installé, pour un fonctionnement d'au moins 3 000 heures par an."],
};

/* ── Produit de tables ────────────────────────────────────────────────────
   Deux grilles multipliées entre elles. */

export const IND_UT_102: Calcul = {
  type: 'produit_tables',
  tables: [
    {
      nom: 'Montant de base selon la puissance du moteur',
      dimension: { nom: 'Puissance nominale du moteur', valeurs: ['0,75 à 5 kW', '5 à 20 kW', '20 à 100 kW', '100 à 500 kW'] },
      valeurs: { '0,75 à 5 kW': 21_000, '5 à 20 kW': 84_000, '20 à 100 kW': 340_000, '100 à 500 kW': 1_260_000 },
      unite: 'kWh cumac',
    },
    {
      nom: "Facteur d'usage selon la durée annuelle de fonctionnement",
      dimension: { nom: 'Durée annuelle de fonctionnement', valeurs: ['< 2 000 h', '2 000 à 4 000 h', '4 000 à 6 000 h', '> 6 000 h'] },
      valeurs: { '< 2 000 h': 0.5, '2 000 à 4 000 h': 1, '4 000 à 6 000 h': 1.6, '> 6 000 h': 2.2 },
    },
  ],
  notes: [
    "La durée annuelle de fonctionnement est justifiée par l'exploitant ; à défaut, la valeur la plus basse s'applique.",
    "Le montant obtenu s'entend par moteur équipé.",
  ],
};

/* ── Variantes ────────────────────────────────────────────────────────────
   Une des formes ci-dessus, choisie selon un cas. */

export const BAT_TH_116: Calcul = {
  type: 'variantes',
  condition: 'Classe du système de gestion technique',
  cas: [
    {
      libelle: 'Classe A',
      calcul: {
        type: 'croisement',
        dimensions: [
          { nom: "Secteur d'activité", valeurs: ['Bureaux', 'Enseignement', 'Commerce', 'Santé', 'Hôtellerie'] },
          { nom: 'Énergie de chauffage', valeurs: ['Combustible', 'Électricité'] },
        ],
        grille: grille2(['Bureaux', 'Enseignement', 'Commerce', 'Santé', 'Hôtellerie'], ['Combustible', 'Électricité'], [
          [1_060, 490],
          [790, 360],
          [1_240, 570],
          [1_680, 780],
          [1_390, 640],
        ]),
        multiplicateur: { libelle: 'Surface pilotée', unite: 'm²' },
        notes: ["Classe A au sens de la norme NF EN ISO 52120-1."],
      },
    },
    {
      libelle: 'Classe B',
      calcul: {
        type: 'croisement',
        dimensions: [
          { nom: "Secteur d'activité", valeurs: ['Bureaux', 'Enseignement', 'Commerce', 'Santé', 'Hôtellerie'] },
          { nom: 'Énergie de chauffage', valeurs: ['Combustible', 'Électricité'] },
        ],
        grille: grille2(['Bureaux', 'Enseignement', 'Commerce', 'Santé', 'Hôtellerie'], ['Combustible', 'Électricité'], [
          [680, 315],
          [505, 230],
          [795, 365],
          [1_075, 500],
          [890, 410],
        ]),
        multiplicateur: { libelle: 'Surface pilotée', unite: 'm²' },
        notes: ["Classe B au sens de la norme NF EN ISO 52120-1."],
      },
    },
  ],
};
