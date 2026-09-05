/**
 * Une date ISO rendue en français. Une seule mise en forme pour tout le site.
 *
 * ⚠️ `Intl` écrit « 1 septembre » ; le français écrit « 1er septembre ». Le cas ne se
 * présente que le premier du mois, mais les fiches CEE prennent effet un premier de mois
 * dans leur immense majorité — c'est donc la date la plus souvent affichée du site.
 */
export function dateFr(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  const rendu = date.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
  return date.getUTCDate() === 1 ? rendu.replace(/^1 /, '1er ') : rendu;
}

/** Une date ISO en jj/mm/aaaa, pour les mentions de version. */
export function dateCourte(iso: string): string {
  const [a, m, j] = iso.split('-');
  return `${j}/${m}/${a}`;
}

/** L'année courante, pour les titres de page. */
export function anneeCourante(): number {
  return new Date().getFullYear();
}
