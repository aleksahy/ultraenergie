/**
 * Les organismes d'où viennent les données d'une page de fiche.
 *
 * ⚠️ CE SONT LES SOURCES DE CE QUE LA PAGE AFFICHE, pas la liste des acteurs du dispositif.
 * Le PNCEE instruit les dossiers et l'ATEE documente le dispositif : ni l'un ni l'autre n'est
 * la provenance d'un chiffre de cette page, les citer ici emprunterait leur autorité sans
 * qu'ils aient rien fourni.
 *
 * ⚠️ La liste SUIT LE CONTENU. Le registre EMMY y a figuré tant que la synthèse affichait un
 * volume engagé ; cette donnée a été retirée le 19/09/2026 (provenance non établie), et le
 * registre avec elle. Une source citée pour une donnée absente est une source fausse.
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

/** Les organismes cités sur toute fiche. La fiche reviendra en paramètre le jour où une
    donnée n'aura de source que sur certaines d'entre elles. */
export function organismesDe(): Organisme[] {
  return [MINISTERE, LEGIFRANCE];
}
