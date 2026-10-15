import type { ReactNode } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import FilAriane from './FilAriane';

/**
 * La coquille commune aux pages intérieures : fil d'Ariane, titre, chapô, contenu, et un
 * pied de page facultatif hors du conteneur.
 *
 * Avec `photo`, le titre passe dans un bandeau photo plein écran sous un voile forêt (les
 * pages « Pour qui » et « Partenaires », d'après les pages intérieures d'EBS Énergie,
 * 15/10/2026) ; le chapô reste en tête du corps. Sans photo, titre et chapô ouvrent le corps.
 *
 * `pied` est rendu APRÈS le `<main>`, donc hors de `.page` et de ses gouttières : c'est ce qui
 * permet à l'appel à l'action (`ContactBande`) d'aller d'un bord à l'autre, comme sur l'accueil.
 */
export default function Page({
  chemin, titre, chapo, surtitre, photo, photoPosition = 'center', lecture = false, pied, children,
}: {
  chemin: string;
  titre: string;
  chapo?: string;
  /** Le libellé en capitales au-dessus du titre (« Syndics et copropriétés »). */
  surtitre?: string;
  /** Une dérivée 1600 de `assets/photos/`, jamais une source de `images/`. */
  photo?: StaticImageData;
  /** L'`object-position` de la photo dans le bandeau (cf. PhotosPages.tsx). */
  photoPosition?: string;
  /**
   * Mode lecture : la page entière (titre compris) tient dans une colonne centrée d'environ
   * 800px. Pour les articles longs sans bande latérale : en pleine largeur, la prose bridée à
   * 760px restait collée au bord gauche et laissait les deux tiers de l'écran vides (Alek,
   * 20/09/2026, sur le glossaire).
   */
  lecture?: boolean;
  /** Une bande pleine largeur après le corps, typiquement `ContactBande`. */
  pied?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      {/* ⚠️ HORS DU `<main>`, et c'est ce qui permet à la bande d'aller d'un bord à l'autre :
          `.page` est un conteneur à largeur maximale et à gouttières, tout ce qu'il contient
          s'y trouve borné. */}
      <FilAriane chemin={chemin} />
      {photo && (
        <div className="page-bande">
          <Image src={photo} alt="" fill sizes="100vw" priority style={{ objectPosition: photoPosition }} />
          <div className="page-bande-inner">
            {surtitre && <div className="surtitre">{surtitre}</div>}
            <h1 className="page-titre">{titre}</h1>
          </div>
        </div>
      )}
      <main className={lecture ? 'page page-lecture' : 'page'}>
        {/* Pas de lien « Retour à … » sous le fil d'Ariane (retiré le 19/09/2026) : le fil
            lie déjà chaque parent, le lien répétait sa dernière miette en plus gros. */}
        {!photo && surtitre && <div className="surtitre page-surtitre">{surtitre}</div>}
        {!photo && <h1 className="page-titre">{titre}</h1>}
        {chapo && <p className="page-chapo">{chapo}</p>}
        {children}
      </main>
      {pied}
    </>
  );
}

/**
 * Une section de page, avec un titre et une ancre facultative. Le titre porte la courte barre
 * verte des têtes de section de l'accueil : même motif sur toutes les pages (15/10/2026).
 *
 * `surtitre` ajoute l'étiquette en capitales au-dessus du titre, comme sur l'accueil.
 * `colonnes` met la tête à gauche et le contenu à droite (le contexte des pages « Pour qui »).
 * `centree` centre la tête et borne le contenu (la FAQ de ces mêmes pages).
 *
 */
export function Section({
  titre, surtitre, id, colonnes = false, centree = false, children,
}: {
  titre: string;
  surtitre?: string;
  id?: string;
  colonnes?: boolean;
  centree?: boolean;
  children: ReactNode;
}) {
  const tete = (
    <div className="page-section-tete">
      {surtitre && <div className="surtitre">{surtitre}</div>}
      <h2 className="page-section-titre">{titre}</h2>
      <div className="tete-section-barre page-section-barre" aria-hidden="true" />
    </div>
  );
  return (
    <section className={`page-section${colonnes ? ' est-colonnes' : ''}${centree ? ' est-centree' : ''}`} id={id}>
      {tete}
      {colonnes ? <div className="page-section-corps">{children}</div> : children}
    </section>
  );
}
