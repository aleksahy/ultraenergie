/**
 * Le contenu des sept pages argumentaires : quatre « Pour qui », trois « Partenaires ».
 *
 * ⚠️ TOUT CE QUI EST AFFIRMÉ ICI DOIT ÊTRE VRAI DU DISPOSITIF OU DE L'OFFRE D'ULTRA ÉNERGIE.
 * Pas de délai de paiement chiffré, pas de taux de prime, pas de « montant garanti » : ces
 * promesses engagent, et rien ne les documente à ce jour. Ce qui est dit du dispositif
 * (rôle actif, éligibles, part précarité, cumul) vient des textes ; ce qui est dit de
 * l'offre est ce qu'un mandataire indépendant fait par construction : mettre plusieurs
 * acheteurs en concurrence, monter et déposer le dossier, ne porter aucune obligation.
 *
 * Les codes de `fichesCles` doivent exister au catalogue ; seuls ceux qui ont une page sont
 * liés (cf. `aUnePage`), les autres sont listés sans lien.
 */
import type { Modale } from '@/components/Modales';

export interface Argumentaire {
  slug: string;
  /** Le surtitre en capitales, au-dessus du H1. */
  surtitre: string;
  titre: string;
  chapo: string;
  /** Deux ou trois paragraphes d'introduction, à gauche du schéma. */
  intro: string[];
  schema: 'copropriete' | 'parc' | 'commande-publique' | 'site' | 'entonnoir' | 'chronologie' | 'reseau';
  arguments: { icone: string; titre: string; texte: string }[];
  /**
   * Gabarit « Pour qui » : les trois lignes de légende du schéma de financement (travaux,
   * prime CEE, autres aides). Pas de chiffres : le schéma montre des parts, pas des montants.
   */
  financement?: string[];
  /** Gabarit « Partenaires » : à qui la page s'adresse, en pastilles sous le titre. */
  profils?: string[];
  /** Gabarit « Partenaires » : ce que vous faites, ce que nous faisons. */
  partage?: { vous: string[]; nous: string[] };
  /** Gabarit « Partenaires » : la phrase-clé du schéma, en HTML dans la bande (le SVG est aria-hidden). */
  schemaLegende?: string;
  etapes: { icone: string; delai: string; titre: string; desc: string }[];
  /** La règle à ne pas manquer, dans un encadré. */
  regle: { titre: string; texte: string };
  fichesCles?: { titre: string; codes: string[] };
  faq: { q: string; r: string }[];
  appel: { titre: string; bouton: string; modale: Modale; note?: string };
}

/* Pour un bénéficiaire qui n'est pas éligible (copropriété, entreprise) : sans rôle actif
   antérieur, il n'y a pas de prime, point. */
const REGLE_ENGAGEMENT = {
  titre: 'L’engagement de prime précède le devis',
  texte:
    'Le rôle actif et incitatif du dispositif impose que l’offre de prime soit formalisée avant la signature du devis ou du bon de commande. Un devis signé avant l’engagement rend l’opération inéligible, quelle que soit la qualité des travaux. Parlez-nous du projet dès qu’il est à l’étude.',
};

/* Pour un éligible (bailleur social, collectivité) : la voie de la prime se ferme de la même
   façon, mais le dépôt en son nom reste possible, sans rôle actif à prouver. Dire « perdu »
   à un éligible est faux, et prive Ultra Énergie d'un argument. */
const REGLE_ENGAGEMENT_ELIGIBLE = {
  titre: 'L’engagement de prime précède la signature',
  texte:
    'Le rôle actif et incitatif impose que l’offre de prime d’un acheteur soit formalisée avant la signature du marché, du bon de commande ou du devis. Un devis signé avant l’engagement ferme la voie de la prime ; il reste alors le dépôt en votre nom, comme éligible, que nous pouvons préparer sous mandat. Parlez-nous du projet dès qu’il est à l’étude.',
};

export const ARGUMENTAIRES: Record<string, Argumentaire> = {
  /* ── Pour qui ─────────────────────────────────────────────────────── */

  'syndics-coproprietes': {
    slug: 'syndics-coproprietes',
    surtitre: 'Syndics & copropriétés',
    titre: 'La prime CEE pour les travaux de copropriété',
    chapo:
      'Isolation, chaufferie, réseau de chaleur, ventilation : les travaux votés en assemblée générale ouvrent droit à une prime que nous faisons chiffrer par plusieurs acheteurs.',
    intro: [
      'Vous préparez les assemblées et vous savez ce qu’une résolution de travaux demande : un devis, un plan de financement, des aides chiffrées. La prime CEE en est une, et elle se joue avant le vote.',
      'Ultra Énergie chiffre la prime sur le devis, la met en concurrence auprès de plusieurs obligés, et vous transmet un engagement daté à joindre à la convocation. Après le vote, nous montons et déposons le dossier ; vous signez l’attestation, rien d’autre.',
      'Nous ne sommes liés à aucun obligé : l’offre retenue est la meilleure des réponses reçues, pas celle d’un partenaire imposé.',
    ],
    schema: 'copropriete',
    financement: [
      'Sur le devis à voter, nous chiffrons le volume de certificats avant l’assemblée.',
      'La prime, proposée par l’engagement, s’inscrit en recette dans la résolution.',
      'Nous vous disons ce qui reste cumulable avec MaPrimeRénov’ Copropriété sur ce projet précis.',
    ],
    arguments: [
      { icone: 'balance', titre: 'Plusieurs acheteurs en concurrence', texte: 'Chaque dossier est proposé à plusieurs obligés et délégataires. La copropriété reçoit la meilleure offre, pas celle d’un partenaire unique.' },
      { icone: 'calendrier', titre: 'Une prime proposée avant l’assemblée', texte: 'L’engagement de prime est transmis avant le vote des travaux : le montant proposé figure dans la résolution, à côté du devis et des autres aides.' },
      { icone: 'dossier', titre: 'Le dossier monté et déposé', texte: 'Attestation sur l’honneur, pièces de l’installateur, preuve du rôle actif : nous rassemblons, vérifions et déposons. Le syndic signe, il ne compile pas.' },
      { icone: 'cumul', titre: 'Cumulable avec MaPrimeRénov’ Copropriété', texte: 'MaPrimeRénov’ Copropriété se cumule avec la prime CEE, y compris le Coup de pouce rénovation performante d’un bâtiment collectif, dans la limite d’écrêtement des aides. Cas à part : les copropriétés fragiles ou en difficulté, dont les CEE sont valorisés par l’Anah. Nous vous disons ce qui reste cumulable sur votre projet.' },
    ],
    etapes: [
      { icone: 'loupe', delai: 'À l’étude', titre: 'Vous nous décrivez le projet', desc: 'Audit, devis en cours ou simple intention : nous identifions les fiches d’opérations concernées et estimons le volume de certificats.' },
      { icone: 'echange', delai: 'Avant le vote', titre: 'Nous consultons les obligés', desc: 'Plusieurs acheteurs sont mis en concurrence. Vous recevez un engagement de prime daté, à joindre à la convocation d’assemblée.' },
      { icone: 'document', delai: 'Après le vote', titre: 'Les travaux sont engagés', desc: 'Vous signez le devis, l’installateur réalise, puis signe avec vous l’attestation sur l’honneur que nous avons préparée.' },
      { icone: 'controle', delai: 'Après travaux', titre: 'Dépôt et versement', desc: 'Nous contrôlons les pièces, déposons le dossier et suivons le versement de la prime à la copropriété.' },
    ],
    regle: REGLE_ENGAGEMENT,
    fichesCles: {
      titre: 'Les opérations les plus courantes en copropriété',
      codes: ['BAR-EN-101', 'BAR-EN-102', 'BAR-EN-103', 'BAR-TH-177', 'BAR-TH-137', 'BAR-TH-161', 'BAR-TH-127'],
    },
    faq: [
      { q: 'Quand la prime est-elle versée ?', r: 'Après travaux et dépôt du dossier, selon l’engagement. Nous vous donnons le montant proposé avant le vote, pour qu’il figure au plan de financement de la résolution.' },
      { q: 'À quel moment faut-il vous contacter ?', r: 'Dès que le projet est à l’étude, et en tout cas avant la signature du devis. Le mieux : avant l’assemblée qui vote les travaux, pour que l’engagement de prime soit joint à la convocation.' },
      { q: 'Un installateur nous propose déjà une prime. Pourquoi passer par vous ?', r: 'Un installateur qui valorise lui-même les CEE est généralement lié à un seul acheteur, dont il répercute l’offre. Nous mettons plusieurs acheteurs en concurrence sur le même dossier, et l’installateur reste celui que vous avez choisi.' },
      { q: 'Les travaux doivent-ils être réalisés par une entreprise RGE ?', r: 'Pour la plupart des opérations en résidentiel, oui : les textes du dispositif l’exigent, et l’attestation sur l’honneur le mentionne. Nous vérifions la qualification avant l’engagement.' },
      { q: 'Que se passe-t-il si le dossier est refusé ?', r: 'Le refus au contrôle ou à l’instruction annule la délivrance des certificats. C’est pour cela que nous vérifions chaque pièce avant le dépôt, et que nous n’engageons que sur des opérations conformes à la fiche.' },
    ],
    appel: { titre: 'Un projet de travaux en copropriété ?', bouton: 'Estimer la prime de la copropriété →', modale: 'estimation' },
  },

  'bailleurs-sociaux': {
    slug: 'bailleurs-sociaux',
    surtitre: 'Bailleurs sociaux',
    titre: 'Valoriser les CEE d’un parc de logements sociaux',
    chapo:
      'Réhabilitation, remplacement de chaufferies, rénovation globale : un parc social produit des volumes de certificats importants, en grande partie comptés au titre de l’obligation précarité énergétique.',
    intro: [
      'Vous programmez des réhabilitations, des chaufferies, des rénovations globales, et vous savez que chacune génère des certificats. La question n’est pas de le savoir, c’est le temps que coûte leur valorisation : dossiers, pièces à obtenir des entreprises, acheteurs à mettre en concurrence.',
      'Ultra Énergie prend cette charge. Nous lisons votre programme, identifions les opérations et leurs volumes, consultons plusieurs acheteurs et montons chaque dossier avec vos entreprises. Vous gardez la maîtrise d’ouvrage, et un seul interlocuteur.',
      'Sur un parc social, une part importante du volume est comptée au titre de l’obligation précarité, et ces certificats sont recherchés : nous la faisons valoir dans chaque consultation.',
    ],
    schema: 'parc',
    financement: [
      'Sur votre programme, nous chiffrons les volumes opération par opération, avant engagement.',
      'La prime s’ajoute à chaque opération, avec la part précarité comptée selon le département.',
      'Nous vérifions, financeur par financeur, ceux qui valorisent eux-mêmes les CEE.',
    ],
    arguments: [
      { icone: 'balance', titre: 'La meilleure offre sur chaque programme', texte: 'Un programme de réhabilitation est un volume qui intéresse les acheteurs. Nous le mettons en concurrence, opération par opération ou en lot.' },
      { icone: 'etoile', titre: 'La part précarité comptée', texte: 'Les logements sociaux ouvrent droit, pour une part fixée par département, à des certificats précarité, que les acheteurs valorisent généralement mieux. Nous les identifions et les justifions dans le dossier.' },
      { icone: 'dossier', titre: 'Un dossier par opération, une seule interface', texte: 'Attestations, factures, preuves de qualification, feuilles de calcul : nous tenons la liste des pièces et relançons les entreprises. Vous avez un interlocuteur.' },
      { icone: 'bouclier', titre: 'Le contrôle avant le dépôt', texte: 'Nous faisons réaliser le contrôle par échantillon exigé et vérifions chaque pièce avant de déposer, parce qu’un refus après travaux ne se rattrape pas.' },
    ],
    etapes: [
      { icone: 'loupe', delai: 'Programmation', titre: 'Revue du programme de travaux', desc: 'Nous lisons votre plan pluriannuel et identifions, opération par opération, les fiches applicables et les volumes attendus.' },
      { icone: 'echange', delai: 'Avant engagement', titre: 'Consultation et engagement', desc: 'Les acheteurs sont consultés, l’engagement de prime est signé avant le marché, le bon de commande ou le devis.' },
      { icone: 'document', delai: 'Chantier', titre: 'Collecte des pièces', desc: 'Nous suivons les entreprises pour obtenir attestations, factures et justificatifs, à mesure que les opérations s’achèvent.' },
      { icone: 'controle', delai: 'Livraison', titre: 'Dépôt et versement', desc: 'Dépôt au PNCEE dans les douze mois de l’achèvement, suivi de l’instruction et versement au bailleur.' },
    ],
    regle: REGLE_ENGAGEMENT_ELIGIBLE,
    fichesCles: {
      titre: 'Les opérations les plus courantes sur un parc social',
      codes: ['BAR-EN-101', 'BAR-EN-102', 'BAR-EN-103', 'BAR-TH-177', 'BAR-TH-137', 'BAR-TH-171', 'BAR-TH-161'],
    },
    faq: [
      { q: 'Nous valorisons déjà en direct. Qu’apportez-vous de plus ?', r: 'La mise en concurrence de plusieurs acheteurs sur chaque lot, et le temps : seuil de volume par dossier ou regroupement, délais de dépôt, relance des entreprises pour les pièces. Notre rémunération porte sur les dossiers aboutis.' },
      { q: 'Comment justifiez-vous la part précarité ?', r: 'Sur un parc social, le conventionnement du logement ou sa gestion par un organisme HLM suffit, et le volume précarité est compté au prorata fixé pour le département. Nous listons les pièces au cas par cas et les intégrons au dossier.' },
      { q: 'Peut-on traiter une rénovation globale plutôt qu’opération par opération ?', r: 'Oui, la fiche de rénovation globale d’un bâtiment résidentiel collectif s’applique quand le gain énergétique atteint le seuil requis, avec une étude préalable. Nous comparons les deux voies sur votre programme.' },
      { q: 'Les CEE sont-ils cumulables avec les autres financements ?', r: 'Avec la plupart des prêts et subventions, oui, sous réserve des règles de cumul propres à chaque dispositif. Nous vous signalons les cas où un autre financeur valorise lui-même les CEE.' },
    ],
    appel: { titre: 'Un programme de travaux à valoriser ?', bouton: 'Parler de votre programme →', modale: 'rappel' },
  },

  'public-collectivites': {
    slug: 'public-collectivites',
    surtitre: 'Public & collectivités',
    titre: 'La prime CEE pour les bâtiments et équipements publics',
    chapo:
      'Écoles, gymnases, mairies, éclairage public, réseaux de chaleur : chaque opération d’économies d’énergie de la collectivité génère des certificats. Nous les valorisons pour vous, sans mobiliser vos services.',
    intro: [
      'Vous connaissez vos bâtiments et votre calendrier de commande publique. Ce que nous apportons, c’est la valorisation des certificats que vos travaux génèrent, sans mobiliser vos services sur le montage des dossiers ni sur la vente.',
      'Nous entrons au stade de la programmation : repérage des opérations éligibles, chiffrage des volumes, consultation de plusieurs acheteurs, engagement de prime avant la signature du marché, puis dossier et dépôt. Vos marchés et vos entreprises restent les vôtres.',
      'Écoles, gymnases, mairies, éclairage extérieur, raccordement à un réseau de chaleur : nous savons quelle fiche s’applique à chaque projet et ce qu’elle exige.',
    ],
    schema: 'commande-publique',
    financement: [
      'Sur le programme ou le marché en préparation, nous chiffrons les volumes bâtiment par bâtiment.',
      'La prime arrive en recette après dépôt ; nous en donnons le montant proposé avant la signature.',
      'Nous vérifions les règles de cumul avec vos subventions d’investissement.',
    ],
    arguments: [
      { icone: 'balance', titre: 'La concurrence entre acheteurs', texte: 'Un mandataire indépendant n’est lié à aucun obligé. Chaque opération est proposée à plusieurs acheteurs, et vous recevez la meilleure offre.' },
      { icone: 'mairie', titre: 'Le bâti public, bien couvert', texte: 'Tertiaire, réseaux, éclairage extérieur : les fiches couvrent la majorité des travaux d’une collectivité, et nous savons lesquelles s’appliquent à chaque projet.' },
      { icone: 'dossier', titre: 'Un dossier calé sur la commande publique', texte: 'Programmation, consultation, signature : nous entrons dès la programmation et suivons le calendrier de votre marché, bâtiment par bâtiment. Vos pièces de marché restent les vôtres.' },
      { icone: 'bouclier', titre: 'La conformité avant le dépôt', texte: 'Chaque pièce est vérifiée avant le dépôt au PNCEE. Un dossier refusé après travaux est une recette perdue pour la collectivité.' },
    ],
    etapes: [
      { icone: 'loupe', delai: 'Programmation', titre: 'Revue des opérations', desc: 'Nous lisons votre programme de travaux et identifions les fiches applicables, bâtiment par bâtiment.' },
      { icone: 'echange', delai: 'Avant signature', titre: 'Engagement de prime', desc: 'Les acheteurs sont consultés et l’engagement est signé avant la signature du marché (acte d’engagement ou bon de commande) ou du devis.' },
      { icone: 'document', delai: 'Travaux', titre: 'Collecte des pièces', desc: 'Attestations, factures, justificatifs techniques : nous suivons les entreprises et vérifions.' },
      { icone: 'controle', delai: 'Réception', titre: 'Dépôt et versement', desc: 'Dépôt au PNCEE dans les douze mois de l’achèvement, suivi de l’instruction, versement à la collectivité.' },
    ],
    regle: REGLE_ENGAGEMENT_ELIGIBLE,
    fichesCles: {
      titre: 'Les opérations les plus courantes pour une collectivité',
      codes: ['BAT-EN-101', 'BAT-EN-102', 'BAT-EN-103', 'BAT-TH-116', 'BAT-TH-157', 'RES-EC-104', 'RES-CH-103'],
    },
    faq: [
      { q: 'Nous valorisons déjà en direct. Qu’apportez-vous de plus ?', r: 'La mise en concurrence de plusieurs acheteurs, et le temps que coûtent le seuil de volume par dossier ou le regroupement, les délais de dépôt et la collecte des pièces auprès des entreprises. Notre rémunération porte sur les dossiers aboutis.' },
      { q: 'À quel moment de la procédure faut-il vous solliciter ?', r: 'Au stade de la programmation ou de la consultation, en tout cas avant la signature du marché ou du devis : c’est là que l’engagement de prime doit être daté. Nous nous calons sur votre calendrier.' },
      { q: 'Quels projets sont concernés ?', r: 'Les travaux sur bâtiments tertiaires existants, dont les bâtiments publics, les réseaux de chaleur et l’éclairage extérieur. Nous vous disons fiche par fiche ce qui s’applique à votre programme.' },
      { q: 'Les certificats concernent-ils aussi les programmes d’accompagnement ?', r: 'Les programmes CEE, financés par les obligés, sont une voie distincte des opérations standardisées. Nous vous orientons si votre projet en relève.' },
    ],
    appel: { titre: 'Un projet sur le patrimoine de la collectivité ?', bouton: 'Parler de votre projet →', modale: 'rappel' },
  },

  'entreprises-industriels': {
    slug: 'entreprises-industriels',
    surtitre: 'Entreprises & industriels',
    titre: 'La prime CEE pour les sites tertiaires et industriels',
    chapo:
      'Gestion technique du bâtiment, moteurs et variateurs, récupération de chaleur, isolation : les opérations d’efficacité énergétique d’un site génèrent des certificats que nous valorisons pour vous.',
    intro: [
      'Vous avez un projet d’efficacité énergétique à l’étude : GTB, variateurs, isolation de réseaux, récupération de chaleur. Il génère des certificats, et leur valeur dépend de la fiche, des quantités et de l’acheteur.',
      'Ultra Énergie chiffre le volume à partir de vos données techniques, consulte plusieurs acheteurs et vous transmet un engagement de prime avant la commande. Le dossier est monté par nous, avec vos prestataires.',
      'Hors catalogue, une opération spécifique peut ouvrir droit à des certificats sur étude : nous vous disons si votre projet en relève.',
    ],
    schema: 'site',
    financement: [
      'Sur le projet à l’étude, nous chiffrons le volume à partir de vos données techniques.',
      'La prime, proposée avant la commande, réduit le temps de retour de l’investissement.',
      'Nous vérifions le cumul avec les autres aides à l’investissement.',
    ],
    arguments: [
      { icone: 'balance', titre: 'Plusieurs acheteurs sur chaque opération', texte: 'Nous ne dépendons d’aucun obligé. Chaque dossier est proposé à plusieurs acheteurs et vous recevez la meilleure offre.' },
      { icone: 'usine', titre: 'Le tertiaire et l’industrie, en détail', texte: 'GTB, éclairage, isolation, moteurs, air comprimé, froid, vapeur, chaleur fatale : les fiches sont nombreuses et précises. Nous savons laquelle s’applique et ce qu’elle exige.' },
      { icone: 'dossier', titre: 'Le dossier avec vos prestataires', texte: 'Nous listons les pièces attendues de l’installateur et du bureau d’études, relançons et vérifions. Vous signez l’attestation, nous faisons le reste.' },
      { icone: 'eclair', titre: 'Le calendrier tenu', texte: 'L’engagement avant devis, le dépôt dans les douze mois de l’achèvement : nous tenons la chronologie qui conditionne la délivrance.' },
    ],
    etapes: [
      { icone: 'loupe', delai: 'Projet à l’étude', titre: 'Qualification de l’opération', desc: 'Nous identifions la fiche applicable, ses conditions et le volume attendu à partir de vos données techniques.' },
      { icone: 'echange', delai: 'Avant commande', titre: 'Consultation et engagement', desc: 'Les acheteurs sont mis en concurrence. L’engagement de prime est signé avant le devis ou le bon de commande.' },
      { icone: 'document', delai: 'Travaux', titre: 'Réalisation et pièces', desc: 'Votre prestataire réalise. Nous collectons les justificatifs techniques prévus par la fiche et l’attestation sur l’honneur.' },
      { icone: 'controle', delai: 'Après réception', titre: 'Dépôt et versement', desc: 'Contrôle des pièces, dépôt au PNCEE, suivi de l’instruction et versement.' },
    ],
    regle: REGLE_ENGAGEMENT,
    fichesCles: {
      titre: 'Les opérations les plus courantes sur un site',
      codes: ['BAT-TH-116', 'BAT-EN-101', 'IND-UT-102', 'IND-UT-116', 'IND-UT-131', 'IND-UT-134', 'IND-BA-110', 'IND-UT-125'],
    },
    faq: [
      { q: 'Notre opération n’est dans aucune fiche. Est-elle perdue ?', r: 'Pas forcément. Les opérations spécifiques permettent d’obtenir des certificats hors catalogue, sur la base d’une étude énergétique, d’une situation de référence et d’un temps de retour supérieur à trois ans. Elles concernent surtout l’industrie. Nous vous disons si votre projet peut en relever.' },
      { q: 'Le prestataire doit-il être RGE ?', r: 'Non, la qualification RGE est une exigence des fiches résidentielles. En tertiaire et en industrie, les fiches demandent un professionnel, et parfois des justificatifs techniques précis (étude de dimensionnement, plaque signalétique, norme de mesure).' },
      { q: 'Comment la prime est-elle calculée ?', r: 'Chaque fiche donne un forfait en kWh cumac, par unité de surface, de puissance ou par équipement, parfois pondéré par un facteur. Ce volume, multiplié par le prix négocié avec l’acheteur, donne la prime. Le simulateur donne le volume pour les fiches modélisées.' },
      { q: 'Quels délais après les travaux ?', r: 'Le dossier doit être déposé dans les douze mois suivant l’achèvement de l’opération. Nous déposons dès que les pièces sont complètes.' },
    ],
    appel: { titre: 'Un projet d’efficacité énergétique sur votre site ?', bouton: 'Estimer la prime de l’opération →', modale: 'estimation' },
  },

  /* ── Partenaires ──────────────────────────────────────────────────── */

  obliges: {
    slug: 'obliges',
    surtitre: 'Obligés & délégataires',
    titre: 'Du volume qui passe le contrôle',
    chapo:
      'Ultra Énergie apporte aux obligés et aux délégataires des opérations qualifiées en résidentiel collectif, tertiaire et industrie, avec des dossiers complets, vérifiés avant dépôt.',
    intro: [
      'Un dossier CEE ne vaut que s’il est délivré. Ce que nous apportons aux acheteurs, ce n’est pas seulement du volume : ce sont des opérations dont la chronologie a été respectée, dont les pièces ont été contrôlées, et dont le bénéficiaire a été informé de ce qu’il signe.',
      'Nous travaillons sous mandat, sans porter d’obligation. Nos opérations viennent des copropriétés, des bailleurs, des collectivités et des entreprises que nous accompagnons, et des installateurs et apporteurs qui nous confient leurs chantiers.',
      'Chaque dossier est proposé à plusieurs acheteurs. Un partenariat avec nous, c’est l’accès à ce flux et à la possibilité d’y répondre.',
    ],
    schema: 'entonnoir',
    schemaLegende: 'Ce qui vous est transmis a déjà passé trois filtres : la fiche, le rôle actif daté, le contrôle des pièces.',
    profils: ['Obligés', 'Délégataires'],
    partage: {
      vous: [
        'Vous nous indiquez les secteurs, les fiches et les volumes qui vous intéressent.',
        'Vous répondez sur chaque proposition d’opération : prix, volume, délai.',
        'Vous déposez, ou nous mandatez pour déposer en votre nom.',
      ],
      nous: [
        'Nous apportons des opérations qualifiées, rôle actif prouvé et daté.',
        'Nous collectons et contrôlons chaque pièce avant transmission.',
        'Nous suivons le chantier et vous informons de l’avancement.',
      ],
    },
    arguments: [
      { icone: 'bouclier', titre: 'Le rôle actif prouvé', texte: 'Chaque opération porte une proposition de prime datée d’avant le devis. La pièce est dans le dossier, pas reconstituée après coup.' },
      { icone: 'dossier', titre: 'Les pièces vérifiées avant dépôt', texte: 'Attestation sur l’honneur complète, qualification du professionnel, justificatifs techniques prévus par la fiche : nous contrôlons chaque pièce avant de vous transmettre le dossier.' },
      { icone: 'usine', titre: 'Des secteurs à volumes', texte: 'Résidentiel collectif, tertiaire, industrie : des opérations de plusieurs centaines de MWh à plusieurs GWh cumac, et des bénéficiaires structurés.' },
      { icone: 'balance', titre: 'Une relation claire', texte: 'Un mandat écrit qui fixe le périmètre, un prix proposé par opération ou par lot, des dossiers transmis prêts à déposer. Vous décidez de répondre ou non sur chaque proposition.' },
    ],
    etapes: [
      { icone: 'echange', delai: 'Démarrage', titre: 'Mandat et conditions', desc: 'Nous formalisons le mandat, les secteurs et les fiches qui vous intéressent, et les conditions de prix.' },
      { icone: 'loupe', delai: 'En continu', titre: 'Propositions d’opérations', desc: 'Nous vous soumettons les opérations qualifiées avec leur volume attendu. Vous répondez sur celles qui vous conviennent.' },
      { icone: 'document', delai: 'Chantier', titre: 'Suivi et collecte', desc: 'Nous suivons les travaux, collectons et vérifions les pièces, et vous tenons informé.' },
      { icone: 'controle', delai: 'Livraison', titre: 'Dossier prêt à déposer', desc: 'Le dossier complet vous est transmis, ou déposé en votre nom selon le mandat.' },
    ],
    regle: {
      titre: 'Nous ne portons aucune obligation',
      texte: 'Ultra Énergie n’est ni obligé ni délégataire. Nous agissons pour le compte de nos partenaires acheteurs, sous mandat, et notre rémunération porte sur les opérations abouties. Les certificats sont délivrés sur votre compte. Le mandat est le vôtre ; la mise en concurrence est ce que nous devons au bénéficiaire, et vous le savez en y répondant.',
    },
    faq: [
      { q: 'Sous quelle forme travaillez-vous avec un obligé ?', r: 'Sous mandat écrit, qui précise le périmètre (secteurs, fiches, volumes) et les conditions. Nous pouvons collecter et transmettre les dossiers, ou déposer en votre nom.' },
      { q: 'D’où viennent vos opérations ?', r: 'Des maîtres d’ouvrage que nous accompagnons (copropriétés, bailleurs, collectivités, entreprises) et des installateurs et apporteurs d’affaires partenaires qui nous confient leurs chantiers avant la signature des devis.' },
      { q: 'Quel contrôle faites-vous avant de transmettre ?', r: 'Chronologie du rôle actif, complétude et cohérence de l’attestation sur l’honneur, qualification du professionnel, justificatifs techniques prévus par la fiche, cohérence des quantités entre devis, facture et attestation.' },
      { q: 'Travaillez-vous avec plusieurs obligés ?', r: 'Oui, c’est le principe. Chaque opération est proposée à plusieurs acheteurs et le bénéficiaire reçoit la meilleure offre. Un partenariat ne donne pas d’exclusivité.' },
    ],
    appel: { titre: 'Recevoir nos propositions d’opérations ?', bouton: 'Devenir partenaire acheteur →', modale: 'partenaire' },
  },

  installateurs: {
    slug: 'installateurs',
    surtitre: 'Installateurs & artisans',
    titre: 'Une prime pour chaque chantier, sans monter le dossier',
    chapo:
      'Vous gardez votre client et votre devis. Nous apportons l’engagement de prime avant signature, montons le dossier CEE et suivons le versement.',
    intro: [
      'Un chantier d’isolation, de chaufferie, de GTB ou de variateurs génère des certificats d’économies d’énergie. Votre client y a droit, et la prime rend votre devis plus facile à signer. Le monter vous-même, c’est du temps, des pièces à collecter et un acheteur à trouver.',
      'Avec Ultra Énergie, vous signalez le chantier avant la signature du devis. Nous transmettons l’engagement de prime à votre client, vous réalisez les travaux, vous signez l’attestation avec lui, et nous faisons le reste : dossier, dépôt, suivi du versement.',
      'Nous mettons plusieurs acheteurs en concurrence, donc votre client reçoit une meilleure offre qu’avec un acheteur unique. Vous n’avez rien à négocier.',
    ],
    schema: 'chronologie',
    schemaLegende: 'L’engagement de prime précède le devis signé. Dans l’autre ordre, l’opération est inéligible.',
    profils: ['Isolation', 'Chauffage et ENR', 'GTB et régulation', 'Électricité industrielle', 'Froid et ventilation'],
    partage: {
      vous: [
        'Vous nous décrivez le chantier : travaux, surface ou puissance, client.',
        'Vous portez sur le devis et la facture les mentions que la fiche exige.',
        'Vous réalisez, puis signez l’attestation sur l’honneur avec le client.',
      ],
      nous: [
        'Nous qualifions l’opération et vous donnons la liste des mentions.',
        'Nous consultons les acheteurs et transmettons l’engagement de prime au client.',
        'Nous montons le dossier, déposons et suivons le versement.',
      ],
    },
    arguments: [
      { icone: 'poignee', titre: 'Votre client reste le vôtre', texte: 'Nous intervenons sur le financement, pas sur la relation commerciale. Le devis, les travaux et la garantie restent entre vous et lui.' },
      { icone: 'eclair', titre: 'Un signalement, pas un dossier', texte: 'Vous nous envoyez le projet, nous vous disons ce que la fiche exige et ce qu’il faudra porter sur le devis et la facture. Rien à monter de votre côté.' },
      { icone: 'euro', titre: 'Une prime qui aide à conclure', texte: 'Votre client connaît le montant proposé, sous réserve de la conformité du dossier, et le devis se signe avec cette ligne en face.' },
      { icone: 'bouclier', titre: 'La conformité vérifiée avec vous', texte: 'Qualification, mentions du devis, attestation sur l’honneur : nous vérifions avant le dépôt, pour que le chantier ne soit pas refusé après coup.' },
    ],
    etapes: [
      { icone: 'loupe', delai: 'Avant le devis', titre: 'Vous signalez le chantier', desc: 'Type de travaux, surface ou puissance, client : nous identifions la fiche et vous indiquons les mentions à porter sur le devis.' },
      { icone: 'echange', delai: 'Avant signature', titre: 'Engagement de prime au client', desc: 'Nous consultons les acheteurs et transmettons l’engagement à votre client, qui signe le devis avec la prime en face.' },
      { icone: 'document', delai: 'Chantier', titre: 'Travaux et attestation', desc: 'Vous réalisez, facturez, et signez avec le client l’attestation sur l’honneur que nous préparons.' },
      { icone: 'controle', delai: 'Après travaux', titre: 'Dépôt et versement', desc: 'Nous contrôlons les pièces, déposons et suivons le versement selon les termes convenus.' },
    ],
    regle: {
      titre: 'Le devis se signe après l’engagement',
      texte: 'C’est la règle du rôle actif et incitatif, et c’est la seule vraie contrainte pour vous : nous prévenir avant que le client signe. Un devis déjà signé ne peut plus ouvrir droit à la prime.',
    },
    fichesCles: {
      titre: 'Les fiches les plus courantes selon votre métier',
      codes: ['BAR-EN-101', 'BAR-EN-102', 'BAR-EN-103', 'BAR-TH-171', 'BAR-TH-113', 'BAT-TH-116', 'BAT-EN-102', 'IND-UT-102'],
    },
    faq: [
      { q: 'Dois-je être RGE ?', r: 'Pour les travaux en résidentiel, la plupart des fiches l’exigent. En tertiaire et en industrie, ce n’est pas requis, mais la fiche peut demander des justificatifs techniques précis. Nous vous le disons fiche par fiche.' },
      { q: 'Que dois-je mentionner sur le devis et la facture ?', r: 'Ce que la fiche impose pour la preuve de réalisation : la nature de l’opération, les caractéristiques du matériel (marque, référence, performance), les quantités. Nous vous transmettons la liste avant le chantier.' },
      { q: 'Qui touche la prime ?', r: 'Le bénéficiaire des travaux, selon l’engagement qu’il a signé. Une remise sur devis est possible dans certains montages ; nous en discutons selon le chantier.' },
      { q: 'Suis-je rémunéré en tant qu’apporteur ?', r: 'Un installateur qui nous apporte des chantiers peut être rémunéré comme apporteur d’affaires, dans les conditions d’un contrat de partenariat. Parlons-en.' },
    ],
    appel: { titre: 'Un partenariat à ouvrir ?', bouton: 'Devenir installateur partenaire →', modale: 'partenaire', note: 'Un chantier à signaler tout de suite ?' },
  },

  'apporteurs-affaires': {
    slug: 'apporteurs-affaires',
    surtitre: 'Apporteurs d’affaires',
    titre: 'Vous voyez les projets avant tout le monde',
    chapo:
      'Syndics, bureaux d’études, mainteneurs, distributeurs, courtiers : vous êtes en amont des travaux. Chaque projet signalé avant le devis peut devenir une prime pour votre client et une commission pour vous.',
    intro: [
      'La prime CEE se joue avant la signature du devis. Ceux qui voient les projets à ce moment-là, ce sont les syndics qui préparent une assemblée, les bureaux d’études qui dimensionnent, les mainteneurs qui préconisent, les distributeurs qui chiffrent.',
      'Ultra Énergie s’occupe de tout ce qui suit : qualification de l’opération, mise en concurrence des acheteurs, engagement de prime, dossier, dépôt. Vous n’avez aucun montage réglementaire à votre charge.',
      'Votre rémunération est une commission sur chaque dossier abouti, prévue au contrat de partenariat.',
    ],
    schema: 'reseau',
    schemaLegende: 'Vous signalez, nous qualifions. La prime va au client, la commission à vous.',
    profils: ['Syndics', 'Bureaux d’études', 'Mainteneurs', 'Distributeurs'],
    partage: {
      vous: [
        'Vous repérez un projet d’économies d’énergie avant son engagement.',
        'Vous nous le signalez : un contact, une nature de travaux, une date.',
        'Vous restez l’interlocuteur de confiance de votre client, si vous le souhaitez.',
      ],
      nous: [
        'Nous qualifions l’opération et contactons le maître d’ouvrage avec vous.',
        'Nous mettons les acheteurs en concurrence et transmettons l’engagement.',
        'Nous montons, déposons, suivons, et vous réglons la commission à la délivrance.',
      ],
    },
    arguments: [
      { icone: 'euro', titre: 'Une commission par dossier abouti', texte: 'Le contrat de partenariat fixe la commission. Elle est due quand les certificats sont délivrés, sur chaque opération que vous avez apportée.' },
      { icone: 'eclair', titre: 'Un signalement suffit', texte: 'Un projet, un contact, une date prévisionnelle. Nous prenons le relais et vous tenons informé de l’avancement.' },
      { icone: 'poignee', titre: 'Votre client mieux servi', texte: 'La mise en concurrence des acheteurs donne à votre client une meilleure offre que celle d’un acheteur unique. Vous lui apportez une recette, pas un vendeur.' },
      { icone: 'bouclier', titre: 'Le montage réglementaire est chez nous', texte: 'Le rôle actif, les pièces, le dépôt et les contrôles sont de notre côté. Vous n’avez aucun dossier à monter ; si votre client vous mandate pour signer l’attestation, nous la préparons avec vous.' },
    ],
    etapes: [
      { icone: 'echange', delai: 'Démarrage', titre: 'Contrat de partenariat', desc: 'Nous convenons du périmètre et de la commission, et vous donnons la fiche de signalement.' },
      { icone: 'loupe', delai: 'Avant devis', titre: 'Vous signalez un projet', desc: 'Nous qualifions l’opération et contactons le maître d’ouvrage, avec vous ou en votre nom, avant toute signature.' },
      { icone: 'document', delai: 'Engagement et travaux', titre: 'Nous gérons le dossier', desc: 'Engagement de prime, suivi du chantier, collecte des pièces. Vous êtes informé à chaque étape.' },
      { icone: 'controle', delai: 'Délivrance', titre: 'Commission versée', desc: 'À la délivrance des certificats, la commission vous est réglée selon le contrat.' },
    ],
    regle: {
      titre: 'Le signalement doit précéder le devis',
      texte: 'Un projet signalé après la signature du devis ne peut plus ouvrir droit à la prime. Ce qui fait votre valeur, c’est d’être en amont. Signalez tôt, même si le projet n’est pas certain.',
    },
    faq: [
      { q: 'Qui peut être apporteur d’affaires ?', r: 'Toute structure qui voit des projets de travaux avant leur engagement : syndics, gestionnaires de patrimoine, bureaux d’études, sociétés de maintenance, distributeurs de matériel, courtiers en énergie, installateurs.' },
      { q: 'Dois-je connaître le dispositif CEE ?', r: 'Non. Il suffit de reconnaître un projet d’économies d’énergie et de nous le signaler avant la signature du devis. Nous nous chargeons de la qualification et du reste.' },
      { q: 'Quand la commission est-elle versée ?', r: 'Quand l’opération est aboutie, c’est-à-dire quand les certificats sont délivrés. Le contrat de partenariat en fixe le montant et les modalités.' },
      { q: 'Puis-je apporter des projets dans tous les secteurs ?', r: 'Oui : résidentiel collectif, tertiaire, industrie, agriculture, réseaux, transport. Chaque secteur a ses fiches, consultables dans notre catalogue.' },
    ],
    appel: { titre: 'Vous voyez passer des projets de travaux ?', bouton: 'Devenir apporteur d’affaires →', modale: 'partenaire' },
  },
};

export function argumentaireDe(slug: string): Argumentaire | undefined {
  return ARGUMENTAIRES[slug];
}
