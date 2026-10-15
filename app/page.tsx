import HeroPhoto from '@/components/HeroPhoto';
import Reperes from '@/components/Reperes';
import Methode from '@/components/Methode';
import NosSolutions from '@/components/NosSolutions';
import Secteurs from '@/components/Secteurs';
import Metier from '@/components/Metier';
import QuestionsAccueil from '@/components/QuestionsAccueil';
import Publications from '@/components/Publications';
import ContactBande from '@/components/ContactBande';

/**
 * L'accueil, refondu le 15/10/2026 sur la variante « Photo » choisie par Alek, d'après le
 * site d'EBS Énergie. L'ordre, arrêté avec Alek le 15/10/2026 : ce qu'on fait (méthode), qui
 * on est (métier), nos solutions par profil, où (secteurs), puis les publications, la FAQ qui lève
 * les dernières objections, et le contact. La lettre « Veille CEE » est dans le pied.
 * (La bande « Conformité » a été retirée par Alek.)
 *
 * ⛔ Plus de landing « produit tech » : ni cartes de profils qui ouvrent une modale, ni
 * comparatif en colonnes, ni cartes partenaires, ni illustration vectorielle.
 */
export default function Accueil() {
  return (
    <main>
      <HeroPhoto />
      <Reperes />
      <Methode />
      <Metier />
      <NosSolutions />
      <Secteurs />
      <Publications />
      <QuestionsAccueil />
      <ContactBande />
    </main>
  );
}
