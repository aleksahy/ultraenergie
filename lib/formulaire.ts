/**
 * L'envoi d'un formulaire du site vers `/api/contact` (functions/api/contact.ts), côté
 * navigateur. Un seul exemplaire du `fetch` et de la lecture d'erreur, pour les deux
 * formulaires (page Contact, modale partenaire).
 *
 * ⚠️ `next dev` ne sert pas les fonctions : en local sans wrangler, l'envoi répond 404 et le
 * formulaire affiche l'erreur. C'est attendu (cf. README, « Formulaires »).
 */
import { COORDONNEES } from './contenu';

export type Resultat = { ok: true } | { ok: false; erreur: string };

export const ERREUR_RESEAU = `Impossible de joindre le serveur. Réessayez, ou écrivez-nous directement à ${COORDONNEES.email}.`;

export async function envoyerFormulaire(corps: Record<string, unknown>): Promise<Resultat> {
  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps),
    });
    if (r.ok) return { ok: true };
    const d = (await r.json().catch(() => ({}))) as { erreur?: string };
    return { ok: false, erreur: d.erreur ?? `Envoi impossible pour le moment. Écrivez-nous à ${COORDONNEES.email}.` };
  } catch {
    return { ok: false, erreur: ERREUR_RESEAU };
  }
}
