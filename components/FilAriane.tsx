import Link from 'next/link';
import { filAriane } from '@/lib/fil-ariane';
import { SITE } from '@/lib/site';

/**
 * Le fil d'Ariane : la trace visible ET le balisage `BreadcrumbList`.
 *
 * ⚠️ LES DEUX SORTENT DE LA MÊME SOURCE, et c'est le seul moyen qu'ils ne divergent pas. Un
 * balisage écrit à part du fil affiché finit par décrire un chemin que la page ne montre
 * plus, ce que les outils de test signalent des mois après.
 *
 * ⚠️ Sur une fiche, c'est ce fil qui porte le lien vers son hub catalogue : ce n'est pas
 * qu'un ornement, c'est une arête du maillage.
 */
export default function FilAriane({ chemin }: { chemin: string }) {
  const miettes = filAriane(chemin);
  if (miettes.length < 2) return null;

  const balisage = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: miettes.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.label,
      // La dernière miette n'a pas d'`item` : schema.org l'admet, et c'est la page courante.
      ...(m.href ? { item: `${SITE.domaine}${m.href}` } : {}),
    })),
  };

  return (
    <nav className="fil-ariane" aria-label="Fil d'Ariane">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(balisage) }} />
      <ol>
        {miettes.map((m) => (
          <li key={m.label}>
            {m.href ? <Link href={m.href}>{m.label}</Link> : <span aria-current="page">{m.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
