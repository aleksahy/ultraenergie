/**
 * Le nom de la marque, en texte. ⛔ Il reste NOIR (`--noir`) même quand l'encre du site est
 * verte, c'est la feuille de style qui le pose. ⛔ Rien dessous : la signature « Mandataire
 * CEE indépendant » a été essayée puis retirée (Alek, 15/10/2026).
 */
export default function Wordmark({ className }: { className?: string }) {
  return <span className={className}>Ultra&nbsp;Énergie</span>;
}
