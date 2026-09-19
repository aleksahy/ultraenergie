'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import Simulateur from './Simulateur';
import ListeLiens from './ListeLiens';
import { FICHES_EN_LIGNE, ficheParCode, ancreFiche } from '@/lib/fiches';

/** Les fiches dont le barème est modélisé : les seules que le simulateur sait calculer. */
const MODELISEES = FICHES_EN_LIGNE.filter((f) => f.calcul);
import { url } from '@/lib/routes';

/**
 * La page du simulateur, ciblée par le CTA des pages de fiche : `/simulateur/?fiche=bar-en-101`.
 *
 * ⚠️ LE PARAMÈTRE EST LU DANS `window.location`, PAS AVEC `useSearchParams`. En export
 * statique, ce hook impose une frontière `<Suspense>` et bascule la page en rendu client :
 * pour lire une chaîne de requête, c'est payer cher.
 *
 * ⚠️ ET PAR `useSyncExternalStore`, PAS PAR UN `useEffect` QUI APPELLE `setState`. L'instantané
 * serveur vaut `null` : le HTML prérendu montre la liste des fiches, ce qui est la bonne
 * réponse quand on arrive sans paramètre, et l'hydratation n'a rien à corriger. Un effet qui
 * pose l'état au montage rendrait la page deux fois et ferait clignoter la liste.
 */
/* La chaîne de requête ne bouge qu'à une navigation : `popstate` suffit à s'en apercevoir. */
function abonneAlHistorique(rappel: () => void) {
  window.addEventListener('popstate', rappel);
  return () => window.removeEventListener('popstate', rappel);
}

/* Renvoie la même chaîne d'un appel à l'autre tant que l'URL ne change pas : c'est ce que
   `useSyncExternalStore` exige pour ne pas boucler. */
function litFiche(): string | null {
  return new URLSearchParams(window.location.search).get('fiche')?.toUpperCase() ?? null;
}

export default function SimulateurPage() {
  const code = useSyncExternalStore(abonneAlHistorique, litFiche, () => null);
  const fiche = code ? ficheParCode(code) : undefined;

  if (fiche && fiche.calcul) {
    return (
      <>
        <p className="page-texte">
          Barème de la fiche{' '}
          <Link className="lien-appuye" href={url.fiche(fiche.secteur, fiche.code)}>{ancreFiche(fiche.code)}</Link>.
        </p>
        <Simulateur calcul={fiche.calcul} code={fiche.code} />
      </>
    );
  }

  if (MODELISEES.length === 0) {
    return (
      <p className="page-chantier">
        Aucun barème n’est encore importé : le simulateur s’ouvrira fiche par fiche, à mesure
        que les barèmes officiels arrivent.
      </p>
    );
  }

  return (
    <>
      {code && (
        <p className="page-chantier">
          La fiche {code} n’a pas encore de barème importé. Choisissez une fiche ci-dessous.
        </p>
      )}
      <p className="page-texte">
        Choisissez la fiche d’opération qui correspond à vos travaux : le montant est calculé
        à partir de son barème officiel.
      </p>
      <ListeLiens
        liens={MODELISEES.map((f) => ({
          href: `${url.simulateur}?fiche=${f.code.toLowerCase()}`,
          label: ancreFiche(f.code),
        }))}
      />
      <p className="page-texte page-texte-gris">
        Les barèmes s’ajoutent fiche par fiche. Si la vôtre n’est pas encore là, le catalogue
        complet est dans <Link className="lien-terme" href={url.fichesCee}>les fiches CEE</Link>.
      </p>
    </>
  );
}
