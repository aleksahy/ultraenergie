import Page, { Section, AChantier } from './Page';
import ListeLiens from './ListeLiens';
import { PARTENAIRES } from '@/lib/publics';
import { url } from '@/lib/routes';

/** Une des trois pages « Partenaires » (`/{partenaire}`). */
export default function PagePartenaire({ slug, label }: { slug: string; label: string }) {
  const autres = PARTENAIRES.filter((p) => p.slug !== slug);

  return (
    <Page
      chemin={url.partenaire(slug)}
      titre={label}
      chapo={`Travailler avec Ultra Énergie : ${label.toLowerCase()}.`}
    >
      <AChantier>Page à rédiger. L&apos;ossature et le maillage sont posés.</AChantier>

      <Section titre="Les autres partenariats">
        <ListeLiens liens={autres.map((p) => ({ href: url.partenaire(p.slug), label: p.label }))} />
      </Section>

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
