import Link from 'next/link';
import { url } from '@/lib/routes';
import { termeParSlug } from '@/lib/glossaire';

/**
 * Un lien contextuel vers le glossaire, posé dans le corps du texte.
 *
 * ⚠️ IL PASSE PAR `termeParSlug` : un terme qui n'existe pas rend le texte SANS lien, au lieu
 * de fabriquer une URL en 404 sur les 218 pages de fiche d'un coup. Le contrôle de fin de
 * build attraperait la faute, mais après coup et sur toutes les pages à la fois.
 */
export default function Terme({ slug, children }: { slug: string; children: React.ReactNode }) {
  if (!termeParSlug(slug)) return <>{children}</>;
  return <Link className="lien-terme" href={url.terme(slug)}>{children}</Link>;
}
