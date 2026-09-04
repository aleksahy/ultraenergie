import { BoutonModale } from './Modales';

export default function AppelFinal() {
  return (
    <section className="appel-final">
      <h2>Prêt à financer vos travaux au meilleur niveau de prime ?</h2>
      <div className="appel-final-actions">
        <BoutonModale modale="estimation" className="pilule pilule-encre">Estimer ma prime →</BoutonModale>
        <BoutonModale modale="partenaire" className="pilule pilule-blanc">Devenir partenaire →</BoutonModale>
      </div>
    </section>
  );
}
