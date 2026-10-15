import { SECTEURS } from './secteurs';
import { PUBLICS, PARTENAIRES } from './publics';
import { TERMES } from './glossaire';

/**
 * Le registre des URL. Une seule source pour la navigation, le fil d'Ariane, le pied de page,
 * le sitemap et les redirections.
 *
 * ⚠️ TOUTES LES URL FINISSENT PAR UNE BARRE OBLIQUE, et `next.config.ts` porte le
 * `trailingSlash: true` correspondant. Ce n'est pas un goût : l'architecture demande que
 * `/comprendre-les-cee/` et `/contact/` répondent 200 telles qu'écrites, ET que
 * la forme soit cohérente sur tout le site. Les deux ensemble ne laissent qu'une possibilité.
 * La forme sans barre redirige en 301 (cf. scripts/verifie-routes.mjs, qui écrit `_redirects`).
 *
 * ⛔ NE JAMAIS ÉCRIRE UNE URL À LA MAIN DANS UN COMPOSANT. Un lien écrit en dur échappe au
 * contrôle de fin de build qui vérifie qu'aucun lien ne pointe vers une 404.
 */
export const url = {
  accueil: '/',
  /**
   * ⛔ PAS UNE PAGE : une ancre de l'accueil, la section « Notre métier ». La page
   * `/qui-sommes-nous/` a été retirée le 15/10/2026 (Alek : « juste une ancre de l'index »)
   * et son slug reste réservé dans `PREMIER_NIVEAU`. Absente de `TOUTES_LES_ROUTES`.
   */
  quiSommesNous: '/#qui-sommes-nous',
  contact: '/contact/',
  mentionsLegales: '/mentions-legales/',

  /** Page « Pour qui » (premier niveau). */
  public: (slug: string) => `/${slug}/`,
  /** Page partenaire (premier niveau). */
  partenaire: (slug: string) => `/${slug}/`,

  comprendreLesCee: '/comprendre-les-cee/',
  terme: (slug: string) => `/comprendre-les-cee/${slug}/`,
};

/**
 * ⚠️ LE REGISTRE DES SLUGS DE PREMIER NIVEAU. `/industrie`, `/contact` et `/comprendre-les-cee` cohabitent
 * dans le même espace de noms : une page « pour qui », une page fixe et une racine de section
 * s'y marchent dessus sans prévenir. Les pages « pour qui » et partenaires passant par un
 * segment dynamique (`app/[slug]/`), une collision ne produirait pas d'erreur — la route
 * statique gagnerait en silence et la page du même nom deviendrait inatteignable.
 *
 * ⛔ LES SIX PAGES SECTEUR COMMERCIALES (`/industrie/`, `/tertiaire/`…) ONT ÉTÉ RETIRÉES le
 * 19/09/2026, « pour le moment ». Les slugs de secteur restent réservés ici pour que rien ne
 * s'y installe entre-temps : le jour où elles reviennent, elles reprennent leur adresse.
 *
 * ⛔ LE CATALOGUE DE FICHES ET LE SIMULATEUR ONT ÉTÉ RETIRÉS le 14/10/2026 pour être rebâtis
 * sur un nouveau modèle de données. `/fiches-cee` et `/simulateur` restent réservés ici : ils
 * reprendront leur adresse, et rien ne doit s'y installer entre-temps. (Un simulateur
 * simplifié a vécu quelques heures le 15/10/2026 ; Alek : « pas de simulateur en attendant
 * d'avoir construit le cœur », les appels à l'action mènent au contact.)
 *
 * ⛔ LE BLOG, « QUI SOMMES-NOUS » ET « VEILLE CEE » ONT ÉTÉ RETIRÉS le 15/10/2026 pour le
 * premier déploiement : le blog n'avait que trois titres sans article, « Qui sommes-nous »
 * est devenu une ancre de l'accueil, et la lettre n'a plus que son formulaire dans le pied.
 * Leurs slugs restent réservés ici.
 *
 * Tout nouveau premier niveau s'ajoute ICI, et `verifieRegistre()` refuse le doublon au build.
 */
export const PREMIER_NIVEAU: { slug: string; role: string }[] = [
  { slug: 'qui-sommes-nous', role: 'slug réservé (ancre de l’accueil depuis le 15/10/2026)' },
  { slug: 'contact', role: 'page fixe' },
  { slug: 'veille-cee', role: 'slug réservé (page retirée le 15/10/2026, formulaire dans le pied)' },
  { slug: 'mentions-legales', role: 'page fixe' },
  { slug: 'simulateur', role: 'slug réservé (simulateur à rebâtir)' },
  ...PUBLICS.map((p) => ({ slug: p.slug, role: 'page « pour qui »' })),
  ...SECTEURS.map((s) => ({ slug: s.slug, role: 'slug réservé (page secteur retirée)' })),
  ...PARTENAIRES.map((p) => ({ slug: p.slug, role: 'page partenaire' })),
  { slug: 'fiches-cee', role: 'slug réservé (catalogue à rebâtir)' },
  { slug: 'comprendre-les-cee', role: 'racine de section' },
  { slug: 'blog', role: 'slug réservé (blog retiré le 15/10/2026)' },
];

/** Toutes les URL du site, dans l'ordre du sitemap. */
export const TOUTES_LES_ROUTES: string[] = [
  url.accueil,
  url.contact,
  url.mentionsLegales,
  ...PUBLICS.map((p) => url.public(p.slug)),
  ...PARTENAIRES.map((p) => url.partenaire(p.slug)),
  url.comprendreLesCee,
  ...TERMES.map((t) => url.terme(t.slug)),
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
