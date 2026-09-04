import TeteSection from './TeteSection';
import { IconeTravaux } from './Icones';
import { TRAVAUX } from '@/lib/contenu';

export default function Travaux() {
  return (
    <section id="travaux" className="section">
      <TeteSection surtitre="Fiches CEE">
        Travaux éligibles aux <span className="accentue">CEE</span>
      </TeteSection>
      <div className="travaux">
        {TRAVAUX.map((t) => (
          <a key={t.titre} href="#travaux" className="travail">
            <IconeTravaux nom={t.icone} />
            <div className="travail-titre">{t.titre}</div>
            <div className="travail-desc">{t.desc}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
