/** Identité du site. Le domaine sert au sitemap, à robots.txt et aux URL absolues du balisage. */
export const SITE = {
  domaine: 'https://ultraenergie.fr',
  nom: 'Ultra Énergie',
};

/** Formatage français : les milliers séparés par une espace insécable fine. */
export const nombreFr = new Intl.NumberFormat('fr-FR');
export const decimalFr = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
