import { SECTEURS, secteurParSlug } from './secteurs';
import { PUBLICS, PARTENAIRES } from './publics';
import { ficheParCode } from './fiches';
import { termeParSlug } from './glossaire';
import { articleParSlug } from './blog';
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
 * sous `/fiches-cee/{secteur}/` hérite forcément de ses deux parents, et une page de premier
 * niveau n'en a aucun, donc elle reste à un seul niveau (« Accueil > Industrie »). Un fil
 * écrit à la main sur chaque page finit par mentir sur l'une d'elles.
 *
 *   /fiches-cee/industrie/ind-ut-102  →  Accueil > Fiches CEE > Industrie > IND-UT-102
 *   /fiches-cee/industrie             →  Accueil > Fiches CEE > Industrie
 *   /industrie                        →  Accueil > Industrie
 *   /syndics-coproprietes             →  Accueil > Syndics & copropriétés
 */
export function filAriane(chemin: string): Miette[] {
  const segments = chemin.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const miettes: Miette[] = [{ label: 'Accueil', href: url.accueil }];

  const [premier, deuxieme, troisieme] = segments;

  if (premier === 'fiches-cee') {
    miettes.push({ label: 'Fiches CEE', href: url.fichesCee });
    if (deuxieme) {
      const secteur = secteurParSlug(deuxieme);
      miettes.push({ label: secteur?.label ?? deuxieme, href: url.hubFiches(deuxieme) });
    }
    if (troisieme) {
      const fiche = ficheParCode(troisieme);
      // La dernière miette d'une fiche porte le CODE, pas l'intitulé : c'est lui qu'on
      // reconnaît, et c'est lui qui est dans l'URL. Les ANCRES DE LIENS vers une fiche
      // suivent la règle inverse (intitulé, jamais code) — les deux ne se contredisent pas,
      // un fil d'Ariane situe, un lien annonce.
      miettes.push({ label: fiche?.code ?? troisieme.toUpperCase() });
    }
    return derniereSansLien(miettes);
  }

  if (premier === 'comprendre-les-cee') {
    miettes.push({ label: 'Comprendre les CEE', href: url.comprendreLesCee });
    if (deuxieme) miettes.push({ label: termeParSlug(deuxieme)?.terme ?? deuxieme });
    return derniereSansLien(miettes);
  }

  if (premier === 'blog') {
    miettes.push({ label: 'Blog', href: url.blog });
    if (deuxieme) miettes.push({ label: articleParSlug(deuxieme)?.titre ?? deuxieme });
    return derniereSansLien(miettes);
  }

  miettes.push({ label: libellePremierNiveau(premier) });
  return derniereSansLien(miettes);
}

function libellePremierNiveau(slug: string): string {
  return (
    SECTEURS.find((s) => s.slug === slug)?.label ??
    PUBLICS.find((p) => p.slug === slug)?.label ??
    PARTENAIRES.find((p) => p.slug === slug)?.label ??
    (slug === 'qui-sommes-nous' ? 'Qui sommes-nous' : slug === 'contact' ? 'Contact' : slug)
  );
}

function derniereSansLien(miettes: Miette[]): Miette[] {
  return miettes.map((m, i) => (i === miettes.length - 1 ? { label: m.label } : m));
}
