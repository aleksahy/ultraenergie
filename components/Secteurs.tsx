import TeteSection from './TeteSection';
import { SECTEURS_OPERATIONS } from '@/lib/contenu';

/**
 * Les six secteurs des fiches, en tuiles à bandeau. ⛔ Pas de lien : les pages secteur ont été
 * retirées le 19/09/2026 et le catalogue est en refonte ; les tuiles deviendront des liens
 * vers ses hubs quand il reviendra.
 */
export default function Secteurs() {
  return (
    <section id="secteurs" className="section">
      <TeteSection surtitre="Secteurs d’opérations">Les six secteurs du dispositif</TeteSection>
      <div className="secteurs">
        {SECTEURS_OPERATIONS.map((s) => (
          <div key={s.nom} className="secteur">
            <strong>{s.nom}</strong>
            <span>{s.exemples}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
