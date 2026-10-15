import Link from 'next/link';
import { BoutonModale } from './Modales';
import type { Modale } from './Modales';
import { url } from '@/lib/routes';

/**
 * L'appel à l'action qui ferme une page : une phrase, un bouton, sur forêt, d'un bord à
 * l'autre. L'accueil l'emploie avec ses valeurs par défaut (vers la page Contact, modèle EBS :
 * Alek, 15/10/2026) ; les pages « Pour qui » et « Partenaires » lui passent leur titre, leur
 * bouton et leur destination (prop `pied` de `Page`) : un lien (`href`) ou une modale.
 *
 * ⛔ Pas de délai promis dans le texte (« sous deux jours ouvrés » retiré par Alek, 15/10/2026).
 */
export default function ContactBande({
  titre = 'Un chantier à venir ?',
  texte = 'Décrivez-nous l’opération avant la signature du devis : nous vérifions l’éligibilité et vous transmettons une estimation.',
  bouton = 'Nous contacter',
  href = url.contact,
  modale,
  contexte,
}: {
  titre?: string;
  texte?: string;
  bouton?: string;
  href?: string;
  /** Prend le pas sur `href` : la modale « Devenir partenaire ». */
  modale?: Modale;
  contexte?: string;
}) {
  return (
    <section className="contact-bande">
      <div className="contact-bande-inner">
        <div>
          <h2>{titre}</h2>
          <p>{texte}</p>
        </div>
        {modale
          ? <BoutonModale modale={modale} contexte={contexte} className="pilule pilule-accent">{bouton}</BoutonModale>
          : <Link href={href} className="pilule pilule-accent">{bouton}</Link>}
      </div>
    </section>
  );
}
