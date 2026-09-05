/**
 * Les six secteurs. Ils vivent à deux endroits dans l'URL, et c'est voulu :
 *   /{secteur}               la page commerciale, adressée au client
 *   /fiches-cee/{secteur}    le hub catalogue, adressé à qui cherche une fiche
 * Les deux se lient l'une l'autre (cf. le maillage dans README.md).
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

