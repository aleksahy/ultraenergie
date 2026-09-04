/** Identité du site. Le domaine sert au sitemap, à robots.txt et aux URL absolues du balisage. */
export const SITE = {
  domaine: 'https://ultraenergie.fr',
  nom: 'Ultra Énergie',
};

/**
 * Le taux de conversion des kWh cumac en euros, en €/kWh cumac.
 *
 * ⚠️ RÉGLAGE DE SITE, DÉCLARÉ ICI ET NULLE PART AILLEURS. Il apparaît sur les 218 pages de
 * fiche, dans chaque simulateur : recopié dans un composant, il deviendrait introuvable le
 * jour où le cours bouge, et deux pages afficheraient deux prix.
 *
 * 🚨 VALEUR D'AMORCE. Le cours du CEE varie ; celui-ci n'est pas relevé sur un marché à une
 * date donnée. À raccorder à la source retenue (indice EMMY, cotation d'un courtier) avant
 * d'annoncer un euro à qui que ce soit.
 */
export const TAUX_EURO_PAR_KWH_CUMAC = 0.0075;

/** Formatage français : les milliers séparés par une espace insécable fine. */
export const nombreFr = new Intl.NumberFormat('fr-FR');
export const euroFr = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
