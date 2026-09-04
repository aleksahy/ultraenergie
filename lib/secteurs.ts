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
  /**
   * Les familles d'opérations du secteur, dans l'ordre des sections à ancres du hub.
   * `famille` est aussi le champ que porte chaque fiche (cf. lib/fiches.ts).
   */
  familles: { id: string; label: string }[];
}

export const SECTEURS: Secteur[] = [
  {
    slug: 'agriculture',
    label: 'Agriculture',
    familles: [
      { id: 'froid', label: 'Froid et récupération de chaleur' },
      { id: 'batiment', label: 'Bâtiment agricole' },
      { id: 'utilites', label: 'Utilités' },
    ],
  },
  {
    slug: 'industrie',
    label: 'Industrie',
    familles: [
      { id: 'utilites', label: 'Utilités et moteurs' },
      { id: 'reseaux', label: 'Réseaux et calorifugeage' },
      { id: 'batiment', label: 'Bâtiment industriel' },
    ],
  },
  {
    slug: 'reseau',
    label: 'Réseau',
    familles: [
      { id: 'chaleur', label: 'Réseaux de chaleur' },
      { id: 'eclairage', label: 'Éclairage extérieur' },
    ],
  },
  {
    slug: 'residentiel',
    label: 'Résidentiel',
    familles: [
      { id: 'enveloppe', label: 'Enveloppe' },
      { id: 'chauffage', label: 'Chauffage et eau chaude' },
    ],
  },
  {
    slug: 'tertiaire',
    label: 'Tertiaire',
    familles: [
      { id: 'enveloppe', label: 'Enveloppe' },
      { id: 'chauffage', label: 'Chauffage et eau chaude' },
      { id: 'pilotage', label: 'Pilotage et GTB' },
      { id: 'eclairage', label: 'Éclairage' },
    ],
  },
  {
    slug: 'transport',
    label: 'Transport',
    familles: [
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

/** Le libellé d'affichage d'une famille, depuis le slug de secteur et l'identifiant. */
export function familleLabel(slugSecteur: string, id: string): string {
  return secteurParSlug(slugSecteur)?.familles.find((f) => f.id === id)?.label ?? id;
}
