/**
 * Les articles du blog. Amorce : trois entrées, celles que la page d'accueil met déjà en
 * avant, pour que ses liens résolvent au lieu de retomber sur une ancre.
 *
 * ⛔ AUCUNE ARCHIVE D'AUTEUR, DE CATÉGORIE NI DE DATE. Le blog n'expose que son index et ses
 * articles ; `tag` est un libellé d'affichage, pas une taxonomie qui engendrerait des pages.
 */
export interface Article {
  slug: string;
  titre: string;
  tag: string;
  /** Date de publication au format ISO, pour le tri et le sitemap. */
  date: string;
}

export const ARTICLES: Article[] = [
  { slug: 'fiches-operations-standardisees-ce-qui-change', titre: "Fiches d'opérations standardisées : ce qui change", tag: 'Actualité réglementaire', date: '2026-08-28' },
  { slug: 'comprendre-la-fiche-bat-th-116', titre: 'Comprendre la fiche CEE BAT-TH-116', tag: 'Guide', date: '2026-07-15' },
  { slug: 'preparer-son-dossier-cee-en-5-points', titre: 'Bien préparer son dossier CEE en 5 points', tag: 'Conseil métier', date: '2026-06-30' },
];

export function articleParSlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
