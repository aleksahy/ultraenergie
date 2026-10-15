import Link from 'next/link';
import LienAccueil from './LienAccueil';
import Wordmark from './Wordmark';
import NavDesktop from './NavDesktop';
import MenuMobile from './MenuMobile';
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
            Un seul bouton, plein, comme chez EBS : « Estimer ma prime » a vécu quelques heures
            le 15/10/2026, retiré avec le simulateur. */}
        <div className="entete-droite">
          <Link href={url.contact} className="pilule pilule-accent">Nous contacter</Link>
        </div>

        <MenuMobile />
      </div>
    </header>
  );
}
