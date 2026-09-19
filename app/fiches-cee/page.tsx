import type { Metadata } from 'next';
import Page, { Section } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { SECTEURS } from '@/lib/secteurs';
import { catalogueDuSecteur, CATALOGUE, catalogueParFamille } from '@/lib/fiches';
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
      chapo={`Les ${CATALOGUE.length} fiches d'opérations standardisées, classées par secteur.`}
    >
      <Section titre="Par secteur">
        {/* Six secteurs, deux lignes de trois : ils forment un ensemble, pas une liste. */}
        <ListeLiens
          colonnes={3}
          liens={SECTEURS.map((s) => ({
            href: url.hubFiches(s.slug),
            label: s.label,
            note: `${catalogueDuSecteur(s.slug).length} fiches · ${catalogueParFamille(s.slug).length} familles`,
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
