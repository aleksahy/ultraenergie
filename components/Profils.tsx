import TeteSection from './TeteSection';
import { BoutonModale } from './Modales';
import { PROFILS } from '@/lib/contenu';

export default function Profils() {
  return (
    <section id="profils" className="section">
      <TeteSection surtitre="Votre profil">Qui êtes-vous ?</TeteSection>
      <div className="profils">
        {PROFILS.map((p) => (
          <BoutonModale key={p.titre} modale="estimation" className="carte-profil">
            <span className="carte-profil-titre">{p.titre}</span>
            <span className="carte-profil-desc">{p.desc}</span>
          </BoutonModale>
        ))}
      </div>
    </section>
  );
}
