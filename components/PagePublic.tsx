import Page, { Section, AChantier } from './Page';
import ListeLiens from './ListeLiens';
import { SECTEURS } from '@/lib/secteurs';
import { url } from '@/lib/routes';

/** Une des quatre pages « Pour qui » (`/{public}`). */
export default function PagePublic({ slug, label }: { slug: string; label: string }) {
  return (
    <Page
      chemin={url.public(slug)}
      titre={label}
      chapo={`Comment Ultra Énergie accompagne les ${label.toLowerCase()} sur leurs opérations d'économies d'énergie.`}
    >
      <AChantier>Page à rédiger. L&apos;ossature et le maillage sont posés.</AChantier>

      <Section titre="Les fiches CEE par secteur">
        <ListeLiens colonnes={3} liens={SECTEURS.map((s) => ({ href: url.hubFiches(s.slug), label: s.label }))} />
      </Section>

      <Section titre="Pour aller plus loin">
        <ListeLiens
          liens={[
            { href: url.fichesCee, label: 'Le catalogue des fiches CEE' },
            { href: url.comprendreLesCee, label: 'Comprendre le dispositif CEE' },
            { href: url.contact, label: 'Nous contacter' },
          ]}
        />
      </Section>
    </Page>
  );
}
