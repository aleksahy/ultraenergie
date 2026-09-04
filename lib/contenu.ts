/**
 * Le contenu éditorial de la page d'accueil, hors JSX.
 *
 * Les icônes ne sont PAS ici : un tracé SVG est du rendu, il vit dans `components/Icones.tsx`
 * et les listes ci-dessous n'en portent que la clef.
 */

export const COORDONNEES = {
  telephone: '01 84 60 00 00',
  telephoneLien: '+33184600000',
  email: 'contact@ultraenergie.fr',
  adresse: ['12 rue de la Convention', '75015 Paris'],
};

export const PROFILS = [
  {
    titre: 'Copropriétés & bailleurs',
    desc: "Chaufferie collective, isolation des parties communes, cumul avec MaPrimeRénov' Copro.",
  },
  {
    titre: 'Entreprises & tertiaire',
    desc: 'GTB, CVC, isolation de toiture, mise en conformité décret tertiaire.',
  },
  {
    titre: 'Industrie',
    desc: 'Récupération de chaleur, variateurs de vitesse, air comprimé, opérations spécifiques.',
  },
  {
    titre: 'Collectivités',
    desc: 'Bâtiments publics, éclairage public, réseaux de chaleur.',
  },
  {
    titre: 'Installateurs & artisans',
    desc: 'Valorisez vos chantiers, dossiers conformes, paiement rapide.',
  },
];

export const ETAPES = [
  {
    icone: 'loupe',
    delai: '24 à 48h',
    titre: "Étude d'éligibilité et estimation",
    desc: "Nous analysons vos travaux et transmettons une estimation de prime basée sur les fiches d'opérations standardisées en vigueur.",
  },
  {
    icone: 'document',
    delai: 'Avant le devis',
    titre: 'Engagement de prime signé avant le devis',
    desc: "L'engagement doit impérativement précéder la signature du devis, conformément au rôle actif et incitatif du dispositif CEE.",
  },
  {
    icone: 'echange',
    delai: '1 à 2 semaines',
    titre: 'Consultation des obligés et contrat de valorisation',
    desc: 'Plusieurs obligés sont mis en concurrence pour retenir la meilleure valorisation, puis le contrat correspondant est signé.',
  },
  {
    icone: 'controle',
    delai: 'Après travaux',
    titre: 'Travaux, contrôle, dépôt et versement',
    desc: 'Une fois les travaux réalisés, nous contrôlons la conformité du dossier, le déposons au PNCEE et suivons le versement.',
  },
] as const;

export const TRAVAUX = [
  { icone: 'couches', titre: 'Isolation', desc: 'Combles, toiture-terrasse, parties communes.' },
  { icone: 'helice', titre: 'Pompe à chaleur collective', desc: 'Remplacement de générateur en habitat collectif ou tertiaire.' },
  { icone: 'flamme', titre: 'Chaudière et réseau de chaleur', desc: 'Chaudière biomasse, raccordement à un réseau de chaleur.' },
  { icone: 'jauge', titre: 'GTB', desc: 'Gestion technique du bâtiment et pilotage énergétique.' },
  { icone: 'tuyau', titre: 'Calorifugeage', desc: 'Isolation des réseaux de fluides et de vapeur.' },
  { icone: 'ampoule', titre: 'Éclairage LED', desc: "Remplacement d'éclairage en tertiaire et industrie." },
  { icone: 'engrenage', titre: 'Moteurs et variateurs', desc: 'Variateurs de vitesse, moteurs à haut rendement.' },
  { icone: 'recuperation', titre: 'Récupération de chaleur', desc: 'Valorisation de chaleur fatale industrielle.' },
] as const;

export const COMPARATIF = [
  {
    titre: 'Mandataire indépendant : Ultra Énergie',
    points: [
      'Consulte plusieurs obligés en concurrence',
      'Ne porte aucune obligation ni équipement',
      "Valorisation optimisée pour le maître d'ouvrage",
    ],
    misEnAvant: true,
  },
  {
    titre: "Délégataire d'un seul obligé",
    points: [
      'Lié contractuellement à un obligé unique',
      'Prime fixée par cet obligé seul',
      'Pas de mise en concurrence possible',
    ],
    misEnAvant: false,
  },
  {
    titre: 'Installateur-mandataire',
    points: [
      'Porte lui-même les CEE en plus des travaux',
      'Fixe seul le niveau de la prime',
      "Risque de conflit d'intérêt sur le prix",
    ],
    misEnAvant: false,
  },
];

export const FAQ = [
  {
    q: 'Dans quel ordre dois-je signer les documents ?',
    r: "L'engagement de prime doit être signé avant le devis de travaux, conformément au rôle actif et incitatif du dispositif CEE. Signer le devis avant l'engagement rend l'opération inéligible.",
  },
  {
    q: 'Quel est le délai de versement de la prime ?',
    r: "Une fois les travaux terminés et le dossier déposé, le versement intervient après contrôle de conformité et signature du contrat de valorisation avec l'obligé retenu.",
  },
  {
    q: 'La prime CEE est-elle imposable ?',
    r: "Pour la majorité des particuliers, la prime CEE n'est pas imposable. Pour les entreprises, le traitement comptable dépend de votre situation ; vérifiez ce point avec votre expert-comptable.",
  },
  {
    q: "Puis-je cumuler la prime CEE avec MaPrimeRénov' Copro et d'autres aides ?",
    r: "Oui, dans la plupart des cas la prime CEE se cumule avec MaPrimeRénov' Copro et d'autres aides, sous réserve du respect des plafonds d'aides publiques applicables.",
  },
  {
    q: 'Mon installateur valorise déjà les CEE, puis-je passer par un mandataire ?',
    r: 'Oui. En passant par un mandataire indépendant, plusieurs obligés sont mis en concurrence pour votre dossier, ce qui permet souvent une valorisation plus élevée.',
  },
  {
    q: 'Je suis artisan, comment et quand suis-je payé ?',
    r: 'Après signature du contrat de valorisation et contrôle de conformité de votre dossier, vous êtes payé selon les délais prévus dans votre contrat partenaire, une fois le dossier déposé.',
  },
];
