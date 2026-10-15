import type { Metadata } from 'next';
import Page, { Section, AChantier } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import Veille from '@/components/Veille';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Veille CEE | Ultra Énergie',
  description: "L’actualité réglementaire des certificats d’économies d’énergie, chaque semaine.",
};

export default function VeilleCee() {
  return (
    <Page
      chemin={url.veilleCee}
      titre="Veille CEE"
      chapo="L’actualité réglementaire des CEE, chaque semaine : fiches modifiées, arrêtés publiés, échéances à surveiller."
    >
      {/* Le formulaire est celui de l'accueil, sans son en-tête : un second point de capture
          qui divergerait du premier serait deux formulaires à maintenir. */}
      <Veille />

      <AChantier>Page à rédiger : ce que contient la lettre, à quelle fréquence, archives.</AChantier>

      <Section titre="Pour aller plus loin">
        <ListeLiens
          liens={[
            { href: url.blog, label: "L’actualité réglementaire au fil de l’eau" },
            { href: url.comprendreLesCee, label: 'Comprendre le dispositif CEE' },
          ]}
        />
      </Section>
    </Page>
  );
}
