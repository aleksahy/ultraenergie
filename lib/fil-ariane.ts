import { PUBLICS, PARTENAIRES } from './publics';
import { termeParSlug } from './glossaire';
import { url } from './routes';

export interface Miette {
  label: string;
  /** Absent sur la dernière miette : on ne se lie pas à la page où l'on est. */
  href?: string;
}

/**
 * Le fil d'Ariane, déduit du chemin.
 *
 * ⚠️ DÉDUIT, ET PAS DÉCLARÉ PAGE PAR PAGE. Les niveaux viennent du chemin : une page rangée
 * sous `/comprendre-les-cee/` hérite forcément de son parent, et une page de premier niveau
 * n'en a aucun, donc elle reste à un seul niveau (« Accueil > Obligés »). Un fil écrit à la
 * main sur chaque page finit par mentir sur l'une d'elles.
 *
 *   /comprendre-les-cee/kwh-cumac     →  Accueil > Comprendre les CEE > kWh cumac
 *   /comprendre-les-cee               →  Accueil > Comprendre les CEE
 *   /syndics-coproprietes             →  Accueil > Syndics & copropriétés
 */
export function filAriane(chemin: string): Miette[] {
  const segments = chemin.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const miettes: Miette[] = [{ label: 'Accueil', href: url.accueil }];

  const [premier, deuxieme] = segments;

  if (premier === 'comprendre-les-cee') {
    miettes.push({ label: 'Comprendre les CEE', href: url.comprendreLesCee });
    if (deuxieme) miettes.push({ label: termeParSlug(deuxieme)?.terme ?? deuxieme });
    return derniereSansLien(miettes);
  }

  miettes.push({ label: libellePremierNiveau(premier) });
  return derniereSansLien(miettes);
}

const PAGES_FIXES: Record<string, string> = {
  contact: 'Contact',
  'mentions-legales': 'Mentions légales',
};

function libellePremierNiveau(slug: string): string {
  return (
    PUBLICS.find((p) => p.slug === slug)?.label ??
    PARTENAIRES.find((p) => p.slug === slug)?.label ??
    PAGES_FIXES[slug] ??
    slug
  );
}

function derniereSansLien(miettes: Miette[]): Miette[] {
  return miettes.map((m, i) => (i === miettes.length - 1 ? { label: m.label } : m));
}
