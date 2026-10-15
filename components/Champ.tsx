import type { ReactNode } from 'react';

/**
 * Un champ de formulaire avec son libellé visible au-dessus. Partagé par la modale
 * partenaire et la page Contact : chaque champ a un libellé visible, parce
 * qu'un placeholder disparaît dès qu'on tape.
 */
export function Champ({ label, facultatif = false, aide, children }: {
  label: string;
  facultatif?: boolean;
  /** Une ligne d'aide sous le champ. */
  aide?: string;
  children: ReactNode;
}) {
  return (
    <label className="champ-bloc">
      <span className="champ-label">{label}{facultatif && <span className="champ-facultatif"> (facultatif)</span>}</span>
      {children}
      {aide && <span className="champ-aide">{aide}</span>}
    </label>
  );
}
