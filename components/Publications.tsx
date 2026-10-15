import Link from 'next/link';
import TeteSection from './TeteSection';
import { TERMES } from '@/lib/glossaire';
import { url } from '@/lib/routes';
import { dateFr } from '@/lib/dates';

/**
 * Les trois articles les plus récents de « Comprendre les CEE », en cartes de texte.
 *
 * Le glossaire est la seule publication écrite : le blog, qui n'avait que trois titres sans
 * article, a été retiré le 15/10/2026 pour le premier déploiement. S'il revient avec de vrais
 * articles, ils reviendront ici avec leur photo.
 */
export default function Publications() {
  const recents = [...TERMES].sort((a, b) => b.dateMaj.localeCompare(a.dateMaj)).slice(0, 3);
  return (
    <section id="publications" className="section">
      <TeteSection surtitre="Publications">Comprendre le dispositif CEE</TeteSection>
      <div className="publications">
        {recents.map((t) => (
          <Link key={t.slug} href={url.terme(t.slug)} className="publication">
            <div className="article-tag">Comprendre les CEE</div>
            <div className="publication-titre">{t.terme}</div>
            <p className="publication-resume">{t.resume}</p>
            <div className="article-date">Mis à jour le {dateFr(t.dateMaj)}</div>
          </Link>
        ))}
      </div>
      <Link href={url.comprendreLesCee} className="lien-suite">Tous les articles</Link>
    </section>
  );
}
