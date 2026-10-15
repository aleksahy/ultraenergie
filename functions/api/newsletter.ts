/**
 * Inscription à la lettre « Veille CEE » : le formulaire du site poste ici, et cette fonction
 * ajoute l'adresse à la liste Brevo.
 *
 * ⚠️ C'EST UNE FONCTION CLOUDFLARE PAGES, PAS DU NEXT. Le site est un export statique :
 * `functions/` est le seul code qui s'exécute côté serveur, et Cloudflare le déploie avec
 * `out/`. `next dev` ne la sert pas. Pour l'essayer en local : `npm run build`, puis
 * `npx wrangler pages dev out`, avec un fichier `.dev.vars` (non versionné) qui porte les
 * deux variables.
 *
 * ⛔ LA CLÉ BREVO NE VA JAMAIS DANS LE NAVIGATEUR. Elle vit dans les variables du projet
 * Cloudflare Pages : `BREVO_API_KEY` (secret) et `BREVO_LIST_ID` (l'identifiant numérique de
 * la liste, choix d'Alek du 14/10/2026 : en variable plutôt qu'en dur, pour changer de liste
 * sans redéployer). Sans l'une ou l'autre, la fonction répond 503 et le formulaire affiche
 * l'erreur.
 *
 * Pas de double opt-in ni de mail de confirmation : décision du 14/10/2026, on collecte.
 * Le champ `site` est un piège à robots : un humain ne le voit pas et le laisse vide.
 */
import { json, adresseValide, MESSAGE_ADRESSE_INVALIDE } from './_formulaire';

interface Env {
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
}

/* La réponse JSON et la validation d'adresse sont celles de `_formulaire.ts`, partagées avec
   `/api/contact` : une règle recopiée finit par diverger (leçon de Salons en France). */
const reponse = (status: number, corps: Record<string, unknown>) => json(corps, status);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!env.BREVO_API_KEY || !/^\d+$/.test(env.BREVO_LIST_ID ?? '')) {
    return reponse(503, { erreur: 'Lettre non configurée.' });
  }

  let email = '';
  let piege = '';
  try {
    const type = request.headers.get('content-type') ?? '';
    if (type.includes('application/json')) {
      const corps = (await request.json()) as { email?: unknown; site?: unknown };
      email = String(corps.email ?? '');
      piege = String(corps.site ?? '');
    } else {
      const corps = await request.formData();
      email = String(corps.get('email') ?? '');
      piege = String(corps.get('site') ?? '');
    }
  } catch {
    return reponse(400, { erreur: 'Corps illisible.' });
  }

  // Un robot a rempli le piège : on dit oui et on ne fait rien.
  if (piege) return reponse(200, { ok: true });

  email = email.trim().toLowerCase();
  if (!adresseValide(email)) return reponse(400, { erreur: MESSAGE_ADRESSE_INVALIDE });

  const brevo = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, listIds: [Number(env.BREVO_LIST_ID)], updateEnabled: true }),
  });

  // 201 : contact créé. 204 : il existait, et `updateEnabled` l'a ajouté à la liste.
  if (brevo.status === 201 || brevo.status === 204) return reponse(200, { ok: true });

  const detail = await brevo.text().catch(() => '');
  console.error(`Brevo ${brevo.status} : ${detail.slice(0, 300)}`);
  return reponse(502, { erreur: 'Inscription impossible pour le moment.' });
};
