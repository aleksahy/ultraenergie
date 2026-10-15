import { PUBLICS, PARTENAIRES } from './publics';
import { url } from './routes';

/**
 * L'arbre de navigation, source unique de la nav desktop, du panneau mobile et du contrôle
 * de fin de build.
 *
 * ⚠️ UN GROUPE N'A PAS D'`href`, ET LE TYPE L'INTERDIT. « Pour qui » et « Partenaires » sont
 * des libellés de menu : ils ne résolvent pas, ils ne doivent jamais
 * être liés. Donner un `href` à un groupe créerait une URL que rien ne sert et que le
 * contrôle de liens signalerait en 404. C'est pour ça que `GroupeNav` ne porte pas le champ :
 * le déclencheur est rendu en `<button>`, pas en `<a>`.
 *
 * « Ressources » suit la même forme : ses pages index sont ses entrées, le libellé lui-même
 * n'en est pas une.
 *
 * ⛔ PLUS D'ENTRÉES « FICHES CEE » NI « SIMULATEUR DE PRIME » depuis le 14/10/2026 : le
 * catalogue et le simulateur sont retirés pour être rebâtis. Quand ils reviennent, ils
 * reprennent leur place en tête des ressources, et « Fiches CEE » reste une entrée parmi les
 * ressources, pas un bloc à part : lister ses hubs en dessous en referait un.
 *
 * ⛔ PAS D'ENTRÉE « SECTEURS » : les six pages secteur commerciales ont été retirées le
 * 19/09/2026. Le menu a quatre entrées, pas cinq. Le contrôle d'orphelines de
 * `scripts/verifie-routes.mjs` refuse le build si l'un d'eux se retrouvait sans lien entrant.
 */
export interface LienNav {
  label: string;
  href: string;
}

export interface GroupeNav {
  label: string;
  enfants: LienNav[];
}

export type NoeudNav = LienNav | GroupeNav;

export function estGroupe(noeud: NoeudNav): noeud is GroupeNav {
  return 'enfants' in noeud;
}

export const NAV: NoeudNav[] = [
  { label: 'Qui sommes-nous', href: url.quiSommesNous },
  {
    /* Les installateurs ouvrent la liste : ce sont les clients (cf. lib/publics.ts). */
    label: 'Pour qui',
    enfants: PUBLICS.map((p) => ({ label: p.label, href: url.public(p.slug) })),
  },
  {
    label: 'Ressources',
    enfants: [
      { label: 'Comprendre les CEE', href: url.comprendreLesCee },
      { label: 'Blog', href: url.blog },
      { label: 'Veille CEE', href: url.veilleCee },
    ],
  },
  {
    label: 'Partenaires',
    enfants: PARTENAIRES.map((p) => ({ label: p.label, href: url.partenaire(p.slug) })),
  },
];
