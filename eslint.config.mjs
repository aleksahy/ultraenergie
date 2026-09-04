import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Le site est rédigé en français : l'apostrophe est dans presque chaque phrase. La
      // règle protège d'une ambiguïté de lecture du source, pas d'un défaut de rendu
      // (React échappe le texte JSX) ; écrire « l&apos;énergie » partout coûte plus
      // qu'elle ne rapporte, et noie les vrais défauts sous le bruit.
      'react/no-unescaped-entities': 'off',
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
