import Image from 'next/image';
import Wordmark from './Wordmark';
import { COORDONNEES } from '@/lib/contenu';
import logoCee from '@/cee.png';

const HUBS = [
  { label: 'Pour qui', href: '#profils' },
  { label: 'Fiches CEE', href: '#travaux' },
  { label: 'Blog', href: '#ressources' },
  { label: 'Glossaire', href: '#ressources' },
  { label: 'Partenaires', href: '#partenaires' },
];

const LEGAL = [
  { label: 'Mentions légales', href: '#mentions' },
  { label: 'Politique de confidentialité', href: '#confidentialite' },
];

export default function PiedDePage() {
  const annee = new Date().getFullYear();

  return (
    <footer id="contact" className="pied">
      <div className="pied-inner">
        <div className="pied-col">
          {/* ⚠️ Le wordmark et les titres « Hubs » / « Légal » partagent `--pied-tete-h` en
              hauteur de ligne. Sans ça, 20px gras et 13px capitales commencent au même
              bord haut mais ne s'alignent pas à l'œil : les deux titres flottent au-dessus
              du wordmark, et la première ligne du pied paraît de travers. */}
          <Wordmark className="pied-wordmark" />
          <address className="pied-coordonnees">
            {COORDONNEES.adresse.map((ligne) => <span key={ligne}>{ligne}</span>)}
            <a href={`mailto:${COORDONNEES.email}`}>{COORDONNEES.email}</a>
            <a href={`tel:${COORDONNEES.telephoneLien}`}>{COORDONNEES.telephone}</a>
          </address>
        </div>

        <div className="pied-col">
          <div className="pied-titre">Hubs</div>
          <div className="pied-liens">
            {HUBS.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
          </div>
        </div>

        <div className="pied-col">
          <div className="pied-titre">Légal</div>
          <div className="pied-liens">
            {LEGAL.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
          </div>
        </div>

        {/* Le logo officiel du dispositif. `align-self: start` l'aligne en haut sur la
            colonne de gauche ; la grille le pose à droite. */}
        <Image src={logoCee} alt="Certificats d'économies d'énergie" className="pied-cee" priority={false} />
      </div>

      <div className="pied-bas">© {annee} Ultra Énergie, mandataire CEE indépendant.</div>
    </footer>
  );
}
