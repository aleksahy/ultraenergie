/**
 * Les cinq pages « Pour qui ». « Pour qui » est un libellé de menu, pas une page.
 * ⚠️ LES INSTALLATEURS SONT LES CLIENTS (Alek, 15/10/2026) : leur page ouvre la liste et
 * suit le même gabarit que les quatre maîtres d'ouvrage, pas celui des partenaires.
 */
export const PUBLICS = [
  { slug: 'installateurs', label: 'Installateurs' },
  { slug: 'syndics-coproprietes', label: 'Syndics & copropriétés' },
  { slug: 'bailleurs-sociaux', label: 'Bailleurs sociaux' },
  { slug: 'public-collectivites', label: 'Public & collectivités' },
  { slug: 'entreprises-industriels', label: 'Entreprises & industriels' },
];

/** Les deux pages « Partenaires ». « Partenaires » est un libellé de menu, pas une page. */
export const PARTENAIRES = [
  { slug: 'obliges', label: 'Obligés' },
  { slug: 'apporteurs-affaires', label: 'Apporteurs d’affaires' },
];
