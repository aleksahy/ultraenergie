import TeteSection from './TeteSection';
import ListeFaq from './ListeFaq';
import { FAQ } from '@/lib/contenu';

export default function Faq() {
  return (
    <section id="faq" className="section section-faq">
      <TeteSection surtitre="Questions fréquentes">FAQ</TeteSection>
      <ListeFaq items={FAQ} />
    </section>
  );
}
