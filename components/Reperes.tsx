import { IconeCoche } from './Icones';
import { REPERES } from '@/lib/contenu';

/** Les trois repères sur une ligne, juste sous la photo du héros. */
export default function Reperes() {
  return (
    <div className="reperes">
      <div className="reperes-inner">
        {REPERES.map((r) => (
          <div key={r.titre} className="repere">
            <IconeCoche />
            <div>
              <strong>{r.titre}</strong>
              <span>{r.texte}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
