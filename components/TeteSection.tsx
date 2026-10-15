import type { ReactNode } from 'react';

/**
 * La tête d'une section de l'accueil : l'étiquette, le titre, et une courte barre verte dessous.
 * Tout à gauche. C'est le motif d'EBS Énergie, retenu par Alek le 15/10/2026.
 *
 * `blanc` pour les bandes forêt ; `compact` quand la tête partage sa ligne avec du contenu
 * (la grille « Vos clients »).
 */
export default function TeteSection({
  surtitre, children, blanc = false, compact = false,
}: {
  surtitre: string;
  children: ReactNode;
  blanc?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`tete-section${blanc ? ' est-blanc' : ''}${compact ? ' est-compact' : ''}`}>
      <div className="surtitre">{surtitre}</div>
      <h2>{children}</h2>
      <div className="tete-section-barre" aria-hidden="true" />
    </div>
  );
}
