import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page, { Section, AChantier } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { TERMES, termeParSlug } from '@/lib/glossaire';
import { url } from '@/lib/routes';

export function generateStaticParams() {
  return TERMES.map((t) => ({ terme: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ terme: string }> }): Promise<Metadata> {
  const { terme } = await params;
  const t = termeParSlug(terme);
  if (!t) return {};
  return { title: `${t.terme} | Ultra Énergie`, description: t.resume };
}

export default async function PageTerme({ params }: { params: Promise<{ terme: string }> }) {
  const { terme: slug } = await params;
  const terme = termeParSlug(slug);
  if (!terme) notFound();

  const autres = TERMES.filter((t) => t.slug !== slug).slice(0, 6);

  return (
    <Page chemin={url.terme(slug)} titre={terme.terme} chapo={terme.resume}>
      <AChantier>Définition longue à rédiger.</AChantier>

      <Section titre="Les autres termes">
        <ListeLiens liens={autres.map((t) => ({ href: url.terme(t.slug), label: t.terme }))} />
      </Section>
    </Page>
  );
}
