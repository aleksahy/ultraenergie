import Link from 'next/link';
import LienAccueil from './LienAccueil';
import Wordmark from './Wordmark';
import NavDesktop from './NavDesktop';
import MenuMobile from './MenuMobile';
import { url } from '@/lib/routes';
import { COORDONNEES } from '@/lib/contenu';

export default function EnTete() {
  return (
    <header className="entete">
      <div className="entete-inner">
        <LienAccueil className="entete-wordmark">
          <Wordmark />
        </LienAccueil>

        <NavDesktop />

        {/* ⚠️ /contact est un BOUTON, hors des six entrées du menu. C'est une destination
            d'action, pas une rubrique : la ranger dans un déroulant la met au même rang
            qu'une page secteur. */}
        <div className="entete-droite">
          <a className="entete-tel" href={`tel:${COORDONNEES.telephoneLien}`}>{COORDONNEES.telephone}</a>
          <Link href={url.contact} className="pilule pilule-accent">Contact →</Link>
        </div>

        <MenuMobile />
      </div>
    </header>
  );
}
