import { SECTEURS } from './secteurs';
import { PUBLICS, PARTENAIRES } from './publics';
import { url } from './routes';

/**
 * L'arbre de navigation, source unique de la nav desktop, du panneau mobile et du contrôle
 * de fin de build.
 *
 * ⚠️ UN GROUPE N'A PAS D'`href`, ET LE TYPE L'INTERDIT. « Pour qui », « Secteurs » et
 * « Partenaires » sont des libellés de menu : ils ne résolvent pas, ils ne doivent jamais
 * être liés. Donner un `href` à un groupe créerait une URL que rien ne sert et que le
 * contrôle de liens signalerait en 404. C'est pour ça que `GroupeNav` ne porte pas le champ :
 * le déclencheur est rendu en `<button>`, pas en `<a>`.
 *
 * « Fiches CEE » et « Ressources » suivent la même forme : leurs pages index sont la
 * première entrée de leur sous-menu, pas le libellé lui-même.
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
  {
    label: 'Pour qui',
    enfants: PUBLICS.map((p) => ({ label: p.label, href: url.public(p.slug) })),
  },
  {
    label: 'Secteurs',
    enfants: SECTEURS.map((s) => ({ label: s.label, href: url.secteur(s.slug) })),
  },
  {
    label: 'Fiches CEE',
    enfants: [
      { label: 'Toutes les fiches CEE', href: url.fichesCee },
      ...SECTEURS.map((s) => ({ label: s.label, href: url.hubFiches(s.slug) })),
    ],
  },
  {
    label: 'Ressources',
    enfants: [
      { label: 'Comprendre les CEE', href: url.comprendreLesCee },
      { label: 'Blog', href: url.blog },
    ],
  },
  {
    label: 'Partenaires',
    enfants: PARTENAIRES.map((p) => ({ label: p.label, href: url.partenaire(p.slug) })),
  },
  { label: 'Qui sommes-nous', href: url.quiSommesNous },
];
