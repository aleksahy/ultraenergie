import type { ReactNode } from 'react';

/** Le bloc surtitre + H2 qui ouvre chaque section. */
export default function TeteSection({
  surtitre, children, large = false,
}: {
  surtitre: string;
  children: ReactNode;
  large?: boolean;
}) {
  return (
    <div className={`tete-section${large ? ' tete-section-large' : ''}`}>
      <div className="surtitre">{surtitre}</div>
      <h2>{children}</h2>
    </div>
  );
}
