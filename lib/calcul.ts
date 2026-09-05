/**
 * Les cinq formes de calcul d'une fiche CEE, et leur évaluation.
 *
 * ⚠️ UN TYPE DISCRIMINANT, PAS UN SAC DE CHAMPS FACULTATIFS. Le champ `type` force le
 * compilateur à traiter les cinq formes partout où l'on en manipule une : ajouter une sixième
 * forme casse la compilation à chaque endroit qui doit la connaître, au lieu de rendre une
 * page vide en production.
 *
 * ⚠️ L'ÉVALUATION VIT ICI, PAS DANS LE SIMULATEUR. La grille officielle est rendue côté
 * serveur et le simulateur côté client : s'ils calculaient chacun de leur côté, ils
 * finiraient par annoncer deux montants différents pour la même fiche.
 */

/** Une entrée de saisie : ce que le simulateur demande, et ce que la Partie A demande. */
export interface Champ {
  /** Clef de saisie, stable. */
  id: string;
  /** Libellé repris de la Partie A. */
  libelle: string;
  /** `choix` = liste fermée, `nombre` = quantité à saisir. */
  nature: 'choix' | 'nombre';
  /** Pour `choix` : les valeurs admises. */
  valeurs?: string[];
  /** Pour `nombre` : l'unité affichée à côté du champ. */
  unite?: string;
}

interface Base {
  /** Les notes de bas de tableau de la fiche officielle. */
  notes?: string[];
}

/** Un coefficient multiplié par une quantité. Ex. 710 kWh cumac × surface en m². */
export interface CalculForfait extends Base {
  type: 'forfait';
  coefficient: number;
  unite: string;
  /** Le libellé de la quantité, repris de la Partie A. */
  variable: string;
  variableUnite: string;
}

/** Une liste fermée de cas, un montant par cas. Ex. 8 catégories de véhicule. */
export interface CalculCorrespondance extends Base {
  type: 'correspondance';
  libelleEntree: string;
  entrees: { libelle: string; montant: number }[];
}

/**
 * Une grille à plusieurs dimensions. Ex. zone climatique × type de système × puissance.
 * `grille` est indexée par les valeurs des dimensions jointes par ` | `, dans l'ordre de
 * `dimensions` — `cleGrille()` est la seule façon de fabriquer cette clef.
 */
export interface CalculCroisement extends Base {
  type: 'croisement';
  dimensions: { nom: string; valeurs: string[] }[];
  grille: Record<string, number>;
  /** Certaines grilles donnent un montant au m², au kW… qu'il reste à multiplier. */
  multiplicateur?: { libelle: string; unite: string };
  /** En-tête de la colonne des montants, quand la fiche officielle le formule autrement. */
  libelleMontant?: string;
}

/** Deux grilles multipliées entre elles. */
export interface CalculProduitTables extends Base {
  type: 'produit_tables';
  tables: {
    nom: string;
    dimension: { nom: string; valeurs: string[] };
    valeurs: Record<string, number>;
    unite?: string;
  }[];
}

/** L'une des quatre formes ci-dessus, selon un cas. Ex. classe A / classe B. */
export interface CalculVariantes {
  type: 'variantes';
  condition: string;
  cas: { libelle: string; calcul: CalculSimple }[];
}

export type CalculSimple = CalculForfait | CalculCorrespondance | CalculCroisement | CalculProduitTables;
export type Calcul = CalculSimple | CalculVariantes;

/* ── Clefs de grille ───────────────────────────────────────────────────── */

export const SEPARATEUR = ' | ';

export function cleGrille(valeurs: string[]): string {
  return valeurs.join(SEPARATEUR);
}

/* ── Les champs à saisir ───────────────────────────────────────────────── */

/** Le champ qui sélectionne la variante, quand il y en a une. */
export const CHAMP_VARIANTE = '__variante';

/**
 * Les champs qu'il faut renseigner pour obtenir un montant. Le simulateur en fait ses
 * entrées, et la section « Justificatifs » la liste de ce que la Partie A réclame : les deux
 * viennent du même endroit, donc elles ne peuvent pas diverger.
 */
export function champs(calcul: Calcul): Champ[] {
  if (calcul.type === 'variantes') {
    const selecteur: Champ = {
      id: CHAMP_VARIANTE,
      libelle: calcul.condition,
      nature: 'choix',
      valeurs: calcul.cas.map((c) => c.libelle),
    };
    // Les cas partagent la même forme de saisie dans les fiches observées : on expose les
    // champs du premier, le sélecteur de variante décidant du barème appliqué.
    return [selecteur, ...champs(calcul.cas[0].calcul)];
  }

  switch (calcul.type) {
    case 'forfait':
      return [{ id: 'quantite', libelle: calcul.variable, nature: 'nombre', unite: calcul.variableUnite }];
    case 'correspondance':
      return [{ id: 'cas', libelle: calcul.libelleEntree, nature: 'choix', valeurs: calcul.entrees.map((e) => e.libelle) }];
    case 'croisement':
      return [
        ...calcul.dimensions.map((d, i) => ({ id: `d${i}`, libelle: d.nom, nature: 'choix' as const, valeurs: d.valeurs })),
        ...(calcul.multiplicateur
          ? [{ id: 'quantite', libelle: calcul.multiplicateur.libelle, nature: 'nombre' as const, unite: calcul.multiplicateur.unite }]
          : []),
      ];
    case 'produit_tables':
      return calcul.tables.map((t, i) => ({ id: `t${i}`, libelle: t.dimension.nom, nature: 'choix' as const, valeurs: t.dimension.valeurs }));
  }
}

/* ── Évaluation ────────────────────────────────────────────────────────── */

export type Saisie = Record<string, string>;

export interface Resultat {
  kwhCumac: number | null;
  /** Les libellés des champs encore vides : le simulateur les nomme au lieu d'afficher 0. */
  manquants: string[];
}

export function evalue(calcul: Calcul, saisie: Saisie): Resultat {
  const manquants = champs(calcul)
    .filter((c) => !saisie[c.id] || saisie[c.id].trim() === '')
    .map((c) => c.libelle);
  if (manquants.length) return { kwhCumac: null, manquants };

  return { kwhCumac: montant(calcul, saisie), manquants: [] };
}

function nombre(valeur: string | undefined): number | null {
  if (valeur === undefined) return null;
  const n = Number(valeur.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function montant(calcul: Calcul, saisie: Saisie): number | null {
  if (calcul.type === 'variantes') {
    const cas = calcul.cas.find((c) => c.libelle === saisie[CHAMP_VARIANTE]);
    return cas ? montant(cas.calcul, saisie) : null;
  }

  switch (calcul.type) {
    case 'forfait': {
      const q = nombre(saisie.quantite);
      return q === null ? null : Math.round(calcul.coefficient * q);
    }
    case 'correspondance': {
      const entree = calcul.entrees.find((e) => e.libelle === saisie.cas);
      return entree ? entree.montant : null;
    }
    case 'croisement': {
      const cle = cleGrille(calcul.dimensions.map((_, i) => saisie[`d${i}`]));
      const valeur = calcul.grille[cle];
      if (valeur === undefined) return null;
      if (!calcul.multiplicateur) return valeur;
      const q = nombre(saisie.quantite);
      return q === null ? null : Math.round(valeur * q);
    }
    case 'produit_tables': {
      let produit = 1;
      for (const [i, table] of calcul.tables.entries()) {
        const valeur = table.valeurs[saisie[`t${i}`]];
        if (valeur === undefined) return null;
        produit *= valeur;
      }
      return Math.round(produit);
    }
  }
}

/* ── Montant en vitrine ────────────────────────────────────────────────── */

/** Toutes les valeurs qu'une forme de calcul peut produire, à multiplicateur près. */
function valeurs(calcul: Calcul): number[] {
  if (calcul.type === 'variantes') return calcul.cas.flatMap((c) => valeurs(c.calcul));
  switch (calcul.type) {
    case 'forfait': return [calcul.coefficient];
    case 'correspondance': return calcul.entrees.map((e) => e.montant);
    case 'croisement': return Object.values(calcul.grille);
    case 'produit_tables': return Object.values(calcul.tables[0].valeurs);
  }
}

export interface MontantVitrine {
  valeur: number;
  unite: string;
  /** La combinaison qui produit ce montant : « en zone H1 ». Absente s'il n'y en a qu'un. */
  condition?: string;
}

/**
 * Le montant de l'encadré de synthèse : la valeur la plus élevée du barème, ET la condition
 * qui la produit.
 *
 * ⛔ JAMAIS UNE MOYENNE. Une moyenne sur une grille climatique ne correspond à aucune
 * opération réelle, et c'est le nombre qu'on retrouve cité de travers.
 * ⚠️ ET JAMAIS LA VALEUR SEULE : « 1 700 kWh cumac/m² » sans « en zone H1 » se lit comme une
 * promesse valable partout. La condition fait partie du montant, pas de la note de bas de page.
 */
export function montantVitrine(calcul: Calcul): MontantVitrine {
  const unite = uniteMontant(calcul);
  const toutes = valeurs(calcul);
  const max = Math.max(...toutes);

  if (toutes.length === 1) return { valeur: max, unite };
  return { valeur: max, unite, condition: conditionDuMax(calcul, max) };
}

/** Le libellé de la combinaison qui atteint le montant maximal. */
function conditionDuMax(calcul: Calcul, max: number): string | undefined {
  if (calcul.type === 'variantes') {
    for (const cas of calcul.cas) {
      if (valeurs(cas.calcul).includes(max)) {
        const interne = conditionDuMax(cas.calcul, max);
        return interne ? `${cas.libelle}, ${interne}` : cas.libelle;
      }
    }
    return undefined;
  }
  if (calcul.type === 'correspondance') {
    return calcul.entrees.find((e) => e.montant === max)?.libelle;
  }
  if (calcul.type === 'croisement') {
    const cle = Object.keys(calcul.grille).find((k) => calcul.grille[k] === max);
    if (!cle) return undefined;
    // Chaque valeur est précédée du nom de sa dimension : « zone climatique H1 » plutôt que
    // « H1 », qui ne veut rien dire hors du tableau qu'on vient de quitter.
    return cle
      .split(SEPARATEUR)
      .map((valeur, i) => `${calcul.dimensions[i].nom.toLowerCase()} ${valeur}`)
      .join(', ');
  }
  if (calcul.type === 'produit_tables') {
    const table = calcul.tables[0];
    return Object.keys(table.valeurs).find((k) => table.valeurs[k] === max);
  }
  return undefined;
}

/** Ce à quoi le montant se rapporte : « kWh cumac », « kWh cumac / m² »… */
export function uniteMontant(calcul: Calcul): string {
  if (calcul.type === 'variantes') return uniteMontant(calcul.cas[0].calcul);
  if (calcul.type === 'forfait') return `${calcul.unite}/${calcul.variableUnite}`;
  if (calcul.type === 'croisement' && calcul.multiplicateur) {
    return `kWh cumac/${calcul.multiplicateur.unite}`;
  }
  return 'kWh cumac';
}
