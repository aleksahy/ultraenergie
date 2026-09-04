import TeteSection from './TeteSection';
import { IconeEtape } from './Icones';
import { ETAPES } from '@/lib/contenu';

export default function Etapes() {
  return (
    <section id="demarches" className="section">
      <TeteSection surtitre="Démarches">
        Comment obtenir votre <span className="accentue">prime CEE</span> ?
      </TeteSection>
      <div className="etapes">
        {ETAPES.map((e) => (
          <div key={e.titre} className="etape">
            <IconeEtape nom={e.icone} />
            <div className="etape-delai">{e.delai}</div>
            <div className="etape-titre">{e.titre}</div>
            <p className="etape-desc">{e.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
