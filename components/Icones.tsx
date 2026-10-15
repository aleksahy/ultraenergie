import type { ReactNode } from 'react';

/* ⚠️ AUCUN LITTÉRAL HEXADÉCIMAL ICI, ET C'EST LA RÈGLE DU PROJET. Les tracés n'ont ni
   `stroke` ni `fill` en dur : ils héritent de `currentColor`, et c'est la feuille de style
   qui pose la couleur depuis une variable de `:root`. Une icône codée en dur survit à un
   changement de charte en gardant l'ancienne couleur, sans rien signaler. */

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

/* ── La coche (24×24), repères et contrôles de l'accueil ─────────────── */

export function IconeCoche() {
  return (
    <svg
      className="ico-coche"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 12.5l2.8 2.8L16.5 9.5" />
    </svg>
  );
}
