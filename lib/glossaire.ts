/**
 * Les termes de « Comprendre les CEE ». Amorce à compléter : ce sont les entrées dont le
 * chantier a besoin pour poser les URL et le maillage, pas le glossaire final.
 */
export interface Terme {
  slug: string;
  terme: string;
  /** Résumé d'une phrase, servant d'amorce de page et de description de lien. */
  resume: string;
}

export const TERMES: Terme[] = [
  { slug: 'kwh-cumac', terme: 'kWh cumac', resume: "L'unité de compte du dispositif CEE : des kWh cumulés et actualisés sur la durée de vie de l'opération." },
  { slug: 'oblige', terme: 'Obligé', resume: "Le vendeur d'énergie à qui l'État impose un volume d'économies d'énergie à réaliser." },
  { slug: 'delegataire', terme: 'Délégataire', resume: "Celui à qui un obligé délègue tout ou partie de son obligation." },
  { slug: 'mandataire', terme: 'Mandataire', resume: "Celui qui agit au nom du bénéficiaire ou de l'obligé, sans porter lui-même l'obligation." },
  { slug: 'fiche-operation-standardisee', terme: "Fiche d'opération standardisée", resume: "Le document qui fixe, pour une opération donnée, le forfait de kWh cumac et les conditions d'éligibilité." },
  { slug: 'operation-specifique', terme: 'Opération spécifique', resume: "L'opération qui ne relève d'aucune fiche standardisée et se calcule au cas par cas." },
  { slug: 'role-actif-et-incitatif', terme: 'Rôle actif et incitatif', resume: "L'exigence qui impose que l'engagement de prime précède la signature du devis." },
  { slug: 'pncee', terme: 'PNCEE', resume: "Le Pôle national des certificats d'économies d'énergie, qui instruit et délivre les certificats." },
  /* Ces trois termes sont cités en corps de texte sur chaque page de fiche : ils doivent
     exister avant que les liens contextuels ne les pointent, sinon le contrôle de liens
     de fin de build refuse le build. */
  { slug: 'zone-climatique', terme: 'Zone climatique', resume: "Le découpage H1, H2, H3 du territoire qui module le forfait de nombreuses fiches." },
  { slug: 'coup-de-pouce', terme: 'Coup de pouce', resume: "La bonification qui majore la prime de certaines opérations, sous conditions." },
  { slug: 'duree-de-vie-conventionnelle', terme: 'Durée de vie conventionnelle', resume: "La durée retenue par la fiche pour calculer les kWh cumac, indépendante de la durée réelle de l'équipement." },
];

export function termeParSlug(slug: string): Terme | undefined {
  return TERMES.find((t) => t.slug === slug);
}
