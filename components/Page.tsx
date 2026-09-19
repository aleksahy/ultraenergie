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
  chemin, titre, chapo, surtitre, children,
}: {
  chemin: string;
  titre: string;
  chapo?: string;
  /** Le libellé en capitales au-dessus du titre (« Syndics et copropriétés »). */
  surtitre?: string;
  children?: ReactNode;
}) {
  return (
    <>
      {/* ⚠️ HORS DU `<main>`, et c'est ce qui permet à la bande d'aller d'un bord à l'autre :
          `.page` est un conteneur à largeur maximale et à gouttières, tout ce qu'il contient
          s'y trouve borné. */}
      <FilAriane chemin={chemin} />
      <main className="page">
        {/* Pas de lien « Retour à … » sous le fil d'Ariane (retiré le 19/09/2026) : le fil
            lie déjà chaque parent, le lien répétait sa dernière miette en plus gros. */}
        {surtitre && <div className="surtitre page-surtitre">{surtitre}</div>}
        <h1 className="page-titre">{titre}</h1>
        {chapo && <p className="page-chapo">{chapo}</p>}
        {children}
      </main>
    </>
  );
}

/**
 * Une section de page, avec un titre et une ancre facultative.
 *
 * `numero` numérote le titre quand la page tient un sommaire : le repère visuel relie la
 * section à sa ligne dans la bande latérale. Il est décoratif — `aria-hidden` — parce qu'une
 * synthèse vocale qui lit « zéro trois Conditions d'éligibilité » n'apprend rien de plus.
 */
export function Section({
  titre, id, numero, children,
}: {
  titre: string;
  id?: string;
  numero?: number;
  children: ReactNode;
}) {
  return (
    <section className="page-section" id={id}>
      <h2 className="page-section-titre">
        {numero !== undefined && (
          <span className="page-section-numero" aria-hidden="true">{String(numero).padStart(2, '0')}</span>
        )}
        {titre}
      </h2>
      {children}
    </section>
  );
}

/** Le bandeau qui dit qu'une page est une coquille, en attendant son contenu. */
export function AChantier({ children }: { children: ReactNode }) {
  return <p className="page-chantier">{children}</p>;
}
