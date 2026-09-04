import TeteSection from './TeteSection';
import { BoutonModale } from './Modales';

const CARTES = [
  {
    titre: 'Installateurs & artisans RGE',
    desc: 'Contrat de valorisation clair, contrôle de conformité avant dépôt du dossier, paiement sous 30 jours après validation.',
  },
  {
    titre: "Apporteurs d'affaires",
    desc: "Syndics, bureaux d'études, courtiers en énergie, distributeurs : commission sur chaque dossier abouti, aucun montage réglementaire à votre charge.",
  },
];

export default function Partenaires() {
  return (
    <section id="partenaires" className="section">
      <TeteSection surtitre="Partenaires">Valorisez vos chantiers, sans effort réglementaire</TeteSection>
      <div className="partenaires">
        {CARTES.map((c) => (
          <div key={c.titre} className="carte-partenaire">
            <div className="carte-partenaire-titre">{c.titre}</div>
            <p className="carte-partenaire-desc">{c.desc}</p>
            <BoutonModale modale="partenaire" className="pilule pilule-accent">
              Devenir partenaire →
            </BoutonModale>
          </div>
        ))}
      </div>
    </section>
  );
}
