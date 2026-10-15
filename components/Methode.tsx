import TeteSection from './TeteSection';
import { ETAPES } from '@/lib/contenu';

/** Les quatre étapes, en tuiles sur une bande forêt. */
export default function Methode() {
  return (
    <section id="methode" className="bande">
      <div className="bande-inner">
        <TeteSection surtitre="Notre méthode" blanc>Quatre étapes, un seul interlocuteur</TeteSection>
        <div className="bande-tuiles">
          {ETAPES.map((e, i) => (
            <div key={e.titre} className="bande-tuile">
              <div className="bande-num">{String(i + 1).padStart(2, '0')} · {e.delai}</div>
              <h3>{e.titre}</h3>
              <p>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
