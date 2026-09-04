import LienAccueil from './LienAccueil';
import Wordmark from './Wordmark';
import NavDesktop from './NavDesktop';
import MenuMobile from './MenuMobile';
import { BoutonModale } from './Modales';
import { COORDONNEES } from '@/lib/contenu';

export default function EnTete() {
  return (
    <header className="entete">
      <div className="entete-inner">
        <LienAccueil className="entete-wordmark">
          <Wordmark />
        </LienAccueil>

        <NavDesktop />

        <div className="entete-droite">
          <a className="entete-tel" href={`tel:${COORDONNEES.telephoneLien}`}>{COORDONNEES.telephone}</a>
          <BoutonModale modale="estimation" className="pilule pilule-accent">
            Estimer ma prime →
          </BoutonModale>
        </div>

        <MenuMobile />
      </div>
    </header>
  );
}
