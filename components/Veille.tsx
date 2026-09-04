'use client';

import { useState } from 'react';

/**
 * Le bloc « Veille CEE ».
 *
 * ⚠️ SON ESPACE AU-DESSUS EST CELUI QUI LE SÉPARE DE LA FAQ. Les deux valent
 * `--espace-veille` : la section Ressources coupe son propre `padding-bottom` et la FAQ
 * reprend la même variable en `padding-top`. Écrire un `margin-top` au jugé ici et un
 * `padding` ailleurs, c'est se condamner à les désaccorder au premier ajustement.
 */
export default function Veille() {
  const [inscrit, setInscrit] = useState(false);

  return (
    <div id="veille" className="veille">
      <div className="veille-texte">
        <div className="veille-titre">Veille CEE</div>
        <div className="veille-desc">L'actualité réglementaire CEE, une fois par mois.</div>
      </div>
      {inscrit ? (
        <p className="veille-merci">Merci, votre inscription est enregistrée.</p>
      ) : (
        <form className="veille-form" onSubmit={(e) => { e.preventDefault(); setInscrit(true); }}>
          <input type="email" required placeholder="Votre email" aria-label="Votre email" className="veille-champ" />
          <button type="submit" className="pilule pilule-encre veille-bouton">S'inscrire</button>
        </form>
      )}
    </div>
  );
}
