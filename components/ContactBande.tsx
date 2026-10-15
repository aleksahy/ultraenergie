import Link from 'next/link';
import { url } from '@/lib/routes';

/**
 * L'appel à l'action qui ferme une page : une phrase, un bouton, sur forêt, d'un bord à
 * l'autre. L'accueil l'emploie avec ses valeurs par défaut ; les pages « Pour qui » et
 * « Partenaires » lui passent leur titre, leur phrase et leur bouton (prop `pied` de `Page`).
 * Tout mène à la page Contact : la modale « Devenir partenaire » a été retirée le 15/10/2026
 * (Alek : « le formulaire partenaire est l'ancien, rediriger vers contact »).
 *
 * ⛔ Pas de délai promis dans le texte (« sous deux jours ouvrés » retiré par Alek, 15/10/2026).
 */
export default function ContactBande({
  titre = 'Un chantier à venir ?',
  texte = 'Décrivez-nous l’opération avant la signature du devis : nous vérifions l’éligibilité et vous transmettons une estimation.',
  bouton = 'Nous contacter',
  href = url.contact,
}: {
  titre?: string;
  texte?: string;
  bouton?: string;
  href?: string;
}) {
  return (
    <section className="contact-bande">
      <div className="contact-bande-inner">
        <div>
          <h2>{titre}</h2>
          <p>{texte}</p>
        </div>
        <Link href={href} className="pilule pilule-accent">{bouton}</Link>
      </div>
    </section>
  );
}
