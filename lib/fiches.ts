import { SECTEURS, secteurParSlug } from './secteurs';

/**
 * Le catalogue des fiches d'opérations standardisées.
 *
 * 🚨 CE JEU DE DONNÉES EST UNE AMORCE, PAS LE CATALOGUE OFFICIEL. Les codes et les intitulés
 * ci-dessous n'ont PAS été vérifiés contre la liste en vigueur (ATEE / arrêtés publiés au
 * Journal officiel). Ils servent à poser l'architecture, les URL et le maillage.
 *
 * ⚠️ ET C'EST URGENT À REPRENDRE, parce que LE SLUG EST LE CODE : `/fiches-cee/industrie/
 * ind-ut-102`. Un code corrigé après mise en ligne est une URL changée, or la règle du
 * projet est qu'un slug de fiche est stable à vie. Remplacer cette amorce par le catalogue
 * réel AVANT la première indexation, pas après.
 *
 * ⛔ LE SLUG EST LE CODE, JAMAIS L'INTITULÉ, même si l'intitulé officiel est reformulé plus
 * tard — c'est précisément ce que cette règle protège.
 */
export interface Fiche {
  /** Le code officiel, en majuscules. Le slug d'URL en est la version minuscule. */
  code: string;
  intitule: string;
  /** Slug du secteur (cf. lib/secteurs.ts). */
  secteur: string;
  /** Identifiant d'usage : la section à ancre du hub qui accueille la fiche. */
  usage: string;
  /**
   * Les fiches jumelles : la même opération portée par un autre secteur. La relation est
   * déclarée dans les deux sens, et `verifieCoherence()` le contrôle au build.
   */
  jumelles: string[];
}

export const FICHES: Fiche[] = [
  // ── Agriculture ──────────────────────────────────────────────────────────
  { code: 'AGRI-TH-102', intitule: "Récupération de chaleur sur un groupe de production de froid", secteur: 'agriculture', usage: 'froid', jumelles: ['IND-UT-134'] },
  { code: 'AGRI-TH-104', intitule: 'Pré-refroidisseur laitier', secteur: 'agriculture', usage: 'froid', jumelles: [] },
  { code: 'AGRI-EQ-102', intitule: 'Système de régulation sur un groupe de froid', secteur: 'agriculture', usage: 'froid', jumelles: [] },
  { code: 'AGRI-TH-108', intitule: "Isolation thermique des parois d'un bâtiment d'élevage", secteur: 'agriculture', usage: 'batiment', jumelles: [] },
  { code: 'AGRI-UT-103', intitule: 'Variateur de vitesse sur pompe de nettoyage', secteur: 'agriculture', usage: 'utilites', jumelles: ['IND-UT-102'] },

  // ── Industrie ────────────────────────────────────────────────────────────
  { code: 'IND-UT-102', intitule: "Variation électronique de vitesse sur un moteur asynchrone", secteur: 'industrie', usage: 'utilites', jumelles: ['AGRI-UT-103'] },
  { code: 'IND-UT-117', intitule: "Récupération de chaleur sur un compresseur d'air", secteur: 'industrie', usage: 'utilites', jumelles: [] },
  { code: 'IND-UT-121', intitule: 'Moto-variateur synchrone à aimants permanents', secteur: 'industrie', usage: 'utilites', jumelles: [] },
  { code: 'IND-UT-134', intitule: 'Récupération de chaleur sur un groupe de production de froid', secteur: 'industrie', usage: 'utilites', jumelles: ['AGRI-TH-102'] },
  { code: 'IND-BA-112', intitule: "Isolation de points singuliers d'un réseau", secteur: 'industrie', usage: 'reseaux', jumelles: ['BAT-TH-155'] },
  { code: 'IND-BA-110', intitule: "Déstratificateur ou brasseur d'air", secteur: 'industrie', usage: 'batiment', jumelles: [] },

  // ── Réseau ───────────────────────────────────────────────────────────────
  { code: 'RES-CH-103', intitule: "Réhabilitation d'un poste de livraison de chaleur", secteur: 'reseau', usage: 'chaleur', jumelles: [] },
  { code: 'RES-CH-104', intitule: "Passage d'un réseau de chaleur en basse température", secteur: 'reseau', usage: 'chaleur', jumelles: [] },
  { code: 'RES-CH-106', intitule: "Optimisation d'un réseau de chaleur existant", secteur: 'reseau', usage: 'chaleur', jumelles: [] },
  { code: 'RES-EC-104', intitule: "Rénovation d'un éclairage extérieur", secteur: 'reseau', usage: 'eclairage', jumelles: ['BAT-EQ-127'] },
  { code: 'RES-EC-107', intitule: "Régulation de tension en éclairage extérieur", secteur: 'reseau', usage: 'eclairage', jumelles: [] },

  // ── Résidentiel ──────────────────────────────────────────────────────────
  { code: 'BAR-EN-101', intitule: 'Isolation de combles ou de toitures', secteur: 'residentiel', usage: 'enveloppe', jumelles: ['BAT-EN-101'] },
  { code: 'BAR-EN-102', intitule: 'Isolation des murs', secteur: 'residentiel', usage: 'enveloppe', jumelles: ['BAT-EN-102'] },
  { code: 'BAR-TH-171', intitule: 'Pompe à chaleur de type air/eau', secteur: 'residentiel', usage: 'chauffage', jumelles: [] },
  { code: 'BAR-TH-113', intitule: 'Chaudière biomasse individuelle', secteur: 'residentiel', usage: 'chauffage', jumelles: [] },
  { code: 'BAR-TH-160', intitule: "Isolation d'un réseau hydraulique de chauffage", secteur: 'residentiel', usage: 'chauffage', jumelles: ['BAT-TH-155'] },

  // ── Tertiaire ────────────────────────────────────────────────────────────
  { code: 'BAT-EN-101', intitule: 'Isolation de combles ou de toitures', secteur: 'tertiaire', usage: 'enveloppe', jumelles: ['BAR-EN-101'] },
  { code: 'BAT-EN-102', intitule: 'Isolation des murs', secteur: 'tertiaire', usage: 'enveloppe', jumelles: ['BAR-EN-102'] },
  { code: 'BAT-TH-102', intitule: 'Chaudière collective à haute performance énergétique', secteur: 'tertiaire', usage: 'chauffage', jumelles: [] },
  { code: 'BAT-TH-155', intitule: "Isolation de points singuliers d'un réseau", secteur: 'tertiaire', usage: 'chauffage', jumelles: ['IND-BA-112', 'BAR-TH-160'] },
  { code: 'BAT-TH-116', intitule: 'Système de gestion technique du bâtiment', secteur: 'tertiaire', usage: 'pilotage', jumelles: [] },
  { code: 'BAT-EQ-127', intitule: "Luminaire d'éclairage général à modules LED", secteur: 'tertiaire', usage: 'eclairage', jumelles: ['RES-EC-104'] },

  // ── Transport ────────────────────────────────────────────────────────────
  { code: 'TRA-EQ-101', intitule: 'Unité de transport frigorifique', secteur: 'transport', usage: 'froid', jumelles: [] },
  { code: 'TRA-EQ-117', intitule: 'Groupe frigorifique autonome', secteur: 'transport', usage: 'froid', jumelles: [] },
  { code: 'TRA-EQ-114', intitule: 'Pneus à basse résistance au roulement', secteur: 'transport', usage: 'vehicules', jumelles: [] },
  { code: 'TRA-SE-101', intitule: "Formation d'un chauffeur à la conduite économe", secteur: 'transport', usage: 'exploitation', jumelles: [] },
  { code: 'TRA-EQ-124', intitule: 'Télématique embarquée', secteur: 'transport', usage: 'exploitation', jumelles: [] },
];

/** Le slug d'URL d'une fiche : son code en minuscules, et rien d'autre. */
export function slugFiche(code: string): string {
  return code.toLowerCase();
}

export function ficheParCode(code: string): Fiche | undefined {
  const c = code.toUpperCase();
  return FICHES.find((f) => f.code === c);
}

export function fichesDuSecteur(slugSecteur: string): Fiche[] {
  return FICHES.filter((f) => f.secteur === slugSecteur);
}

/** Les fiches d'un secteur, groupées par usage, dans l'ordre des sections du hub. */
export function fichesParUsage(slugSecteur: string) {
  const secteur = secteurParSlug(slugSecteur);
  if (!secteur) return [];
  return secteur.usages
    .map((u) => ({ ...u, fiches: FICHES.filter((f) => f.secteur === slugSecteur && f.usage === u.id) }))
    .filter((u) => u.fiches.length > 0);
}

/**
 * Le bloc fixe de six liens d'une fiche : jumelles d'abord, voisines d'usage ensuite.
 *
 * L'ordre est un ordre d'utilité décroissante : la même opération dans un autre secteur, puis
 * le même usage dans le même secteur, puis le reste du secteur, puis le même usage ailleurs.
 * Le bloc est dit « fixe » : il en faut six, sinon la page a un trou.
 */
export function fichesLiees(code: string, combien = 6): Fiche[] {
  const depart = ficheParCode(code);
  if (!depart) return [];

  const vues = new Set([depart.code]);
  const retenues: Fiche[] = [];

  const ajoute = (candidates: Fiche[]) => {
    for (const f of candidates) {
      if (retenues.length >= combien) return;
      if (vues.has(f.code)) continue;
      vues.add(f.code);
      retenues.push(f);
    }
  };

  ajoute(depart.jumelles.map(ficheParCode).filter((f): f is Fiche => Boolean(f)));
  ajoute(FICHES.filter((f) => f.secteur === depart.secteur && f.usage === depart.usage));
  ajoute(FICHES.filter((f) => f.secteur === depart.secteur));
  ajoute(FICHES.filter((f) => f.usage === depart.usage));
  ajoute(FICHES);

  return retenues;
}

/**
 * Contrôles de cohérence, exécutés à l'import donc au build : une incohérence casse le build
 * au lieu de produire une page fausse ou une URL en double.
 */
function verifieCoherence() {
  const codes = new Set<string>();
  for (const f of FICHES) {
    if (codes.has(f.code)) throw new Error(`Fiche en double : ${f.code}`);
    codes.add(f.code);

    if (f.code !== f.code.toUpperCase()) throw new Error(`Code non capitalisé : ${f.code}`);
    if (!/^[A-Z]+(-[A-Z0-9]+)+$/.test(f.code)) throw new Error(`Code de forme inattendue : ${f.code}`);

    const secteur = secteurParSlug(f.secteur);
    if (!secteur) throw new Error(`Fiche ${f.code} : secteur inconnu « ${f.secteur} »`);
    if (!secteur.usages.some((u) => u.id === f.usage)) {
      throw new Error(`Fiche ${f.code} : usage « ${f.usage} » absent du secteur ${f.secteur}`);
    }
  }

  // La relation jumelle est symétrique : sans ça, une fiche apparaît dans le bloc de l'autre
  // mais pas l'inverse, et le maillage devient un aller sans retour.
  for (const f of FICHES) {
    for (const code of f.jumelles) {
      const jumelle = FICHES.find((x) => x.code === code);
      if (!jumelle) throw new Error(`Fiche ${f.code} : jumelle inconnue « ${code} »`);
      if (!jumelle.jumelles.includes(f.code)) {
        throw new Error(`Relation jumelle non réciproque : ${f.code} → ${code}, mais pas l'inverse`);
      }
    }
  }

  for (const s of SECTEURS) {
    if (fichesDuSecteur(s.slug).length === 0) throw new Error(`Secteur sans aucune fiche : ${s.slug}`);
  }
}
verifieCoherence();
