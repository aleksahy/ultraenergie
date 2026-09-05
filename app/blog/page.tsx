import type { Metadata } from 'next';
import Page, { Section } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { ARTICLES } from '@/lib/blog';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Blog | Ultra Énergie',
  description: "L'actualité réglementaire des CEE, les guides et les conseils métier.",
};

/* ⛔ AUCUNE ARCHIVE DE CATÉGORIE NI DE DATE. Cet index et les articles, rien d'autre : les
   tags sont des libellés d'affichage, pas une taxonomie qui engendrerait des pages. */
export default function IndexBlog() {
  const tries = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Page chemin={url.blog} titre="Blog" chapo="Actualité réglementaire, guides et conseils métier.">
      <Section titre="Les articles">
        <ListeLiens liens={tries.map((a) => ({ href: url.article(a.slug), label: a.titre, note: a.tag }))} colonnes={1} />
      </Section>
    </Page>
  );
}
