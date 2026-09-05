import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page, { Section, AChantier } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { ARTICLES, articleParSlug } from '@/lib/blog';
import { url } from '@/lib/routes';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ article: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ article: string }> }): Promise<Metadata> {
  const { article } = await params;
  const a = articleParSlug(article);
  if (!a) return {};
  return { title: `${a.titre} | Ultra Énergie` };
}

export default async function PageArticle({ params }: { params: Promise<{ article: string }> }) {
  const { article: slug } = await params;
  const article = articleParSlug(slug);
  if (!article) notFound();

  const autres = ARTICLES.filter((a) => a.slug !== slug);

  return (
    <Page chemin={url.article(slug)} titre={article.titre} chapo={article.tag}>
      <AChantier>Article à rédiger.</AChantier>

      <Section titre="Les autres articles">
        <ListeLiens liens={autres.map((a) => ({ href: url.article(a.slug), label: a.titre, note: a.tag }))} colonnes={1} />
      </Section>
    </Page>
  );
}
