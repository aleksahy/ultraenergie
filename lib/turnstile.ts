'use client';

/**
 * Le cycle de vie du widget Turnstile côté navigateur : chargement du script, rendu, jeton.
 * Repris de Salons en France (`lib/turnstile.ts`, 15/10/2026) sans ses goals d'analytique.
 *
 * ⚠️ SANS CLÉ PUBLIQUE, RIEN NE SE REND ET RIEN NE BLOQUE. `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 * est figée au BUILD : absente au moment de construire, aucun jeton n'est produit, alors que
 * côté serveur la vérification échoue FERMÉ partout sauf en local (`functions/api/_turnstile.ts`).
 * Les deux moitiés se posent ensemble, ou tout formulaire devient impossible une fois déployé.
 *
 * ⚠️ LE WIDGET EST VISIBLE (`appearance: 'always'`). En mode caché, un défi interactif
 * n'apparaissait qu'au clic sur Envoyer et les formulaires paraissaient en panne.
 */
import { useCallback, useEffect, useRef, type RefObject } from 'react';

const CLE_PUBLIQUE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** `true` quand le site est configuré, donc quand le serveur attend un jeton. */
export const turnstileActif = Boolean(CLE_PUBLIQUE);

const ID_SCRIPT = 'cf-turnstile-script';
const URL_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const DELAI_CHARGEMENT_MS = 8000;

/** Le nom du formulaire, posé en `action` sur le widget et VÉRIFIÉ par la fonction : même
    mot des deux côtés (`functions/api/contact.ts`). */
export type ActionTurnstile = 'contact' | 'partenaire';

interface ApiTurnstile {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
}

const api = () => (window as unknown as { turnstile?: ApiTurnstile }).turnstile;

function baliseScript(): HTMLScriptElement {
  let script = document.getElementById(ID_SCRIPT) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = ID_SCRIPT;
    script.src = URL_SCRIPT;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
  return script;
}

function messageIndisponible() {
  const p = document.createElement('p');
  p.className = 'turnstile-indisponible';
  p.textContent = 'La vérification anti-robot n’a pas pu se charger. Un bloqueur de publicité peut en être la cause : autorisez ce site, puis rechargez la page.';
  return p;
}

/**
 * Monte le widget dans `conteneur` et appelle `surJeton` à chaque changement : jeton frais, ou
 * chaîne vide quand il expire, échoue ou se retire. `actif: false` tant que le conteneur n'est
 * pas affiché (la modale fermée, le formulaire de contact pas encore atteint).
 *
 * Rend `reinitialiser`, à appeler après chaque envoi : un jeton est à usage unique.
 */
export function useTurnstile(
  conteneur: RefObject<HTMLElement | null>,
  surJeton: (jeton: string) => void,
  { action, actif = true }: { action: ActionTurnstile; actif?: boolean },
) {
  const widget = useRef<string | null>(null);
  /* Le rappel passe par une référence mise à jour dans un effet : en dépendance de l'effet,
     il remonterait le widget à chaque rendu du parent, donc un nouveau défi à chaque frappe. */
  const rappel = useRef(surJeton);
  useEffect(() => { rappel.current = surJeton; });

  useEffect(() => {
    if (!CLE_PUBLIQUE || !actif) return;
    let minuterie: number | undefined;
    let script: HTMLScriptElement | null = null;

    const indisponible = () => {
      window.clearTimeout(minuterie);
      if (widget.current || !conteneur.current) return;
      conteneur.current.replaceChildren(messageIndisponible());
    };

    const rendre = () => {
      const t = api();
      if (!t || !conteneur.current || widget.current) return;
      window.clearTimeout(minuterie);
      conteneur.current.replaceChildren();
      widget.current = t.render(conteneur.current, {
        sitekey: CLE_PUBLIQUE,
        action,
        appearance: 'always',
        /* `flexible` ne descend pas sous 300px : en dessous, le format `compact`. */
        size: conteneur.current.clientWidth >= 300 ? 'flexible' : 'compact',
        theme: 'light',
        language: 'fr',
        'refresh-expired': 'auto',
        callback: (jeton: string) => rappel.current(jeton),
        'expired-callback': () => rappel.current(''),
        'error-callback': () => rappel.current(''),
        'timeout-callback': () => rappel.current(''),
      });
    };

    /* Une balise en échec se retire : laissée en place, elle ne recharge jamais. */
    const scriptEnEchec = () => { script?.remove(); indisponible(); };

    if (api()) {
      rendre();
    } else {
      script = baliseScript();
      script.addEventListener('load', rendre);
      script.addEventListener('error', scriptEnEchec);
      minuterie = window.setTimeout(indisponible, DELAI_CHARGEMENT_MS);
    }

    return () => {
      window.clearTimeout(minuterie);
      script?.removeEventListener('load', rendre);
      script?.removeEventListener('error', scriptEnEchec);
      /* `remove`, pas seulement le démontage : Cloudflare garde le widget dans son registre, et
         un widget orphelin rappellerait `expired-callback` sur le composant resté monté. */
      const t = api();
      if (t && widget.current) {
        try { t.remove(widget.current); } catch { /* déjà détruit */ }
      }
      widget.current = null;
      rappel.current('');
    };
  }, [conteneur, action, actif]);

  const reinitialiser = useCallback(() => {
    const t = api();
    rappel.current('');
    if (t && widget.current) t.reset(widget.current);
  }, []);

  return { reinitialiser };
}
