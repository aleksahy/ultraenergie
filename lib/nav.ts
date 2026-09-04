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
 * « Ressources » suit la même forme : ses pages index sont ses entrées, le libellé lui-même
 * n'en est pas une.
 *
 * ⛔ LES SIX HUBS `/fiches-cee/{secteur}` NE SONT PLUS DANS LE MENU. « Fiches CEE » y est une
 * entrée parmi les ressources, pas un bloc à part : lister ses six hubs en dessous en
 * referait un, et poserait sous « Ressources » six libellés de secteur que « Secteurs »
 * affiche déjà à l'identique.
 * Ils restent atteignables, et pas d'un seul chemin : l'index /fiches-cee/ les liste tous,
 * chaque hub pointe les cinq autres, chaque page secteur pointe le sien, et les huit blocs
 * « Travaux éligibles » de l'accueil y mènent directement. Le contrôle d'orphelines de
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
    label: 'Pour qui',
    enfants: PUBLICS.map((p) => ({ label: p.label, href: url.public(p.slug) })),
  },
  {
    label: 'Secteurs',
    enfants: SECTEURS.map((s) => ({ label: s.label, href: url.secteur(s.slug) })),
  },
  {
    label: 'Ressources',
    enfants: [
      { label: 'Fiches CEE', href: url.fichesCee },
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
