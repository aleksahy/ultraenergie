'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

/**
 * La barre de familles d'un hub : « Tous » puis une entrée par famille. Un clic FILTRE la
 * liste, il ne fait pas défiler.
 *
 * ⚠️ LES SECTIONS SONT RENDUES CÔTÉ SERVEUR ET PASSÉES ICI TOUTES FAITES. Ce composant ne
 * lit pas le catalogue : s'il l'importait, c'est tout `data/details.json` qui partirait
 * dans le bundle client. Il ne fait que masquer ou montrer des blocs déjà construits, avec
 * l'attribut `hidden`, donc le HTML prérendu contient toutes les fiches et les moteurs
 * les lisent toutes.
 *
 * L'adresse suit le filtre (`#enveloppe`) : un lien vers une famille reste partageable, et
 * l'ancre est un vrai lien pour qui n'exécute pas le script. `replaceState` évite le saut
 * de défilement que provoquerait un changement de hash.
 */
export interface FamilleFiltre {
  slug: string;
  label: string;
  compte: number;
}

/* Le filtre actif EST le hash de l'adresse, lu par `useSyncExternalStore` : pas d'état à
   synchroniser avec l'URL, et un instantané serveur vide, donc le HTML prérendu montre tout
   et l'hydratation n'a rien à corriger. */
function abonne(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}
const hashCourant = () => window.location.hash.slice(1);
const hashServeur = () => '';

export default function FiltreFamilles({ familles, sections }: { familles: FamilleFiltre[]; sections: ReactNode[] }) {
  const hash = useSyncExternalStore(abonne, hashCourant, hashServeur);
  const actif = familles.some((f) => f.slug === hash) ? hash : 'tous';

  const choisir = (slug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const chemin = window.location.pathname + window.location.search;
    // `replaceState` ne fait pas défiler, contrairement à `location.hash = …` ; il ne
    // déclenche pas `hashchange` non plus, d'où l'événement envoyé à la main.
    window.history.replaceState(null, '', slug === 'tous' ? chemin : `${chemin}#${slug}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  const total = familles.reduce((n, f) => n + f.compte, 0);

  return (
    <>
      <nav className="ancres" aria-label="Filtrer par famille d’opérations">
        <a href="#" aria-current={actif === 'tous' ? 'true' : undefined} onClick={choisir('tous')}>
          Tous <span className="ancres-compte">{total}</span>
        </a>
        {familles.map((f) => (
          <a key={f.slug} href={`#${f.slug}`} aria-current={actif === f.slug ? 'true' : undefined} onClick={choisir(f.slug)}>
            {f.label} <span className="ancres-compte">{f.compte}</span>
          </a>
        ))}
      </nav>
      {sections.map((s, i) => (
        <div key={familles[i].slug} hidden={actif !== 'tous' && actif !== familles[i].slug}>
          {s}
        </div>
      ))}
    </>
  );
}
