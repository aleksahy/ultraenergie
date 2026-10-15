import type { Metadata } from 'next';
import Page, { Section, AChantier } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Qui sommes-nous | Ultra Énergie',
  description: 'Ultra Énergie, mandataire CEE indépendant à Saint-Cloud : ni obligé, ni délégataire, ni installateur. Qui nous sommes et comment nous travaillons.',
  alternates: { canonical: '/qui-sommes-nous/' },
};

export default function QuiSommesNous() {
  return (
    <Page
      chemin={url.quiSommesNous}
      titre="Qui sommes-nous"
      chapo="Ultra Énergie est un mandataire CEE indépendant : nous ne portons aucune obligation, n’installons rien et ne vendons aucun équipement."
    >
      <AChantier>Page à rédiger. L&apos;ossature et le maillage sont posés.</AChantier>

      <Section titre="Pour aller plus loin">
        <ListeLiens
          liens={[
            { href: url.comprendreLesCee, label: 'Comprendre le dispositif CEE' },
            { href: url.contact, label: 'Nous contacter' },
          ]}
        />
      </Section>
    </Page>
  );
}
