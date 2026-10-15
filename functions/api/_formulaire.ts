/**
 * Ce que les formulaires du site ont en commun : la réponse JSON, la coupe d'un champ, le
 * corps d'un mail, la validation d'adresse et le journal sans secret.
 *
 * Repris de Salons en France (`functions/api/_form.js`, `_email.js`, `lib/journal.ts`) le
 * 15/10/2026, demande d'Alek : « tu gardes le meilleur et tu jettes le mauvais ». Gardé : un
 * seul exemplaire de chaque règle (là-bas, trois copies de la validation d'adresse avaient
 * divergé), la borne OBLIGATOIRE de `cleanStr` (un champ non borné partait entier dans un
 * en-tête de mail), le corps de mail échappé en un seul endroit. Jeté : le CRM Notion, la
 * base Neon, la transmission à un tiers, les goals d'analytique, le limiteur par IP (il
 * demande un espace KV que ce projet n'a pas ; le piège à robots et Turnstile font la porte).
 */

const ENTETES = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

/** Réponse JSON nue. Toutes les réponses des formulaires passent par là. */
export const json = (corps: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(corps), { status, headers: ENTETES });

/** Échappement des quatre caractères qui comptent dans le HTML d'un mail. */
export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Un champ prêt à sortir : trim + coupe à `max`, chaîne vide si absent ou non-string.
 * ⚠️ `max` EST OBLIGATOIRE. Une validation de longueur minimale ne dit rien du maximum, et
 * un champ sans borne compilait, se lisait bien, et laissait passer 100 Ko dans un `Reply-To`.
 */
export const cleanStr = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Le corps d'un mail de formulaire : des lignes « label : valeur », puis un bloc de texte
 * libre facultatif. Rend les deux versions que Brevo attend, HTML et texte. Tout est
 * échappé ici, une fois.
 */
export function corpsMail(lignes: [string, string][], bloc: { titre: string; texte: string } | null = null) {
  const htmlLignes = lignes.map(([k, v]) => `<p><strong>${esc(k)} :</strong> ${esc(v)}</p>`).join('\n      ');
  const html = `<!DOCTYPE html>
<html lang="fr">
  <head><meta charset="utf-8"></head>
  <body>
      ${htmlLignes}
      ${bloc ? `<p><strong>${esc(bloc.titre)} :</strong></p>\n      <p>${esc(bloc.texte).replace(/\n/g, '<br />')}</p>` : ''}
  </body>
</html>`;
  const texte = [
    ...lignes.map(([k, v]) => `${k} : ${v}`),
    ...(bloc ? ['', `${bloc.titre} :`, bloc.texte] : []),
  ].join('\n');
  return { html, texte };
}

/*
 * La validation d'adresse. ⚠️ CE N'EST PAS LE NAVIGATEUR QUI SUFFIT : `type="email"` laisse
 * passer `jean..dupont@gmail.com` et `a@b.c`, et il ne protège de rien face à un appel direct
 * sur `/api/`, qui est public. On refuse ici plutôt que de nettoyer Brevo plus tard : une
 * adresse invalide acceptée rebondit et abîme la réputation d'envoi du domaine.
 * ⛔ Pas la conformité RFC 5322 : la règle du HTML, plus les trois refus qui manquent (point
 * doublé ou en bordure, extension d'un caractère, longueurs de la norme).
 */
const ADRESSE =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export function adresseValide(valeur: unknown): valeur is string {
  if (typeof valeur !== 'string') return false;
  const a = valeur.trim();
  if (a.length > 254) return false;
  if (a.slice(0, a.lastIndexOf('@')).length > 64) return false;
  return ADRESSE.test(a);
}

export const MESSAGE_ADRESSE_INVALIDE = 'Adresse email invalide.';

/*
 * Le texte d'une erreur, sans rien qui ressemble à un identifiant, borné à 300 caractères.
 * ⛔ NE JAMAIS PASSER L'OBJET D'ERREUR À `console.error` : le runtime le sérialise avec ses
 * propriétés et sa pile, et une erreur d'API tierce porte parfois le jeton qui l'a produite.
 */
const MOTIFS: RegExp[] = [/[a-z][a-z0-9+.-]*:\/\/\S*/gi, /[^\s:/@]+:[^\s:/@]+@\S+/g, /Bearer\s+\S+/gi, /xkeysib-\S+/gi];

export function sansSecret(e: unknown): string {
  const brut = e instanceof Error ? `${e.name} : ${e.message}` : String(e);
  return MOTIFS.reduce((t, m) => t.replace(m, '[masqué]'), brut).slice(0, 300);
}
