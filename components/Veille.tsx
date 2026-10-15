'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

/**
 * Le formulaire de la lettre « Veille CEE ».
 *
 * Deux rendus : `bloc` (la page /veille-cee/, encadré) et `pied` (sous les informations de
 * la société, dans le pied de page, et nulle part ailleurs : Alek, 15/10/2026). ⛔ Aucune
 * ligne sous le formulaire : ni prestataire, ni fréquence, ni lien (Alek, même jour).
 *
 * Le formulaire poste à `/api/newsletter`, une fonction Cloudflare Pages
 * (`functions/api/newsletter.ts`) qui ajoute l'adresse à la liste Brevo. `next dev` ne la
 * sert pas : en local, le bloc affiche l'erreur, c'est attendu. Le `action` est là pour que
 * le formulaire marche encore sans JavaScript.
 */
type Etat = 'repos' | 'envoi' | 'inscrit' | 'erreur';

export default function Veille({ variante = 'bloc' }: { variante?: 'bloc' | 'pied' } = {}) {
  const [etat, setEtat] = useState<Etat>('repos');

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const donnees = new FormData(e.currentTarget);
    setEtat('envoi');
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: donnees.get('email'), site: donnees.get('site') }),
      });
      setEtat(r.ok ? 'inscrit' : 'erreur');
    } catch {
      setEtat('erreur');
    }
  }

  const formulaire = etat === 'inscrit' ? (
    <p className="veille-merci">Merci, votre inscription est enregistrée.</p>
  ) : (
    <form className="veille-form" action="/api/newsletter" method="post" onSubmit={envoyer}>
      <input type="email" name="email" required placeholder="Votre email" aria-label="Votre email" className="veille-champ" />
      {/* Piège à robots : hors écran, hors tabulation, jamais rempli par un humain. */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="veille-piege" />
      <button type="submit" className="pilule pilule-encre veille-bouton" disabled={etat === 'envoi'}>
        {etat === 'envoi' ? 'Envoi…' : 'S’inscrire'}
      </button>
      {etat === 'erreur' && (
        <p className="veille-erreur" role="alert">Inscription impossible pour le moment. Réessayez dans quelques minutes.</p>
      )}
    </form>
  );

  if (variante === 'pied') {
    return (
      <div className="pied-veille">
        <div className="pied-titre pied-titre-suivant">Veille CEE</div>
        <p className="pied-veille-desc">L’actualité réglementaire CEE, chaque semaine.</p>
        {formulaire}
        
      </div>
    );
  }

  return (
    <div id="veille" className="veille">
      {formulaire}
      
    </div>
  );
}
