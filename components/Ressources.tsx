import Image from 'next/image';
import TeteSection from './TeteSection';
import Veille from './Veille';

/* ⚠️ LES PHOTOS SONT IMPORTÉES COMME MODULES, jamais posées dans `public/`. Next leur donne
   un nom porteur d'une empreinte du contenu (`/_next/static/media/guide.<hash>.jpg`) et en
   déduit `width`/`height`, ce qui réserve la place avant chargement. C'est aussi ce qui
   autorise la règle `immutable` de `public/_headers` sur `/_next/static/*`.
   ⛔ Ne jamais importer depuis `images/` : ce sont les sources pleine résolution (0,7 à
   1,4 Mo pièce). Les dérivées de `assets/photos/` sont fabriquées par `npm run images`. */
import photoReglementaire from '@/assets/photos/reglementaire.jpg';
import photoGuide from '@/assets/photos/guide.jpg';
import photoConseil from '@/assets/photos/conseil-metier.jpg';

const ARTICLES = [
  {
    photo: photoReglementaire,
    tag: 'Actualité réglementaire',
    titre: "Fiches d'opérations standardisées : ce qui change",
  },
  { photo: photoGuide, tag: 'Guide', titre: 'Comprendre la fiche CEE BAT-TH-116' },
  { photo: photoConseil, tag: 'Conseil métier', titre: 'Bien préparer son dossier CEE en 5 points' },
];

export default function Ressources() {
  return (
    <section id="ressources" className="section section-ressources">
      <TeteSection surtitre="Ressources">Comprendre le dispositif CEE</TeteSection>
      <div className="articles">
        {ARTICLES.map((a) => (
          <a key={a.titre} href="#ressources" className="article">
            <div className="article-photo">
              <Image src={a.photo} alt="" sizes="(max-width: 900px) 100vw, 33vw" />
            </div>
            <div className="article-tag">{a.tag}</div>
            <div className="article-titre">{a.titre}</div>
          </a>
        ))}
      </div>
      <Veille />
    </section>
  );
}
