'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as KeyboardEventReact, ReactNode } from 'react';
import Link from 'next/link';
import { url } from '@/lib/routes';

export type Modale = 'estimation' | 'rappel' | 'partenaire';

/** Le second argument transporte le contexte d'ouverture, par exemple le titre de la page. */
const ContexteModales = createContext<(m: Modale, contexte?: string) => void>(() => {});

export function useModales() {
  return useContext(ContexteModales);
}

const TRAVAUX = ['Isolation', 'Chaufferie, pompe à chaleur', 'GTB et régulation', 'Éclairage', 'Ventilation', 'Moteurs et variateurs', 'Récupération de chaleur', 'Autre'];
const CLIENTS = ['Copropriété', 'Bailleur social', 'Collectivité', 'Entreprise ou industriel', 'Autre'];

/**
 * Les trois modales du site (estimation, rappel, partenariat) et le contexte qui permet à
 * n'importe quel bouton de la page de les ouvrir.
 *
 * ⚠️ AUCUN `autoFocus`, ET SURTOUT PAS SUR UN `<select>`. Chrome déroule la liste d’un
 * `<select>` qui reçoit le focus au montage : la modale « Devenir partenaire » s'ouvrait
 * avec son menu « activité » déjà déplié, sans que personne l'ait cliqué. On met le focus
 * sur le panneau lui-même (`tabIndex={-1}`), ce qui amène le lecteur d'écran au bon endroit
 * sans toucher au premier champ.
 *
 * ⚠️ L'ESTIMATION DEMANDE CE QU'UN INSTALLATEUR SAIT DONNER (relecture du 15/10/2026) :
 * société et nom, type de client, travaux, surface ou puissance, code postal du chantier, et
 * surtout si le devis est déjà signé, la seule contrainte répétée sur chaque page. Chaque
 * champ a un libellé visible : un placeholder disparaît dès qu'on tape.
 */
export default function ProviderModales({ children }: { children: ReactNode }) {
  const [ouverte, setOuverte] = useState<Modale | null>(null);
  const [contexte, setContexte] = useState<string | undefined>();
  const ouvrir = useCallback((m: Modale, c?: string) => { setContexte(c); setOuverte(m); }, []);
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
        <Modale titre="Estimer ma prime CEE" sousTitre="Une première estimation sous deux jours ouvrés, sans engagement." fermer={fermer}>
          <input type="hidden" name="origine" value={contexte ?? ''} />
          <div className="champs-deux">
            <Champ label="Société"><input className="champ" name="societe" autoComplete="organization" required /></Champ>
            <Champ label="Votre nom"><input className="champ" name="nom" autoComplete="name" required /></Champ>
          </div>
          <Champ label="Vous êtes">
            <select name="profil" defaultValue="" className="champ" required>
              <option value="" disabled>Choisir</option>
              <option>Installateur / artisan</option>
              <option>Maître d’ouvrage</option>
              <option>Apporteur d’affaires</option>
            </select>
          </Champ>
          <div className="champs-deux">
            <Champ label="Type de travaux">
              <select name="travaux" defaultValue="" className="champ" required>
                <option value="" disabled>Choisir</option>
                {TRAVAUX.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Champ>
            <Champ label="Client final">
              <select name="client" defaultValue="" className="champ">
                <option value="" disabled>Choisir</option>
                {CLIENTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Champ>
          </div>
          <div className="champs-deux">
            <Champ label="Surface ou puissance" facultatif><input className="champ" name="dimension" placeholder="ex. 800 m², 120 kW" /></Champ>
            <Champ label="Code postal du chantier"><input className="champ" name="cp" inputMode="numeric" pattern="[0-9]{5}" required /></Champ>
          </div>
          <Champ label="Le devis est-il déjà signé ?">
            <select name="devis" defaultValue="" className="champ" required>
              <option value="" disabled>Choisir</option>
              <option>Non, pas encore</option>
              <option>Pas encore de devis</option>
              <option>Oui, déjà signé</option>
            </select>
          </Champ>
          <div className="champs-deux">
            <Champ label="Email"><input className="champ" type="email" name="email" autoComplete="email" required /></Champ>
            <Champ label="Téléphone"><input className="champ" type="tel" name="telephone" autoComplete="tel" required /></Champ>
          </div>
          <BoutonEnvoi>Envoyer ma demande</BoutonEnvoi>
        </Modale>
      )}

      {ouverte === 'rappel' && (
        <Modale titre="Être rappelé" fermer={fermer} etroite>
          <Champ label="Votre nom"><input className="champ" name="nom" autoComplete="name" required /></Champ>
          <Champ label="Société" facultatif><input className="champ" name="societe" autoComplete="organization" /></Champ>
          <Champ label="Téléphone"><input className="champ" type="tel" name="telephone" autoComplete="tel" required /></Champ>
          <BoutonEnvoi>Demander à être rappelé</BoutonEnvoi>
        </Modale>
      )}

      {ouverte === 'partenaire' && (
        <Modale
          titre="Devenir partenaire"
          sousTitre="Installateur, apporteur d’affaires, obligé ou délégataire : dites-nous qui vous êtes, nous vous recontactons sous deux jours ouvrés."
          fermer={fermer}
        >
          <Champ label="Votre activité">
            <select name="activite" defaultValue="" className="champ" required>
              <option value="" disabled>Choisir</option>
              <option>Installateur / artisan</option>
              <option>Apporteur d’affaires</option>
              <option>Obligé ou délégataire</option>
            </select>
          </Champ>
          <Champ label="Société"><input className="champ" name="societe" autoComplete="organization" required /></Champ>
          <div className="champs-deux">
            <Champ label="Email"><input className="champ" type="email" name="email" autoComplete="email" required /></Champ>
            <Champ label="Téléphone"><input className="champ" type="tel" name="telephone" autoComplete="tel" required /></Champ>
          </div>
          <BoutonEnvoi>Envoyer</BoutonEnvoi>
        </Modale>
      )}
    </ContexteModales.Provider>
  );
}

/** Un champ avec son libellé visible au-dessus. */
function Champ({ label, facultatif = false, children }: { label: string; facultatif?: boolean; children: ReactNode }) {
  return (
    <label className="champ-bloc">
      <span className="champ-label">{label}{facultatif && <span className="champ-facultatif"> (facultatif)</span>}</span>
      {children}
    </label>
  );
}

function BoutonEnvoi({ children }: { children: ReactNode }) {
  return <button type="submit" className="pilule pilule-accent modale-envoi">{children}</button>;
}

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

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

  /* Le focus reste dans le panneau : Tab boucle sur ses éléments, dans les deux sens. */
  const boucler = (e: KeyboardEventReact<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panneau.current) return;
    const elements = Array.from(panneau.current.querySelectorAll<HTMLElement>(FOCUSABLES));
    if (elements.length === 0) return;
    const premier = elements[0];
    const dernier = elements[elements.length - 1];
    if (e.shiftKey && (document.activeElement === premier || document.activeElement === panneau.current)) {
      e.preventDefault(); dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault(); premier.focus();
    }
  };

  return (
    <div className="modale-voile" onMouseDown={(e) => { if (e.target === e.currentTarget) fermer(); }}>
      <div
        className={`modale${etroite ? ' modale-etroite' : ''}`}
        ref={panneau}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        onKeyDown={boucler}
      >
        <button type="button" className="modale-croix" onClick={fermer} aria-label="Fermer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="modale-titre">{titre}</div>
        {sousTitre && <div className="modale-soustitre">{sousTitre}</div>}

        {envoye ? (
          /* Pas de backend à ce stade : le formulaire ne part nulle part. Il accuse
             quand même réception, sinon l'envoi ne produit rien du tout à l'écran. */
          <p className="modale-merci">
            Merci. Nous revenons vers vous sous deux jours ouvrés.
          </p>
        ) : (
          <form className="modale-form" onSubmit={(e) => { e.preventDefault(); setEnvoye(true); }}>
            {children}
            {/* L'information due au moment de la collecte (article 13 du RGPD). */}
            <p className="modale-info">
              Ces informations ne servent qu’à vous répondre. <Link href={url.mentionsLegales}>Mentions légales</Link>.
            </p>
          </form>
        )}

        <button type="button" className="modale-fermer" onClick={fermer}>Fermer</button>
      </div>
    </div>
  );
}

/** Un bouton de la page qui ouvre une modale. */
export function BoutonModale({
  modale, className, contexte, children,
}: {
  modale: Modale;
  className?: string;
  /** Transmis à la modale : le titre de la page depuis laquelle on part, par exemple. */
  contexte?: string;
  children: ReactNode;
}) {
  const ouvrir = useModales();
  return (
    <button type="button" className={className} onClick={() => ouvrir(modale, contexte)}>
      {children}
    </button>
  );
}
