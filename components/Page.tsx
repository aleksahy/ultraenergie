import type { ReactNode } from 'react';
import FilAriane from './FilAriane';

/**
 * La coquille commune aux pages intérieures : fil d'Ariane, titre, chapô, contenu.
 *
 * Le contenu et le design de ces pages viennent plus tard ; ce qui est posé ici, c'est leur
 * ossature et leur maillage, les deux choses qu'on ne peut pas ajouter après coup sans
 * refaire les URL.
 */
export default function Page({
  chemin, titre, chapo, children,
}: {
  chemin: string;
  titre: string;
  chapo?: string;
  children?: ReactNode;
}) {
  return (
    <main className="page">
      <FilAriane chemin={chemin} />
      <h1 className="page-titre">{titre}</h1>
      {chapo && <p className="page-chapo">{chapo}</p>}
      {children}
    </main>
  );
}

/** Une section de page, avec un titre et une ancre facultative. */
export function Section({
  titre, id, children,
}: {
  titre: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className="page-section" id={id}>
      <h2 className="page-section-titre">{titre}</h2>
      {children}
    </section>
  );
}

/** Le bandeau qui dit qu'une page est une coquille, en attendant son contenu. */
export function AChantier({ children }: { children: ReactNode }) {
  return <p className="page-chantier">{children}</p>;
}
