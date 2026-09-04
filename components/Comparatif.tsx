import TeteSection from './TeteSection';
import { COMPARATIF } from '@/lib/contenu';

export default function Comparatif() {
  return (
    <section id="independance" className="section">
      <TeteSection surtitre="Indépendance" large>
        Mandataire indépendant, délégataire ou installateur-mandataire ?
      </TeteSection>
      <div className="comparatif">
        {COMPARATIF.map((c) => (
          <div key={c.titre} className={`colonne-comparatif${c.misEnAvant ? ' est-mise-en-avant' : ''}`}>
            <div className="colonne-titre">{c.titre}</div>
            <ul className="colonne-points">
              {c.points.map((p) => (
                <li key={p}><span className="puce" aria-hidden="true">—</span><span>{p}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
