import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // ⚠️ OBLIGATOIRE AVEC `output: 'export'` : il n'y a pas de serveur pour redimensionner
  // à la volée. Les photos importées sont servies telles quelles, d'où les dérivées
  // fabriquées en amont par `npm run images` (cf. scripts/derive-photos.mjs).
  images: { unoptimized: true },
};

export default nextConfig;
