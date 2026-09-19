import Link from 'next/link';
import { NAV, estGroupe } from '@/lib/nav';

/**
 * La nav desktop. Les déroulants sont en CSS pur (`:hover` + `:focus-within`, cf.
 * globals.css) : les enfants sont de vrais `<a href>` présents dans le HTML, seulement
 * masqués en CSS. Aucun `'use client'`, aucun état, rien à hydrater.
 *
 * ⚠️ LE DÉCLENCHEUR D'UN GROUPE EST UN `<button>`, PAS UN LIEN. « Pour qui » et
 * « Partenaires » n'ont pas d'URL : ce sont des libellés de menu. Le rendre en `<a href="#">`
 * ou en lien vers une pseudo-page fabriquerait une URL que rien ne sert. Le bouton ouvre au
 * survol et au focus clavier, et ne navigue nulle part.
 */
export default function NavDesktop() {
  return (
    <nav className="nav-desktop" aria-label="Navigation principale">
      {NAV.map((noeud) =>
        estGroupe(noeud) ? (
          <div key={noeud.label} className="nav-groupe">
            <button type="button" className="nav-lien nav-groupe-tete" aria-haspopup="true">
              {noeud.label}
              <svg className="nav-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="nav-menu">
              {noeud.enfants.map((enfant) => (
                <Link key={enfant.href} href={enfant.href} className="nav-menu-item">
                  {enfant.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link key={noeud.href} href={noeud.href} className="nav-lien">{noeud.label}</Link>
        ),
      )}
    </nav>
  );
}
