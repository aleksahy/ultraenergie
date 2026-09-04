import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import TeteSection from './TeteSection';
import Veille from './Veille';
import { ARTICLES } from '@/lib/blog';
import { url } from '@/lib/routes';

/* ⚠️ LES PHOTOS SONT IMPORTÉES COMME MODULES, jamais posées dans `public/`. Next leur donne
   un nom porteur d'une empreinte du contenu (`/_next/static/media/guide.<hash>.jpg`) et en
   déduit `width`/`height`, ce qui réserve la place avant chargement. C'est aussi ce qui
   autorise la règle `immutable` de `public/_headers`.
   ⛔ Ne jamais importer depuis `images/` : ce sont les sources pleine résolution (0,7 à
   1,4 Mo pièce). Les dérivées de `assets/photos/` sont fabriquées par `npm run images`. */
import photoReglementaire from '@/assets/photos/reglementaire.jpg';
import photoGuide from '@/assets/photos/guide.jpg';
import photoConseil from '@/assets/photos/conseil-metier.jpg';

/* La photo est un attribut d'affichage, pas une donnée d'article : elle est attachée ici, par
   slug, pour que `lib/blog.ts` reste une liste et pas un catalogue d'images. */
const PHOTOS: Record<string, StaticImageData> = {
  'fiches-operations-standardisees-ce-qui-change': photoReglementaire,
  'comprendre-la-fiche-bat-th-116': photoGuide,
  'preparer-son-dossier-cee-en-5-points': photoConseil,
};

export default function Ressources() {
  return (
    <section id="ressources" className="section section-ressources">
      <TeteSection surtitre="Ressources">Comprendre le dispositif CEE</TeteSection>
      <div className="articles">
        {ARTICLES.map((a) => (
          <Link key={a.slug} href={url.article(a.slug)} className="article">
            <div className="article-photo">
              <Image src={PHOTOS[a.slug]} alt="" sizes="(max-width: 900px) 100vw, 33vw" />
            </div>
            <div className="article-tag">{a.tag}</div>
            <div className="article-titre">{a.titre}</div>
          </Link>
        ))}
      </div>
      <Veille />
    </section>
  );
}
