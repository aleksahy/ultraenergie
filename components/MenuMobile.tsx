'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV, estGroupe } from '@/lib/nav';
import { url } from '@/lib/routes';
import { useModales } from './Modales';

/**
 * Le menu mobile (< 900px) : le burger ouvre un panneau qui se déploie SOUS l'en-tête.
 *
 * ⚠️ L'EN-TÊTE RESTE VISIBLE ET N'EST PAS REDOUBLÉ DANS LE PANNEAU. Le panneau est
 * `position: fixed` ancré à `top: var(--header-h)`, exactement la hauteur de l'en-tête
 * collant : les deux sont jointifs quelle que soit la position de défilement, et aucun
 * morceau de page ne peut apparaître entre eux.
 *
 * ⚠️ Les groupes sans URL sont des `<button>` d'accordéon, jamais des liens : même règle
 * qu'en desktop (cf. lib/nav.ts).
 *
 * ⛔ PAS DE BOUTON « ESTIMER » à gauche des trois traits : le burger est seul dans
 * l'en-tête mobile.
 */
export default function MenuMobile() {
  const [ouvert, setOuvert] = useState(false);
  const [groupesOuverts, setGroupesOuverts] = useState<string[]>([]);
  const burger = useRef<HTMLButtonElement>(null);
  const ouvrirModale = useModales();

  const basculerGroupe = (label: string) =>
    setGroupesOuverts((g) => (g.includes(label) ? g.filter((x) => x !== label) : [...g, label]));

  const fermer = () => { setOuvert(false); burger.current?.focus(); };

  useEffect(() => {
    if (!ouvert) return;
    const auClavier = (e: KeyboardEvent) => { if (e.key === 'Escape') fermer(); };
    document.addEventListener('keydown', auClavier);
    return () => document.removeEventListener('keydown', auClavier);
  }, [ouvert]);

  return (
    <div className="menu-mobile">
      <button
        type="button"
        ref={burger}
        className="burger"
        aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={ouvert}
        onClick={() => setOuvert((o) => !o)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
          {ouvert ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {ouvert && (
        <>
          <button type="button" className="menu-scrim" aria-label="Fermer le menu" onClick={fermer} />
          <nav className="menu-panneau" aria-label="Navigation principale">
            {NAV.map((noeud) => {
              if (estGroupe(noeud)) {
                const deplie = groupesOuverts.includes(noeud.label);
                return (
                  <div key={noeud.label}>
                    <button
                      type="button"
                      className={`menu-lien menu-groupe${deplie ? ' est-deplie' : ''}`}
                      aria-expanded={deplie}
                      onClick={() => basculerGroupe(noeud.label)}
                    >
                      {noeud.label}
                      <svg className="menu-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {deplie && (
                      <div className="menu-sous">
                        {noeud.enfants.map((enfant) => (
                          <Link key={enfant.href} href={enfant.href} className="menu-sous-lien" onClick={fermer}>
                            {enfant.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link key={noeud.href} href={noeud.href} className="menu-lien" onClick={fermer}>
                  {noeud.label}
                </Link>
              );
            })}

            {/* /contact est hors menu en desktop (c'est le bouton de l'en-tête) ; sur
                téléphone il rejoint la liste, faute d'une place à droite où le poser. */}
            <Link href={url.contact} className="menu-lien" onClick={fermer}>Contact</Link>

            {/* Le même bouton qu'en PC, et lui seul : « Contact » est déjà dans la liste. */}
            <div className="menu-actions">
              <button
                type="button"
                className="pilule pilule-accent"
                onClick={() => { setOuvert(false); ouvrirModale('estimation'); }}
              >
                Estimer ma prime
              </button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
