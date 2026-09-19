import Image from 'next/image';
import Link from 'next/link';
import Wordmark from './Wordmark';
import { COORDONNEES } from '@/lib/contenu';
import { SECTEURS } from '@/lib/secteurs';
import { PUBLICS, PARTENAIRES } from '@/lib/publics';
import { url } from '@/lib/routes';
import logoCee from '@/cee.png';

/* ⚠️ TOUS LES LIENS VIENNENT DU REGISTRE (`lib/routes.ts`), aucun n'est écrit à la main.
   La règle du projet est qu'aucun lien du menu ou du pied ne pointe vers une 404, et le
   contrôle de fin de build la vérifie sur le HTML produit — il ne peut le faire que si les
   URL sortent toutes du même endroit.

   ⛔ PAS DE « MENTIONS LÉGALES » NI DE « POLITIQUE DE CONFIDENTIALITÉ » ICI. Ces pages
   n'existent pas dans l'architecture : les lier ferait exactement les 404 que la règle
   interdit. Elles reviendront le jour où les routes existeront. */
export default function PiedDePage() {
  const annee = new Date().getFullYear();

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
            <a href={`tel:${COORDONNEES.telephoneLien}`}>{COORDONNEES.telephone}</a>
          </address>
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

        <div className="pied-col">
          <div className="pied-titre">Fiches par secteur</div>
          <div className="pied-liens">
            {SECTEURS.map((s) => <Link key={s.slug} href={url.hubFiches(s.slug)}>{s.label}</Link>)}
          </div>
        </div>

        <div className="pied-col">
          <div className="pied-titre">Ressources</div>
          <div className="pied-liens">
            <Link href={url.fichesCee}>Fiches CEE</Link>
            <Link href={url.simulateur}>Simulateur de prime</Link>
            <Link href={url.comprendreLesCee}>Comprendre les CEE</Link>
            <Link href={url.blog}>Blog</Link>
            <Link href={url.veilleCee}>Veille CEE</Link>
          </div>
          <div className="pied-titre pied-titre-suivant">Ultra Énergie</div>
          <div className="pied-liens">
            <Link href={url.quiSommesNous}>Qui sommes-nous</Link>
            <Link href={url.contact}>Contact</Link>
          </div>
        </div>

        {/* Le logo officiel du dispositif : à droite du pied, aligné en haut sur la
            colonne de gauche. */}
        <Image src={logoCee} alt="Certificats d'économies d'énergie" className="pied-cee" />
      </div>

      <div className="pied-bas">© {annee} Ultra Énergie, mandataire CEE indépendant.</div>
    </footer>
  );
}
