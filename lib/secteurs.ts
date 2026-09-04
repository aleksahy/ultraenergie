/**
 * Les six secteurs. Ils vivent à deux endroits dans l'URL, et c'est voulu :
 *   /{secteur}               la page commerciale, adressée au client
 *   /fiches-cee/{secteur}    le hub catalogue, adressé à qui cherche une fiche
 * Les deux se lient l'une l'autre (cf. le maillage dans README.md).
 *
 * ⛔ PAS DE NIVEAU SOUS-SECTEUR, ni en URL ni en page. Les usages ne sont que des sections
 * à ancres dans le hub, jamais des pages.
 */
export interface Secteur {
  slug: string;
  label: string;
  /** Les usages du hub catalogue, dans l'ordre des sections à ancres. */
  usages: { id: string; label: string }[];
}

export const SECTEURS: Secteur[] = [
  {
    slug: 'agriculture',
    label: 'Agriculture',
    usages: [
      { id: 'froid', label: 'Froid et récupération de chaleur' },
      { id: 'batiment', label: 'Bâtiment agricole' },
      { id: 'utilites', label: 'Utilités' },
    ],
  },
  {
    slug: 'industrie',
    label: 'Industrie',
    usages: [
      { id: 'utilites', label: 'Utilités et moteurs' },
      { id: 'reseaux', label: 'Réseaux et calorifugeage' },
      { id: 'batiment', label: 'Bâtiment industriel' },
    ],
  },
  {
    slug: 'reseau',
    label: 'Réseau',
    usages: [
      { id: 'chaleur', label: 'Réseaux de chaleur' },
      { id: 'eclairage', label: 'Éclairage extérieur' },
    ],
  },
  {
    slug: 'residentiel',
    label: 'Résidentiel',
    usages: [
      { id: 'enveloppe', label: 'Enveloppe' },
      { id: 'chauffage', label: 'Chauffage et eau chaude' },
    ],
  },
  {
    slug: 'tertiaire',
    label: 'Tertiaire',
    usages: [
      { id: 'enveloppe', label: 'Enveloppe' },
      { id: 'chauffage', label: 'Chauffage et eau chaude' },
      { id: 'pilotage', label: 'Pilotage et GTB' },
      { id: 'eclairage', label: 'Éclairage' },
    ],
  },
  {
    slug: 'transport',
    label: 'Transport',
    usages: [
      { id: 'vehicules', label: 'Véhicules' },
      { id: 'froid', label: 'Froid embarqué' },
      { id: 'exploitation', label: 'Exploitation' },
    ],
  },
];

export const SLUGS_SECTEURS = SECTEURS.map((s) => s.slug);

export function secteurParSlug(slug: string): Secteur | undefined {
  return SECTEURS.find((s) => s.slug === slug);
}
