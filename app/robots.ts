import type { MetadataRoute } from 'next';

/* ⚠️ INDISPENSABLE AVEC `output: 'export'` : sans ce drapeau, Next traite la route comme
   dynamique et le build échoue à la collecte des pages. */
export const dynamic = 'force-static';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.domaine}/sitemap.xml`,
  };
}
