import type { Calcul } from './calcul';

/**
 * Les barèmes, sortis de `lib/fiches.ts` pour que la table de détail reste lisible.
 *
 * Une entrée par code, nommée comme lui. Les cinq formes de calcul sont décrites dans
 * `lib/calcul.ts` ; celle-ci est la plus simple, une dimension et une variable.
 */

export const BAR_EN_101: Calcul = {
  type: 'croisement',
  dimensions: [{ nom: 'Zone climatique', valeurs: ['H1', 'H2', 'H3'] }],
  grille: { H1: 1_700, H2: 1_400, H3: 920 },
  multiplicateur: { libelle: "Surface d'isolant", unite: 'm²' },
  libelleMontant: "kWh cumac par m² d'isolant",
};
