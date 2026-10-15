import type { Metadata } from 'next';

/**
 * Les métadonnées d'une page intérieure, en un seul endroit.
 *
 * ⚠️ LE `<title>` N'EST PAS LE H1 (audit SEO du 15/10/2026, demande d'Alek) : le titre de
 * l'onglet et du résultat de recherche porte le mot-clé et le contexte (« Prime CEE pour
 * installateurs… »), le H1 porte la promesse éditoriale. Les deux disaient la même chose sur
 * vingt pages.
 *
 * ⚠️ `openGraph` EST RENDU EN ENTIER. Next ne fusionne pas les objets imbriqués : une page
 * qui ne donne que `title` et `description` perd le `siteName`, la `locale` et le `type`
 * posés par le layout. D'où le helper, qui les repose à chaque fois.
 *
 * ⚠️ `canonical` À CHAQUE PAGE. Sans lui, la page hérite du canonical du layout, `/`, et
 * déclare l'accueil comme version de référence : c'était le cas des douze pages du
 * glossaire avant le 15/10/2026.
 */
export function metaPage({ titre, description, chemin }: { titre: string; description: string; chemin: string }): Metadata {
  const title = `${titre} | Ultra Énergie`;
  return {
    title,
    description,
    alternates: { canonical: chemin },
    openGraph: { siteName: 'Ultra Énergie', locale: 'fr_FR', type: 'website', title, description, url: chemin },
  };
}
