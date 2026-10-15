import TeteSection from './TeteSection';
import ListeFaq from './ListeFaq';
import { FAQ_ACCUEIL } from '@/lib/contenu';

/** Cinq questions sur le dispositif, du plus général à la valorisation (liste d'Alek). */
export default function QuestionsAccueil() {
  return (
    <section id="questions" className="section est-centree">
      <TeteSection surtitre="Questions fréquentes">Cinq questions sur les CEE</TeteSection>
      <ListeFaq items={FAQ_ACCUEIL} />
    </section>
  );
}
