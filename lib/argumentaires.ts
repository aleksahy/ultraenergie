/**
 * Le contenu des sept pages argumentaires : cinq « Pour qui » (installateurs compris), deux « Partenaires ».
 *
 * ⚠️ TOUT CE QUI EST AFFIRMÉ ICI DOIT ÊTRE VRAI DU DISPOSITIF OU DE L'OFFRE D'ULTRA ÉNERGIE.
 * Pas de délai de paiement chiffré, pas de taux de prime, pas de « montant garanti » : ces
 * promesses engagent, et rien ne les documente à ce jour. Ce qui est dit du dispositif
 * (rôle actif, éligibles, part précarité, cumul) vient des textes ; ce qui est dit de
 * l'offre est ce qu'un mandataire indépendant fait par construction : négocier la valorisation
 * sans être lié à un obligé, monter et déposer le dossier, ne porter aucune obligation.
 *
 * ⛔ PLUS DE « MISE EN CONCURRENCE DES OBLIGÉS » (Alek, 15/10/2026), ni de « meilleure offre »
 * qui la sous-entend : sur l'accueil comme ici. L'argument est l'indépendance.
 *
 * ⛔ PLUS DE « FICHES CLÉS » depuis le 14/10/2026 : le catalogue a été retiré pour être rebâti.
 * La section reviendra avec lui, branchée sur le nouveau modèle.
 */
import type { Modale } from '@/components/Modales';
import { url } from './routes';

export interface Argumentaire {
  slug: string;
  /** Le surtitre en capitales, au-dessus du H1. */
  surtitre: string;
  titre: string;
  /** ⛔ Pas affiché : c'est la description de la page pour les moteurs et le partage. */
  chapo: string;
  /** Les paragraphes de la première section : « Le contexte » (Pour qui), « Notre proposition » (Partenaires). */
  intro: string[];
  /** La clef de la photo de bandeau de la page (cf. components/PhotosPages.tsx). */
  photo: 'copropriete' | 'parc' | 'commande-publique' | 'site' | 'entonnoir' | 'chronologie' | 'reseau';
  /** Pages Partenaires : « Pourquoi travailler avec Ultra Énergie », en tuiles. Pas rendus sur les pages Pour qui. */
  arguments: { titre: string; texte: string }[];
  /**
   * Pages Pour qui : les familles d'opérations éligibles pour ce profil, avec les fiches
   * citées en exemple. ⚠️ NE CITER QUE DES CODES DONT LE TITRE EST VÉRIFIÉ
   * (data/fiches/catalogue.json ou le glossaire) : les autres familles se décrivent sans code.
   * Les pages Partenaires n'en ont pas : leur bande montre les six secteurs de l'accueil.
   */
  operations?: { titre: string; texte: string }[];
  /** Le déroulé horizontal, quatre étapes. */
  etapes: { delai: string; titre: string; desc: string }[];
  faq: { q: string; r: string }[];
  /**
   * La bande de contact qui ferme la page : `texte` est la phrase sous le titre (sans elle,
   * `ContactBande` affiche sa phrase par défaut) ; la destination est un lien (`href`, la page
   * Contact) ou la modale partenaire. ⛔ Ni « Qui fait quoi », ni encadré de règle, ni
   * profils en pastilles : retirés le 15/10/2026 (Alek), leur fond est dans les textes.
   */
  appel: { titre: string; texte?: string; bouton: string; modale?: Modale; href?: string };
}

export const ARGUMENTAIRES: Record<string, Argumentaire> = {
  /* ── Pour qui ─────────────────────────────────────────────────────── */

  'syndics-coproprietes': {
    slug: 'syndics-coproprietes',
    surtitre: 'Syndics & copropriétés',
    titre: 'La prime CEE pour les travaux de copropriété',
    chapo:
      'Isolation, chaufferie, réseau de chaleur, ventilation : les travaux votés en assemblée générale peuvent donner lieu à une prime que nous chiffrons et valorisons pour la copropriété.',
    intro: [
      'Les copropriétés sont poussées à rénover : la loi Climat et Résilience généralise progressivement le diagnostic de performance énergétique à l’échelle de l’immeuble et le plan pluriannuel de travaux, et ferme peu à peu la location des logements les plus énergivores. Une résolution de travaux se vote avec son plan de financement, et la prime CEE en fait partie.',
      'La prime se joue avant le vote : l’engagement de prime doit être établi avant la signature du devis, et son montant dépend de la fiche d’opération, de la zone climatique et des caractéristiques du matériel. Elle se cumule avec MaPrimeRénov’ Copropriété, dans la limite d’écrêtement des aides.',
      'Ultra Énergie chiffre la prime sur le devis, négocie sa valorisation et vous transmet un engagement daté à joindre à la convocation. Après le vote, nous montons le dossier et suivons son dépôt ; vous signez l’attestation, rien d’autre. Nous ne sommes liés à aucun obligé : nous négocions pour la copropriété, pas pour un partenaire imposé.',
    ],
    photo: 'copropriete',
    operations: [
      { titre: 'Isolation de l’enveloppe', texte: 'Combles et toitures (fiche BAR-EN-101), murs par l’extérieur, planchers bas sur sous-sol ou parking.' },
      { titre: 'Chaufferie collective', texte: 'Remplacement de chaudière, pompe à chaleur collective, raccordement à un réseau de chaleur, régulation et équilibrage de l’installation.' },
      { titre: 'Eau chaude et ventilation', texte: 'Production d’eau chaude collective, ventilation mécanique contrôlée des logements et des parties communes.' },
      { titre: 'Maintenance et pilotage', texte: 'Désembouage des réseaux de chauffage (BAR-SE-108), affichage des consommations (BAR-EQ-115), gestion technique du bâtiment.' },
      { titre: 'Rénovation performante', texte: 'Les bouquets de travaux d’une rénovation globale, avec le Coup de pouce « Rénovation performante de bâtiment résidentiel collectif » quand ses conditions sont réunies.' },
    ],
    arguments: [
      { titre: 'Indépendant de tout obligé', texte: 'Nous ne sommes liés à aucun acheteur de certificats. La valorisation se négocie pour le compte de la copropriété, pas pour celui d’un partenaire.' },
      { titre: 'Une prime proposée avant l’assemblée', texte: 'L’engagement de prime est transmis avant le vote des travaux : le montant proposé figure dans la résolution, à côté du devis et des autres aides.' },
      { titre: 'Le dossier monté et déposé', texte: 'Attestation sur l’honneur, pièces de l’installateur, preuve du rôle actif : nous rassemblons, vérifions et faisons déposer par l’acheteur, ou déposons en son nom sous mandat. Le syndic signe, il ne compile pas.' },
      { titre: 'Cumulable avec MaPrimeRénov’ Copropriété', texte: 'MaPrimeRénov’ Copropriété se cumule avec la prime CEE, y compris le Coup de pouce rénovation performante d’un bâtiment collectif, dans la limite d’écrêtement des aides. Cas à part : les copropriétés fragiles ou en difficulté, dont les CEE sont valorisés par l’Anah. Nous vous disons ce qui reste cumulable sur votre projet.' },
    ],
    etapes: [
      { delai: 'À l’étude', titre: 'Vous nous décrivez le projet', desc: 'Audit, devis en cours ou simple intention : nous identifions les fiches d’opérations concernées et estimons le volume de certificats.' },
      { delai: 'Avant le vote', titre: 'Nous négocions la valorisation', desc: 'Vous recevez un engagement de prime daté, à joindre à la convocation d’assemblée.' },
      { delai: 'Après le vote', titre: 'Les travaux sont engagés', desc: 'Vous signez le devis, l’installateur réalise, puis signe avec vous l’attestation sur l’honneur que nous avons préparée.' },
      { delai: 'Après travaux', titre: 'Dépôt et versement', desc: 'Nous contrôlons les pièces, transmettons le dossier à l’acheteur qui le dépose, ou le déposons en son nom sous mandat, et suivons le versement de la prime à la copropriété.' },
    ],
    faq: [
      { q: 'Quand la prime est-elle versée ?', r: 'Après travaux et dépôt du dossier, selon l’engagement. Nous vous donnons le montant proposé avant le vote, pour qu’il figure au plan de financement de la résolution.' },
      { q: 'À quel moment faut-il vous contacter ?', r: 'Dès que le projet est à l’étude, et en tout cas avant la signature du devis (pour un syndicat de copropriétaires, les textes tolèrent un engagement signé au plus tard quatorze jours après le devis et avant le début des travaux, mais ne comptez pas dessus). Le mieux : avant l’assemblée qui vote les travaux, pour que l’engagement de prime soit joint à la convocation.' },
      { q: 'Un installateur nous propose déjà une prime. Pourquoi passer par vous ?', r: 'Un installateur qui valorise lui-même les CEE passe souvent par un seul acheteur, dont il répercute l’offre. Nous ne sommes liés à aucun obligé et négocions pour la copropriété ; l’installateur reste celui que vous avez choisi, le devis et les travaux ne changent pas.' },
      { q: 'Les travaux doivent-ils être réalisés par une entreprise RGE ?', r: 'Pour la plupart des opérations en résidentiel, oui : les textes du dispositif l’exigent, et l’attestation sur l’honneur le mentionne. Nous vérifions la qualification avant l’engagement.' },
      { q: 'Que se passe-t-il si le dossier est refusé ?', r: 'Le refus au contrôle ou à l’instruction annule la délivrance des certificats. C’est pour cela que nous vérifions chaque pièce avant le dépôt, et que nous n’engageons que sur des opérations conformes à la fiche.' },
    ],
    appel: { titre: 'Un projet de travaux en copropriété ?', bouton: 'Parler du projet de la copropriété', href: url.contact },
  },

  'bailleurs-sociaux': {
    slug: 'bailleurs-sociaux',
    surtitre: 'Bailleurs sociaux',
    titre: 'Valoriser les CEE d’un parc de logements sociaux',
    chapo:
      'Réhabilitation, remplacement de chaufferies, rénovation globale : un parc social produit des volumes de certificats importants, en grande partie comptés au titre de l’obligation précarité énergétique.',
    intro: [
      'Le parc social est sous la même pression que le reste du logement : la location des logements les plus énergivores se ferme progressivement, et les programmes de réhabilitation s’enchaînent. Chacun génère des certificats, en volume, et une part importante en est comptée au titre de l’obligation précarité énergétique, que les acheteurs recherchent.',
      'Un bailleur social est éligible au dispositif : il peut déposer lui-même ses dossiers, ou céder la valeur de ses opérations à un acheteur contre une prime. Dans les deux cas, l’engagement doit précéder le marché, le bon de commande ou le devis, et le dossier se monte avec les pièces des entreprises.',
      'Ultra Énergie lit votre programme, identifie les opérations et leurs volumes, négocie leur valorisation, par lot ou opération par opération, et monte chaque dossier avec vos entreprises. Vous gardez la maîtrise d’ouvrage, et un seul interlocuteur.',
    ],
    photo: 'parc',
    operations: [
      { titre: 'Réhabilitation de l’enveloppe', texte: 'Isolation des combles et toitures (BAR-EN-101), des façades et des planchers bas, remplacement des menuiseries, sur une tour, une barre ou une résidence entière.' },
      { titre: 'Chaufferies et réseaux', texte: 'Chaudières et pompes à chaleur collectives, raccordement aux réseaux de chaleur, équilibrage et désembouage (BAR-SE-108).' },
      { titre: 'Logements', texte: 'Pompes à chaleur individuelles (BAR-TH-171, BAR-TH-129), chauffe-eau thermodynamiques (BAR-TH-148), ventilation, affichage des consommations (BAR-EQ-115).' },
      { titre: 'Rénovation globale', texte: 'Les programmes de rénovation performante, valorisés par lot ou opération par opération, avec la part précarité comptée à part pour le parc social.' },
    ],
    arguments: [
      { titre: 'Un volume qui se négocie', texte: 'Un programme de réhabilitation est un volume qui intéresse les acheteurs. Nous en négocions la valorisation, opération par opération ou en lot.' },
      { titre: 'La part précarité comptée', texte: 'Les logements sociaux ouvrent droit, pour une part fixée par département, à des certificats précarité, que les acheteurs valorisent généralement mieux. Nous les identifions et les justifions dans le dossier.' },
      { titre: 'Un dossier par opération, une seule interface', texte: 'Attestations, factures, preuves de qualification, feuilles de calcul : nous tenons la liste des pièces et relançons les entreprises. Vous avez un interlocuteur.' },
      { titre: 'Le contrôle avant le dépôt', texte: 'Nous organisons, pour le demandeur, le contrôle par échantillon exigé et vérifions chaque pièce avant le dépôt, parce qu’un refus après travaux ne se rattrape pas.' },
    ],
    etapes: [
      { delai: 'Programmation', titre: 'Revue du programme de travaux', desc: 'Nous lisons votre plan pluriannuel et identifions, opération par opération, les fiches applicables et les volumes attendus.' },
      { delai: 'Avant engagement', titre: 'Valorisation et engagement', desc: 'La valorisation est négociée, l’engagement de prime est signé avant le marché, le bon de commande ou le devis.' },
      { delai: 'Chantier', titre: 'Collecte des pièces', desc: 'Nous suivons les entreprises pour obtenir attestations, factures et justificatifs, à mesure que les opérations s’achèvent.' },
      { delai: 'Livraison', titre: 'Dépôt et versement', desc: 'Dépôt au PNCEE dans les douze mois de l’achèvement, par l’acheteur ou en votre nom comme éligible sous mandat, suivi de l’instruction et versement au bailleur.' },
    ],
    faq: [
      { q: 'Nous valorisons déjà en direct. Qu’apportez-vous de plus ?', r: 'Le temps, d’abord : seuil de volume par dossier ou regroupement, délais de dépôt, relance des entreprises pour les pièces. Et une valorisation négociée par un acteur qui n’est lié à aucun obligé. Notre rémunération porte sur les dossiers aboutis.' },
      { q: 'Comment justifiez-vous la part précarité ?', r: 'Sur un parc social, le conventionnement du logement ou sa gestion par un organisme HLM suffit, et le volume précarité est compté au prorata fixé pour le département. Nous listons les pièces au cas par cas et les intégrons au dossier.' },
      { q: 'Peut-on traiter une rénovation globale plutôt qu’opération par opération ?', r: 'Oui, la fiche de rénovation globale d’un bâtiment résidentiel collectif s’applique quand le gain énergétique atteint le seuil requis, avec une étude préalable. Nous comparons les deux voies sur votre programme.' },
      { q: 'Les CEE sont-ils cumulables avec les autres financements ?', r: 'Avec la plupart des prêts et subventions, oui, sous réserve des règles de cumul propres à chaque dispositif. Nous vous signalons les cas où un autre financeur valorise lui-même les CEE.' },
    ],
    appel: { titre: 'Un programme de travaux à valoriser ?', bouton: 'Parler de votre programme', href: url.contact },
  },

  'public-collectivites': {
    slug: 'public-collectivites',
    surtitre: 'Public & collectivités',
    titre: 'La prime CEE pour les bâtiments et équipements publics',
    chapo:
      'Écoles, gymnases, mairies, éclairage public, réseaux de chaleur : chaque opération d’économies d’énergie de la collectivité génère des certificats. Nous les valorisons pour vous, sans mobiliser vos services.',
    intro: [
      'Les bâtiments publics sont soumis au décret tertiaire, qui impose de réduire leurs consommations d’énergie par paliers, et les collectivités rénovent écoles, gymnases, mairies et éclairage public au rythme de leurs budgets. Chaque opération génère des certificats, que la collectivité peut valoriser comme une recette.',
      'Une collectivité est éligible au dispositif : elle peut déposer elle-même ou céder la valeur de ses opérations à un acheteur contre une prime. Dans la commande publique, l’engagement de prime doit précéder la signature du marché ou du bon de commande : c’est au stade de la programmation que la prime se joue.',
      'Ultra Énergie entre à ce stade : repérage des opérations éligibles, chiffrage des volumes, négociation de la valorisation, engagement de prime avant la signature, puis dossier et dépôt. Vos marchés et vos entreprises restent les vôtres, sans mobiliser vos services sur le montage.',
    ],
    photo: 'commande-publique',
    operations: [
      { titre: 'Bâtiments publics', texte: 'Isolation des combles et toitures (BAT-EN-101), chaufferies, pompes à chaleur, régulation et gestion technique du bâtiment (BAT-TH-116), équilibrage des installations (BAT-SE-103) dans les écoles, gymnases, mairies et bureaux.' },
      { titre: 'Éclairage public', texte: 'Rénovation de l’éclairage extérieur (RES-EC-104) : voirie, parkings, équipements sportifs.' },
      { titre: 'Réseaux de chaleur', texte: 'Réhabilitation des postes de livraison (RES-CH-103), raccordement des bâtiments publics, isolation des réseaux.' },
      { titre: 'Flottes et mobilité', texte: 'Achat ou location de véhicules légers électriques et rétrofit électrique par une collectivité (TRA-EQ-114).' },
    ],
    arguments: [
      { titre: 'Indépendant de tout obligé', texte: 'Un mandataire indépendant n’est lié à aucun obligé : nous négocions la valorisation de chaque opération pour le compte de la collectivité.' },
      { titre: 'Le bâti public, bien couvert', texte: 'Tertiaire, réseaux, éclairage extérieur : les fiches couvrent la majorité des travaux d’une collectivité, et nous savons lesquelles s’appliquent à chaque projet.' },
      { titre: 'Un dossier calé sur la commande publique', texte: 'Programmation, consultation, signature : nous entrons dès la programmation et suivons le calendrier de votre marché, bâtiment par bâtiment. Vos pièces de marché restent les vôtres.' },
      { titre: 'La conformité avant le dépôt', texte: 'Chaque pièce est vérifiée avant le dépôt au PNCEE. Un dossier refusé après travaux est une recette perdue pour la collectivité.' },
    ],
    etapes: [
      { delai: 'Programmation', titre: 'Revue des opérations', desc: 'Nous lisons votre programme de travaux et identifions les fiches applicables, bâtiment par bâtiment.' },
      { delai: 'Avant signature', titre: 'Engagement de prime', desc: 'La valorisation est négociée et l’engagement est signé avant la signature du marché (acte d’engagement ou bon de commande) ou du devis.' },
      { delai: 'Travaux', titre: 'Collecte des pièces', desc: 'Attestations, factures, justificatifs techniques : nous suivons les entreprises et vérifions.' },
      { delai: 'Réception', titre: 'Dépôt et versement', desc: 'Dépôt au PNCEE dans les douze mois de l’achèvement, par l’acheteur ou en votre nom comme éligible sous mandat, suivi de l’instruction, versement à la collectivité.' },
    ],
    faq: [
      { q: 'Nous valorisons déjà en direct. Qu’apportez-vous de plus ?', r: 'Le temps que coûtent le seuil de volume par dossier ou le regroupement, les délais de dépôt et la collecte des pièces auprès des entreprises. Et une valorisation négociée par un acteur qui n’est lié à aucun obligé. Notre rémunération porte sur les dossiers aboutis.' },
      { q: 'À quel moment de la procédure faut-il vous solliciter ?', r: 'Au stade de la programmation ou de la consultation, en tout cas avant la signature du marché ou du devis : c’est là que l’engagement de prime doit être daté. Nous nous calons sur votre calendrier.' },
      { q: 'Quels projets sont concernés ?', r: 'Les travaux sur bâtiments tertiaires existants, dont les bâtiments publics, les réseaux de chaleur et l’éclairage extérieur. Nous vous disons fiche par fiche ce qui s’applique à votre programme.' },
      { q: 'Les certificats concernent-ils aussi les programmes d’accompagnement ?', r: 'Les programmes CEE, financés par les obligés, sont une voie distincte des opérations standardisées. Nous vous orientons si votre projet en relève.' },
    ],
    appel: { titre: 'Un projet sur le patrimoine de la collectivité ?', bouton: 'Parler de votre projet', href: url.contact },
  },

  'entreprises-industriels': {
    slug: 'entreprises-industriels',
    surtitre: 'Entreprises & industriels',
    titre: 'La prime CEE pour les sites tertiaires et industriels',
    chapo:
      'Gestion technique du bâtiment, moteurs et variateurs, récupération de chaleur, isolation : les opérations d’efficacité énergétique d’un site génèrent des certificats que nous valorisons pour vous.',
    intro: [
      'Les bureaux et les commerces sont soumis au décret tertiaire, qui impose de réduire leurs consommations par paliers ; les sites industriels, eux, cherchent à faire baisser une facture d’énergie devenue un poste majeur. Dans les deux cas, les travaux d’efficacité énergétique génèrent des certificats : GTB, isolation, variateurs, récupération de chaleur, air comprimé.',
      'Leur valeur dépend de la fiche d’opération, des quantités et du prix du marché au moment de l’engagement, qui doit précéder la commande. Pour un projet sans fiche, une opération spécifique peut être montée sur étude, selon le guide qui a valeur réglementaire : nous vous disons si votre projet en relève.',
      'Ultra Énergie chiffre le volume à partir de vos données techniques, négocie sa valorisation et vous transmet un engagement de prime avant la commande. Le dossier est monté par nous, avec vos prestataires, et déposé par l’acheteur.',
    ],
    photo: 'site',
    operations: [
      { titre: 'Tertiaire', texte: 'Gestion technique du bâtiment (BAT-TH-116), isolation des combles et toitures (BAT-EN-101), équilibrage du chauffage (BAT-SE-103), luminaires performants, meubles frigorifiques de vente (BAT-EQ-134).' },
      { titre: 'Industrie', texte: 'Variateurs de vitesse sur moteurs (IND-UT-102), isolation des parois d’équipements et de réseaux (IND-UT-131), déstratification d’air (IND-BA-110), récupération de chaleur, air comprimé.' },
      { titre: 'Agriculture', texte: 'Pompes à chaleur (AGRI-TH-108), double écran thermique de serre (AGRI-EQ-102), variateurs de vitesse (AGRI-UT-102).' },
      { titre: 'Opérations spécifiques', texte: 'Pour les projets sans fiche, une opération spécifique peut être montée sur étude, selon le guide de l’ADEME qui a valeur réglementaire.' },
    ],
    arguments: [
      { titre: 'Indépendant de tout obligé', texte: 'Nous ne dépendons d’aucun obligé : nous négocions la valorisation de chaque opération pour votre compte.' },
      { titre: 'Le tertiaire et l’industrie, en détail', texte: 'GTB, éclairage, isolation, moteurs, air comprimé, froid, vapeur, chaleur fatale : les fiches sont nombreuses et précises. Nous savons laquelle s’applique et ce qu’elle exige.' },
      { titre: 'Le dossier avec vos prestataires', texte: 'Nous listons les pièces attendues de l’installateur et du bureau d’études, relançons et vérifions. Vous signez l’attestation, nous faisons le reste.' },
      { titre: 'Le calendrier tenu', texte: 'L’engagement avant devis, le dépôt dans les douze mois de l’achèvement : nous tenons la chronologie qui conditionne la délivrance.' },
    ],
    etapes: [
      { delai: 'Projet à l’étude', titre: 'Qualification de l’opération', desc: 'Nous identifions la fiche applicable, ses conditions et le volume attendu à partir de vos données techniques.' },
      { delai: 'Avant commande', titre: 'Valorisation et engagement', desc: 'La valorisation est négociée. L’engagement de prime est signé avant le devis ou le bon de commande.' },
      { delai: 'Travaux', titre: 'Réalisation et pièces', desc: 'Votre prestataire réalise. Nous collectons les justificatifs techniques prévus par la fiche et l’attestation sur l’honneur.' },
      { delai: 'Après réception', titre: 'Dépôt et versement', desc: 'Contrôle des pièces, transmission du dossier complet à l’acheteur qui le dépose au PNCEE, suivi de l’instruction et versement.' },
    ],
    faq: [
      { q: 'Notre opération n’est dans aucune fiche. Est-elle perdue ?', r: 'Pas forcément. Les opérations spécifiques permettent d’obtenir des certificats hors catalogue, sur la base d’une étude énergétique, d’une situation de référence et d’un temps de retour supérieur à trois ans. Elles concernent surtout l’industrie. Nous vous disons si votre projet peut en relever.' },
      { q: 'Le prestataire doit-il être RGE ?', r: 'Non, la qualification RGE est une exigence des fiches résidentielles. En tertiaire et en industrie, les fiches demandent un professionnel, et parfois des justificatifs techniques précis (étude de dimensionnement, plaque signalétique, norme de mesure).' },
      { q: 'Comment la prime est-elle calculée ?', r: 'Chaque fiche donne un forfait en kWh cumac, par unité de surface, de puissance ou par équipement, parfois pondéré par un facteur. Ce volume, multiplié par le prix négocié avec l’acheteur, donne la prime.' },
      { q: 'Quels délais après les travaux ?', r: 'Le dossier doit être déposé dans les douze mois suivant l’achèvement de l’opération. Nous déposons dès que les pièces sont complètes.' },
    ],
    appel: { titre: 'Un projet d’efficacité énergétique sur votre site ?', bouton: 'Parler de votre opération', href: url.contact },
  },

  /* ── Partenaires ──────────────────────────────────────────────────── */

  obliges: {
    slug: 'obliges',
    surtitre: 'Obligés & délégataires',
    titre: 'Des opérations CEE vérifiées avant le dépôt',
    chapo:
      'Ultra Énergie apporte aux obligés et aux délégataires des opérations qualifiées en résidentiel collectif, tertiaire et industrie, avec des dossiers complets, vérifiés avant dépôt.',
    /* « Notre proposition » : ce qu'on apporte, d'où ça vient, ce qu'on n'est pas. Absorbe
       l'ancien encadré « Nous ne portons aucune obligation » et le fond de « Qui fait quoi ». */
    intro: [
      'Un dossier CEE ne vaut que si les certificats sont délivrés. Ce que nous apportons aux acheteurs, ce n’est pas du volume : ce sont des opérations dont la chronologie a été respectée, dont les pièces ont été contrôlées avant transmission, et dont le bénéficiaire sait ce qu’il signe.',
      'Ces opérations viennent des copropriétés, des bailleurs, des collectivités et des entreprises que nous accompagnons, et des installateurs et apporteurs d’affaires qui nous confient leurs chantiers avant le devis. Vous nous indiquez les secteurs, les fiches et les volumes qui vous intéressent ; nous vous soumettons les opérations qui y répondent, et vous décidez sur chacune.',
      'Ultra Énergie n’est ni obligé ni délégataire. Nous agissons sous mandat du bénéficiaire des travaux, et sous mandat de votre part si vous nous confiez le dépôt en votre nom. Aucune exclusivité ne nous lie à un acheteur, notre rémunération porte sur les opérations abouties, et les certificats sont délivrés sur votre compte.',
    ],
    photo: 'entonnoir',
    arguments: [
      { titre: 'Le rôle actif prouvé', texte: 'Chaque opération porte une proposition de prime datée d’avant le devis. La pièce est dans le dossier, pas reconstituée après coup.' },
      { titre: 'Les pièces vérifiées avant dépôt', texte: 'Attestation sur l’honneur complète, qualification du professionnel, justificatifs techniques prévus par la fiche : nous contrôlons chaque pièce avant de vous transmettre le dossier.' },
      { titre: 'Des secteurs à volumes', texte: 'Résidentiel collectif, tertiaire, industrie : des opérations de plusieurs centaines de MWh à plusieurs GWh cumac, et des maîtres d’ouvrage identifiés.' },
      { titre: 'Une relation claire', texte: 'Un mandat écrit qui fixe le périmètre, un prix proposé par opération ou par lot, des dossiers transmis prêts à déposer. Vous décidez de répondre ou non sur chaque proposition.' },
    ],
    /* Le « vous faites, nous faisons » de l'ancien « Qui fait quoi » est dans chaque étape. */
    etapes: [
      { delai: 'Démarrage', titre: 'Mandat et conditions', desc: 'Vous nous indiquez les secteurs, les fiches et les volumes qui vous intéressent ; nous formalisons le mandat et les conditions de prix.' },
      { delai: 'En continu', titre: 'Propositions d’opérations', desc: 'Nous vous soumettons les opérations qualifiées, rôle actif daté, avec leur volume attendu. Vous répondez sur chacune : prix, volume, délai.' },
      { delai: 'Chantier', titre: 'Suivi et collecte', desc: 'Nous suivons les travaux, collectons et vérifions chaque pièce, et vous tenons informé de l’avancement.' },
      { delai: 'Livraison', titre: 'Dossier prêt à déposer', desc: 'Le dossier complet vous est transmis, ou déposé en votre nom selon le mandat. Les certificats sont délivrés sur votre compte.' },
    ],
    faq: [
      { q: 'Sous quelle forme travaillez-vous avec un obligé ?', r: 'Sous mandat écrit, qui précise le périmètre (secteurs, fiches, volumes) et les conditions. Nous pouvons collecter et transmettre les dossiers, ou déposer en votre nom.' },
      { q: 'D’où viennent vos opérations ?', r: 'Des maîtres d’ouvrage que nous accompagnons (copropriétés, bailleurs, collectivités, entreprises) et des installateurs et apporteurs d’affaires partenaires qui nous confient leurs chantiers avant la signature des devis.' },
      { q: 'Quel contrôle faites-vous avant de transmettre ?', r: 'Chronologie du rôle actif, complétude et cohérence de l’attestation sur l’honneur, qualification du professionnel, justificatifs techniques prévus par la fiche, cohérence des quantités entre devis, facture et attestation.' },
      { q: 'Travaillez-vous avec plusieurs obligés ?', r: 'Oui. Un partenariat ne donne pas d’exclusivité.' },
    ],
    appel: {
      titre: 'Recevoir nos propositions d’opérations ?',
      texte: 'Dites-nous vos secteurs, vos fiches et vos volumes : nous vous soumettons des opérations qualifiées, rôle actif daté et pièces vérifiées.',
      bouton: 'Devenir partenaire acheteur',
      modale: 'partenaire',
    },
  },

  installateurs: {
    slug: 'installateurs',
    surtitre: 'Installateurs & artisans',
    titre: 'Une prime sur vos chantiers éligibles, sans monter le dossier',
    chapo:
      'Vous gardez votre client et votre devis. Nous apportons l’engagement de prime avant la signature, montons le dossier CEE et suivons le versement.',
    /* Le contexte, pour le gabarit EBS : ce qu'est la prime, quand elle se joue, ce que nous faisons. */
    intro: [
      'Une prime CEE n’est pas une subvention : c’est la valeur des certificats que votre chantier génère, achetés par un vendeur d’énergie qui doit en détenir. Elle dépend de la fiche d’opération applicable, de la zone climatique et des caractéristiques du matériel.',
      'Elle se joue avant le devis : l’engagement de prime doit être établi avant que votre client signe, sinon la voie de la prime se ferme en principe. Et c’est la fiche qui fixe les conditions : le matériel et ses performances, la qualification de l’installateur quand elle est exigée, les mentions du devis et de la facture.',
      'Vous gardez votre client et votre devis. Vous nous décrivez le chantier, nous négocions le prix des certificats avec un acheteur, transmettons l’engagement à votre client, puis montons le dossier après les travaux et suivons le versement.',
    ],
    photo: 'chronologie',
    operations: [
      { titre: 'Isolation', texte: 'Combles et toitures (fiches BAR-EN-101 en résidentiel, BAT-EN-101 en tertiaire), murs, planchers bas, et isolation des réseaux et équipements industriels (IND-UT-131).' },
      { titre: 'Chauffage et eau chaude', texte: 'Pompes à chaleur air/eau (BAR-TH-171) et air/air (BAR-TH-129), chauffe-eau thermodynamique (BAR-TH-148), chaudières et pompes à chaleur collectives, raccordement à un réseau de chaleur.' },
      { titre: 'Régulation et GTB', texte: 'Gestion technique du bâtiment (BAT-TH-116), équilibrage d’une installation de chauffage (BAT-SE-103), désembouage (BAR-SE-108), affichage des consommations (BAR-EQ-115).' },
      { titre: 'Ventilation et froid', texte: 'Ventilation mécanique contrôlée, déstratification d’air (IND-BA-110), meubles frigorifiques de vente performants (BAT-EQ-134).' },
      { titre: 'Moteurs et électricité', texte: 'Variateurs électroniques de vitesse sur moteurs asynchrones (IND-UT-102 en industrie, AGRI-UT-102 en agriculture), récupération de chaleur.' },
      { titre: 'Éclairage', texte: 'Rénovation d’éclairage extérieur (RES-EC-104) et luminaires performants dans les bâtiments tertiaires.' },
    ],
    arguments: [
      { titre: 'Votre client reste le vôtre', texte: 'Nous intervenons sur la prime, pas sur la relation commerciale. Le devis, les travaux et la garantie restent entre vous et lui.' },
      { titre: 'Un signalement, pas un dossier', texte: 'Vous nous envoyez le projet, nous vous disons ce que la fiche exige et ce qu’il faudra porter sur le devis et la facture. Rien à monter de votre côté.' },
      { titre: 'Une prime qui aide à conclure', texte: 'Votre client connaît le montant proposé, sous réserve de la conformité du dossier, et le devis se signe avec cette ligne en face.' },
      { titre: 'La conformité vérifiée avec vous', texte: 'Qualification, mentions du devis, attestation sur l’honneur : nous vérifions avant le dépôt, pour que le chantier ne soit pas refusé après coup.' },
    ],
    etapes: [
      { delai: 'Avant le devis', titre: 'Vous nous décrivez le chantier', desc: 'Type de travaux, surface ou puissance, client : nous identifions la fiche et vous indiquons les mentions à porter sur le devis.' },
      { delai: 'Avant signature', titre: 'Engagement de prime au client', desc: 'Nous négocions la valorisation et transmettons l’engagement à votre client, qui signe le devis avec la prime en face.' },
      { delai: 'Chantier', titre: 'Travaux et attestation', desc: 'Vous réalisez, facturez, et signez avec le client l’attestation sur l’honneur que nous préparons.' },
      { delai: 'Après travaux', titre: 'Dépôt et versement', desc: 'Nous contrôlons les pièces, transmettons le dossier à l’acheteur pour le dépôt et suivons le versement selon les termes convenus.' },
    ],
    faq: [
      { q: 'Quels travaux sont éligibles ?', r: 'Ceux qui correspondent à une fiche d’opération standardisée : isolation, chauffage et EnR, GTB et régulation, éclairage, ventilation, moteurs et variateurs, récupération de chaleur, dans les six secteurs du dispositif. Décrivez-nous le chantier, nous vous disons si une fiche s’applique et à quelles conditions.' },
      { q: 'Dois-je être RGE ?', r: 'Pour les travaux en résidentiel, la plupart des fiches l’exigent. En tertiaire et en industrie, ce n’est pas requis, mais la fiche peut demander des justificatifs techniques précis. Nous vous le disons fiche par fiche.' },
      { q: 'Que dois-je mentionner sur le devis et la facture ?', r: 'Ce que la fiche impose pour la preuve de réalisation : la nature de l’opération, les caractéristiques du matériel (marque, référence, performance), les quantités. Nous vous transmettons la liste avant le chantier.' },
      { q: 'Qui touche la prime ?', r: 'Le bénéficiaire des travaux, selon l’engagement qu’il a signé. Une remise sur devis est possible dans certains montages ; dans ce cas, qui la porte et quand elle est remboursée est fixé avant l’engagement.' },
      { q: 'Combien ça coûte, et qui paie ?', r: 'Notre rémunération porte sur les dossiers aboutis, et les conditions vous sont précisées avant l’engagement de prime. Nous décrire un chantier n’engage à rien.' },
      { q: 'Puis-je aussi apporter des chantiers que je ne réalise pas ?', r: 'Oui, comme apporteur d’affaires, dans les conditions d’un contrat de partenariat : voir la page Apporteurs d’affaires.' },
    ],
    appel: { titre: 'Un chantier en préparation ?', bouton: 'Nous décrire le chantier', href: url.contact },
  },

  'apporteurs-affaires': {
    slug: 'apporteurs-affaires',
    surtitre: 'Apporteurs d’affaires',
    titre: 'Signaler un projet avant le devis',
    chapo:
      'Gestionnaires de patrimoine, bureaux d’études, mainteneurs, distributeurs, courtiers : vous êtes en amont des travaux. Chaque projet signalé avant le devis peut devenir une prime pour votre client et une commission pour vous.',
    intro: [
      'La prime CEE se joue avant la signature du devis. Ceux qui voient les projets à ce moment-là, ce sont les gestionnaires de patrimoine qui programment, les bureaux d’études qui dimensionnent, les mainteneurs qui préconisent, les distributeurs qui chiffrent.',
      'Ultra Énergie s’occupe de tout ce qui suit : qualification de l’opération, négociation de la valorisation, engagement de prime, dossier, dépôt. Vous n’avez aucun montage réglementaire à votre charge.',
      'Votre rémunération est une commission sur chaque dossier abouti, prévue au contrat de partenariat.',
    ],
    photo: 'reseau',
    arguments: [
      { titre: 'Une commission par dossier abouti', texte: 'Le contrat de partenariat fixe la commission. Elle est due quand les certificats sont délivrés, sur chaque opération que vous avez apportée.' },
      { titre: 'Un signalement suffit', texte: 'Un projet, un contact, une date prévisionnelle. Nous prenons le relais et vous tenons informé de l’avancement.' },
      { titre: 'Votre client bien servi', texte: 'Nous ne sommes liés à aucun obligé et négocions la valorisation pour votre client. Vous lui apportez une recette, pas un vendeur.' },
      { titre: 'Le montage réglementaire est chez nous', texte: 'Le rôle actif, les pièces, le dépôt et les contrôles sont de notre côté. Vous n’avez aucun dossier à monter ; si votre client vous mandate pour signer l’attestation, nous la préparons avec vous.' },
    ],
    etapes: [
      { delai: 'Démarrage', titre: 'Contrat de partenariat', desc: 'Nous convenons du périmètre et de la commission, et vous donnons la fiche de signalement.' },
      { delai: 'Avant devis', titre: 'Vous signalez un projet', desc: 'Nous qualifions l’opération et contactons le maître d’ouvrage, avec vous ou en votre nom, avant toute signature.' },
      { delai: 'Engagement et travaux', titre: 'Nous gérons le dossier', desc: 'Engagement de prime, suivi du chantier, collecte des pièces. Vous êtes informé à chaque étape.' },
      { delai: 'Délivrance', titre: 'Commission versée', desc: 'À la délivrance des certificats, la commission vous est réglée selon le contrat.' },
    ],
    faq: [
      { q: 'Qui peut être apporteur d’affaires ?', r: 'Toute structure qui voit des projets de travaux avant leur engagement : syndics, gestionnaires de patrimoine, bureaux d’études, sociétés de maintenance, distributeurs de matériel, courtiers en énergie, installateurs.' },
      { q: 'Dois-je connaître le dispositif CEE ?', r: 'Non. Il suffit de reconnaître un projet d’économies d’énergie et de nous le signaler avant la signature du devis. Nous nous chargeons de la qualification et du reste.' },
      { q: 'Quand la commission est-elle versée ?', r: 'Quand l’opération est aboutie, c’est-à-dire quand les certificats sont délivrés. Le contrat de partenariat en fixe le montant et les modalités.' },
      { q: 'Puis-je apporter des projets dans tous les secteurs ?', r: 'Oui : résidentiel collectif, tertiaire, industrie, agriculture, réseaux, transport. Chaque secteur a ses fiches.' },
    ],
    appel: {
      titre: 'Vous voyez passer des projets de travaux ?',
      texte: 'Un contact, une nature de travaux, une date prévisionnelle : nous qualifions l’opération et prenons le relais, et vous êtes informé à chaque étape.',
      bouton: 'Devenir apporteur d’affaires',
      modale: 'partenaire',
    },
  },
};

export function argumentaireDe(slug: string): Argumentaire | undefined {
  return ARGUMENTAIRES[slug];
}
