import PageArgumentaire from './PageArgumentaire';
import { PUBLICS } from '@/lib/publics';
import { argumentaireDe } from '@/lib/argumentaires';
import { url } from '@/lib/routes';

/** Une des quatre pages « Pour qui » (`/{public}`) : une page argumentaire. */
export default function PagePublic({ slug }: { slug: string; label: string }) {
  const a = argumentaireDe(slug);
  if (!a) throw new Error(`Page « pour qui » sans argumentaire : ${slug}`);
  const autres = PUBLICS.filter((p) => p.slug !== slug).map((p) => ({ href: url.public(p.slug), label: p.label }));
  return <PageArgumentaire argumentaire={a} chemin={url.public(slug)} autres={autres} />;
}
