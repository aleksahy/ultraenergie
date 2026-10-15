import type { Metadata } from 'next';
import Link from 'next/link';
import Page, { Section } from '@/components/Page';
import { TERMES, tempsLecture } from '@/lib/glossaire';
import { url } from '@/lib/routes';
import { metaPage } from '@/lib/meta';

export const metadata: Metadata = metaPage({
  titre: 'Comprendre les CEE : le glossaire du dispositif en onze termes',
  description: 'Le glossaire du dispositif des certificats d’économies d’énergie : onze termes expliqués, avec leurs sources.',
  chemin: url.comprendreLesCee,
});

export default function IndexGlossaire() {
  return (
    <Page
      chemin={url.comprendreLesCee}
      titre="Comprendre les CEE"
      chapo="Les mots du dispositif, expliqués un par un : ce que c’est, pourquoi ça existe, ce que ça change pour vous, et les pièges."
    >
      <Section titre="Le glossaire">
        {/* La grille reprend les cartes de `ListeLiens`, avec en plus le temps de lecture : le
            composant partagé ne porte pas cette ligne, et la lui ajouter pour une seule page
            aurait changé toutes les listes du site. */}
        <ul className="liste-liens liste-liens-auto">
          {TERMES.map((t) => (
            <li key={t.slug}>
              <Link href={url.terme(t.slug)}>
                <span className="liste-liens-label">{t.terme}</span>
                <span className="liste-liens-note">{t.resume}</span>
                <span className="glossaire-lecture">Lecture : {tempsLecture(t)} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
