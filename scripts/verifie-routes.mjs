/**
 * Contrôle de fin de build, et écriture des redirections.
 *
 * Il tient les quatre garde-fous que l'architecture demande et qu'aucun type ne peut vérifier :
 *
 *   1. Le sitemap et le contenu de `out/` disent la même chose, DANS LES DEUX SENS. Une page
 *      générée sans être déclarée, c'est une page d'archive ou de média apparue toute seule ;
 *      une page déclarée sans être générée, c'est une entrée de sitemap en 404.
 *   2. Aucun lien interne du HTML produit ne pointe vers une page qui n'existe pas. Le
 *      contrôle porte sur le HTML, pas sur les sources : c'est le seul niveau où le menu, le
 *      pied et le corps sont vus comme le visiteur les voit.
 *   3. Toutes les URL sont sous leur forme canonique, barre oblique finale comprise. Un lien
 *      interne sous une autre forme coûterait une redirection à chaque clic.
 *   4. `out/_redirects` est écrit à partir du sitemap : la forme sans barre finale part en 301.
 *
 * Lancé par `npm run build` (script `postbuild`).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, extname, posix } from 'node:path';

const OUT = 'out';
const erreurs = [];

/* ── Les routes déclarées : le sitemap ────────────────────────────────────── */

const sitemap = await readFile(join(OUT, 'sitemap.xml'), 'utf8');
const declarees = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
);
if (declarees.size === 0) erreurs.push('Le sitemap ne déclare aucune URL.');

/* ── Les routes générées : les index.html de out/ ─────────────────────────── */

async function fichiers(dossier) {
  const trouves = [];
  for (const entree of await readdir(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) trouves.push(...(await fichiers(chemin)));
    else trouves.push(chemin);
  }
  return trouves;
}

const tous = await fichiers(OUT);
const html = tous.filter((f) => f.endsWith('.html'));

// La page d'erreur n'est pas une page du site. Next l'écrit à TROIS endroits avec
// `trailingSlash: true` : `404.html` (celle que sert Cloudflare Pages), `404/index.html` et
// `_not-found/index.html`. Les trois sont le même document ; aucune n'a d'URL à indexer.
const NON_INDEXABLES = ['_not-found/', '404/'];
const estPageDuSite = (f) => {
  const rel = relative(OUT, f).split('\\').join('/');
  return rel.endsWith('index.html') && !NON_INDEXABLES.some((p) => rel.startsWith(p));
};

const generees = new Set(
  html.filter(estPageDuSite).map((f) => {
    const rel = posix.dirname(relative(OUT, f).split('\\').join('/'));
    return rel === '.' ? '/' : `/${rel}/`;
  }),
);

for (const route of declarees) {
  if (!generees.has(route)) erreurs.push(`Déclarée au sitemap mais absente de out/ : ${route}`);
}
for (const route of generees) {
  if (!declarees.has(route)) erreurs.push(`Générée dans out/ mais absente du sitemap : ${route}`);
}

/* ── Les liens internes du HTML produit ───────────────────────────────────── */

const fichiersPresents = new Set(tous.map((f) => `/${relative(OUT, f).split('\\').join('/')}`));

for (const page of html) {
  const source = await readFile(page, 'utf8');
  const depuis = `/${relative(OUT, page).split('\\').join('/')}`;

  for (const m of source.matchAll(/href="(\/[^"]*)"/g)) {
    const brut = m[1];
    const chemin = brut.split('#')[0].split('?')[0];
    if (chemin === '') continue;

    // Un fichier (bundle, police, image, sitemap…) : on vérifie qu'il est bien là.
    if (chemin.startsWith('/_next/') || extname(chemin)) {
      if (!fichiersPresents.has(chemin)) erreurs.push(`${depuis} → fichier absent : ${chemin}`);
      continue;
    }

    if (!chemin.endsWith('/')) {
      erreurs.push(`${depuis} → lien hors forme canonique (barre finale manquante) : ${chemin}`);
      continue;
    }
    if (chemin !== chemin.toLowerCase()) {
      erreurs.push(`${depuis} → lien non minuscule : ${chemin}`);
      continue;
    }
    if (!generees.has(chemin)) erreurs.push(`${depuis} → lien vers une page inexistante : ${chemin}`);
  }
}

/* ── Les redirections ─────────────────────────────────────────────────────── */

const regles = [...declarees]
  .filter((r) => r !== '/')
  .sort()
  .map((r) => `${r.replace(/\/$/, '')}  ${r}  301`);

await writeFile(
  join(OUT, '_redirects'),
  [
    '# Généré par scripts/verifie-routes.mjs à chaque build. Ne pas éditer à la main.',
    '#',
    '# La forme canonique de toute URL du site porte une barre oblique finale',
    '# (cf. `trailingSlash` dans next.config.ts). Ces règles renvoient la forme sans barre',
    "# vers elle, en 301. Cloudflare Pages normalise déjà, mais en 308 : on écrit les règles",
    "# pour que le code soit celui que l'architecture demande, et pour que la liste des",
    '# formes acceptées soit lisible dans le dépôt plutôt que déduite du comportement du CDN.',
    '',
    ...regles,
    '',
  ].join('\n'),
  'utf8',
);

/* ── Verdict ──────────────────────────────────────────────────────────────── */

if (erreurs.length) {
  console.error(`\n✗ ${erreurs.length} problème(s) :\n`);
  for (const e of erreurs) console.error(`  ${e}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ ${generees.size} pages, sitemap et out/ concordants, ` +
  `aucun lien interne mort, ${regles.length} redirections écrites dans out/_redirects.`,
);
