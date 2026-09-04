'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type Modale = 'estimation' | 'rappel' | 'partenaire';

const ContexteModales = createContext<(m: Modale) => void>(() => {});

export function useModales() {
  return useContext(ContexteModales);
}

/**
 * Les trois modales du site (estimation, rappel, partenariat) et le contexte qui permet à
 * n'importe quel bouton de la page de les ouvrir.
 *
 * ⚠️ AUCUN `autoFocus`, ET SURTOUT PAS SUR UN `<select>`. Chrome déroule la liste d'un
 * `<select>` qui reçoit le focus au montage : la modale « Devenir partenaire » s'ouvrait
 * avec son menu « activité » déjà déplié, sans que personne l'ait cliqué. On met le focus
 * sur le panneau lui-même (`tabIndex={-1}`), ce qui amène le lecteur d'écran au bon endroit
 * sans toucher au premier champ.
 */
export default function ProviderModales({ children }: { children: ReactNode }) {
  const [ouverte, setOuverte] = useState<Modale | null>(null);
  const ouvrir = useCallback((m: Modale) => setOuverte(m), []);
  const fermer = useCallback(() => setOuverte(null), []);

  useEffect(() => {
    if (!ouverte) return;
    const auClavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fermer();
    };
    document.addEventListener('keydown', auClavier);
    return () => document.removeEventListener('keydown', auClavier);
  }, [ouverte, fermer]);

  return (
    <ContexteModales.Provider value={ouvrir}>
      {children}

      {ouverte === 'estimation' && (
        <Modale titre="Estimer ma prime CEE" sousTitre="Réponse sous 48h, sans engagement." fermer={fermer}>
          <select name="profil" defaultValue="" className="champ">
            <option value="" disabled>Vous êtes…</option>
            <option>Maître d'ouvrage</option>
            <option>Installateur / artisan</option>
            <option>Apporteur d'affaires</option>
          </select>
          <input className="champ" name="travaux" placeholder="Type de travaux" required />
          <input className="champ" name="localisation" placeholder="Localisation" required />
          <input className="champ" type="email" name="email" placeholder="Email" required />
          <input className="champ" type="tel" name="telephone" placeholder="Téléphone" required />
          <BoutonEnvoi>Envoyer ma demande →</BoutonEnvoi>
        </Modale>
      )}

      {ouverte === 'rappel' && (
        <Modale titre="Être rappelé" fermer={fermer} etroite>
          <input className="champ" name="nom" placeholder="Nom" required />
          <input className="champ" type="tel" name="telephone" placeholder="Téléphone" required />
          <BoutonEnvoi>Demander à être rappelé →</BoutonEnvoi>
        </Modale>
      )}

      {ouverte === 'partenaire' && (
        <Modale
          titre="Devenir partenaire"
          sousTitre="Installateur RGE ou apporteur d'affaires ; nous vous recontactons sous 48h."
          fermer={fermer}
        >
          <select name="activite" defaultValue="" className="champ">
            <option value="" disabled>Votre activité…</option>
            <option>Installateur / artisan RGE</option>
            <option>Apporteur d'affaires</option>
          </select>
          <input className="champ" name="societe" placeholder="Société" required />
          <input className="champ" type="email" name="email" placeholder="Email" required />
          <input className="champ" type="tel" name="telephone" placeholder="Téléphone" required />
          <BoutonEnvoi>Envoyer →</BoutonEnvoi>
        </Modale>
      )}
    </ContexteModales.Provider>
  );
}

function BoutonEnvoi({ children }: { children: ReactNode }) {
  return <button type="submit" className="pilule pilule-accent modale-envoi">{children}</button>;
}

function Modale({
  titre, sousTitre, children, fermer, etroite = false,
}: {
  titre: string;
  sousTitre?: string;
  children: ReactNode;
  fermer: () => void;
  etroite?: boolean;
}) {
  const panneau = useRef<HTMLDivElement>(null);
  const [envoye, setEnvoye] = useState(false);

  useEffect(() => { panneau.current?.focus(); }, []);

  return (
    <div className="modale-voile" onMouseDown={(e) => { if (e.target === e.currentTarget) fermer(); }}>
      <div
        className={`modale${etroite ? ' modale-etroite' : ''}`}
        ref={panneau}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
      >
        <div className="modale-titre">{titre}</div>
        {sousTitre && <div className="modale-soustitre">{sousTitre}</div>}

        {envoye ? (
          /* Pas de backend à ce stade : le formulaire ne part nulle part. Il accuse
             quand même réception, sinon l'envoi ne produit rien du tout à l'écran. */
          <p className="modale-merci">
            Merci, votre demande est enregistrée. Nous revenons vers vous sous 48h.
          </p>
        ) : (
          <form className="modale-form" onSubmit={(e) => { e.preventDefault(); setEnvoye(true); }}>
            {children}
          </form>
        )}

        <button type="button" className="modale-fermer" onClick={fermer}>Fermer</button>
      </div>
    </div>
  );
}

/** Un bouton de la page qui ouvre une modale. */
export function BoutonModale({
  modale, className, children,
}: {
  modale: Modale;
  className?: string;
  children: ReactNode;
}) {
  const ouvrir = useModales();
  return (
    <button type="button" className={className} onClick={() => ouvrir(modale)}>
      {children}
    </button>
  );
}
