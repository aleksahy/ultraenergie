import Link from 'next/link';

/**
 * Une grille de cartes-liens : autant de colonnes que la largeur en permet. (Les variantes à
 * une et à trois colonnes sont parties avec les pages secteur et le blog.)
 */
export default function ListeLiens({ liens }: { liens: { href: string; label: string; note?: string }[] }) {
  return (
    <ul className="liste-liens liste-liens-auto">
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
