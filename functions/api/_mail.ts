/**
 * L'envoi transactionnel Brevo (`/v3/smtp/email`), en un seul endroit.
 *
 * ⚠️ NE PAS CONFONDRE AVEC `newsletter.ts`, qui gère l'appartenance à la liste de la lettre
 * (`/v3/contacts`) : deux endpoints, deux régimes d'erreur, deux fichiers.
 *
 * Repris de Salons en France (`lib/mail-brevo.ts`, 15/10/2026), où quatre copies de cet appel
 * avaient divergé et où aucune n'avait de délai ni de reprise : un 429 de Brevo perdait le
 * message en silence. Ici : un délai par tentative, une reprise sur ce qui peut réussir la
 * fois suivante (réseau, 429, 5xx), et jamais sur un 400 ou un 401.
 *
 * 🚨 CE MODULE JETTE, TOUJOURS. Seul l'appelant sait ce qu'une panne d'envoi doit produire ;
 * qui veut un booléen écrit `.then(() => true, () => false)`.
 *
 * ⚠️ L'EXPÉDITEUR DOIT ÊTRE VALIDÉ CHEZ BREVO (adresse ou domaine authentifié), sinon Brevo
 * répond 400 et rien ne part. C'est `contact@ultraenergie.fr`, à faire valider par Alek.
 */
import { COORDONNEES } from '../../lib/contenu';

export interface Destinataire {
  email: string;
  nom?: string;
}

export interface Mail {
  a: Destinataire | Destinataire[];
  sujet: string;
  html: string;
  texte?: string;
  expediteur?: Destinataire;
  /** L'adresse à laquelle répondre, quand elle diffère de l'expéditeur : celle du visiteur. */
  repondreA?: Destinataire;
}

export class ErreurMailBrevo extends Error {
  constructor(readonly statut: number, corps = '') {
    super(`Brevo smtp/email ${statut}${corps ? ` : ${corps.slice(0, 200)}` : ''}`);
    this.name = 'ErreurMailBrevo';
  }
}

const EXPEDITEUR_PAR_DEFAUT: Destinataire = { email: COORDONNEES.email, nom: 'Ultra Énergie' };

const contact = (d: Destinataire) => (d.nom ? { email: d.email, name: d.nom } : { email: d.email });
const reprenable = (statut: number) => statut === 429 || statut >= 500;
const attends = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function envoieMail(
  env: { BREVO_API_KEY?: string },
  mail: Mail,
  { essais = 2, delaiMs = 5000, attenteMs = 400 } = {},
): Promise<void> {
  if (!env.BREVO_API_KEY) throw new ErreurMailBrevo(0, 'BREVO_API_KEY absente');

  const corps = JSON.stringify({
    to: (Array.isArray(mail.a) ? mail.a : [mail.a]).map(contact),
    sender: contact(mail.expediteur ?? EXPEDITEUR_PAR_DEFAUT),
    ...(mail.repondreA ? { replyTo: contact(mail.repondreA) } : {}),
    subject: mail.sujet,
    htmlContent: mail.html,
    ...(mail.texte ? { textContent: mail.texte } : {}),
  });

  let derniere: Error = new ErreurMailBrevo(0, 'aucune tentative');
  for (let essai = 1; essai <= Math.max(1, essais); essai++) {
    if (essai > 1) await attends(attenteMs * 2 ** (essai - 2));
    let reponse: Response;
    try {
      reponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
        body: corps,
        signal: AbortSignal.timeout(delaiMs),
      });
    } catch (e) {
      derniere = e instanceof Error ? e : new Error(String(e));
      continue;
    }
    // `fetch` ne rejette pas sur un statut d'erreur : Brevo rend 201 sur un envoi accepté.
    if (reponse.ok) return;
    const echec = new ErreurMailBrevo(reponse.status, await reponse.text().catch(() => ''));
    if (!reprenable(reponse.status)) throw echec;
    derniere = echec;
  }
  throw derniere;
}
