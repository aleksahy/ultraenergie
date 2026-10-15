import PagePourQui from './PagePourQui';
import { argumentaireDe } from '@/lib/argumentaires';
import { url } from '@/lib/routes';

/** Une des cinq pages « Pour qui » (`/{public}`). */
export default function PagePublic({ slug }: { slug: string; label: string }) {
  const a = argumentaireDe(slug);
  if (!a) throw new Error(`Page « pour qui » sans argumentaire : ${slug}`);
  return <PagePourQui argumentaire={a} chemin={url.public(slug)} />;
}
