import { FICHES_ABROGEES } from '@/lib/fiches';
import { url } from '@/lib/routes';

/* ⚠️ INDISPENSABLE AVEC `output: 'export'`. */
export const dynamic = 'force-static';

/**
 * Les redirections des fiches abrogées, écrites par le build pour être fusionnées dans
 * `out/_redirects` puis SUPPRIMÉES (cf. scripts/verifie-routes.mjs).
 *
 * ⚠️ POURQUOI CE DÉTOUR. Le site est statique : personne n'évalue une date d'abrogation au
 * moment du clic. La bascule se fait donc au build, et c'est `lib/fiches.ts` qui la connaît.
 * Or le script de fin de build est en JavaScript simple et ne peut pas importer les données
 * TypeScript du site. Cette route est le pont : elle fait passer la liste du monde des
 * données à celui du script, par un fichier.
 *
 * ⛔ CE FICHIER NE DOIT PAS RESTER DANS `out/` : le script le supprime après fusion. Sans ça,
 * il se retrouverait servi à l'adresse /redirections-fiches.txt, hors du sitemap, et le
 * contrôle de concordance le signalerait à raison.
 */
export function GET() {
  const lignes = FICHES_ABROGEES.map(
    (f) => `${url.fiche(f.secteur, f.code).replace(/\/$/, '')}  ${url.hubFiches(f.secteur)}  301`,
  );
  return new Response(lignes.join('\n') + (lignes.length ? '\n' : ''), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
