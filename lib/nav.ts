/**
 * L'arbre de navigation, source unique pour la nav desktop et le panneau mobile.
 *
 * Les rubriques pointent aujourd'hui vers des ancres de la page d'accueil : les hubs
 * (Pour qui, Fiches CEE, Blog, Glossaire) n'existent pas encore comme pages. Quand ils
 * arriveront, seul ce fichier change.
 */

export interface LienNav {
  label: string;
  href: string;
}

export interface GroupeNav {
  label: string;
  href: string;
  enfants: LienNav[];
}

export type NoeudNav = LienNav | GroupeNav;

export function estGroupe(noeud: NoeudNav): noeud is GroupeNav {
  return 'enfants' in noeud;
}

export const NAV: NoeudNav[] = [
  {
    label: 'Pour qui',
    href: '#profils',
    enfants: [
      { label: 'Copropriétés & bailleurs', href: '#profils' },
      { label: 'Entreprises & tertiaire', href: '#profils' },
      { label: 'Industrie', href: '#profils' },
      { label: 'Collectivités', href: '#profils' },
      { label: 'Installateurs & artisans', href: '#partenaires' },
    ],
  },
  {
    label: 'Fiches CEE',
    href: '#travaux',
    enfants: [
      { label: 'Résidentiel', href: '#travaux' },
      { label: 'Tertiaire', href: '#travaux' },
      { label: 'Industrie', href: '#travaux' },
      { label: 'Agriculture', href: '#travaux' },
      { label: 'Réseaux', href: '#travaux' },
      { label: 'Transport', href: '#travaux' },
    ],
  },
  {
    label: 'Ressources',
    href: '#ressources',
    enfants: [
      { label: 'Blog', href: '#ressources' },
      { label: 'Glossaire', href: '#ressources' },
      { label: 'Newsletter', href: '#veille' },
    ],
  },
  { label: 'Partenaires', href: '#partenaires' },
  { label: 'Contact', href: '#contact' },
];
