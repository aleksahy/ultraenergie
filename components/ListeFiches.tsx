import Link from 'next/link';
import type { EntreeCatalogue } from '@/lib/fiches';
import { ficheParCode, aUnePage } from '@/lib/fiches';
import { url } from '@/lib/routes';

/**
 * La liste des fiches d'une famille, dans un hub catalogue.
 *
 * ⚠️ UNE ENTRÉE N'EST UN LIEN QUE SI SA PAGE EXISTE. Le catalogue compte 216 codes ; le
 * détail qui donne sa page à une fiche arrivera par un second export. D'ici là, l'entrée est
 * rendue en texte : le hub reste complet et exact, sans un seul lien mort. La bascule se fera
 * fiche par fiche, sans toucher à ce composant.
 *
 * ⛔ PAS DE LIEN VERS UNE PAGE « À VENIR ». Le contrôle de fin de build le refuserait, et il
 * aurait raison : une page annoncée qui répond 404 coûte plus qu'une ligne non cliquable.
 */
export default function ListeFiches({ entrees }: { entrees: EntreeCatalogue[] }) {
  return (
    <ul className="fiches-liste">
      {entrees.map((entree) => {
        const fiche = ficheParCode(entree.code);
        const liable = aUnePage(entree.code);

        const contenu = (
          <>
            <span className="fiche-entree-code">{entree.code}</span>
            {fiche && <span className="fiche-entree-titre">{fiche.intitule}</span>}
          </>
        );

        return (
          <li key={entree.code}>
            {liable && fiche ? (
              <Link className="fiche-entree" href={url.fiche(fiche.secteur, fiche.code)}>{contenu}</Link>
            ) : (
              <span className="fiche-entree fiche-entree-inerte">{contenu}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
