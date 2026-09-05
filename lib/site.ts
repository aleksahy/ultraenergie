/** Identité du site. Le domaine sert au sitemap, à robots.txt et aux URL absolues du balisage. */
export const SITE = {
  domaine: 'https://ultraenergie.fr',
  nom: 'Ultra Énergie',
};

/**
 * Le cours du CEE, en euros par MWh cumac.
 *
 * ⚠️ PARAMÈTRE UNIQUE DU SITE, DÉCLARÉ ICI ET NULLE PART AILLEURS, ET DATÉ. Il apparaît sur
 * chaque page de fiche et dans le simulateur : recopié dans un composant, il deviendrait
 * introuvable le jour où le cours bouge, et deux pages afficheraient deux prix. La date
 * s'affiche avec le montant — un prix de marché sans date ne veut rien dire.
 *
 * 🚨 VALEUR À RACCORDER À UNE SOURCE (indice EMMY, cotation d'un courtier) et à tenir à jour.
 */
export const TAUX_CEE = {
  euroParMwhCumac: 8,
  releveLe: '2026-09-01',
};

/** Convertit des kWh cumac en euros, au taux du site. */
export function enEuros(kwhCumac: number): number {
  return (kwhCumac / 1000) * TAUX_CEE.euroParMwhCumac;
}

/** Formatage français : les milliers séparés par une espace insécable fine. */
export const nombreFr = new Intl.NumberFormat('fr-FR');
export const euroFr = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export const decimalFr = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
