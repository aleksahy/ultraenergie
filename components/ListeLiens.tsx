import Link from 'next/link';

/**
 * Une grille de cartes-liens, la brique de maillage des hubs et des pages secteur.
 *
 * `colonnes` fixe la grille :
 *   'auto'  autant de colonnes que la largeur en permet, pour une liste dont le nombre varie
 *   3       exactement trois, pour les six secteurs qui doivent tomber en deux lignes de trois
 *   1       une seule, pour les listes dont chaque entrée porte une phrase de description
 *
 * ⚠️ `3` n'est pas `auto` avec un minimum plus grand : à 1600px, `auto` mettait les six
 * secteurs en 4 + 2, ce qui ne se lit pas comme un ensemble. Le nombre de colonnes est ici
 * une décision de mise en page, pas une conséquence de la largeur.
 */
export default function ListeLiens({
  liens, colonnes = 'auto',
}: {
  liens: { href: string; label: string; note?: string }[];
  colonnes?: 'auto' | 1 | 3;
}) {
  const classe =
    colonnes === 'auto' ? 'liste-liens liste-liens-auto'
    : colonnes === 3 ? 'liste-liens liste-liens-trois'
    : 'liste-liens';

  return (
    <ul className={classe}>
      {liens.map((l) => (
        <li key={l.href}>
          <Link href={l.href}>
            <span className="liste-liens-label">{l.label}</span>
            {l.note && <span className="liste-liens-note">{l.note}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
