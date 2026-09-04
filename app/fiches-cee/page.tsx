import type { Metadata } from 'next';
import Page, { Section } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { SECTEURS } from '@/lib/secteurs';
import { fichesDuSecteur, FICHES } from '@/lib/fiches';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Fiches CEE | Ultra Énergie',
  description: "Le catalogue des fiches d'opérations standardisées, par secteur.",
};

export default function IndexFiches() {
  return (
    <Page
      chemin={url.fichesCee}
      titre="Fiches CEE"
      chapo={`Les ${FICHES.length} fiches d'opérations standardisées que nous valorisons, classées par secteur.`}
    >
      <Section titre="Par secteur">
        <ListeLiens
          liens={SECTEURS.map((s) => ({
            href: url.hubFiches(s.slug),
            label: s.label,
            note: `${fichesDuSecteur(s.slug).length} fiches`,
          }))}
        />
      </Section>

      <Section titre="Comprendre le dispositif">
        <ListeLiens
          liens={[
            { href: url.comprendreLesCee, label: 'Le glossaire des CEE' },
            { href: url.blog, label: "L'actualité réglementaire" },
          ]}
        />
      </Section>
    </Page>
  );
}
