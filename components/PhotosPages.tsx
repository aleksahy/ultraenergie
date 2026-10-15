import type { StaticImageData } from 'next/image';
import type { Argumentaire } from '@/lib/argumentaires';
import installateurs from '@/assets/photos/installateurs.webp';
import syndics from '@/assets/photos/syndics.webp';
import bailleurs from '@/assets/photos/bailleurs.webp';
import collectivites from '@/assets/photos/collectivites.webp';
import entreprises from '@/assets/photos/entreprises.webp';
import obliges from '@/assets/photos/obliges.webp';
import apporteurs from '@/assets/photos/apporteurs.webp';

/**
 * La photo de bandeau des pages « Pour qui » et « Partenaires », par clef d'argumentaire
 * (`photo` dans lib/argumentaires.ts), et son cadrage. Une seule photo par page, en haut,
 * comme chez EBS Énergie (Alek, 15/10/2026). Sources et crédits : `images/SOURCES.md`.
 *
 * `position` est l'`object-position` de l'image dans le bandeau : la dérivée (WebP 1400×788,
 * cf. scripts/derive-photos.mjs) est en 16:9 et le bandeau bien plus large que haut, donc on
 * choisit quelle bande verticale on garde.
 * ⛔ Installateurs : la bande BASSE, sans le visage du technicien (Alek, 15/10/2026 : « pas
 * besoin de voir le visage, au contraire »). Tous les cadrages ont été réglés par Alek le
 * 15/10/2026 au soir sur une page jetable à curseurs (`x% y%`, sens d'`object-position`).
 */
export const PHOTOS_PAGES: Record<Argumentaire['photo'], { src: StaticImageData; position: string }> = {
  copropriete: { src: syndics, position: '49% 89%' },
  parc: { src: bailleurs, position: '50% 90%' },
  'commande-publique': { src: collectivites, position: '50% 20%' },
  site: { src: entreprises, position: '50% 55%' },
  entonnoir: { src: obliges, position: '50% 90%' },
  chronologie: { src: installateurs, position: '50% 80%' },
  reseau: { src: apporteurs, position: '50% 50%' },
};
