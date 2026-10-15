/**
 * Les articles de « Comprendre les CEE » : onze termes, chacun avec son article complet.
 *
 * ⚠️ LES SLUGS SONT LIÉS DEPUIS LES PAGES DE FICHE (composant `Terme`) : on ne les renomme pas.
 *
 * ⚠️ RIEN N'EST ÉCRIT SANS SOURCE. Chaque règle des articles vient d'une page listée dans
 * `sources`, lue à la date indiquée ; quand une source manque, la phrase est au conditionnel
 * et le doute est dit. Les chiffres sont réglementaires (1,04 ; 0,015 € ; 14 jours ; 12 mois)
 * ou présentés comme illustratifs. Aucune promesse sur l'offre d'Ultra Énergie : ni délai, ni
 * taux, ni montant.
 *
 * Le nombre de mots et le temps de lecture sont calculés, pas déclarés : un champ déclaré
 * finit par mentir dès la première retouche.
 */

/** Les schémas dessinés dans `components/SchemasGlossaire.tsx`. */
export type NomSchemaGlossaire =
  | 'actualisation'
  | 'duree-conventionnelle'
  | 'chaine-obligation'
  | 'periodes'
  | 'delegation'
  | 'mandat'
  | 'anatomie-fiche'
  | 'bifurcation'
  | 'chronologie-rai'
  | 'parcours-dossier'
  | 'zones-climatiques'
  | 'multiplicateur';

export interface SourceTerme {
  titre: string;
  url: string;
  /** Date ISO de lecture effective de la page. */
  consulteLe: string;
}

export interface SectionTerme {
  titre: string;
  paragraphes: string[];
  liste?: string[];
  /** Le schéma inséré à la fin de la section, s'il y en a un. */
  schema?: NomSchemaGlossaire;
  /** La phrase-clé du schéma, en HTML : le SVG est masqué aux lecteurs d'écran. */
  legendeSchema?: string;
}

export interface Terme {
  slug: string;
  terme: string;
  /** Résumé d'une phrase, servant de description de lien et de balise meta. */
  resume: string;
  /** Date ISO de dernière mise à jour de l'article. */
  dateMaj: string;
  /** Le chapô, sous le titre. */
  intro: string;
  sections: SectionTerme[];
  /** Les schémas que l'article possède ; chaque section qui en appelle un le prend ici. */
  schemas: NomSchemaGlossaire[];
  /** Trois points, pas plus : l'encadré « À retenir ». */
  aRetenir: string[];
  sources: SourceTerme[];
}

/* La date de lecture commune à toutes les sources de ce chantier. */
const LU = '2026-09-20';

/* Les sources citées par plusieurs articles, pour ne pas les recopier avec des variantes. */
const SRC = {
  dispositif: { titre: 'Dispositif des certificats d’économies d’énergie (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/dispositif-certificats-deconomies-denergie', consulteLe: LU },
  questionsReponses: { titre: 'Questions-réponses sur le dispositif CEE (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/questions-reponses-dispositif-cee', consulteLe: LU },
  standardisees: { titre: 'Opérations standardisées d’économies d’énergie (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/operations-standardisees-deconomies-denergie', consulteLe: LU },
  specifiques: { titre: 'Opérations spécifiques d’économies d’énergie (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/operations-specifiques-deconomies-denergie', consulteLe: LU },
  modalitesDepot: { titre: 'Modalités détaillées pour déposer un dossier de demande de CEE (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/modalites-detaillees-deposer-dossier-demande-certificats-deconomies-denergie', consulteLe: LU },
  codeL: { titre: 'Code de l’énergie, articles L221-1 à L221-13 (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000023983208/LEGISCTA000023986206', consulteLe: LU },
  codeR: { titre: 'Code de l’énergie, articles R221-1 à R221-31 (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000023983208/LEGISCTA000031747955/', consulteLe: LU },
  r22122: { titre: 'Code de l’énergie, article R221-22 (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046816614', consulteLe: LU },
  r22116: { titre: 'Code de l’énergie, article R221-16 (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043616744', consulteLe: LU },
  l2218: { titre: 'Code de l’énergie, article L221-8 (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051830603', consulteLe: LU },
  sanctions: { titre: 'Code de l’énergie, articles R222-1 à R222-12, sanctions (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000023983208/LEGISCTA000031748021/', consulteLe: LU },
  registre: { titre: 'Code de l’énergie, articles R221-26 à R221-30, registre national (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000023983208/LEGISCTA000031752560/', consulteLe: LU },
  arreteModalites: { titre: 'Arrêté du 29 décembre 2014 relatif aux modalités d’application du dispositif des CEE (Légifrance, version consolidée)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000030001603', consulteLe: LU },
  arreteStandardisees: { titre: 'Arrêté du 22 décembre 2014 définissant les opérations standardisées d’économies d’énergie (Légifrance, version consolidée)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000029953752/', consulteLe: LU },
  arreteDemande: { titre: 'Arrêté du 4 septembre 2014 fixant la liste des éléments d’une demande de CEE (Légifrance, version consolidée)', url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000029460644', consulteLe: LU },
  decretP6: { titre: 'Décret n° 2025-1048 du 30 octobre 2025 relatif à la sixième période du dispositif des CEE (Légifrance)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052486193', consulteLe: LU },
  webinaireP6: { titre: 'Webinaire DGEC « 6e période des certificats d’économies d’énergie », 2 décembre 2025 (PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/2025-12-02%20Webinaire%20DGEC%20P6%20CEE%20vweb.pdf', consulteLe: LU },
  lettreNov2025: { titre: 'Lettre d’information CEE de novembre 2025 (DGEC, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/2025-11%20lettre%20d’infos%20CEE%20vf.pdf', consulteLe: LU },
  doctrineFiches: { titre: 'Doctrine relative à la création et à la révision des fiches d’opérations standardisées et aux bonifications, version au 1er juillet 2026 (DGEC, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/Doctrine%20Fiches%20et%20bonifications%20CEE%20vdef.pdf', consulteLe: LU },
  courDesComptes: { titre: 'Cour des comptes, « Les certificats d’économies d’énergie : un dispositif à réformer », juillet 2024 (PDF)', url: 'https://www.ccomptes.fr/sites/default/files/2024-09/20240917-Certificats-economie-energie_0.pdf', consulteLe: LU },
  atee: { titre: 'ATEE, Club C2E, « Les certificats d’économies d’énergie »', url: 'https://atee.fr/efficacite-energetique/club-c2e/les-certificats-deconomie-denergie', consulteLe: LU },
  ficheBarEn101: { titre: 'Fiche BAR-EN-101 « Isolation de combles ou de toiture », version A64-6 (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/BAR-EN-101%20vA64-6%20%C3%A0%20compter%20du%2001-01-2025_1.pdf', consulteLe: LU },
  ficheBarTh171: { titre: 'Fiche BAR-TH-171 « Pompe à chaleur de type air/eau », version A82-5 (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/BAR-TH-171%20vA82-5%20%C3%A0%20compter%20du%2001-09-2026.pdf', consulteLe: LU },
  zonesDepartements: { titre: 'Répartition des départements par zone climatique (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/La%20r%C3%A9partition%20des%20d%C3%A9partements%20par%20zone%20climatique.pdf', consulteLe: LU },
  arreteStandardiseesConsolide: { titre: 'Arrêté du 22 décembre 2014, version consolidée au 30 avril 2026 (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/20260430%20Arr%C3%AAt%C3%A9%20du%2022%20d%C3%A9cembre%202014%20consolid%C3%A9.pdf', consulteLe: LU },
  ficheBarSe105: { titre: 'Fiche BAR-SE-105 « Contrat de performance énergétique services » (calculateur CEE de l’ADEME, PDF)', url: 'https://calculateur-cee.ademe.fr/pdf/display/218/BAR-SE-105', consulteLe: LU },
  re2020: { titre: 'Décret n° 2021-1004 du 29 juillet 2021 relatif aux exigences de performance énergétique des constructions neuves (RE2020), annexe sur les zones climatiques (Légifrance)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043877196', consulteLe: LU },
  l2211: { titre: 'Code de l’énergie, article L221-1 (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051830610', consulteLe: LU },
  r2215: { titre: 'Code de l’énergie, article R221-5, délégation (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000052490787', consulteLe: LU },
  l2222: { titre: 'Code de l’énergie, article L222-2, sanctions (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051830576', consulteLe: LU },
  delivrance: { titre: 'Code de l’énergie, articles R221-14 à R221-25, délivrance des certificats (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000023983208/LEGISCTA000031747985/', consulteLe: LU },
  bilan2024: { titre: 'Bilan annuel du dispositif CEE, cinquième période, année 2024 (DGEC, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/Bilan%20annuel%20CEE%20P5%20-%202024_0.pdf', consulteLe: LU },
  lettreJuil2026: { titre: 'Lettre d’information CEE de juillet 2026 (DGEC, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/2026-07%20lettre%20d%27infos%20CEE%20vf2.pdf', consulteLe: LU },
  delegatairesP6: { titre: 'Liste des délégataires d’obligation validés pour la sixième période, au 5 juin 2026 (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/Liste%20des%20d%C3%A9l%C3%A9gataires%20P6%20au%202026-06-05.pdf', consulteLe: LU },
  codeCivilMandat: { titre: 'Code civil, articles 1984 à 2010, du mandat (Légifrance)', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000006118139/', consulteLe: LU },
  annexe5: { titre: 'Arrêté du 4 septembre 2014, annexe 5, pièces des opérations standardisées (Légifrance)', url: 'https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000046730494', consulteLe: LU },
  arreteControles: { titre: 'Arrêté du 28 septembre 2021 relatif aux contrôles dans le cadre du dispositif des CEE, version consolidée au 1er mai 2026 (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/2026-05-01%20Arr%C3%AAt%C3%A9%20Contr%C3%B4les%20CEE%20du%2028%20sept%202021%20vconsolid%C3%A9e.pdf', consulteLe: LU },
  arreteModalitesConsolide: { titre: 'Arrêté du 29 décembre 2014, version consolidée au 1er avril 2026 (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/2026-04-01%20Arrete%20modalites%2029_dec_2014%20vconsolidee.pdf', consulteLe: LU },
  guideSpecifiques: { titre: 'Guide technique pour le montage d’un dossier CEE dans le cadre d’une opération spécifique, installations fixes, avril 2025 (ADEME, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/Guide-CEE-ope-sp%C3%A9cifique-inst-fixes-2025_0.pdf', consulteLe: LU },
  arreteGuide: { titre: 'Arrêté du 18 avril 2025 donnant valeur réglementaire au guide des opérations spécifiques (Légifrance)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051522615', consulteLe: LU },
  arreteMacf: { titre: 'Arrêté du 27 mars 2026 modifiant la bonification des opérations spécifiques industrielles (Légifrance)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053734274', consulteLe: LU },
  ateeSpecifiques: { titre: 'ATEE, Club C2E, « Opérations spécifiques »', url: 'https://atee.fr/efficacite-energetique/club-c2e/operations-specifiques', consulteLe: LU },
  ateeFiches: { titre: 'ATEE, Club C2E, « Fiches d’opérations standardisées »', url: 'https://atee.fr/efficacite-energetique/club-c2e/fiches-doperations-standardisees', consulteLe: LU },
  arreteMai2026: { titre: 'Arrêté du 29 mai 2026 modifiant les arrêtés du 22 décembre 2014, du 29 décembre 2014 et du 28 septembre 2021 (Légifrance)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054152008', consulteLe: LU },
  coupsDePouce: { titre: 'Certificats d’économies d’énergie : pages des Coups de pouce (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques/certificats-economies-denergie', consulteLe: LU },
  coupDePouceChauffage: { titre: 'Coup de pouce « Chauffage » (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/coup-pouce-chauffage', consulteLe: LU },
  coupDePouceCollectif: { titre: 'Coup de pouce « Chauffage des bâtiments résidentiels collectifs et tertiaires » (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/coup-pouce-chauffage-batiments-residentiels-collectifs-tertiaires', consulteLe: LU },
  coupDePouceRenovation: { titre: 'Coup de pouce « Rénovation performante de bâtiment résidentiel collectif » (ministère de la Transition écologique)', url: 'https://www.ecologie.gouv.fr/politiques-publiques/coup-pouce-renovation-performante-batiment-residentiel-collectif', consulteLe: LU },
  noteCoupsDePouce2021: { titre: 'Note « Évolutions liées aux Coups de pouce CEE », mai 2021 (ministère, PDF)', url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/Evolutions%20li%C3%A9es%20aux%20Coups%20de%20Pouce%20-%20mai%202021.pdf', consulteLe: LU },
} satisfies Record<string, SourceTerme>;

export const TERMES: Terme[] = [
  {
    slug: 'kwh-cumac',
    terme: 'kWh cumac',
    resume: 'L’unité de compte du dispositif CEE : des kWh cumulés et actualisés sur la durée de vie de l’opération.',
    dateMaj: '2026-09-20',
    intro: 'Le kWh cumac est l’unité dans laquelle le dispositif compte les économies d’énergie. Un certificat vaut un kWh cumac. L’obligation d’un fournisseur, le forfait d’une fiche, le seuil de dépôt d’un dossier : tout s’exprime dans cette unité, et rien n’y est en euros.',
    schemas: ['actualisation'],
    sections: [
      {
        titre: 'Ce que le mot veut dire',
        paragraphes: [
          'La loi dit que l’unité de compte des certificats est « le kilowattheure d’énergie finale économisé » (article L221-8 du code de l’énergie). Les textes d’application précisent la façon de compter et parlent de kilowattheures « cumulés actualisés », en abrégé cumac (article R221-4 et arrêté du 29 décembre 2014). Le ministère résume : un CEE, c’est un kWh cumac.',
          'Cumulé : on n’additionne pas l’économie d’une seule année, mais celle de chaque année sur toute la durée de vie conventionnelle de l’opération. Une isolation de combles compte sur trente ans, une pompe à chaleur air/eau sur dix-sept ans : la durée vient de la fiche, pas de l’équipement.',
          'Actualisé : les années lointaines pèsent moins que la première. La règle est écrite à l’article 3 de l’arrêté du 29 décembre 2014 : les économies de chaque année suivant la première « sont calculées en divisant par 1,04 les économies de l’année précédente ». C’est un taux d’actualisation de 4 % par an. Le volume de certificats est la somme de ces économies annuelles ainsi calculées.',
        ],
        schema: 'actualisation',
        legendeSchema: 'La première année compte en entier ; chaque année suivante vaut la précédente divisée par 1,04. Le volume en kWh cumac est la somme de toutes les barres.',
      },
      {
        titre: 'Un exemple, à titre illustratif',
        paragraphes: [
          'L’Association technique énergie environnement (ATEE) donne l’exemple d’une action qui économise un million de kWh par an pendant dix ans : elle vaut 8,43 millions de kWh cumac. Le calcul se vérifie en additionnant dix termes : 1, puis 1 divisé par 1,04, puis 1 divisé par 1,04 au carré, et ainsi de suite. La somme fait 8,43, et non 10, parce que chaque année vaut un peu moins que la précédente.',
          'Le même raisonnement donne, pour une durée de trente ans, un peu moins de dix-huit fois l’économie de la première année. Autrement dit, sur les fiches d’isolation, le forfait en kWh cumac est de l’ordre de dix-huit fois l’économie annuelle estimée. Ces multiples ne figurent pas tels quels dans les textes : ils découlent de la règle du 1,04, et nous les donnons pour situer l’ordre de grandeur.',
        ],
      },
      {
        titre: 'Pourquoi cette unité et pas une autre',
        paragraphes: [
          'Le dispositif doit comparer des opérations qui n’ont rien à voir : un isolant posé pour trente ans, un luminaire, un moteur industriel, un contrat de service de quelques années. Une unité qui intègre la durée permet de les mettre sur la même échelle, et donc de les compter dans une même obligation nationale.',
          'La Cour des comptes le formule ainsi : le certificat valorise « non le coût d’une opération, mais l’économie d’énergie finale qu’elle doit permettre », dans une unité qui repose sur « une évaluation conventionnelle ex ante » des économies. Le volume n’est pas relevé au compteur après travaux : il est calculé à l’avance, à partir d’hypothèses fixées par la fiche.',
          'La doctrine de la DGEC, l’administration qui pilote le dispositif, ajoute que ce calcul « doit s’efforcer d’être proche des économies d’énergie réelles » tout en s’appuyant sur des paramètres « difficilement falsifiables » : une surface, une puissance, une classe de performance. C’est ce qui explique que les fiches demandent des caractéristiques précises et non une consommation constatée.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Pour un maître d’ouvrage, le volume en kWh cumac est la matière première de la prime : il dépend de la fiche applicable, des paramètres de l’opération (surface, puissance, rendement) et, souvent, de la zone climatique. Deux devis pour le même équipement donnent le même volume ; c’est la contrepartie négociée pour ce volume qui varie d’une offre à l’autre.',
          'Pour un installateur, les paramètres qui font le volume doivent apparaître sur la facture : la fiche BAR-EN-101, par exemple, demande la surface et la résistance thermique de l’isolant posé. Une facture qui ne les mentionne pas, c’est un volume qu’on ne peut pas justifier.',
          'Les ordres de grandeur aident à lire les textes. Une opération se compte en milliers ou en millions de kWh cumac. Un dossier déposé au Pôle national des certificats d’économies d’énergie (PNCEE) doit atteindre 50 millions de kWh cumac, soit 50 GWh cumac, pour des opérations standardisées. L’obligation nationale de la sixième période a été fixée sur la base de 1 050 TWh cumac par an, soit 1 050 milliards de kWh cumac, selon la présentation de la Direction générale de l’énergie et du climat (DGEC) en décembre 2025.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Confondre kWh cumac et kWh économisés par an : le premier intègre la durée de vie et l’actualisation, il est donc bien plus grand que le second.',
          'Lire le volume comme une mesure de la consommation réelle : c’est une estimation conventionnelle, calculée avant travaux, jamais un relevé.',
          'Comparer des primes sans comparer les volumes : une prime se lit en regard du volume qu’elle rémunère, et de l’opération exacte qui le produit.',
          'Oublier qu’un renouvellement de la même opération, chez le même bénéficiaire, pendant la durée de vie conventionnelle, ne donne pas de nouveaux certificats.',
        ],
      },
    ],
    aRetenir: [
      'Un CEE vaut un kWh cumac : une économie d’énergie cumulée sur la durée de vie conventionnelle de l’opération et actualisée à 4 % par an.',
      'Le volume est calculé à l’avance, à partir de la fiche et des paramètres de l’opération, jamais mesuré au compteur.',
      'Tout le dispositif se lit dans cette unité : forfaits, seuils de dépôt, obligations ; la valeur en euros vient du marché, pas des textes.',
    ],
    sources: [SRC.dispositif, SRC.arreteModalites, SRC.l2218, SRC.r22116, SRC.doctrineFiches, SRC.courDesComptes, SRC.atee, SRC.webinaireP6, SRC.decretP6, SRC.modalitesDepot, SRC.ficheBarEn101],
  },
  {
    slug: 'duree-de-vie-conventionnelle',
    terme: 'Durée de vie conventionnelle',
    resume: 'La durée retenue par la fiche pour calculer les kWh cumac, indépendante de la durée réelle de l’équipement.',
    dateMaj: '2026-09-20',
    intro: 'Chaque fiche d’opération standardisée fixe une durée de vie conventionnelle : le nombre d’années sur lequel les économies d’énergie sont comptées. C’est une convention de calcul, pas une garantie ni une prévision. Elle détermine pourtant l’essentiel du volume de certificats, et elle engage le bénéficiaire.',
    schemas: ['duree-conventionnelle'],
    sections: [
      {
        titre: 'Une durée fixée par la fiche, pas par l’équipement',
        paragraphes: [
          'Les textes ne donnent pas de définition générale de la durée de vie conventionnelle. Elle apparaît fiche par fiche, au point 4 de chacune, juste avant le montant en kWh cumac du point 5. Le ministère l’écrit dans ses questions-réponses : le montant de certificats « dépend de la durée de vie conventionnelle du produit en question mentionnée quant à elle au point 4 ».',
          'Quelques exemples lus dans les fiches officielles : trente ans pour l’isolation de combles ou de toiture (BAR-EN-101), dix-sept ans pour une pompe à chaleur air/eau en logement (BAR-TH-171, version applicable au 1er septembre 2026), de deux à dix ans pour un contrat de performance énergétique services (BAR-SE-105), selon la durée de l’engagement.',
          'Ces durées sont des conventions d’estimation. Une chaudière peut durer plus ou moins longtemps que le chiffre retenu ; le dispositif ne s’en préoccupe pas. Ce qui compte, c’est que tous les demandeurs calculent une même opération avec la même durée.',
        ],
        schema: 'duree-conventionnelle',
        legendeSchema: 'Seules les années fixées par la fiche entrent dans le calcul, que l’équipement dure plus ou moins longtemps.',
      },
      {
        titre: 'À quoi elle sert dans le calcul',
        paragraphes: [
          'Le volume de certificats d’une opération est « la somme des économies d’énergie annuelles réalisées durant la durée de vie du produit ou la durée d’exécution du contrat de service », avec des coefficients dégressifs pour les années suivant la première (article R221-16 du code de l’énergie). L’arrêté du 29 décembre 2014 fixe ce coefficient : chaque année vaut la précédente divisée par 1,04.',
          'La durée est donc le nombre de termes de cette somme. À titre illustratif, une durée de trente ans donne un peu moins de dix-huit fois l’économie de la première année ; une durée de dix-sept ans, environ douze fois et demie. Ces multiples ne sont pas écrits dans les fiches : ils résultent de l’arithmétique du 1,04, et le forfait de la fiche les intègre déjà.',
          'C’est pourquoi deux opérations qui économisent la même énergie chaque année peuvent donner des volumes très différents : celle dont la fiche retient une longue durée vaut plus de certificats. La doctrine de la Direction générale de l’énergie et du climat (DGEC) rappelle que l’actualisation s’applique « sur la durée de vie conventionnelle de l’opération qui est précisée dans chaque fiche ».',
        ],
      },
      {
        titre: 'Pourquoi une convention plutôt qu’une mesure',
        paragraphes: [
          'Le dispositif repose, selon la Cour des comptes, sur « une évaluation conventionnelle ex ante des économies d’énergie espérées sur la durée de vie d’un équipement ». Une durée conventionnelle rend cette évaluation possible sans attendre trente ans, et la rend identique pour tous : le même isolant, posé dans les mêmes conditions, vaut le même volume chez tous les demandeurs.',
          'La durée est révisée quand la fiche l’est. La version applicable à une opération est celle en vigueur à sa date d’engagement ; la durée de vie qui s’applique est donc celle de cette version.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Le bénéficiaire est supposé conserver l’équipement pendant toute la durée conventionnelle. Conséquence directe, écrite dans les questions-réponses du ministère : les certificats « ne peuvent être délivrés à un même bénéficiaire qui renouvelle une opération » déjà valorisée, dans les mêmes conditions, tant que cette durée court.',
          'L’arrêté du 22 décembre 2014 (article 2 quater) demande en outre que les équipements soient maintenus en fonctionnement, pour les besoins des contrôles, au moins jusqu’à six ans après l’achèvement ou jusqu’à la fin de la durée de vie conventionnelle si elle est plus proche. Remplacer un équipement pendant sa durée conventionnelle ne donne pas de nouveaux certificats.',
          'Pour un maître d’ouvrage, la durée de la fiche est donc un engagement implicite : l’opération ne doit pas être défaite. Pour un installateur ou un apporteur d’affaires, c’est une question à poser avant de proposer une opération sur un équipement récent : a-t-il déjà donné lieu à des certificats, et quand ?',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Lire la durée conventionnelle comme une garantie du fabricant ou une durée d’amortissement : elle ne dit rien de la vie réelle de l’équipement.',
          'Oublier qu’elle change avec les versions de fiche : la durée à retenir est celle de la version applicable à la date d’engagement.',
          'Proposer un remplacement anticipé d’un équipement déjà valorisé : pendant la durée conventionnelle, pas de nouveaux certificats.',
        ],
      },
    ],
    aRetenir: [
      'La durée de vie conventionnelle est fixée au point 4 de chaque fiche ; elle n’a pas de définition générale et ne décrit pas la durée réelle de l’équipement.',
      'Elle fixe le nombre d’années additionnées dans le calcul des kWh cumac, avec un coefficient qui divise chaque année par 1,04.',
      'Elle engage : pas de nouveaux certificats pour la même opération chez le même bénéficiaire tant qu’elle court, et l’équipement doit rester en service.',
    ],
    sources: [SRC.questionsReponses, SRC.r22116, SRC.arreteModalites, SRC.arreteStandardisees, SRC.arreteStandardiseesConsolide, SRC.doctrineFiches, SRC.courDesComptes, SRC.ficheBarEn101, SRC.ficheBarTh171, SRC.ficheBarSe105],
  },
  {
    slug: 'zone-climatique',
    terme: 'Zone climatique',
    resume: 'Le découpage H1, H2, H3 du territoire qui module le forfait de nombreuses fiches.',
    dateMaj: '2026-09-20',
    intro: 'Le dispositif CEE découpe la France en trois zones climatiques, H1, H2 et H3, par département. Pour les fiches de chauffage et d’isolation, le forfait en kWh cumac dépend de la zone : plus le climat est froid, plus l’économie estimée est grande. La zone se lit à l’adresse des travaux.',
    schemas: ['zones-climatiques'],
    sections: [
      {
        titre: 'Trois zones, une liste de départements',
        paragraphes: [
          'Le ministère publie la répartition des départements par zone climatique sur sa page consacrée aux opérations standardisées. La zone H1 regroupe le nord, l’est, le Massif central et les Alpes du Nord, Île-de-France comprise : 51 départements. La zone H2 couvre l’ouest et le sud-ouest, de la Bretagne aux Pyrénées, avec quelques départements du Val de Loire et du sud-est : 36 départements. La zone H3 est le pourtour méditerranéen : Alpes-Maritimes, Aude, Bouches-du-Rhône, Corse, Gard, Hérault, Pyrénées-Orientales et Var.',
          'Pour l’outre-mer, la règle est écrite à l’article 4 de l’arrêté du 22 décembre 2014 : la France d’outre-mer relève de la zone H3, sauf Saint-Pierre-et-Miquelon, rattaché à la zone H1. Le dispositif s’applique en Guadeloupe, en Guyane, en Martinique, à La Réunion, à Mayotte et à Saint-Pierre-et-Miquelon, pas dans les autres collectivités.',
          'Le document de répartition ne cite pas de critère climatique ni de règle d’altitude : c’est une liste, et elle se lit par département.',
        ],
        schema: 'zones-climatiques',
        legendeSchema: 'En vert foncé la zone H1 (nord, est, Massif central, Alpes du Nord, Île-de-France), en vert clair la zone H2 (ouest et sud-ouest), en blanc la zone H3 (pourtour méditerranéen et Corse). Découpage par département, d’après la liste ministérielle ; l’outre-mer est en H3.',
      },
      {
        titre: 'Pourquoi les fiches en tiennent compte',
        paragraphes: [
          'Une isolation ou un système de chauffage économise d’autant plus d’énergie que l’hiver est rigoureux. Le ministère l’écrit sobrement : « les forfaits des fiches d’opérations standardisées dépendent parfois de la zone climatique dans laquelle est situé le bâtiment rénové ». Le mot « parfois » compte : une fiche d’éclairage ou de moteur n’a pas de zone.',
          'Deux exemples lus dans les fiches officielles. L’isolation de combles ou de toiture (BAR-EN-101) vaut, par mètre carré d’isolant, 1 700 kWh cumac en H1, 1 400 en H2 et 920 en H3. La pompe à chaleur air/eau en logement (BAR-TH-171, version du 1er septembre 2026) applique au forfait un facteur correctif de 1,2 en H1, 1 en H2 et 0,7 en H3 ; cette fiche parle de « zone géographique », avec les mêmes lettres.',
          'Entre H1 et H3, le volume d’une même opération d’isolation de combles varie donc presque du simple au double. C’est un écart de calcul réglementaire, pas un jugement sur l’intérêt des travaux dans le sud.',
        ],
      },
      {
        titre: 'Trois zones, et non huit',
        paragraphes: [
          'La réglementation thermique des bâtiments neufs (RE2020, décret n° 2021-1004 du 29 juillet 2021) utilise huit zones : H1a, H1b, H1c, H2a, H2b, H2c, H2d et H3. Le dispositif CEE ne retient que les trois grandes zones, sans sous-découpage. Les lettres sont les mêmes, les listes sont compatibles, mais un bureau d’études qui raisonne en H2d doit simplement lire H2 pour une fiche.',
          'Nous n’avons trouvé, dans les textes CEE lus, ni définition climatique des trois zones ni règle particulière pour l’altitude : la liste par département fait foi. Si une fiche prévoit une modulation supplémentaire, elle l’écrit elle-même.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'La zone se détermine à l’adresse du bâtiment où les travaux ont lieu, pas au siège de l’entreprise ni à l’adresse du demandeur. Pour un parc réparti sur plusieurs départements, chaque site a sa zone, et chaque opération son volume.',
          'Sur l’attestation sur l’honneur, l’adresse des travaux est ce qui permet au Pôle national des certificats d’économies d’énergie (PNCEE) de vérifier la zone retenue. Une adresse incomplète ou celle du siège, c’est un volume contestable au contrôle.',
          'Pour un installateur qui travaille de part et d’autre d’une limite de zone, un même chantier type ne vaut pas le même volume d’un département à l’autre. Ce n’est pas une anomalie de l’offre : c’est la fiche.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Retenir la zone du siège social ou du demandeur au lieu de celle du chantier.',
          'Confondre le découpage CEE en trois zones avec les huit zones de la réglementation thermique.',
          'Supposer qu’une fiche sans mention de zone en a une : l’absence de zone signifie un forfait identique partout.',
          'Oublier l’outre-mer : H3 partout, sauf Saint-Pierre-et-Miquelon en H1.',
        ],
      },
    ],
    aRetenir: [
      'Trois zones par département : H1 au nord, à l’est et au centre, H2 à l’ouest et au sud-ouest, H3 sur le pourtour méditerranéen ; l’outre-mer est en H3, Saint-Pierre-et-Miquelon en H1.',
      'La zone module le forfait des fiches de chauffage et d’isolation, parfois presque du simple au double ; une fiche sans mention de zone a le même forfait partout.',
      'La zone se lit à l’adresse des travaux, et c’est cette adresse que l’attestation sur l’honneur doit porter.',
    ],
    sources: [SRC.standardisees, SRC.zonesDepartements, SRC.arreteStandardiseesConsolide, SRC.arreteStandardisees, SRC.questionsReponses, SRC.ficheBarEn101, SRC.ficheBarTh171, SRC.re2020],
  },
  {
    slug: 'oblige',
    terme: 'Obligé',
    resume: 'Le vendeur d’énergie à qui l’État impose un volume d’économies d’énergie à réaliser.',
    dateMaj: '2026-09-20',
    intro: 'L’obligé est le vendeur d’énergie à qui l’État impose de faire réaliser des économies d’énergie. C’est lui qui porte l’obligation, et lui qui paie une pénalité s’il ne l’atteint pas. Tout le dispositif découle de cette contrainte, y compris la prime qu’un maître d’ouvrage reçoit pour ses travaux.',
    schemas: ['chaine-obligation', 'periodes'],
    sections: [
      {
        titre: 'Qui est obligé',
        paragraphes: [
          'L’article L221-1 du code de l’énergie soumet à une obligation d’économies d’énergie deux catégories de personnes : celles qui mettent à la consommation des carburants automobiles ou du fioul domestique, et celles qui vendent de l’électricité, du gaz, de la chaleur ou du froid aux consommateurs finals. Dans les deux cas, l’obligation ne s’applique qu’au-delà d’un seuil de ventes annuelles fixé par décret, énergie par énergie.',
          'Ces seuils ont été abaissés pour la sixième période. La Direction générale de l’énergie et du climat (DGEC) l’a présenté ainsi en décembre 2025 : le seuil passe de 1 000 à 500 mètres cubes pour le fioul domestique, de 7 000 à 500 mètres cubes pour les carburants hors GPL, et de 7 000 à 2 000 tonnes pour le GPL carburant. Davantage de vendeurs entrent donc dans le dispositif depuis 2026.',
          'Le ministère publie à chaque période la liste des personnes à qui un arrêté d’obligation a été notifié ; depuis 2023, elle mentionne aussi les obligés qui ont délégué, et à qui.',
        ],
        schema: 'chaine-obligation',
        legendeSchema: 'Des ventes d’énergie naît une obligation en kWh cumac. En fin de période, les certificats détenus doivent la couvrir ; ce qui manque se paie au Trésor public.',
      },
      {
        titre: 'Comment l’obligation se calcule',
        paragraphes: [
          'L’obligation d’un vendeur est proportionnelle à ses volumes de vente au-delà du seuil, multipliés par un coefficient propre à chaque énergie et à chaque période (article R221-4 du code de l’énergie). Le décret n° 2025-1048 du 30 octobre 2025 fixe ces coefficients pour la sixième période, qui court du 1er janvier 2026 au 31 décembre 2030.',
          'La DGEC présente ces coefficients comme fondés sur une obligation nationale totale, précarité comprise, de 1 050 TWh cumac par an, contre 3 100 TWh cumac sur les quatre années de la cinquième période, soit 775 par an. Ce total ne figure pas dans le décret, qui ne contient que des coefficients.',
          'À cette obligation dite classique s’ajoute une obligation distincte au bénéfice des ménages en situation de précarité énergétique (article L221-1-1). Elle vaut l’obligation classique multipliée par un coefficient, 0,364 pour la sixième période, soit 280 TWh cumac par an selon la DGEC. Seuls des certificats identifiés comme « précarité » peuvent la couvrir.',
        ],
        schema: 'periodes',
        legendeSchema: 'Le dispositif fonctionne par périodes pluriannuelles. La sixième, en cours, va de 2026 à 2030.',
      },
      {
        titre: 'Comment un obligé s’en acquitte',
        paragraphes: [
          'La loi laisse plusieurs voies. L’obligé peut réaliser des économies d’énergie « directement ou indirectement », c’est-à-dire financer des opérations chez ses clients ou chez d’autres consommateurs en échange des certificats qu’elles produisent. Il peut acquérir des certificats auprès d’autres détenteurs, sur le registre national. Il peut déléguer tout ou partie de son obligation à un délégataire. Il peut enfin contribuer à des programmes agréés, dans la limite d’un plafond.',
          'À l’issue de la période, l’obligé « justifie de l’accomplissement de ses obligations en produisant des certificats » (article L221-2). Les certificats détenus sur son compte sont alors annulés à hauteur de l’obligation. S’il en manque, le ministre le met en demeure d’acquérir les certificats manquants dans un délai donné. Pour la cinquième période, cette réconciliation a commencé le 1er juillet 2026, avec un délai laissé jusqu’au 31 décembre 2026.',
          'Passé ce délai, la pénalité s’applique : la loi fixe un plafond de 0,02 euro par kilowattheure (article L221-4), et le décret fixe le montant à 0,015 euro par kWh cumac manquant pour l’obligation classique et 0,02 euro pour l’obligation précarité (article R222-2). Autrement dit 15 et 20 euros par MWh cumac. C’est cette pénalité qui donne sa valeur au certificat : un obligé a intérêt à obtenir ses certificats tant que cela lui coûte moins que la pénalité.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'La prime CEE n’est pas une aide de l’État : c’est l’argent d’un obligé, ou d’un délégataire, qui achète ainsi les certificats que produira votre opération. La DGEC le rappelle : le coût du dispositif, supporté par les vendeurs d’énergie, est répercuté sur la facture de leurs clients. C’est pourquoi la contrepartie proposée varie d’un acteur à l’autre.',
          'L’obligé, ou son délégataire, est le demandeur des certificats. Le ministère le dit sans détour dans ses questions-réponses : le demandeur « est responsable des manquements au cadre réglementaire », quelle que soit l’origine des informations erronées, bénéficiaire ou professionnel. C’est lui que le Pôle national des certificats d’économies d’énergie (PNCEE) contrôle et sanctionne. Les exigences documentaires qu’il vous impose (attestation sur l’honneur, facture détaillée, contrôles sur site) sont la conséquence directe de cette responsabilité.',
          'Un maître d’ouvrage ne traite donc jamais avec l’État, mais avec un demandeur ou un intermédiaire qui agit pour lui. Savoir qui porte l’obligation et qui déposera le dossier est la première question à poser.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Croire que la prime est une subvention publique : elle vient d’un obligé qui achète des certificats, et ses conditions sont contractuelles.',
          'Confondre obligé, délégataire et mandataire : seuls les deux premiers portent l’obligation et déposent en leur nom.',
          'Oublier les périodes : les règles d’une opération dépendent de sa date d’engagement, et un changement de période change les coefficients et parfois les fiches.',
        ],
      },
    ],
    aRetenir: [
      'L’obligé est un vendeur d’énergie au-delà d’un seuil ; son obligation, en kWh cumac, se calcule sur ses ventes et se règle en certificats à la fin de chaque période.',
      'Il s’en acquitte en finançant des opérations, en achetant des certificats, en déléguant ou en contribuant à des programmes ; sinon il paie 0,015 euro par kWh cumac manquant, 0,02 pour la précarité.',
      'La prime que vous recevez est l’argent d’un obligé ou d’un délégataire, et c’est lui, demandeur, qui répond des manquements devant le PNCEE.',
    ],
    sources: [SRC.l2211, SRC.codeL, SRC.codeR, SRC.sanctions, SRC.decretP6, SRC.webinaireP6, SRC.lettreJuil2026, SRC.bilan2024, SRC.questionsReponses, SRC.dispositif],
  },
  {
    slug: 'delegataire',
    terme: 'Délégataire',
    resume: 'Celui à qui un obligé délègue tout ou partie de son obligation.',
    dateMaj: '2026-09-20',
    intro: 'Le délégataire reçoit d’un obligé tout ou partie de son obligation d’économies d’énergie. Une fois sa délégation validée par le ministère, il est lui-même considéré comme un obligé pour ce volume, avec les mêmes devoirs : réunir les certificats, ou payer la pénalité. Pour un maître d’ouvrage, c’est un interlocuteur de même rang que l’obligé.',
    schemas: ['delegation'],
    sections: [
      {
        titre: 'Ce qu’est une délégation',
        paragraphes: [
          'La délégation existe pour qu’un vendeur d’énergie, dont ce n’est pas le métier, puisse confier son obligation à un acteur spécialisé. Le code de l’énergie permet à un obligé de déléguer « la totalité de son obligation » de la période à un tiers, ou « une partie de son obligation » à un ou plusieurs tiers (article R221-5). La délégation partielle a un plancher : chaque délégation ne peut être inférieure à 1 milliard de kWh cumac avant la sixième période, et à 2 milliards à compter de celle-ci.',
          'La base légale se lit à l’article L221-1-1 pour l’obligation précarité, qui peut être remplie « en la déléguant pour tout ou partie à un tiers », et à l’article L221-12, qui renvoie au décret « les conditions de délégation de tout ou partie des obligations ». L’article L221-1 lui-même ne parle pas de délégation : c’est le décret qui l’organise.',
          'Un obligé qui délègue la totalité de ses obligations n’est plus considéré comme soumis à obligation. Un délégataire, en revanche, ne peut pas déléguer à son tour, « même partiellement ». La délégation ne vaut que pour une période et se renouvelle à chaque période.',
        ],
        schema: 'delegation',
        legendeSchema: 'L’obligation change de mains par contrat : le délégataire devient obligé pour le volume délégué, et c’est lui qui rend les certificats ou paie la pénalité.',
      },
      {
        titre: 'Les conditions pour devenir délégataire',
        paragraphes: [
          'L’article R221-6 fixe ce que le délégataire doit justifier : recevoir au total un volume minimal d’obligations, 150 millions de kWh cumac pour la cinquième période et 300 millions à partir de la sixième ; disposer d’un système de management de la qualité couvrant son activité CEE, certifié par un organisme accrédité ; établir sa capacité technique et financière, bilans à l’appui ; produire les certificats de régularité fiscale et sociale prévus par le code de la commande publique.',
          'Le dossier est transmis au ministre avec le contrat de délégation signé, qui précise le type de délégation, la catégorie d’obligation, le volume, la période et une clause de remise de l’obligation en cas de défaillance. Le ministre dispose de deux mois pour se prononcer. À réception de la réponse favorable, ou à l’expiration du délai, le délégataire « est considéré comme une personne soumise à une obligation d’économies d’énergie pour un volume égal à la somme des obligations déléguées ».',
          'C’est le Pôle national des certificats d’économies d’énergie (PNCEE) qui instruit et valide ce statut. Au 5 juin 2026, la liste publiée par le ministère comptait vingt délégataires validés pour la sixième période.',
        ],
      },
      {
        titre: 'Ce que le délégataire porte',
        paragraphes: [
          'Étant considéré comme obligé, le délégataire doit rendre des certificats en fin de période. S’il en manque, la mise en demeure et la pénalité de l’article L221-4 s’appliquent à lui comme à tout obligé ; c’est la lecture combinée des textes, aucune phrase ne le dit isolément. En cas de défaillance du délégataire, l’article R221-7 remet les obligations à la charge de chaque délégant.',
          'Le délégataire dépose les demandes de certificats en son nom. Il est donc demandeur, premier détenteur des certificats, et responsable des manquements devant le PNCEE. Si sa certification qualité est suspendue, il doit en informer sans délai le ministre et ses délégants, et ne peut plus déposer tant qu’il n’a pas justifié du retour aux conditions.',
          'Un point de calendrier compte pour vos opérations : le ministère précise que le délégataire ne peut avoir de rôle actif et incitatif « qu’après avoir eu la validation de son statut de délégataire par le PNCEE ». Une opération engagée avant cette validation ne peut pas être valorisée par lui.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Pour un maître d’ouvrage ou un installateur, un délégataire est un interlocuteur équivalent à l’obligé : il finance la contribution, dépose le dossier, répond des contrôles. La question n’est pas de savoir s’il vaut « moins » qu’un vendeur d’énergie, mais s’il est bien validé pour la période en cours, ce que la liste publique permet de vérifier.',
          'Le délégataire se distingue du mandataire. Le délégataire porte l’obligation et dépose en son nom ; le mandataire agit au nom d’un demandeur, sans porter d’obligation. Les deux peuvent intervenir sur le même chantier : un mandataire peut monter le dossier qu’un délégataire déposera.',
          'Pour un apporteur d’affaires, le nom du délégataire qui valorisera l’opération doit être connu avant l’engagement des travaux : c’est lui, ou une personne qui lui est liée par contrat, qui doit formaliser la contribution au bon moment.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Engager une opération avec un délégataire dont le statut n’est pas encore validé pour la période : elle ne pourra pas être valorisée par lui.',
          'Prendre un mandataire pour un délégataire, ou l’inverse : l’un porte l’obligation, l’autre non.',
          'Supposer qu’une délégation validée pour la cinquième période vaut pour la sixième : elle se renouvelle à chaque période.',
        ],
      },
    ],
    aRetenir: [
      'Un délégataire reçoit par contrat tout ou partie de l’obligation d’un obligé ; validé par le ministère, il est considéré comme obligé pour ce volume.',
      'Il doit justifier d’un volume minimal, d’une certification qualité et de sa capacité financière ; la délégation vaut pour une période et ne peut pas être sous-déléguée.',
      'Il dépose en son nom et répond des manquements ; son rôle actif et incitatif ne peut commencer qu’après validation de son statut.',
    ],
    sources: [SRC.r2215, SRC.codeR, SRC.codeL, SRC.questionsReponses, SRC.delegatairesP6, SRC.bilan2024, SRC.webinaireP6, SRC.modalitesDepot],
  },
  {
    slug: 'mandataire',
    terme: 'Mandataire',
    resume: 'Celui qui agit au nom du bénéficiaire ou de l’obligé, sans porter lui-même l’obligation.',
    dateMaj: '2026-09-20',
    intro: 'Le mandataire agit au nom d’un autre : il constitue le dossier, signe ou dépose à sa place, mais ne porte ni l’obligation ni la qualité de demandeur. C’est la position d’Ultra Énergie. Elle est définie par le code civil et encadrée, dans le dispositif CEE, par les pièces que le mandat doit contenir.',
    schemas: ['mandat'],
    sections: [
      {
        titre: 'Un mandat, au sens du code civil',
        paragraphes: [
          'Le mandat est défini à l’article 1984 du code civil : « un acte par lequel une personne donne à une autre le pouvoir de faire quelque chose pour le mandant et en son nom ». Le mandataire « ne peut rien faire au-delà de ce qui est porté dans son mandat » (article 1989) et « répond des fautes qu’il commet dans sa gestion » (article 1992). En retour, le mandant « est tenu d’exécuter les engagements contractés par le mandataire, conformément au pouvoir qui lui a été donné » (article 1998).',
          'En clair : le mandataire agit au nom d’un autre, dans les limites écrites de son mandat ; ce qu’il signe engage le mandant ; il répond de ses fautes de gestion envers le mandant.',
        ],
      },
      {
        titre: 'Le mandat dans les textes CEE',
        paragraphes: [
          'Le mandat permet à un demandeur de faire monter ses dossiers par un tiers sans déplacer sa responsabilité. Les textes CEE ne définissent pas le mandataire ; ils disent ce que le mandat doit contenir. L’annexe 2 de l’arrêté du 4 septembre 2014 pose la règle : « si une tierce personne constitue en tout ou partie un dossier au nom d’un demandeur, la demande comporte un exemplaire du mandat ». Le mandat précise, pour le mandant et pour le mandataire, le nom, l’adresse du siège, le numéro SIREN, le nom et la qualité du signataire ; puis sa durée ; puis son périmètre détaillé, par exemple le dépôt des demandes ou les relations avec l’administration.',
          'L’annexe 5 du même arrêté, dans sa version applicable au 1er septembre 2026, prévoit un second cas : le contrat qui porte la contribution du demandeur « peut être signé par un mandataire agissant en lieu et place du bénéficiaire ou du demandeur ». Elle ajoute une condition de calendrier : « le contrat de mandat est signé avant la date de signature de tout contrat par le mandataire au nom du mandant ».',
          'Le mandataire apparaît aussi dans les règles de contrôle : depuis 2023, le dirigeant d’un organisme d’inspection ne peut diriger ni un demandeur « ni le mandataire de ce dernier », et les textes de 2025-2026 exigent l’absence de lien de contrôle, direct ou indirect, entre l’organisme, le demandeur et son mandataire.',
        ],
        schema: 'mandat',
        legendeSchema: 'Le mandataire agit au nom du demandeur, obligé ou délégataire, et peut aussi représenter le bénéficiaire. L’obligation et la responsabilité du demandeur ne bougent pas.',
      },
      {
        titre: 'Ce qui ne change pas',
        paragraphes: [
          'Le mandat ne déplace pas la responsabilité. Le ministère l’écrit dans ses questions-réponses : le demandeur, premier détenteur des certificats, « est responsable des manquements au cadre réglementaire », quelle que soit l’origine des informations erronées. La page consacrée au dépôt des dossiers ajoute qu’il est « de la responsabilité du demandeur de s’assurer du respect des exigences » de l’annexe 5 et des fiches.',
          'Le mandataire n’est pas un obligé : il n’apparaît ni à l’article L221-1, ni dans les conditions de la délégation. Aucun texte ne l’écrit en une phrase ; cela ressort de la lecture des articles. Il ne porte donc ni obligation ni pénalité de fin de période, mais sa responsabilité contractuelle envers son mandant, et sa responsabilité pénale en cas de fraude, comme tout acteur.',
        ],
      },
      {
        titre: 'Deux mandats possibles, et un regroupement qui n’en est pas un',
        paragraphes: [
          'Le mandataire du demandeur agit pour un obligé ou un délégataire : il repère les opérations, réunit les pièces, prépare le dépôt, et peut signer en son nom le contrat qui matérialise le rôle actif et incitatif. Le mandataire du bénéficiaire agit pour le maître d’ouvrage et signe en son nom le contrat de contribution, ce que l’annexe 5 autorise, toujours avec un mandat écrit antérieur.',
          'Le regroupement est autre chose : plusieurs personnes éligibles désignent un « regroupeur » pour atteindre ensemble le seuil de dépôt, et le ministère précise qu’il « n’a en théorie pas de rôle dans la mise en œuvre des opérations » des autres membres. Un mandataire n’est pas un regroupeur, et n’a pas besoin d’être éligible.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Pour un maître d’ouvrage, travailler avec un mandataire, c’est confier la constitution du dossier à quelqu’un qui n’a pas d’obligation à remplir et qui adresse l’opération à un demandeur. Ce qu’il faut vérifier, c’est le mandat lui-même : pour qui il agit, sur quel périmètre, jusqu’à quand, et qu’il a été signé avant le premier contrat. Le demandeur final doit être identifiable, puisque c’est lui qui répondra du dossier.',
          'Pour un installateur, les pièces ne changent pas : attestation sur l’honneur, facture détaillée et justificatifs de la fiche restent les mêmes, seul l’interlocuteur qui les vérifie avant le dépôt change. Pour un apporteur d’affaires, la chronologie est celle du rôle actif et incitatif : le mandat précède tout contrat signé au nom du mandant, et la contribution précède l’engagement des travaux.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Un mandat verbal ou signé après coup : la demande doit comporter un exemplaire du mandat, et le mandat précède tout contrat signé au nom du mandant.',
          'Un périmètre flou : le mandataire ne peut rien faire au-delà de ce que le mandat écrit.',
          'Croire que l’intermédiaire porte la responsabilité du dossier : elle reste au demandeur, premier détenteur des certificats.',
        ],
      },
    ],
    aRetenir: [
      'Un mandataire agit au nom d’un autre, dans les limites écrites de son mandat ; il ne porte ni l’obligation ni la qualité de demandeur.',
      'Le mandat doit être joint à la demande, identifier les parties, fixer sa durée et son périmètre, et précéder tout contrat signé au nom du mandant.',
      'La responsabilité du dossier reste au demandeur ; le mandataire répond de ses fautes envers son mandant, et pénalement en cas de fraude.',
    ],
    sources: [SRC.codeCivilMandat, SRC.arreteDemande, SRC.annexe5, SRC.modalitesDepot, SRC.questionsReponses, SRC.arreteControles, SRC.webinaireP6, SRC.l2211, SRC.codeR],
  },
  {
    slug: 'fiche-operation-standardisee',
    terme: 'Fiche d’opération standardisée',
    resume: 'Le document qui fixe, pour une opération donnée, le forfait de kWh cumac et les conditions d’éligibilité.',
    dateMaj: '2026-09-20',
    intro: 'Une fiche d’opération standardisée décrit une opération courante d’économies d’énergie et fixe, une fois pour toutes, le volume de certificats qu’elle vaut. Elle dit à quels bâtiments elle s’applique, à quelles conditions, sur quelle durée, et avec quel forfait. Neuf certificats sur dix délivrés en cinquième période reposent sur une fiche.',
    schemas: ['anatomie-fiche'],
    sections: [
      {
        titre: 'Ce que c’est',
        paragraphes: [
          'Le code de l’énergie distingue trois façons d’obtenir des certificats : les opérations standardisées, les opérations spécifiques et les programmes (article R221-14). Les premières sont « définies par arrêté du ministre chargé de l’énergie et assorties d’un volume forfaitaire d’économies d’énergie », calculé par rapport à une situation de référence.',
          'Cet arrêté est celui du 22 décembre 2014, modifié depuis par une longue série d’arrêtés : c’est le catalogue. Le ministère le décrit ainsi : les fiches « correspondent à des opérations couramment réalisées pour lesquelles une valeur forfaitaire de certificats a été définie » ; elles « définissent les exigences requises pour la délivrance de certificats et les montants forfaitaires d’économies d’énergie associés, exprimés en kWh cumac ». Le catalogue comptait 221 fiches au 16 septembre 2026 selon le décompte du ministère, réparties en six secteurs : agriculture, résidentiel, tertiaire, industrie, réseaux et transport.',
          'Les fiches naissent dans les groupes de travail sectoriels de l’Association technique énergie environnement (ATEE), sont expertisées par l’ADEME et validées par la Direction générale de l’énergie et du climat (DGEC), puis passent devant le Conseil supérieur de l’énergie avant publication par arrêté. Une fiche explicative, non réglementaire, accompagne souvent la fiche pour en éclairer l’usage.',
        ],
      },
      {
        titre: 'Comment une fiche est construite',
        paragraphes: [
          'Chaque fiche porte un code, par exemple BAR-EN-101 : le premier bloc désigne le secteur (BAR pour les bâtiments résidentiels, BAT pour le tertiaire, IND pour l’industrie, AGRI, RES, TRA), le deuxième la famille d’opération (EN pour l’enveloppe, TH pour le thermique, EQ pour l’équipement), le troisième un numéro d’ordre. Cette lecture est d’usage ; aucun texte ne la définit comme règle.',
          'Le corps de la fiche suit toujours les mêmes rubriques : le secteur d’application, la dénomination de l’opération, les conditions pour la délivrance des certificats, la durée de vie conventionnelle, puis le montant en kWh cumac, souvent sous forme de tableau selon la zone climatique, la surface ou la puissance. En annexe, la fiche définit la partie A de l’attestation sur l’honneur que le bénéficiaire et le professionnel devront signer ; le ministère précise qu’elle « fait partie intégrante » de la fiche.',
          'Le forfait est une estimation conventionnelle, pas un calcul au cas par cas. La doctrine de la DGEC le formule ainsi : il est « fondé sur une estimation conventionnelle des économies d’énergie générées par rapport à une situation de référence », à partir de paramètres « difficilement falsifiables ». Deux opérations conformes à la même fiche, avec les mêmes paramètres, valent le même volume, quel que soit le demandeur.',
        ],
        schema: 'anatomie-fiche',
        legendeSchema: 'Un code, cinq rubriques, une attestation en annexe : le forfait en kWh cumac est le résultat des rubriques qui le précèdent.',
      },
      {
        titre: 'Les versions et la date d’engagement',
        paragraphes: [
          'Les fiches changent. Chaque arrêté modificatif révise, crée ou supprime des fiches, et précise à quelles opérations la nouvelle version s’applique : en pratique, aux opérations engagées à compter d’une date donnée. L’arrêté du 29 mai 2026, par exemple, entre en vigueur le 1er septembre 2026 « et s’applique aux opérations engagées à compter de cette date ». La version applicable à une opération est donc celle en vigueur à sa date d’engagement, c’est-à-dire à la signature du devis ou du bon de commande.',
          'Chaque version porte une mention comme « A64-6 » sur l’attestation ; le ministère publie un catalogue des versions avec leurs dates d’application. Une fiche créée ou modifiée après le 1er janvier 2022 et non modifiée pendant cinq ans est abrogée de droit (arrêté du 22 décembre 2014, article 1). La fiche BAR-EN-101, dans sa version actuelle, annonce ainsi sa propre abrogation au 1er mai 2027.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Pour un maître d’ouvrage, la fiche est le contrat technique de l’opération : si les conditions de la rubrique 3 ne sont pas remplies (résistance thermique, rendement, qualification de l’installateur, visite préalable), il n’y a pas de certificats, quelle que soit la qualité des travaux. Lire la fiche avant de signer évite les mauvaises surprises.',
          'Pour un installateur, la fiche dicte le contenu de la facture : la fiche BAR-EN-101 exige par exemple que la preuve de réalisation mentionne la surface, la marque, la référence, l’épaisseur et la résistance thermique de l’isolant, ainsi que la date de la visite technique. Une facture muette sur un de ces points fragilise le dossier.',
          'Pour un apporteur d’affaires, la fiche dit d’abord si l’opération existe : une opération sans fiche n’est pas perdue, mais elle relève du régime des opérations spécifiques, plus lourd. Le ministère précise en outre que certaines fiches du secteur industriel peuvent servir dans un autre secteur, à condition qu’aucune fiche équivalente n’y existe.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Appliquer une fiche à un bâtiment hors de son secteur d’application : la première rubrique se vérifie avant toutes les autres.',
          'Utiliser une version périmée ou anticipée : c’est la date d’engagement qui fixe la version, pas la date des travaux ni celle du dépôt.',
          'Lire le forfait comme une mesure : c’est une convention, et la fiche liste les seuls paramètres qui le font varier.',
          'Négliger l’attestation sur l’honneur : sa partie A est définie par la fiche elle-même, et le Pôle national des certificats d’économies d’énergie (PNCEE) la lit en premier.',
        ],
      },
    ],
    aRetenir: [
      'Une fiche fixe par arrêté, pour une opération courante, ses conditions et un forfait en kWh cumac ; le catalogue en comptait 221 en septembre 2026, en six secteurs.',
      'Cinq rubriques et une attestation en annexe : secteur, dénomination, conditions, durée de vie conventionnelle, montant.',
      'La version applicable est celle en vigueur à la date d’engagement ; une fiche non révisée pendant cinq ans disparaît.',
    ],
    sources: [SRC.delivrance, SRC.arreteStandardisees, SRC.standardisees, SRC.ateeFiches, SRC.doctrineFiches, SRC.arreteMai2026, SRC.ficheBarEn101, SRC.questionsReponses, SRC.lettreNov2025],
  },
  {
    slug: 'operation-specifique',
    terme: 'Opération spécifique',
    resume: 'L’opération qui ne relève d’aucune fiche standardisée et se calcule au cas par cas.',
    dateMaj: '2026-09-20',
    intro: 'Quand aucune fiche ne couvre une opération, le dispositif ne la refuse pas : il demande de démontrer les économies. C’est l’opération spécifique. Elle exige un audit, une situation de référence, un calcul propre au site et un temps de retour supérieur à trois ans, et le Pôle national des certificats d’économies d’énergie (PNCEE) l’instruit dossier par dossier.',
    schemas: ['bifurcation'],
    sections: [
      {
        titre: 'Ce que c’est',
        paragraphes: [
          'L’article R221-14 du code de l’énergie ouvre la délivrance de certificats à « la réalisation d’opérations spécifiques, lorsque l’action n’entre pas dans le champ d’une opération standardisée ». Le ministère y voit un moyen « d’encourager les opérations plus innovantes ». L’ATEE résume la différence : les montants « ne sont pas forfaitisés et sont propres à chaque opération », et « font l’objet d’un examen particulier par le PNCEE ».',
          'La part de ces opérations est faible en volume : 1,9 % des certificats délivrés en cinquième période, contre 89,8 % pour les opérations standardisées, selon la lettre d’information de novembre 2025. Mais chaque dossier pèse lourd, parce qu’il concerne souvent un site industriel ou un réseau.',
          'Le seuil de dépôt est plus bas que pour les opérations standardisées : 20 millions de kWh cumac par demande, contre 50 millions.',
        ],
        schema: 'bifurcation',
        legendeSchema: 'Une fiche existe : le forfait s’applique. Aucune fiche : on démontre, et le PNCEE dispose de six mois au lieu de deux.',
      },
      {
        titre: 'Ce qu’il faut démontrer',
        paragraphes: [
          'L’annexe 4 de l’arrêté du 4 septembre 2014 liste les pièces. Il faut établir la situation avant l’opération, à partir d’un audit énergétique réalisé moins de quatre ans avant l’engagement, conforme aux cahiers des charges de l’ADEME ou aux normes de la série NF EN 16247 pour l’industrie. Il faut ensuite établir la situation de référence, au sens de l’article R221-16 : l’état du parc pour l’enveloppe, l’état du marché ou la réglementation en vigueur pour le reste. Puis la situation après l’opération, et le volume demandé en kWh cumac.',
          'Deux conditions de fond s’ajoutent. L’article R221-17 exige que les économies « ne compensent le coût de l’investissement qu’après plus de trois ans » : une opération qui se rembourse plus vite est réputée rentable par elle-même et n’ouvre pas droit aux certificats. Le guide de l’ADEME parle de temps de retour brut. Et l’opération ne doit pas viser le seul respect de la réglementation en vigueur (article R221-15).',
          'Le dossier comprend enfin une attestation sur l’honneur signée par le bénéficiaire, attestant du rôle actif et incitatif du demandeur, et, pour certaines opérations, un mesurage après travaux : l’arrêté du 29 décembre 2014 prévoit une durée minimale de six mois, réduite à deux mois quand l’opération représente moins de 20 millions de kWh cumac.',
        ],
      },
      {
        titre: 'Le guide devenu opposable',
        paragraphes: [
          'Depuis l’arrêté du 18 avril 2025, les opérations spécifiques pour installations fixes « respectent les dispositions du guide technique pour le montage d’un dossier CEE dans le cadre d’une opération spécifique », dans sa version d’avril 2025. Ce guide, rédigé par l’ADEME et relu par la DGEC et l’ATEE, n’est donc plus un simple conseil.',
          'Il donne des repères utiles. La durée de vie de l’équipement est à justifier ; pour l’industrie, elle « se situe généralement entre 10 et 15 ans », et retenir plus de quinze ans demande une bonne argumentation. L’instruction dure six mois « si aucun complément administratif et/ou technique n’est nécessaire ». Et le guide livre un chiffre qui vaut avertissement : 70 % des dossiers expertisés par l’ADEME ont fait l’objet de demandes de compléments techniques, avec une baisse moyenne de 30 % du volume après réévaluation.',
          'Les écueils les plus fréquents, selon le même guide : un audit absent ou de qualité insuffisante, une situation de référence mal définie, une durée de vie erronée ou non justifiée.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Pour un industriel ou un exploitant de réseau, l’opération spécifique est la voie des projets sur mesure : récupération de chaleur, refonte d’un procédé, changement de vecteur énergétique. Elle demande d’anticiper : l’audit et l’étude de dimensionnement peuvent précéder l’engagement, et c’est même souhaitable, mais la contribution du demandeur, elle, doit toujours être formalisée avant l’engagement.',
          'Depuis 2025, une bonification existe pour les opérations spécifiques industrielles relevant du mécanisme d’ajustement carbone aux frontières, quand elles remplacent un vecteur fossile par un vecteur sans émission directe de CO2 : le volume est multiplié par deux, dans la limite d’un plafond lié aux dépenses éligibles (arrêté du 27 mars 2026). Les conditions de dates sont strictes et évoluent ; elles se vérifient dans le texte au moment du projet.',
          'Pour un apporteur d’affaires, le réflexe est de vérifier d’abord s’il existe une fiche : la voie spécifique ne s’ouvre que si aucune fiche ne couvre l’opération, et elle mobilise un bureau d’études.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Un temps de retour de trois ans ou moins : l’opération est irrecevable, même si les économies sont réelles.',
          'Un audit trop ancien, de plus de quatre ans avant l’engagement, ou hors cahier des charges.',
          'Une durée de vie affirmée sans justification : c’est l’un des trois écueils cités par le guide.',
          'Confondre le délai d’instruction, six mois pour un dossier complet, avec le délai de dépôt, douze mois après l’achèvement.',
        ],
      },
    ],
    aRetenir: [
      'Une opération spécifique est une opération sans fiche ; ses économies se démontrent site par site, avec audit, situation de référence et calcul en kWh cumac.',
      'Deux conditions de fond : un temps de retour supérieur à trois ans et une action qui dépasse le simple respect de la réglementation.',
      'Le guide ADEME d’avril 2025 est opposable pour les installations fixes ; le PNCEE instruit en six mois, et sept dossiers sur dix reçoivent des demandes de compléments.',
    ],
    sources: [SRC.delivrance, SRC.specifiques, SRC.arreteDemande, SRC.arreteModalites, SRC.arreteGuide, SRC.guideSpecifiques, SRC.arreteMacf, SRC.ateeSpecifiques, SRC.lettreNov2025, SRC.modalitesDepot],
  },
  {
    slug: 'role-actif-et-incitatif',
    terme: 'Rôle actif et incitatif',
    resume: 'L’exigence qui impose que l’engagement de prime précède la signature du devis.',
    dateMaj: '2026-09-20',
    intro: 'Le rôle actif et incitatif est la preuve que le demandeur de certificats a contribué à déclencher l’opération, et non qu’il l’a récupérée après coup. La règle tient en une chronologie : la contribution est formalisée au plus tard à la date d’engagement, c’est-à-dire à la signature du devis. C’est le motif de refus le plus simple à éviter.',
    schemas: ['chronologie-rai'],
    sections: [
      {
        titre: 'Ce que dit le texte',
        paragraphes: [
          'La définition est à l’article R221-22 du code de l’énergie : le demandeur « doit, à l’appui de sa demande, justifier de son rôle actif et incitatif dans la réalisation de l’opération ». Est considérée comme tel « toute contribution directe, quelle qu’en soit la nature, apportée, par le demandeur ou par l’intermédiaire d’une personne qui lui est liée contractuellement, à la personne bénéficiant de l’opération d’économies d’énergie et permettant la réalisation de cette dernière ».',
          'Trois mots portent la règle. Contribution : une prime, mais aussi un bon d’achat, un prêt bonifié, un audit ou un conseil personnalisé, un produit ou un service offert ; l’annexe 5 de l’arrêté du 4 septembre 2014 en donne la liste et exige que sa nature et sa valeur soient écrites. Directe : elle va au bénéficiaire, éventuellement par une personne liée au demandeur par contrat, un installateur ou un mandataire. Antérieure : « la contractualisation de cette contribution ou l’engagement écrit du demandeur intervient au plus tard à la date d’engagement de l’opération ».',
          'La date d’engagement est définie par l’annexe 5 : pour un particulier, la date d’acceptation du contrat, « matérialisée par la date de signature » du devis ou du bon de commande ; pour une personne morale, la signature du contrat de travaux, du devis ou de l’ordre de service. L’achèvement, lui, se lit à la date de la facture.',
        ],
        schema: 'chronologie-rai',
        legendeSchema: 'La contribution est formalisée par écrit avant que le bénéficiaire ne s’engage. Pour un particulier ou une copropriété, quatorze jours de tolérance après le devis, jamais après le début des travaux.',
      },
      {
        titre: 'La tolérance de quatorze jours',
        paragraphes: [
          'Depuis le décret du 26 décembre 2022, l’article R221-22 prévoit une exception pour deux catégories de bénéficiaires : « lorsque le bénéficiaire est une personne physique ou un syndicat de copropriétaires », la contractualisation ou l’engagement écrit « intervient au plus tard quatorze jours après la date d’engagement de l’opération et, en tout état de cause, avant la date de début de réalisation de l’opération ».',
          'Pour ces mêmes bénéficiaires, sur les opérations standardisées, la valeur de la contribution est fixée dans le même délai et « ne peut être révisée qu’au regard d’une réévaluation du volume réel de certificats » ou de la situation de précarité ; et la contribution est effectivement versée « au plus tard à la date à laquelle la demande de certificats est déposée ».',
          'Pour une entreprise, une collectivité ou un bailleur, la tolérance n’existe pas : la règle reste « au plus tard à la date d’engagement ». Un devis signé la veille de l’engagement de prime est un dossier perdu, quelle que soit la qualité des travaux. Aucun texte n’énonce cette sanction en ces termes ; c’est la conséquence directe de la chronologie exigée.',
        ],
      },
      {
        titre: 'Pourquoi cette règle existe',
        paragraphes: [
          'Le dispositif ne rémunère pas les économies d’énergie en général : il rémunère celles que le demandeur a contribué à faire naître. Le certificat suppose une action « additionnelle par rapport à son activité habituelle », selon l’article L221-7. Si la prime arrivait après la décision de travaux, elle n’aurait rien déclenché ; elle paierait une opération qui aurait eu lieu de toute façon.',
          'La DGEC le formule simplement : après avoir aidé les consommateurs à réduire leur consommation « et en avoir apporté la preuve », les fournisseurs obtiennent des certificats. Le rôle actif et incitatif est cette preuve. C’est aussi pour cela que la contribution doit être écrite, datée et chiffrée : un engagement oral ne se contrôle pas.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Pour un maître d’ouvrage, la règle se résume à un ordre : obtenir l’engagement écrit de contribution, puis signer le devis. Le document qui matérialise cet engagement, souvent appelé cadre contribution, indique la nature de la contribution, sa valeur et l’identité du demandeur. Il fait partie des pièces archivées et contrôlées.',
          'Pour un installateur, le devis ne doit pas être signé avant que le demandeur se soit engagé, sauf pour un particulier ou une copropriété, dans la limite de quatorze jours et avant le début des travaux. Certaines fiches ajoutent leurs propres délais ; BAR-EN-101 impose par exemple sept jours francs entre l’acceptation du devis et le début de la pose.',
          'Pour un apporteur d’affaires, le rôle actif et incitatif est ce qui rend le signalement précoce indispensable : une opération signalée après la signature du marché n’est plus valorisable, et le demandeur ne peut pas revenir en arrière. C’est également pour cette raison qu’un délégataire ne peut engager d’opérations qu’après validation de son statut.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Le devis signé avant l’engagement de contribution, hors tolérance : le dossier est inéligible.',
          'Appliquer la tolérance de quatorze jours à une entreprise ou à une collectivité : elle ne vaut que pour les personnes physiques et les copropriétés.',
          'Un engagement oral ou non daté : la contribution se prouve par écrit, avec sa nature et sa valeur.',
          'Oublier que le début des travaux borne tout : même dans la tolérance, la contribution doit précéder la première intervention.',
        ],
      },
    ],
    aRetenir: [
      'Le demandeur doit prouver une contribution directe, écrite, chiffrée, formalisée au plus tard à la date d’engagement, c’est-à-dire à la signature du devis.',
      'Particuliers et copropriétés : quatorze jours de tolérance après le devis, et toujours avant le début des travaux ; personnes morales : aucune tolérance.',
      'La règle protège l’additionnalité du dispositif : sans preuve que la prime a déclenché l’opération, pas de certificats.',
    ],
    sources: [SRC.r22122, SRC.annexe5, SRC.arreteDemande, SRC.questionsReponses, SRC.codeL, SRC.webinaireP6, SRC.modalitesDepot, SRC.ficheBarEn101],
  },
  {
    slug: 'pncee',
    terme: 'PNCEE',
    resume: 'Le Pôle national des certificats d’économies d’énergie, qui instruit et délivre les certificats.',
    dateMaj: '2026-09-20',
    intro: 'Le Pôle national des certificats d’économies d’énergie est le service de l’État qui reçoit les demandes, les instruit, délivre les certificats, contrôle les opérations et sanctionne les manquements. Il valide aussi le statut des délégataires. Tout dossier CEE finit sur son bureau, et c’est à ses exigences que les pièces d’un chantier sont préparées.',
    schemas: ['parcours-dossier'],
    sections: [
      {
        titre: 'Ce que c’est',
        paragraphes: [
          'Le PNCEE est un service du ministère chargé de l’énergie, rattaché à la Direction générale de l’énergie et du climat. La Cour des comptes le décrit comme un « service à compétence nationale placé sous l’égide de la DGEC », chargé de la mise en œuvre opérationnelle du dispositif, tandis qu’un bureau de la même direction prépare les textes. Le bilan annuel du ministère résume sa mission : « effectuer les vérifications, validations et contrôles des dépôts de CEE » et valider « le statut de délégataire pour les acteurs qui en font la demande ».',
          'C’est un service de taille modeste au regard des volumes : une vingtaine d’équivalents temps plein en 2023 selon la Cour des comptes, face à 4 733 TWh cumac de certificats classiques délivrés depuis 2006 et à un stock de 241 TWh cumac en cours d’instruction au 1er juillet 2026.',
        ],
      },
      {
        titre: 'Le parcours d’un dossier',
        paragraphes: [
          'Seules les personnes éligibles de l’article L221-7 (obligés, délégataires, collectivités, bailleurs sociaux, Agence nationale de l’habitat) peuvent déposer, et à condition d’avoir un compte au registre national. Une demande ne porte que sur une catégorie : standardisées, spécifiques ou programmes. Elle doit atteindre un volume minimal fixé par l’article 8 de l’arrêté du 29 décembre 2014 : 50 millions de kWh cumac pour les opérations standardisées, 20 millions pour les spécifiques et pour les programmes. Chaque demandeur peut toutefois déposer, une fois par année civile et par catégorie, une demande sous le seuil.',
          'Une demande se dépose « moins de 12 mois après la date d’achèvement » de l’opération (arrêté du 4 septembre 2014, article 4-1) ; le ministère cite le non-respect de ce délai parmi les non-conformités les plus courantes. À compter de la réception d’un dossier complet, le ministre délivre les certificats dans un délai de deux mois pour les opérations standardisées et de six mois pour les opérations spécifiques (article R221-22). Le délai court à compter d’un dossier complet. Les certificats sont alors inscrits sur le compte du demandeur au registre national.',
        ],
        schema: 'parcours-dossier',
        legendeSchema: 'Des opérations achevées à un compte sur le registre : un seuil de dépôt, une instruction en deux ou six mois, des contrôles avant et après.',
      },
      {
        titre: 'Les contrôles',
        paragraphes: [
          'Il y a deux étages de contrôle. Avant le dépôt, la loi impose au demandeur de justifier de contrôles « effectués sur les opérations d’économies d’énergie réalisées », à ses frais, sur un échantillon tiré au hasard, par un organisme accrédité (article L221-9). L’arrêté du 28 septembre 2021 fixe les taux, fiche par fiche : dans le cas général, pour les opérations engagées depuis 2025, 15 % de contrôles satisfaisants sur le lieu des opérations et 30 % par contact ; certaines fiches sont contrôlées sur site à 100 %. L’organisme doit être indépendant du demandeur, de son mandataire et de l’installateur.',
          'Après la délivrance, le PNCEE contrôle lui-même : contrôles documentaires, contrôles sur site qu’il commande, publipostage auprès des bénéficiaires. Il a fait état, en décembre 2025, de plus de 4 500 contrôles sur site mandatés dans l’année, et de plus de 120 TWh cumac rejetés ou retirés depuis 2016. La Cour des comptes a relevé des taux de non-conformité « compris entre 8,7 % et 39,4 % » chez les particuliers, contre moins de 0,6 % chez les professionnels : c’est ce qui explique la sévérité croissante des contrôles.',
        ],
      },
      {
        titre: 'Les sanctions',
        paragraphes: [
          'L’article L222-2 du code de l’énergie donne au ministre, après mise en demeure, ou lorsque des certificats ont été « indûment délivrés », le pouvoir de prononcer une sanction pécuniaire, d’annuler des certificats, de suspendre l’instruction des demandes ou de les rejeter. Les décisions sont motivées et publiées au Journal officiel. Lorsqu’un contrôle révèle plus de 10 % de manquements sur le volume contrôlé, le ministre peut imposer des vérifications supplémentaires, aux frais du demandeur.',
          'Ces sanctions visent le demandeur, premier détenteur des certificats, responsable des manquements « quelle que soit l’origine de ces informations ». En cas de fraude, la responsabilité pénale de chaque acteur peut être engagée.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Un maître d’ouvrage ne s’adresse pas au PNCEE : c’est le demandeur qui dépose. Mais les pièces qu’on lui demande (attestation sur l’honneur, facture détaillée, photographies, accueil d’un contrôleur) sont celles que le PNCEE attend. Être contacté par courrier ou par téléphone plusieurs mois après les travaux est normal.',
          'Un installateur doit savoir qu’un organisme d’inspection peut se présenter sur le chantier avant le dépôt, et que les taux de contrôle montent d’année en année. Pour tous, le calendrier compte : douze mois au plus entre l’achèvement et le dépôt, puis deux ou six mois d’instruction. La contrepartie versée au bénéficiaire suit le contrat conclu avec le demandeur, pas la date de délivrance.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Croire qu’on peut déposer soi-même : seules les personnes éligibles, titulaires d’un compte au registre, déposent.',
          'Laisser passer douze mois après la facture : la demande est alors irrecevable.',
          'Refuser ou ignorer un contrôle : l’opération, et parfois le dossier, en dépendent.',
          'Confondre le délai d’instruction et la date de versement de la contribution, qui relève du contrat avec le demandeur.',
        ],
      },
    ],
    aRetenir: [
      'Le PNCEE, service de la DGEC, instruit les demandes, délivre les certificats, contrôle avant et après délivrance, sanctionne, et valide les délégataires.',
      'Un dossier se dépose sous douze mois après l’achèvement, au-dessus d’un seuil de 50 GWh cumac pour les opérations standardisées, et s’instruit en deux mois, six pour les opérations spécifiques.',
      'Les contrôles avant dépôt sont à la charge du demandeur, par organisme accrédité indépendant ; le demandeur répond seul des manquements devant le pôle.',
    ],
    sources: [SRC.modalitesDepot, SRC.r22122, SRC.codeR, SRC.codeL, SRC.l2222, SRC.arreteDemande, SRC.arreteModalitesConsolide, SRC.arreteControles, SRC.webinaireP6, SRC.lettreJuil2026, SRC.bilan2024, SRC.courDesComptes, SRC.questionsReponses, SRC.registre],
  },
  {
    slug: 'coup-de-pouce',
    terme: 'Coup de pouce',
    resume: 'La bonification qui majore la prime de certaines opérations, sous conditions.',
    dateMaj: '2026-09-20',
    intro: 'Un Coup de pouce est une bonification : pour certaines opérations que l’État veut encourager, le volume de certificats d’une fiche est multiplié par un coefficient. En contrepartie, le demandeur signe une charte qui l’engage, notamment sur la contribution versée au bénéficiaire. La prime monte, et les contrôles aussi.',
    schemas: ['multiplicateur'],
    sections: [
      {
        titre: 'Ce que c’est',
        paragraphes: [
          'Le ministère définit les bonifications comme ce qui « augmente les certificats accordés pour certaines opérations afin d’en encourager le développement ». Les Coups de pouce en sont la forme la plus connue : ils sont inscrits dans l’arrêté du 29 décembre 2014, aux articles 3-4 à 3-8, et chacun renvoie à une charte d’engagement publiée en annexe.',
          'La mécanique tient en trois pièces. Une fiche, qui donne le volume de base. Un coefficient multiplicateur, fixé par l’arrêté pour chaque fiche concernée. Une charte, que le demandeur signe et dont il respecte les engagements, en particulier une contribution minimale au bénéficiaire quand la charte en prévoit une. L’arrêté le dit ainsi : sont bonifiées les opérations « pour lesquelles le demandeur est signataire » de la charte « et lorsque le rôle actif et incitatif prévu à l’article R221-22 du code de l’énergie est conforme à ces chartes ».',
          'Les signataires sont, selon les pages du ministère, principalement les vendeurs d’énergie et leurs délégataires. Depuis l’arrêté du 21 décembre 2025, les éligibles qui ne sont pas obligés, collectivités ou bailleurs par exemple, sont dispensés de signer la charte quand ils agissent sur leur propre patrimoine.',
        ],
        schema: 'multiplicateur',
        legendeSchema: 'Le forfait de la fiche, multiplié par le coefficient de la charte, donne un volume plus grand pour la même opération. Les hauteurs du dessin sont des proportions, pas des valeurs.',
      },
      {
        titre: 'Les Coups de pouce en vigueur',
        paragraphes: [
          'Au 20 septembre 2026, le ministère publie des pages pour les Coups de pouce « Chauffage », « Chauffage des bâtiments résidentiels collectifs et tertiaires », « Rénovation d’ampleur des maisons et appartements individuels » et « Rénovation performante de bâtiment résidentiel collectif », ainsi que pour des bonifications sur les véhicules électriques et le fret ferroviaire. Isolation, thermostat, pilotage connecté et covoiturage ont pris fin entre 2021 et 2024.',
          'Les coefficients sont propres à chaque fiche. Pour le Coup de pouce Chauffage, l’arrêté prévoit par exemple un coefficient de 5 pour le remplacement d’une chaudière au charbon, au fioul ou au gaz par une pompe à chaleur air/eau ou eau/eau (fiches BAR-TH-171 et BAR-TH-172), ou par une chaudière biomasse (BAR-TH-113). Pour le chauffage des bâtiments collectifs et tertiaires, les coefficients vont de 3 à 5 selon la technologie.',
          'Les dates sont strictes : l’opération doit être engagée après la signature et la prise d’effet de la charte par le demandeur, et souvent avant une date limite d’engagement. Ces bornes changent d’un arrêté à l’autre et se vérifient dans la charte en vigueur au moment de l’engagement.',
        ],
      },
      {
        titre: 'Ce que la charte impose',
        paragraphes: [
          'La charte fixe ce que le signataire doit au bénéficiaire et à l’administration. Selon les Coups de pouce, elle prévoit des montants minimaux de contribution ; pour la rénovation performante des bâtiments collectifs, par exemple, la page du ministère affiche des minima au mètre carré. Pour le Coup de pouce Chauffage, en revanche, les montants minimaux des anciennes chartes « ne sont plus applicables pour les opérations engagées à compter du 1er janvier 2026 » : la contribution dépend alors de l’offre de chaque signataire.',
          'La charte impose aussi un bilan mensuel transmis à la Direction générale de l’énergie et du climat (DGEC) et des engagements de conduite. L’article 3-8 de l’arrêté permet au ministre de retirer à un signataire le bénéfice de la charte, après mise en demeure non suivie d’effet, en cas de manquement à la charte ou aux règles du dispositif. Les bonifications ne se cumulent pas entre elles. Et elles pèsent lourd : 37,9 % du volume attendu des opérations standardisées engagées de janvier 2022 à septembre 2025, selon la DGEC, pour un plafond annoncé de 25 % de l’obligation en cinquième période.',
        ],
      },
      {
        titre: 'Ce que ça change pour vous',
        paragraphes: [
          'Pour un maître d’ouvrage, un Coup de pouce change l’ordre de grandeur de la contribution, pas les règles de fond : la fiche et le rôle actif et incitatif restent à respecter, et la contribution doit venir d’un signataire de la charte, ce que les listes publiées par le ministère permettent de vérifier.',
          'Pour un installateur, les Coups de pouce concentrent les contrôles. L’arrêté du 28 septembre 2021 prévoit des contrôles sur site à 100 % pour certaines fiches bonifiées, et fait monter le taux des pompes à chaleur individuelles à 25 % en 2026, 50 % en 2027, puis 100 % à compter de 2028. Les exigences de la fiche, visite préalable, qualification, mentions sur la facture, y sont vérifiées de près.',
          'Pour un apporteur d’affaires, un Coup de pouce est une raison de plus de signaler tôt : la date d’engagement doit suivre la prise d’effet de la charte du demandeur et précéder toute date limite, et les bonifications changent souvent.',
        ],
      },
      {
        titre: 'Les pièges',
        paragraphes: [],
        liste: [
          'Un demandeur non signataire de la charte : pas de bonification, même si la fiche est respectée.',
          'Un engagement hors des dates de la charte, avant sa prise d’effet ou après sa date limite.',
          'Croire que le doublement pour les ménages en grande précarité existe encore : l’article qui le portait est abrogé.',
          'Cumuler deux bonifications sur la même opération : l’arrêté l’interdit.',
        ],
      },
    ],
    aRetenir: [
      'Un Coup de pouce multiplie le volume d’une fiche par un coefficient, contre une charte signée par le demandeur, dont le rôle actif et incitatif doit respecter les engagements.',
      'En 2026, les Coups de pouce actifs portent sur le chauffage, individuel et collectif, et la rénovation performante ou d’ampleur ; les coefficients et les dates se lisent dans l’arrêté et la charte.',
      'Plus de prime, plus de contrôles : certaines fiches bonifiées sont contrôlées sur site à 100 %, et le ministre peut retirer la charte à un signataire fautif.',
    ],
    sources: [SRC.dispositif, SRC.noteCoupsDePouce2021, SRC.arreteModalitesConsolide, SRC.coupsDePouce, SRC.coupDePouceChauffage, SRC.coupDePouceCollectif, SRC.coupDePouceRenovation, SRC.arreteControles, SRC.webinaireP6, SRC.lettreNov2025, SRC.bilan2024],
  },
];

/* ⚠️ CONTRÔLE AU CHARGEMENT : un schéma appelé par une section doit être déclaré par l'article.
   La liste `schemas` sert de sommaire aux relectures ; si elle diverge des sections, elle ment. */
for (const t of TERMES) {
  for (const s of t.sections) {
    if (s.schema && !t.schemas.includes(s.schema)) {
      throw new Error(`Glossaire : « ${t.slug} » appelle le schéma « ${s.schema} » sans le déclarer.`);
    }
  }
  if (t.aRetenir.length !== 3) throw new Error(`Glossaire : « ${t.slug} » doit avoir trois points « À retenir ».`);
}

export function termeParSlug(slug: string): Terme | undefined {
  return TERMES.find((t) => t.slug === slug);
}

/** Le nombre de mots de l'article, chapô, sections, listes et « À retenir » compris. */
export function nombreDeMots(t: Terme): number {
  const textes = [
    t.intro,
    ...t.sections.flatMap((s) => [s.titre, ...s.paragraphes, ...(s.liste ?? []), s.legendeSchema ?? '']),
    ...t.aRetenir,
  ];
  return textes.join(' ').split(/\s+/).filter(Boolean).length;
}

/** Le temps de lecture en minutes : mots divisés par 200, arrondi au supérieur. */
export function tempsLecture(t: Terme): number {
  return Math.ceil(nombreDeMots(t) / 200);
}
