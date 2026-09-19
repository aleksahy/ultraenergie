import PageArgumentaire from './PageArgumentaire';
import { PARTENAIRES } from '@/lib/publics';
import { argumentaireDe } from '@/lib/argumentaires';
import { url } from '@/lib/routes';

/** Une des trois pages « Partenaires » (`/{partenaire}`) : une page argumentaire. */
export default function PagePartenaire({ slug }: { slug: string; label: string }) {
  const a = argumentaireDe(slug);
  if (!a) throw new Error(`Page partenaire sans argumentaire : ${slug}`);
  const autres = PARTENAIRES.filter((p) => p.slug !== slug).map((p) => ({ href: url.partenaire(p.slug), label: p.label }));
  return <PageArgumentaire argumentaire={a} chemin={url.partenaire(slug)} autres={autres} />;
}
