import { SECTEURS } from './secteurs';
import { PUBLICS, PARTENAIRES } from './publics';
import { FICHES_EN_LIGNE, slugFiche } from './fiches';
import { TERMES } from './glossaire';
import { ARTICLES } from './blog';

/**
 * Le registre des URL. Une seule source pour la navigation, le fil d'Ariane, le pied de page,
 * le sitemap et les redirections.
 *
 * ⚠️ TOUTES LES URL FINISSENT PAR UNE BARRE OBLIQUE, et `next.config.ts` porte le
 * `trailingSlash: true` correspondant. Ce n'est pas un goût : l'architecture demande que
 * `/fiches-cee/`, `/comprendre-les-cee/` et `/blog/` répondent 200 telles qu'écrites, ET que
 * la forme soit cohérente sur tout le site. Les deux ensemble ne laissent qu'une possibilité.
 * La forme sans barre redirige en 301 (cf. scripts/verifie-routes.mjs, qui écrit `_redirects`).
 *
 * ⛔ NE JAMAIS ÉCRIRE UNE URL À LA MAIN DANS UN COMPOSANT. Un lien écrit en dur échappe au
 * contrôle de fin de build qui vérifie qu'aucun lien ne pointe vers une 404.
 */
export const url = {
  accueil: '/',
  quiSommesNous: '/qui-sommes-nous/',
  contact: '/contact/',
  veilleCee: '/veille-cee/',
  simulateur: '/simulateur/',

  /** Page « Pour qui » (premier niveau). */
  public: (slug: string) => `/${slug}/`,
  /** Page secteur commerciale (premier niveau). */
  secteur: (slug: string) => `/${slug}/`,
  /** Page partenaire (premier niveau). */
  partenaire: (slug: string) => `/${slug}/`,

  fichesCee: '/fiches-cee/',
  hubFiches: (slugSecteur: string) => `/fiches-cee/${slugSecteur}/`,
  fiche: (slugSecteur: string, code: string) => `/fiches-cee/${slugSecteur}/${slugFiche(code)}/`,

  comprendreLesCee: '/comprendre-les-cee/',
  terme: (slug: string) => `/comprendre-les-cee/${slug}/`,

  blog: '/blog/',
  article: (slug: string) => `/blog/${slug}/`,
};

/**
 * ⚠️ LE REGISTRE DES SLUGS DE PREMIER NIVEAU. `/industrie`, `/contact` et `/blog` cohabitent
 * dans le même espace de noms : une page secteur, une page fixe et une racine de section s'y
 * marchent dessus sans prévenir. Les six pages secteur passant par un segment dynamique
 * (`app/[secteur]/`), une collision ne produirait pas d'erreur — la route statique gagnerait
 * en silence et la page secteur deviendrait inatteignable.
 *
 * Tout nouveau premier niveau s'ajoute ICI, et `verifieRegistre()` refuse le doublon au build.
 */
export const PREMIER_NIVEAU: { slug: string; role: string }[] = [
  { slug: 'qui-sommes-nous', role: 'page fixe' },
  { slug: 'contact', role: 'page fixe' },
  { slug: 'veille-cee', role: 'page fixe' },
  { slug: 'simulateur', role: 'page fixe' },
  ...PUBLICS.map((p) => ({ slug: p.slug, role: 'page « pour qui »' })),
  ...SECTEURS.map((s) => ({ slug: s.slug, role: 'page secteur (segment dynamique)' })),
  ...PARTENAIRES.map((p) => ({ slug: p.slug, role: 'page partenaire' })),
  { slug: 'fiches-cee', role: 'racine de section' },
  { slug: 'comprendre-les-cee', role: 'racine de section' },
  { slug: 'blog', role: 'racine de section' },
];

/** Toutes les URL du site, dans l'ordre du sitemap. */
export const TOUTES_LES_ROUTES: string[] = [
  url.accueil,
  url.quiSommesNous,
  url.contact,
  url.veilleCee,
  url.simulateur,
  ...PUBLICS.map((p) => url.public(p.slug)),
  ...SECTEURS.map((s) => url.secteur(s.slug)),
  ...PARTENAIRES.map((p) => url.partenaire(p.slug)),
  url.fichesCee,
  ...SECTEURS.map((s) => url.hubFiches(s.slug)),
  // ⚠️ `FICHES_EN_LIGNE`, pas `FICHES` : une fiche dont la date d'abrogation est passée
  // n'a plus de page, et `scripts/verifie-routes.mjs` écrit sa 301 vers le hub du secteur.
  ...FICHES_EN_LIGNE.map((f) => url.fiche(f.secteur, f.code)),
  url.comprendreLesCee,
  ...TERMES.map((t) => url.terme(t.slug)),
  url.blog,
  ...ARTICLES.map((a) => url.article(a.slug)),
];

/** Une URL absolue sur le domaine de production, pour le sitemap et le balisage. */
export function absolue(chemin: string, domaine: string): string {
  return `${domaine}${chemin}`;
}

/**
 * Contrôles exécutés à l'import, donc au build : une collision ou une URL malformée casse le
 * build plutôt que de produire une page silencieusement inatteignable.
 */
function verifieRegistre() {
  const vus = new Map<string, string>();
  for (const { slug, role } of PREMIER_NIVEAU) {
    const deja = vus.get(slug);
    if (deja) throw new Error(`Collision de slug de premier niveau « /${slug} » : ${deja} et ${role}`);
    vus.set(slug, role);
  }

  for (const route of TOUTES_LES_ROUTES) {
    if (route !== route.toLowerCase()) throw new Error(`URL non minuscule : ${route}`);
    if (!route.startsWith('/')) throw new Error(`URL relative : ${route}`);
    if (!route.endsWith('/')) throw new Error(`URL sans barre oblique finale : ${route}`);
    if (/[^a-z0-9/-]/.test(route)) throw new Error(`URL avec un caractère à éviter : ${route}`);
    if (route.includes('//') && route !== '/') throw new Error(`URL avec un segment vide : ${route}`);
  }

  const doublons = TOUTES_LES_ROUTES.filter((r, i) => TOUTES_LES_ROUTES.indexOf(r) !== i);
  if (doublons.length) throw new Error(`URL en double : ${[...new Set(doublons)].join(', ')}`);
}
verifieRegistre();
