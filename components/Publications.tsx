import Link from 'next/link';
import TeteSection from './TeteSection';
import { TERMES } from '@/lib/glossaire';
import { url } from '@/lib/routes';
import { dateFr } from '@/lib/dates';

/**
 * Les trois articles les plus récents de « Comprendre les CEE », en cartes de texte.
 *
 * ⛔ PAS LES ARTICLES DU BLOG : ils sont encore des coquilles (« Article à rédiger ») et les
 * dater sur l'accueil, c'était afficher des publications inventées (relecture du 15/10/2026).
 * Le glossaire, lui, est écrit et sourcé. Quand le blog aura de vrais articles, ils
 * reviendront ici avec leur photo.
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
