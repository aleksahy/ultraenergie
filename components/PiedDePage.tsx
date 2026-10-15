import Image from 'next/image';
import Link from 'next/link';
import Wordmark from './Wordmark';
import Veille from './Veille';
import { COORDONNEES } from '@/lib/contenu';
import { PUBLICS, PARTENAIRES } from '@/lib/publics';
import { url } from '@/lib/routes';
import logoCee from '@/cee.png';

/* ⚠️ TOUS LES LIENS VIENNENT DU REGISTRE (`lib/routes.ts`), aucun n'est écrit à la main.
   La règle du projet est qu'aucun lien du menu ou du pied ne pointe vers une 404, et le
   contrôle de fin de build la vérifie sur le HTML produit — il ne peut le faire que si les
   URL sortent toutes du même endroit.

   Pas de ligne de copyright en bas : retirée le 15/10/2026 (demande d'Alek). Les mentions
   légales se rangent sous « Contact », dans la colonne Ultra Énergie. */
export default function PiedDePage() {
  return (
    <footer className="pied">
      <div className="pied-inner">
        <div className="pied-col">
          {/* ⚠️ Le wordmark et les titres de colonne partagent `--pied-tete-h` en hauteur de
              ligne : sans ça, 20px gras et 13px capitales commencent au même bord haut mais
              ne s'alignent pas à l'œil. */}
          <Wordmark className="pied-wordmark" />
          <address className="pied-coordonnees">
            {COORDONNEES.adresse.map((ligne) => <span key={ligne}>{ligne}</span>)}
            <a href={`mailto:${COORDONNEES.email}`}>{COORDONNEES.email}</a>
            {/* ⛔ Pas de téléphone dans le pied (Alek, 15/10/2026) : il reste sur /contact et
                dans les mentions légales. */}
          </address>
          {/* La lettre « Veille CEE », sous les informations de la société et nulle part
              ailleurs sur la page (Alek, 15/10/2026). */}
          <Veille />
        </div>

        <div className="pied-col">
          <div className="pied-titre">Pour qui</div>
          <div className="pied-liens">
            {PUBLICS.map((p) => <Link key={p.slug} href={url.public(p.slug)}>{p.label}</Link>)}
          </div>
          <div className="pied-titre pied-titre-suivant">Partenaires</div>
          <div className="pied-liens">
            {PARTENAIRES.map((p) => <Link key={p.slug} href={url.partenaire(p.slug)}>{p.label}</Link>)}
          </div>
        </div>

        {/* Trois colonnes, pas quatre : la colonne des secteurs est partie avec les pages
            secteur (19/09/2026). Le catalogue et le simulateur, retirés le 14/10/2026 pour
            être rebâtis, reprendront leur ligne ici. */}
        <div className="pied-col">
          <div className="pied-titre">Ressources</div>
          <div className="pied-liens">
            <Link href={url.comprendreLesCee}>Comprendre les CEE</Link>
          </div>
          <div className="pied-titre pied-titre-suivant">Ultra Énergie</div>
          <div className="pied-liens">
            <Link href={url.quiSommesNous}>Qui sommes-nous</Link>
            <Link href={url.contact}>Nous contacter</Link>
            <Link href={url.mentionsLegales}>Mentions légales</Link>
          </div>
        </div>

        {/* Le logo officiel du dispositif : à droite du pied, aligné en haut sur la colonne de
            gauche. ⛔ Ni légende ni lien dessous (Alek, 15/10/2026). */}
        <Image src={logoCee} alt="Les certificats d’économies d’énergie" className="pied-cee" />
      </div>
    </footer>
  );
}
