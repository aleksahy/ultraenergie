import Link from 'next/link';
import { filAriane } from '@/lib/fil-ariane';

/**
 * Le lien de retour, sous le titre.
 *
 * ⚠️ IL SORT DU FIL D'ARIANE, il ne le double pas : sa cible est l'avant-dernière miette,
 * c'est-à-dire le parent direct. Le fil situe dans l'arborescence en petit caractère ; ce
 * lien-ci est un geste, dimensionné pour être cliqué. Écrire sa destination à la main sur
 * chaque page reviendrait à maintenir deux fois la même arborescence.
 */
export default function RetourParent({ chemin }: { chemin: string }) {
  const miettes = filAriane(chemin);
  const parent = miettes[miettes.length - 2];
  if (!parent?.href) return null;

  return (
    <Link className="retour" href={parent.href}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      {parent.label === 'Accueil' ? "Retour à l'accueil" : `Retour à ${parent.label}`}
    </Link>
  );
}
