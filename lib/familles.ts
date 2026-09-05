/**
 * Les familles d'opérations, lues DANS LE CODE de la fiche.
 *
 * ⚠️ C'EST UNE DONNÉE, PAS UN CLASSEMENT À TENIR. Le deuxième segment du code officiel porte
 * déjà la famille : BAR-**EN**-101 relève de l'enveloppe, IND-**UT**-102 des utilités. Une
 * liste écrite à la main à côté finit forcément par contredire les codes — c'est ce qui
 * était arrivé, avec BAT-EQ-127 rangé dans « Éclairage » alors que son segment dit EQ.
 *
 * ⛔ NE JAMAIS REDONNER À UNE FICHE UNE FAMILLE ÉCRITE À LA MAIN. Une fiche ne peut pas être
 * mal rangée si son rangement vient de son propre code.
 *
 * L'ordre du tableau est celui des sections d'un hub catalogue. Les libellés et cet ordre
 * sont des choix d'affichage, modifiables sans rien casser ; les segments et les secteurs
 * concernés, non.
 */

export interface Famille {
  /** Segment officiel, deuxième bloc du code. */
  segment: string;
  label: string;
  /** Ancre des sections du hub catalogue. */
  slug: string;
  /** Les secteurs où cette famille existe. Sert de garde-fou, cf. `verifieFamille`. */
  secteurs: string[];
}

export const FAMILLES: Famille[] = [
  { segment: 'TH', label: 'Thermique', slug: 'thermique', secteurs: ['agriculture', 'residentiel', 'tertiaire'] },
  { segment: 'EQ', label: 'Équipement', slug: 'equipement', secteurs: ['agriculture', 'residentiel', 'tertiaire', 'transport'] },
  { segment: 'EN', label: 'Enveloppe', slug: 'enveloppe', secteurs: ['residentiel', 'tertiaire', 'industrie'] },
  { segment: 'SE', label: 'Service', slug: 'service', secteurs: ['agriculture', 'residentiel', 'tertiaire', 'transport'] },
  { segment: 'UT', label: 'Utilités', slug: 'utilites', secteurs: ['agriculture', 'industrie'] },
  { segment: 'BA', label: 'Bâtiment', slug: 'batiment', secteurs: ['industrie'] },
  { segment: 'CH', label: 'Chaleur', slug: 'chaleur', secteurs: ['reseau'] },
  { segment: 'EC', label: 'Éclairage', slug: 'eclairage', secteurs: ['reseau'] },
];

/** Le segment d'un code : `IND-UT-102` → `UT`. */
export function segmentDe(code: string): string {
  return code.split('-')[1] ?? '';
}

/**
 * La famille d'une fiche. Lève si le segment est inconnu : au build, sur un catalogue de
 * 218 lignes, c'est la seule façon de repérer un segment imprévu — sinon la fiche
 * disparaîtrait simplement de son hub, sans un mot.
 */
export function familleDe(code: string): Famille {
  const segment = segmentDe(code);
  const famille = FAMILLES.find((f) => f.segment === segment);
  if (!famille) {
    throw new Error(
      `Segment inconnu « ${segment} » dans le code ${code}. ` +
      `Ajouter la famille correspondante dans lib/familles.ts.`,
    );
  }
  return famille;
}

export function familleLabel(code: string): string {
  return familleDe(code).label;
}

/**
 * Vérifie qu'un code est cohérent avec son secteur.
 *
 * ⚠️ CE CONTRÔLE ATTRAPE UNE FAUTE DE SAISIE QUE RIEN D'AUTRE NE VERRAIT. `IND-TH-101` se
 * compile, s'affiche, et produit une page d'apparence normale — alors que la famille
 * thermique n'existe pas en industrie. Une ligne mal recopiée depuis le catalogue officiel
 * ressemble exactement à ça.
 */
export function verifieFamille(code: string, slugSecteur: string): void {
  const famille = familleDe(code);
  if (!famille.secteurs.includes(slugSecteur)) {
    throw new Error(
      `${code} : la famille ${famille.segment} (${famille.label}) n'existe pas en ` +
      `« ${slugSecteur} ». Secteurs concernés : ${famille.secteurs.join(', ')}.`,
    );
  }
}

/** Les familles d'un secteur, dans l'ordre du tableau. */
export function famillesDuSecteur(slugSecteur: string): Famille[] {
  return FAMILLES.filter((f) => f.secteurs.includes(slugSecteur));
}
