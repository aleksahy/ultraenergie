import { BoutonModale } from './Modales';
import { IllustrationHero } from './Icones';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-texte">
        <div className="surtitre">Mandataire CEE indépendant</div>
        <h1>
          Financez vos travaux d'économies d'énergie avec la{' '}
          <span className="accentue">prime CEE</span>
        </h1>
        <p className="hero-p">
          Nous mettons plusieurs obligés en concurrence pour valoriser vos kWh cumac au meilleur
          niveau, sans jamais porter l'obligation, installer, ni vendre le moindre équipement.
        </p>
        <div className="hero-actions">
          <BoutonModale modale="estimation" className="pilule pilule-encre">Estimer ma prime →</BoutonModale>
          <BoutonModale modale="rappel" className="pilule pilule-accent">Être rappelé →</BoutonModale>
        </div>
      </div>

      {/* ⛔ PC UNIQUEMENT (masquée sous 900px, cf. globals.css) : sur téléphone elle
          repoussait les deux appels à l'action sous la ligne de flottaison. */}
      <div className="hero-illustration">
        <span className="hero-halo hero-halo-1" aria-hidden="true" />
        <span className="hero-halo hero-halo-2" aria-hidden="true" />
        <IllustrationHero />
      </div>
    </section>
  );
}
