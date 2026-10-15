import Link from 'next/link';
import LienAccueil from './LienAccueil';
import Wordmark from './Wordmark';
import NavDesktop from './NavDesktop';
import MenuMobile from './MenuMobile';
import { BoutonModale } from './Modales';
import { url } from '@/lib/routes';

export default function EnTete() {
  return (
    <header className="entete">
      <div className="entete-inner">
        <LienAccueil className="entete-wordmark">
          <Wordmark />
        </LienAccueil>

        <NavDesktop />

        {/* ⚠️ /contact est un BOUTON, hors des quatre entrées du menu. C'est une destination
            d'action, pas une rubrique : la ranger dans un déroulant la met au même rang
            qu'une page « Pour qui ».
            « Estimer ma prime » a pris la place du téléphone le 15/10/2026 (demande d'Alek).
            Un seul bouton plein : deux pleins côte à côte, c'est le tic des landings. */}
        <div className="entete-droite">
          <BoutonModale modale="estimation" className="pilule pilule-accent">Estimer ma prime</BoutonModale>
          <Link href={url.contact} className="pilule pilule-contour">Contact</Link>
        </div>

        <MenuMobile />
      </div>
    </header>
  );
}
