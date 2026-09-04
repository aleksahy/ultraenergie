import type { Metadata } from 'next';
import Page, { Section } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { TERMES } from '@/lib/glossaire';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Comprendre les CEE | Ultra Énergie',
  description: 'Le glossaire du dispositif des certificats d’économies d’énergie.',
};

export default function IndexGlossaire() {
  return (
    <Page
      chemin={url.comprendreLesCee}
      titre="Comprendre les CEE"
      chapo="Les mots du dispositif, expliqués un par un."
    >
      <Section titre="Le glossaire">
        <ListeLiens liens={TERMES.map((t) => ({ href: url.terme(t.slug), label: t.terme, note: t.resume }))} colonnes={false} />
      </Section>

      <Section titre="Pour aller plus loin">
        <ListeLiens
          liens={[
            { href: url.fichesCee, label: 'Le catalogue des fiches CEE' },
            { href: url.blog, label: "L'actualité réglementaire" },
          ]}
        />
      </Section>
    </Page>
  );
}
