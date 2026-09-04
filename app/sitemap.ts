import type { MetadataRoute } from 'next';

/* ⚠️ INDISPENSABLE AVEC `output: 'export'` : sans ce drapeau, Next traite la route comme
   dynamique et le build échoue à la collecte des pages. */
export const dynamic = 'force-static';
import { SITE } from '@/lib/site';
import { TOUTES_LES_ROUTES } from '@/lib/routes';

/**
 * Le sitemap, en URL ABSOLUES sur le domaine de production, référencé par robots.txt.
 *
 * ⚠️ IL SERT AUSSI DE SOURCE AU CONTRÔLE DE FIN DE BUILD (scripts/verifie-routes.mjs) : le
 * script compare ce qu'il déclare à ce que le build a réellement écrit dans `out/`, dans les
 * deux sens. Une page générée sans être ici, ou déclarée ici sans être générée, casse le
 * build. C'est ce qui garantit qu'aucune page d'archive, d'auteur ou de média n'apparaît
 * sans qu'on l'ait voulue.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return TOUTES_LES_ROUTES.map((chemin) => ({ url: `${SITE.domaine}${chemin}` }));
}
