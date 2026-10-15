import { BoutonModale } from './Modales';
import type { Modale } from './Modales';

/**
 * L'appel à l'action qui ferme une page : une phrase, un bouton, sur forêt, d'un bord à
 * l'autre. L'accueil l'emploie avec ses valeurs par défaut ; les pages « Pour qui » et
 * « Partenaires » lui passent leur titre, leur bouton et leur modale (prop `pied` de `Page`).
 */
export default function ContactBande({
  titre = 'Un chantier à venir ?',
  texte = 'Décrivez-nous l’opération avant la signature du devis : nous vérifions l’éligibilité et vous transmettons une première estimation sous deux jours ouvrés.',
  bouton = 'Estimer ma prime',
  modale = 'estimation',
  contexte,
}: {
  titre?: string;
  texte?: string;
  bouton?: string;
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
        <BoutonModale modale={modale} contexte={contexte} className="pilule pilule-accent">{bouton}</BoutonModale>
      </div>
    </section>
  );
}
