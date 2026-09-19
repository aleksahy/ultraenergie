import TeteSection from './TeteSection';
import ListeEtapes from './ListeEtapes';
import { ETAPES } from '@/lib/contenu';

export default function Etapes() {
  return (
    <section id="demarches" className="section">
      <TeteSection surtitre="Démarches">
        Comment obtenir votre <span className="accentue">prime CEE</span> ?
      </TeteSection>
      <ListeEtapes etapes={ETAPES} />
    </section>
  );
}
