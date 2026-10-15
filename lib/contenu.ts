/**
 * Le contenu éditorial de la page d'accueil, hors JSX.
 *
 * Les icônes ne sont PAS ici : un tracé SVG est du rendu, il vit dans `components/Icones.tsx`
 * et les listes ci-dessous n'en portent que la clef.
 */

export const COORDONNEES = {
  telephone: '06 51 53 27 33',
  telephoneLien: '+33651532733',
  email: 'contact@ultraenergie.fr',
  /** Les demandes sur les données personnelles (mentions légales) : un alias de contact@ chez OVH. */
  emailRgpd: 'rgpd@ultraenergie.fr',
  adresse: ['1 rue Royale', '262 Bureaux de la Colline', '92210 Saint-Cloud'],
};

export const ETAPES = [
  {
    icone: 'loupe',
    delai: 'Sous deux jours ouvrés',
    titre: 'Étude d’éligibilité et estimation',
    desc: 'Nous analysons les travaux au regard de la fiche d’opération applicable et transmettons une première estimation de prime.',
  },
  {
    icone: 'echange',
    delai: 'Avant le devis',
    titre: 'Valorisation et engagement de prime',
    desc: 'Nous négocions la valorisation avec un acheteur de certificats et transmettons l’engagement de prime daté, que le client reçoit avant de signer le devis.',
  },
  {
    icone: 'document',
    delai: 'Chantier',
    titre: 'Travaux et attestation',
    desc: 'L’installateur réalise, facture avec les mentions exigées par la fiche, et signe avec le client l’attestation sur l’honneur que nous préparons.',
  },
  {
    icone: 'controle',
    delai: 'Après travaux',
    titre: 'Dépôt et versement',
    desc: 'Nous contrôlons les pièces, transmettons le dossier complet à l’acheteur qui le dépose au PNCEE, ou le déposons en son nom sous mandat, et suivons le versement.',
  },
];

/**
 * Les six secteurs des fiches d'opérations standardisées, avec des familles d'opérations.
 * ⚠️ LES EXEMPLES SONT PLAUSIBLES, PAS VÉRIFIÉS FICHE PAR FICHE (15/10/2026) : à confirmer avec
 * le catalogue quand il sera rebâti.
 */
export const SECTEURS_OPERATIONS = [
  { nom: 'Agriculture', exemples: 'Serres, séchage, moteurs' },
  { nom: 'Résidentiel', exemples: 'Isolation, chauffage, ventilation' },
  { nom: 'Tertiaire', exemples: 'GTB, CVC, éclairage' },
  { nom: 'Industrie', exemples: 'Moteurs, air comprimé, récupération de chaleur' },
  { nom: 'Réseaux', exemples: 'Réseaux de chaleur, éclairage extérieur' },
  { nom: 'Transport', exemples: 'Flottes et équipements de transport' },
];

/** Les trois repères sous la photo du héros. */
export const REPERES = [
  { titre: 'Indépendant de tout obligé', texte: 'Aucune obligation portée, aucun équipement vendu.' },
  { titre: 'L’engagement avant le devis', texte: 'Le rôle actif établi et daté, condition de la prime.' },
  { titre: 'Le dossier déposé et suivi', texte: 'Pièces contrôlées avant dépôt, versement suivi.' },
];

/** Notre métier, en trois paragraphes. */
export const METIER = {
  titre: 'Un mandataire, pas un vendeur',
  paragraphes: [
    'Ultra Énergie agit sous mandat du bénéficiaire des travaux ; pour le dépôt, l’acheteur de certificats peut aussi nous mandater en son nom. Nous ne portons aucune obligation, n’installons rien et ne vendons aucun équipement : la relation commerciale reste entre l’installateur et son client.',
    'Notre travail commence avant le devis, au moment où l’engagement de prime doit être établi, et se termine au versement. Entre les deux : la fiche d’opération applicable, les pièces du dossier, les mentions du devis et de la facture, le dépôt et son suivi.',
    'Nous intervenons en résidentiel collectif, tertiaire, industrie et, selon les projets, agriculture, réseaux et transport.',
  ],
};

/**
 * Les cinq questions de l'accueil (liste d'Alek, 15/10/2026), dans l'ordre où elles
 * s'enchaînent : le dispositif, son marché, le mandataire, les démarches, la valorisation.
 * Les réponses reprennent ce que les articles de « Comprendre les CEE » disent, sans
 * promesse ni chiffre que le site ne documente pas.
 */
export const FAQ_ACCUEIL = [
  {
    q: 'Qu’est-ce que le dispositif des CEE ?',
    r: 'Un dispositif créé en 2005 qui oblige les vendeurs d’énergie à financer des économies d’énergie, comptées en kWh cumac. Ils le font surtout en versant des primes pour des travaux décrits dans des fiches d’opérations standardisées.',
  },
  {
    q: 'Comment fonctionne le marché des CEE ?',
    r: 'Chaque obligé doit détenir, en fin de période, autant de certificats que son obligation. Il les obtient en finançant des travaux ou en les achetant à d’autres acteurs ; c’est ce prix de marché qui fait monter ou baisser les primes.',
  },
  {
    q: 'Qu’est-ce qu’un mandataire CEE, quels sont ses rôles ?',
    r: 'Il agit au nom du bénéficiaire des travaux, sans porter d’obligation ni détenir les certificats. Il qualifie l’opération, obtient l’engagement de prime avant le devis, monte le dossier et suit le versement.',
  },
  {
    q: 'Quelles démarches pour obtenir des CEE ?',
    r: 'Faire établir l’engagement de prime avant de signer le devis, réaliser les travaux selon la fiche, puis réunir la facture, l’attestation sur l’honneur et les justificatifs. Le dossier est déposé dans les douze mois suivant l’achèvement.',
  },
  {
    q: 'Comment valoriser les CEE ?',
    r: 'En cédant la valeur de l’opération à un obligé ou à un délégataire, contre une prime ou une remise sur devis. Cette valeur dépend du volume en kWh cumac, des bonifications et du prix du marché au moment de l’engagement.',
  },
];
