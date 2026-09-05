import type { Fiche } from './fiches';

/**
 * Les organismes d'où viennent les données d'une page de fiche.
 *
 * ⚠️ CE SONT LES SOURCES DE CE QUE LA PAGE AFFICHE, pas la liste des acteurs du dispositif.
 * Le PNCEE instruit les dossiers et l'ATEE documente le dispositif : ni l'un ni l'autre n'est
 * la provenance d'un chiffre de cette page, les citer ici emprunterait leur autorité sans
 * qu'ils aient rien fourni.
 *
 * ⚠️ La liste SUIT LE CONTENU : le registre n'apparaît que sur les fiches dont on affiche un
 * volume engagé. Une source citée pour une donnée absente est une source fausse.
 */
export interface Organisme {
  nom: string;
  url: string;
}

const MINISTERE: Organisme = {
  nom: 'Ministère de la Transition écologique',
  url: 'https://www.ecologie.gouv.fr',
};

const LEGIFRANCE: Organisme = {
  nom: 'Légifrance',
  url: 'https://www.legifrance.gouv.fr',
};

/** 🚨 URL à vérifier avant mise en ligne : le registre national des CEE. */
const REGISTRE: Organisme = {
  nom: 'Registre national EMMY',
  url: 'https://www.emmy.fr',
};

export function organismesDe(fiche: Fiche): Organisme[] {
  return [MINISTERE, LEGIFRANCE, ...(fiche.volumeEngage ? [REGISTRE] : [])];
}
