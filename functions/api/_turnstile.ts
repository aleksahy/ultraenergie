/**
 * Vérification Turnstile (anti-robot de Cloudflare), côté serveur. Le jeton ne s'obtient
 * qu'en exécutant le défi dans un navigateur, sur un domaine autorisé.
 *
 * Reprise de Salons en France (`functions/api/_turnstile.js`, 15/10/2026), sans la « passe
 * de session » (elle sert à un outil conversationnel, pas à un formulaire envoyé une fois).
 * Ce qu'on garde, parce que ça a coûté là-bas :
 *   · l'`action` posée sur le widget est vérifiée : un jeton résolu sur la page Contact ne
 *     vaut pas pour la modale partenaire ;
 *   · le `hostname` rendu par siteverify doit être celui de la requête ;
 *   · une panne de siteverify (réseau, secret absent ou faux, incident Cloudflare) est rendue
 *     à part, pour un 503 « momentanément indisponible » au lieu d'un 403 qui accuserait le
 *     visiteur ; les codes partent au journal (`wrangler pages deployment tail`) ;
 *   · ⛔ sans `TURNSTILE_SECRET_KEY` la porte n'est ouverte qu'en LOCAL (`localhost`,
 *     `127.0.0.1`) : déployé, un secret absent refuse tout, visiblement, au lieu de laisser
 *     entrer le spam en silence. Les deux moitiés se posent ensemble : le secret chez
 *     Cloudflare, la clé publique `NEXT_PUBLIC_TURNSTILE_SITE_KEY` au build (cf. README).
 */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const HOTES_LOCAUX = new Set(['localhost', '127.0.0.1']);
const PANNES = new Set(['internal-error', 'missing-input-secret', 'invalid-input-secret']);

export type Verdict = { ok: true } | { ok: false; indisponible?: true; codes: string[] };

export async function verifierTurnstile(
  env: { TURNSTILE_SECRET_KEY?: string },
  { jeton, ip, action, requete }: { jeton?: string; ip?: string; action: string; requete: Request },
): Promise<Verdict> {
  const hote = new URL(requete.url).hostname;
  const local = HOTES_LOCAUX.has(hote);

  if (!env.TURNSTILE_SECRET_KEY) return local ? { ok: true } : panne(action, ['secret-absent']);
  if (!jeton) return refus(action, ['jeton-absent']);

  const corps = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: jeton });
  if (ip) corps.set('remoteip', ip);
  let d: { success?: boolean; 'error-codes'?: string[]; action?: string; hostname?: string };
  try {
    const r = await fetch(SITEVERIFY, { method: 'POST', body: corps });
    d = ((await r.json()) ?? {}) as typeof d;
  } catch (e) {
    return panne(action, ['siteverify-injoignable:' + String(e instanceof Error ? e.message : e).slice(0, 100)]);
  }
  if (d.success !== true) {
    const codes = (d['error-codes'] ?? ['refus-sans-code']).map(String);
    if (codes.some((c) => PANNES.has(c))) return panne(action, codes);
    return refus(action, codes);
  }
  /* Les clés de test de Cloudflare rendent une action et un hôte fixes : en local on ne juge
     ni l'un ni l'autre. */
  if (local) return { ok: true };
  if (d.action !== action) return refus(action, ['action-inattendue:' + String(d.action).slice(0, 40)]);
  if (d.hostname !== hote) return refus(action, ['hote-inattendu:' + String(d.hostname).slice(0, 80)]);
  return { ok: true };
}

function refus(action: string, codes: string[]): Verdict {
  console.warn('turnstile refuse', action, codes.join(','));
  return { ok: false, codes };
}

/** La vérification elle-même n'a pas pu se faire : ce n'est pas un jugement sur le visiteur. */
function panne(action: string, codes: string[]): Verdict {
  console.warn('turnstile indisponible', action, codes.join(','));
  return { ok: false, indisponible: true, codes };
}

/** Le statut HTTP d'un verdict négatif : 503 quand c'est la vérification qui manque. */
export const statutRefus = (v: { indisponible?: true }) => (v.indisponible ? 503 : 403);

/** Le message d'un verdict négatif. On donne TOUJOURS l'adresse directe : une demande perdue
    coûte plus cher qu'un spam reçu. */
export const messageRefus = (v: { indisponible?: true }, email: string) =>
  v.indisponible
    ? `La vérification anti-robot est momentanément indisponible. Réessayez dans un instant, ou écrivez-nous directement à ${email}.`
    : `La vérification anti-robot a échoué. Réessayez, ou écrivez-nous directement à ${email}.`;
