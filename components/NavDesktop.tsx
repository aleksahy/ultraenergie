import { NAV, estGroupe } from '@/lib/nav';

/**
 * La nav desktop. Les déroulants sont en CSS pur (`:hover` + `:focus-within`, cf.
 * globals.css) : les enfants sont de vrais `<a href>` présents dans le HTML, seulement
 * masqués en CSS. Aucun `'use client'`, aucun état, rien à hydrater.
 */
export default function NavDesktop() {
  return (
    <nav className="nav-desktop">
      {NAV.map((noeud) =>
        estGroupe(noeud) ? (
          <div key={noeud.label} className="nav-groupe">
            <a href={noeud.href} className="nav-lien nav-groupe-tete">
              {noeud.label}
              <svg className="nav-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
            <div className="nav-menu">
              {noeud.enfants.map((enfant, i) => (
                <a key={`${enfant.label}-${i}`} href={enfant.href} className="nav-menu-item">
                  {enfant.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <a key={noeud.href} href={noeud.href} className="nav-lien">{noeud.label}</a>
        ),
      )}
    </nav>
  );
}
