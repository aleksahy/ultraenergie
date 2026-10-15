/**
 * POST /api/contact : les deux formulaires du site (la page Contact et la modale « Devenir
 * partenaire ») arrivent ici et repartent en un mail vers contact@, avec `Reply-To` sur le
 * visiteur. Piège à robots, Turnstile, champs bornés.
 *
 * ⚠️ C'EST UNE FONCTION CLOUDFLARE PAGES, PAS DU NEXT (cf. newsletter.ts) : `next dev` ne la
 * sert pas. En local : `npm run build`, puis `npx wrangler pages dev out`, avec `.dev.vars`.
 *
 * Un seul point d'entrée, discriminé par `formulaire` : même destination, même porte, même
 * mail. Chacun a son `action` Turnstile (le même mot des deux côtés) et sa liste de lignes.
 * (Le simulateur, troisième formulaire pendant quelques heures le 15/10/2026, a été retiré
 * en attendant le cœur du site.)
 *
 * Variables du projet Cloudflare : `BREVO_API_KEY` (déjà posée pour la lettre) et
 * `TURNSTILE_SECRET_KEY` (à poser ; sans elle, refus partout sauf en local).
 */
import { COORDONNEES } from '../../lib/contenu';
import { json, cleanStr, corpsMail, adresseValide, MESSAGE_ADRESSE_INVALIDE, sansSecret } from './_formulaire';
import { verifierTurnstile, statutRefus, messageRefus } from './_turnstile';
import { envoieMail } from './_mail';

interface Env {
  BREVO_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

type Corps = Record<string, unknown>;
type Formulaire = 'contact' | 'partenaire';
const FORMULAIRES: Formulaire[] = ['contact', 'partenaire'];

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  const ip = request.headers.get('CF-Connecting-IP') ?? '';

  let corps: Corps;
  try {
    const brut: unknown = await request.json();
    /* ⚠️ `JSON.parse('null')` ne jette pas : un corps `null` traverserait le `try`. */
    if (typeof brut !== 'object' || brut === null) return json({ erreur: 'Corps JSON attendu.' }, 400);
    corps = brut as Corps;
  } catch {
    return json({ erreur: 'Corps JSON attendu.' }, 400);
  }

  // Un robot a rempli le piège : on dit oui et on ne fait rien.
  if (cleanStr(corps.site, 10)) return json({ ok: true }, 200);

  const formulaire = cleanStr(corps.formulaire, 20) as Formulaire;
  if (!FORMULAIRES.includes(formulaire)) return json({ erreur: 'Formulaire inconnu.' }, 400);

  const verdict = await verifierTurnstile(env, { jeton: cleanStr(corps.jeton, 4000), ip, action: formulaire, requete: request });
  if (!verdict.ok) return json({ erreur: messageRefus(verdict, COORDONNEES.email) }, statutRefus(verdict));

  const email = corps.email;
  if (!adresseValide(email)) return json({ erreur: MESSAGE_ADRESSE_INVALIDE }, 400);
  const societe = cleanStr(corps.societe, 200);
  const telephone = cleanStr(corps.telephone, 40);

  let sujet = '';
  let lignes: [string, string][] = [];
  let bloc: { titre: string; texte: string } | null = null;
  let nomComplet = '';

  if (formulaire === 'contact') {
    const prenom = cleanStr(corps.prenom, 100);
    const nom = cleanStr(corps.nom, 100);
    const objet = cleanStr(corps.sujet, 200);
    const message = cleanStr(corps.message, 5000);
    if (nom.length < 2) return json({ erreur: 'Merci d’indiquer votre nom.' }, 400);
    if (!telephone) return json({ erreur: 'Merci d’indiquer un numéro de téléphone.' }, 400);
    if (message.length < 10) return json({ erreur: 'Votre message est trop court.' }, 400);
    nomComplet = [prenom, nom].filter(Boolean).join(' ');
    lignes = [
      ['Profil', cleanStr(corps.profil, 80)],
      ['Sujet', objet],
      ['Prénom', prenom],
      ['Nom', nom],
      ['Société', societe],
      ['Email', email.trim()],
      ['Téléphone', telephone],
    ];
    bloc = { titre: 'Message', texte: message };
    sujet = `[Contact] ${objet || 'Message'} (${nomComplet})`;
  } else {
    const activite = cleanStr(corps.activite, 60);
    if (!activite || !societe) return json({ erreur: 'Activité et société sont nécessaires.' }, 400);
    nomComplet = societe;
    lignes = [
      ['Activité', activite],
      ['Société', societe],
      ['Email', email.trim()],
      ['Téléphone', telephone],
      ['Page d’origine', cleanStr(corps.origine, 120)],
    ];
    sujet = `[Partenaire] ${activite} (${societe})`;
  }

  const { html, texte } = corpsMail(lignes.filter(([, v]) => v), bloc);
  try {
    await envoieMail(env, {
      a: { email: COORDONNEES.email },
      repondreA: { email: email.trim(), nom: nomComplet || undefined },
      sujet,
      html,
      texte,
    });
  } catch (e) {
    console.error('[contact] envoi impossible', sansSecret(e));
    return json({ erreur: `Envoi impossible pour le moment. Écrivez-nous directement à ${COORDONNEES.email}.` }, 502);
  }
  return json({ ok: true }, 200);
};
