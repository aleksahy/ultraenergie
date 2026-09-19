import { Fragment } from 'react';
import type { ReactNode } from 'react';

/* ⚠️ AUCUN LITTÉRAL HEXADÉCIMAL ICI, ET C'EST LA RÈGLE DU PROJET. Les tracés n'ont ni
   `stroke` ni `fill` en dur : ils héritent de `currentColor`, et c'est la feuille de style
   qui pose la couleur depuis une variable de `:root`. Une icône codée en dur survit à un
   changement de charte en gardant l'ancienne couleur, sans rien signaler. */

/* ── Icônes des étapes (44×44, trait épais) ─────────────────────────── */

const TRACES_ETAPES: Record<string, ReactNode> = {
  loupe: (
    <>
      <circle cx="19" cy="19" r="12" />
      <path d="M28 28 L38 38" />
    </>
  ),
  document: (
    <>
      <rect x="9" y="5" width="26" height="34" rx="2" />
      <path d="M15 15h14M15 22h14" />
      <path d="M15 30 L19 34 L29 24" />
    </>
  ),
  echange: (
    <>
      <path d="M9 16h22" />
      <path d="M25 10l6 6-6 6" />
      <path d="M35 28H13" />
      <path d="M19 22l-6 6 6 6" />
    </>
  ),
  controle: (
    <>
      <path d="M22 5 36 10v11c0 8-6 14-14 18-8-4-14-10-14-18V10L22 5Z" />
      <path d="M15.5 21.5 20 26l9-9" />
    </>
  ),
};

export function IconeEtape({ nom }: { nom: string }) {
  return (
    <svg
      className="ico-etape"
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRACES_ETAPES[nom]}
    </svg>
  );
}

/* ── Icônes des travaux éligibles (24×24, filaire fin) ──────────────── */

const TRACES_TRAVAUX: Record<string, ReactNode> = {
  couches: (
    <>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M2 13l10 5 10-5" />
      <path d="M2 17.5l10 5 10-5" />
    </>
  ),
  helice: (
    <>
      <circle cx="12" cy="12" r="1.5" />
      <path d="M12 10.5c-1-2-3.5-4-5.5-3-1.5.8-1.5 3 .5 4" />
      <path d="M13.5 12c2-1 4-3.5 3-5.5-.8-1.5-3-1.5-4 .5" />
      <path d="M12 13.5c1 2 3.5 4 5.5 3 1.5-.8 1.5-3-.5-4" />
      <path d="M10.5 12c-2 1-4 3.5-3 5.5.8 1.5 3 1.5 4-.5" />
    </>
  ),
  flamme: <path d="M9 18c-2-1-3-3-3-5 0-3 2-4 2-7 0 0 4 2 4 6 1-1 1-2.5 1-3.5 2 1.5 3 4 3 6.5 0 3-2.5 5-5 5s-4-1-2-2Z" />,
  jauge: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13l3-3" />
      <path d="M8 4h8" />
    </>
  ),
  tuyau: (
    <>
      <path d="M4 8h16" />
      <path d="M4 8v8" />
      <path d="M20 8v8" />
      <path d="M4 12h4M12 12h4" />
      <path d="M4 16h16" />
    </>
  ),
  ampoule: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3 11c.6.5 1 1.2 1 2h4c0-.8.4-1.5 1-2a6 6 0 0 0-3-11Z" />
    </>
  ),
  engrenage: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.2 7.8l2.6 1.5M17.2 14.7l2.6 1.5M3 12h3M18 12h3M4.2 16.2l2.6-1.5M17.2 9.3l2.6-1.5M7.8 4.2l1.5 2.6M14.7 17.2l1.5 2.6" />
    </>
  ),
  recuperation: (
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-14 5.3L4 16" />
      <path d="M4 20v-4h4" />
    </>
  ),
};

export function IconeTravaux({ nom }: { nom: string }) {
  return (
    <svg
      className="ico-travaux"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRACES_TRAVAUX[nom]}
    </svg>
  );
}

/* ── Icônes de l'illustration du héros (24×24, énergies renouvelables) ─ */

const ENERGIES: ReactNode[] = [
  <Fragment key="solaire">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
  </Fragment>,
  /* ⚠️ LES PALES SONT DES FUSEAUX FERMÉS, PAS TROIS SEGMENTS PARTANT DU MOYEU. Dessinées en
     traits droits, la pale du haut et le mât formaient une seule verticale traversant le
     moyeu : l'icône se lisait comme un avion. Un fuseau, répété par rotation de 120°
     autour du moyeu, ne peut pas prolonger le mât. */
  <Fragment key="eolien">
    <path d="M11.2 8.6C10.8 5.4 11.1 2.9 12 1.2c.9 1.7 1.2 4.2.8 7.4Z" />
    <path d="M11.2 8.6C10.8 5.4 11.1 2.9 12 1.2c.9 1.7 1.2 4.2.8 7.4Z" transform="rotate(120 12 9.2)" />
    <path d="M11.2 8.6C10.8 5.4 11.1 2.9 12 1.2c.9 1.7 1.2 4.2.8 7.4Z" transform="rotate(240 12 9.2)" />
    <circle cx="12" cy="9.2" r="1.1" />
    <path d="M12 10.4V21" />
    <path d="M9.6 21.4h4.8" />
  </Fragment>,
  <path key="hydraulique" d="M12 3.2c3.4 3.8 5.6 6.6 5.6 9.4a5.6 5.6 0 1 1-11.2 0c0-2.8 2.2-5.6 5.6-9.4Z" />,
  <Fragment key="biomasse">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
    <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
  </Fragment>,
  <Fragment key="geothermie">
    <path d="M3 15.5h18" />
    <path d="M6.5 19.5h11" />
    <path d="M8.5 12c0-2 2-2 2-4s-2-2-2-4" />
    <path d="M15.5 12c0-2 2-2 2-4s-2-2-2-4" />
  </Fragment>,
  <Fragment key="stockage">
    <rect x="2.5" y="7" width="15" height="10" rx="2.5" />
    <path d="M20.5 10.5v3" />
    <path d="M11.4 9.4 8.6 13.2h3L9.8 16.6" />
  </Fragment>,
];

/**
 * L'illustration du héros : six énergies renouvelables posées sur un cercle, autour d'un
 * cercle central. Affichée sur PC uniquement (cf. `.hero-illustration` en CSS).
 *
 * ⚠️ Les positions sont calculées, pas devinées : six points à 60° d'écart sur un cercle de
 * rayon 138 centré en (200, 200), le premier au sommet. Déplacer un satellite sans refaire
 * le tour casse la régularité, qui est tout le propos du dessin.
 */
const RAYON_ORBITE = 138;
const POSITIONS = Array.from({ length: 6 }, (_, i) => {
  const angle = (-90 + i * 60) * (Math.PI / 180);
  return {
    x: 200 + RAYON_ORBITE * Math.cos(angle),
    y: 200 + RAYON_ORBITE * Math.sin(angle),
  };
});

/* ── Icônes des arguments (24×24, filaire fin), pages « Pour qui » et « Partenaires » ── */

const TRACES_ARGUMENTS: Record<string, ReactNode> = {
  balance: (
    <>
      <path d="M12 3v18M5 21h14" />
      <path d="M12 6 4 8m8-2 8 2" />
      <path d="M2 14c0 1.7 1.3 3 3 3s3-1.3 3-3L5 8l-3 6Z" />
      <path d="M16 14c0 1.7 1.3 3 3 3s3-1.3 3-3l-3-6-3 6Z" />
    </>
  ),
  calendrier: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M9 15l2 2 4-4" />
    </>
  ),
  dossier: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M8 14h8M8 17h5" />
    </>
  ),
  cumul: (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </>
  ),
  etoile: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
  bouclier: (
    <>
      <path d="M12 3 20 6v6c0 4.5-3.4 8.2-8 9.9C7.4 20.2 4 16.5 4 12V6l8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  mairie: (
    <>
      <path d="M3 21h18M4 10h16M12 3l8 5H4l8-5Z" />
      <path d="M6 10v11M10 10v11M14 10v11M18 10v11" />
    </>
  ),
  usine: (
    <>
      <path d="M3 21V10l5-3v3l5-3v3l5-3v14H3Z" />
      <path d="M7 15h2M11 15h2M15 15h2M5 7V4h3v3" />
    </>
  ),
  eclair: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  poignee: (
    <>
      <path d="M2 10 7 6l4 1 3-1 6 4" />
      <path d="M22 10l-4 4-4-3" />
      <path d="M7 6 2 10l5 6 3 2 4-1 4-3" />
      <path d="M10 11l3 3M12 9l3 3" />
    </>
  ),
  euro: (
    <>
      <path d="M17 6.5A6.5 6.5 0 0 0 6.5 12 6.5 6.5 0 0 0 17 17.5" />
      <path d="M4 10.5h9M4 13.5h9" />
    </>
  ),
};

export function IconeArgument({ nom }: { nom: string }) {
  return (
    <svg
      className="ico-argument"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRACES_ARGUMENTS[nom]}
    </svg>
  );
}

export function IllustrationHero() {
  return (
    <svg className="hero-svg" viewBox="0 0 400 400" fill="none" aria-hidden="true">
      {/* L'orbite, tracée sous les satellites : elle les relie sans avoir à dessiner
          six segments qui se rejoindraient mal aux bords des cercles. */}
      <circle cx="200" cy="200" r={RAYON_ORBITE} stroke="var(--accent)" strokeWidth="1.5" opacity="0.4" />

      <circle cx="200" cy="200" r="62" fill="var(--accent)" />
      <path d="M208 170 182 206h16l-6 26 26-36h-16z" fill="var(--sur-accent)" />

      {POSITIONS.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="40" fill="var(--blanc)" stroke="var(--encre)" strokeWidth="2" />
          <g
            transform={`translate(${p.x - 18} ${p.y - 18}) scale(1.5)`}
            stroke="var(--accent)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ENERGIES[i]}
          </g>
        </g>
      ))}
    </svg>
  );
}
