import Link from 'next/link';

/** Une grille de liens, la brique de maillage des hubs et des pages secteur. */
export default function ListeLiens({
  liens, colonnes = true,
}: {
  liens: { href: string; label: string; note?: string }[];
  colonnes?: boolean;
}) {
  return (
    <ul className={`liste-liens${colonnes ? ' liste-liens-colonnes' : ''}`}>
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
