'use client';

/**
 * Le lien vers l'accueil : le wordmark de l'en-tête, et « Accueil » du pied de page.
 *
 * ⚠️ POURQUOI UN COMPOSANT PLUTÔT QU'UN `<Link href="/">` NU. Sur l'accueil lui-même, la
 * navigation vers `/` est un NON-ÉVÉNEMENT pour le routeur : même route, rien à charger,
 * donc rien ne bouge, et surtout pas le défilement. Le site tient aujourd'hui en une seule
 * page et l'en-tête est collant : le wordmark est visible depuis le pied, on le clique
 * naturellement pour remonter, et il ne faisait rien.
 *
 * ⛔ Le raccourci ne vaut QUE sur l'accueil. Ailleurs le lien doit naviguer normalement.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function LienAccueil({
  children, className, onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={className}
      onClick={(e) => {
        onClick?.();
        if (pathname !== '/') return;
        e.preventDefault();
        /* Le mouvement est une information : il montre qu'on remonte une page au lieu de la
           faire clignoter. Il se coupe pour qui a demandé moins d'animation, un défilement
           long étant précisément ce qui gêne dans ce réglage. */
        const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' });
      }}
    >
      {children}
    </Link>
  );
}
