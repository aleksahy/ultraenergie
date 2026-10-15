import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // ⚠️ OBLIGATOIRE AVEC `output: 'export'` : il n'y a pas de serveur pour redimensionner à la
  // volée. Les photos importées sont servies telles quelles, d'où les dérivées fabriquées en
  // amont par `npm run images` (cf. scripts/derive-photos.mjs).
  images: { unoptimized: true },
  // ⚠️ LA BARRE OBLIQUE FINALE EST LA FORME CANONIQUE DU SITE, sur toutes les pages.
  // L'architecture demande deux choses à la fois : que `/comprendre-les-cee/` et `/blog/`
  // répondent 200 telles qu'écrites, et que la forme d'URL soit cohérente
  // partout. Les deux ensemble ne laissent qu'une possibilité. Chaque page est écrite en
  // `<dossier>/index.html`, et la forme sans barre redirige en 301 (les règles sont écrites
  // dans `out/_redirects` par scripts/verifie-routes.mjs).
  // ⛔ Ne pas repasser à `false` sans refaire les redirections en sens inverse : toutes les
  // URL déjà indexées changeraient.
  trailingSlash: true,
};

export default nextConfig;
