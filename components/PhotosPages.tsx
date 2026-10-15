import type { StaticImageData } from 'next/image';
import type { Argumentaire } from '@/lib/argumentaires';
import installateurs from '@/assets/photos/installateurs-1600.jpg';
import syndics from '@/assets/photos/syndics-1600.jpg';
import bailleurs from '@/assets/photos/bailleurs-1600.jpg';
import collectivites from '@/assets/photos/collectivites-1600.jpg';
import entreprises from '@/assets/photos/entreprises-1600.jpg';
import obliges from '@/assets/photos/obliges-1600.jpg';
import apporteurs from '@/assets/photos/apporteurs-1600.jpg';

/**
 * La photo de bandeau des pages « Pour qui » et « Partenaires », par clef d'argumentaire
 * (`photo` dans lib/argumentaires.ts), et son cadrage. Une seule photo par page, en haut,
 * comme chez EBS Énergie (Alek, 15/10/2026). Sources et crédits : `images/SOURCES.md`.
 *
 * `position` est l'`object-position` de l'image dans le bandeau : la dérivée est en 16:9 et
 * le bandeau bien plus large que haut, donc on choisit quelle bande verticale on garde.
 * ⛔ Installateurs : la bande BASSE, sans le visage du technicien (Alek, 15/10/2026 : « pas
 * besoin de voir le visage, au contraire »).
 */
export const PHOTOS_PAGES: Record<Argumentaire['photo'], { src: StaticImageData; position: string }> = {
  copropriete: { src: syndics, position: 'center 45%' },
  parc: { src: bailleurs, position: 'center 70%' },
  'commande-publique': { src: collectivites, position: 'center 50%' },
  site: { src: entreprises, position: 'center 55%' },
  entonnoir: { src: obliges, position: 'center 60%' },
  chronologie: { src: installateurs, position: 'center 80%' },
  reseau: { src: apporteurs, position: 'center 50%' },
};
