'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent as KeyboardEventReact, ReactNode } from 'react';
import Link from 'next/link';
import { url } from '@/lib/routes';
import { useTurnstile, turnstileActif } from '@/lib/turnstile';
import { envoyerFormulaire } from '@/lib/formulaire';
import { Champ } from './Champ';

/**
 * ⛔ UNE SEULE MODALE DEPUIS LE 15/10/2026 : « Devenir partenaire ». Les modales « Estimer ma
 * prime » et « Être rappelé » sont parties : tout mène à la page Contact. Le type `Modale`
 * ne connaît donc que `partenaire`.
 */
export type Modale = 'partenaire';

/** Le second argument transporte le contexte d'ouverture, par exemple le titre de la page. */
const ContexteModales = createContext<(m: Modale, contexte?: string) => void>(() => {});

export function useModales() {
  return useContext(ContexteModales);
}

const ACTIVITES = ['Installateur / artisan', 'Apporteur d’affaires', 'Obligé ou délégataire'];

/**
 * La modale et le contexte qui permet à n'importe quel bouton de la page de l'ouvrir.
 *
 * ⚠️ AUCUN `autoFocus`, ET SURTOUT PAS SUR UN `<select>`. Chrome déroule la liste d’un
 * `<select>` qui reçoit le focus au montage : la modale s'ouvrait avec son menu « activité »
 * déjà déplié. Le focus va sur le panneau lui-même (`tabIndex={-1}`).
 *
 * Le formulaire poste à `/api/contact` (functions/api/contact.ts) avec un jeton Turnstile ;
 * `next dev` ne sert pas la fonction, en local l'envoi affiche l'erreur, c'est attendu.
 */
export default function ProviderModales({ children }: { children: ReactNode }) {
  const [ouverte, setOuverte] = useState<Modale | null>(null);
  const [contexte, setContexte] = useState<string | undefined>();
  const ouvrir = useCallback((m: Modale, c?: string) => { setContexte(c); setOuverte(m); }, []);
  const fermer = useCallback(() => setOuverte(null), []);

  useEffect(() => {
    if (!ouverte) return;
    const auClavier = (e: KeyboardEvent) => { if (e.key === 'Escape') fermer(); };
    document.addEventListener('keydown', auClavier);
    return () => document.removeEventListener('keydown', auClavier);
  }, [ouverte, fermer]);

  return (
    <ContexteModales.Provider value={ouvrir}>
      {children}
      {ouverte === 'partenaire' && <ModalePartenaire contexte={contexte} fermer={fermer} />}
    </ContexteModales.Provider>
  );
}

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

function ModalePartenaire({ contexte, fermer }: { contexte?: string; fermer: () => void }) {
  const panneau = useRef<HTMLDivElement>(null);
  const conteneur = useRef<HTMLDivElement>(null);
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'envoye'>('repos');
  const [erreur, setErreur] = useState('');
  const [jeton, setJeton] = useState('');
  const { reinitialiser } = useTurnstile(conteneur, setJeton, { action: 'partenaire' });

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

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setEtat('envoi');
    setErreur('');
    const reponse = await envoyerFormulaire({
      formulaire: 'partenaire',
      jeton,
      site: d.get('site'),
      activite: d.get('activite'),
      societe: d.get('societe'),
      email: d.get('email'),
      telephone: d.get('telephone'),
      origine: contexte ?? '',
    });
    if (reponse.ok) { setEtat('envoye'); return; }
    setErreur(reponse.erreur);
    setEtat('repos');
    reinitialiser();
  }

  return (
    <div className="modale-voile" onMouseDown={(e) => { if (e.target === e.currentTarget) fermer(); }}>
      <div className="modale" ref={panneau} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Devenir partenaire" onKeyDown={boucler}>
        <button type="button" className="modale-croix" onClick={fermer} aria-label="Fermer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="modale-titre">Devenir partenaire</div>
        <div className="modale-soustitre">Installateur, apporteur d’affaires, obligé ou délégataire : dites-nous qui vous êtes, nous vous recontactons.</div>

        {etat === 'envoye' ? (
          <p className="modale-merci">Merci, votre demande est envoyée. Nous revenons vers vous.</p>
        ) : (
          <form className="modale-form" onSubmit={envoyer}>
            <Champ label="Votre activité">
              <select name="activite" defaultValue="" className="champ" required>
                <option value="" disabled>Choisir</option>
                {ACTIVITES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </Champ>
            <Champ label="Société"><input className="champ" name="societe" autoComplete="organization" required /></Champ>
            <div className="champs-deux">
              <Champ label="Email"><input className="champ" type="email" name="email" autoComplete="email" required /></Champ>
              <Champ label="Téléphone"><input className="champ" type="tel" name="telephone" autoComplete="tel" required /></Champ>
            </div>
            {/* Piège à robots : hors écran, hors tabulation, jamais rempli par un humain. */}
            <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="veille-piege" />
            <div ref={conteneur} className="turnstile" />
            {erreur && <p className="formulaire-erreur" role="alert">{erreur}</p>}
            <button type="submit" className="pilule pilule-accent modale-envoi" disabled={etat === 'envoi' || (turnstileActif && !jeton)}>
              {etat === 'envoi' ? 'Envoi…' : 'Envoyer'}
            </button>
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
