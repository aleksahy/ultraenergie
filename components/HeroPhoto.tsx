import Image from 'next/image';
import { BoutonModale } from './Modales';
import photo from '@/assets/photos/conseil-metier-1600.jpg';

/**
 * Le héros de l'accueil : une photo plein écran sous un voile forêt, une colonne de texte à
 * gauche, un seul bouton. Variante « Photo » retenue par Alek le 15/10/2026, d'après EBS.
 *
 * ⚠️ Il parle aux installateurs ET à leurs clients : « Nous accompagnons les installateurs et
 * leurs clients ». Les partenaires (obligés, apporteurs) ont leurs pages, pas de place ici.
 * Le titre dit « prime », « CEE » et « chantiers » : la relecture du 15/10/2026 avait noté
 * qu'un installateur ne trouvait aucun de ces mots dans l'ancien titre.
 *
 * La photo est celle du projet (mains sur un porte-bloc) : Alek a choisi de la garder pour
 * le moment. Elle est importée en dérivée 1600, jamais depuis `images/`.
 */
export default function HeroPhoto() {
  return (
    <section className="hero-photo">
      <Image src={photo} alt="" fill sizes="100vw" priority />
      <div className="hero-photo-inner">
        <div className="surtitre">Mandataire CEE indépendant</div>
        <h1>La prime CEE de vos chantiers, engagée avant le devis, versée après travaux</h1>
        <p>
          Nous accompagnons les installateurs et leurs clients : engagement de prime avant le devis,
          dossier constitué et déposé, versement suivi.
        </p>
        <BoutonModale modale="estimation" className="pilule pilule-accent">Estimer ma prime</BoutonModale>
      </div>
    </section>
  );
}
