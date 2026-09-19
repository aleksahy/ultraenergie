/**
 * Les six secteurs. Ils n'ont qu'une adresse : le hub catalogue `/fiches-cee/{secteur}`.
 *
 * ⚠️ La page commerciale `/{secteur}` a existé et a été retirée le 19/09/2026 « pour le
 * moment ». Son slug reste réservé dans `PREMIER_NIVEAU` (lib/routes.ts) pour qu'une page
 * fixe ne s'y installe pas entre-temps.
 *
 * ⛔ PAS DE NIVEAU SOUS-SECTEUR, ni en URL ni en page. Les familles ne sont que des sections
 * à ancres dans le hub, jamais des pages.
 */
export interface Secteur {
  slug: string;
  label: string;
}

export const SECTEURS: Secteur[] = [
  {
    slug: 'agriculture',
    label: 'Agriculture',
  },
  {
    slug: 'industrie',
    label: 'Industrie',
  },
  {
    slug: 'reseau',
    label: 'Réseau',
  },
  {
    slug: 'residentiel',
    label: 'Résidentiel',
  },
  {
    slug: 'tertiaire',
    label: 'Tertiaire',
  },
  {
    slug: 'transport',
    label: 'Transport',
  },
];

export const SLUGS_SECTEURS = SECTEURS.map((s) => s.slug);

export function secteurParSlug(slug: string): Secteur | undefined {
  return SECTEURS.find((s) => s.slug === slug);
}

