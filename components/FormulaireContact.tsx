'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useTurnstile, turnstileActif } from '@/lib/turnstile';
import { envoyerFormulaire } from '@/lib/formulaire';
import { url } from '@/lib/routes';
import { Champ } from './Champ';

/**
 * Le formulaire de la page Contact, dans l'ordre d'EBS Énergie : qui vous êtes, puis
 * « 01 Votre demande » (sujet, message), puis « 02 Vos coordonnées ». Il poste à
 * `/api/contact` (functions/api/contact.ts). Téléphone obligatoire (Alek, 15/10/2026).
 */
const PROFILS = ['Installateur', 'Maître d’ouvrage', 'Partenaire : apporteur, obligé, délégataire'];

export default function FormulaireContact() {
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'envoye'>('repos');
  const [erreur, setErreur] = useState('');
  const [jeton, setJeton] = useState('');
  const conteneur = useRef<HTMLDivElement>(null);
  const { reinitialiser } = useTurnstile(conteneur, setJeton, { action: 'contact' });

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setEtat('envoi');
    setErreur('');
    const reponse = await envoyerFormulaire({
      formulaire: 'contact',
      jeton,
      site: d.get('site'),
      profil: d.get('profil'),
      sujet: d.get('sujet'),
      message: d.get('message'),
      prenom: d.get('prenom'),
      nom: d.get('nom'),
      societe: d.get('societe'),
      email: d.get('email'),
      telephone: d.get('telephone'),
    });
    if (reponse.ok) { setEtat('envoye'); return; }
    setErreur(reponse.erreur);
    setEtat('repos');
    reinitialiser();
  }

  if (etat === 'envoye') {
    return <p className="formulaire-merci">Merci, votre message est envoyé. Nous vous répondons par email ou par téléphone.</p>;
  }

  return (
    <form className="formulaire" onSubmit={envoyer}>
      {/* Une liste déroulante, pas des boutons radio (Alek, 15/10/2026). */}
      <Champ label="Vous êtes">
        <select name="profil" defaultValue="" className="champ" required>
          <option value="" disabled>Choisir</option>
          {PROFILS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </Champ>

      <h3 className="contact-etape">01 – Votre demande</h3>
      <Champ label="Sujet"><input className="champ" name="sujet" placeholder="Exemple : un chantier d’isolation à valoriser" maxLength={200} required /></Champ>
      <Champ label="Votre message"><textarea className="champ champ-texte" name="message" rows={5} placeholder="Décrivez votre demande en quelques phrases." minLength={10} required /></Champ>

      <h3 className="contact-etape">02 – Vos coordonnées</h3>
      <div className="champs-deux">
        <Champ label="Prénom"><input className="champ" name="prenom" autoComplete="given-name" required /></Champ>
        <Champ label="Nom"><input className="champ" name="nom" autoComplete="family-name" required /></Champ>
      </div>
      <div className="champs-deux">
        <Champ label="Email"><input className="champ" type="email" name="email" autoComplete="email" required /></Champ>
        <Champ label="Téléphone"><input className="champ" type="tel" name="telephone" autoComplete="tel" required /></Champ>
      </div>
      <Champ label="Société" facultatif><input className="champ" name="societe" autoComplete="organization" /></Champ>

      {/* Piège à robots : hors écran, hors tabulation, jamais rempli par un humain. */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="veille-piege" />
      <div ref={conteneur} className="turnstile" />
      {erreur && <p className="formulaire-erreur" role="alert">{erreur}</p>}
      <button type="submit" className="pilule pilule-accent" disabled={etat === 'envoi' || (turnstileActif && !jeton)}>
        {etat === 'envoi' ? 'Envoi…' : 'Envoyer le message'}
      </button>
      <p className="modale-info">
        Ces informations ne servent qu’à vous répondre. <Link href={url.mentionsLegales}>Mentions légales</Link>.
      </p>
    </form>
  );
}
