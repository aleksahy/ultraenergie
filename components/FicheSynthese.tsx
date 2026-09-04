import Terme from './Terme';
import type { Fiche } from '@/lib/fiches';
import { LIBELLE_ZONE } from '@/lib/fiches';
import { montantType } from '@/lib/calcul';
import { nombreFr } from '@/lib/site';
import { dateFr } from '@/lib/dates';

/**
 * L'encadré de synthèse : les quatre chiffres qu'on vient chercher en premier.
 *
 * ⛔ LE MONTANT EST UNE FOURCHETTE, JAMAIS UNE MOYENNE. Une moyenne sur une grille climatique
 * ne correspond à aucune opération réelle, et c'est exactement le nombre qui se retrouve cité
 * hors contexte. Quand la fiche n'a qu'un forfait, la fourchette se referme d'elle-même sur
 * une valeur unique.
 */
export default function FicheSynthese({ fiche }: { fiche: Fiche }) {
  const { min, max, unite } = montantType(fiche.calcul);

  return (
    <dl className="synthese">
      <div className="synthese-case synthese-case-forte">
        <dt>Montant</dt>
        <dd>
          {min === max ? nombreFr.format(min) : `${nombreFr.format(min)} à ${nombreFr.format(max)}`}
          <span className="synthese-unite">{unite}</span>
        </dd>
      </div>

      <div className="synthese-case">
        <dt><Terme slug="duree-de-vie-conventionnelle">Durée de vie</Terme></dt>
        <dd>
          {fiche.dureeVie.length === 1
            ? `${fiche.dureeVie[0].valeurAnnees} ans`
            : `${Math.min(...fiche.dureeVie.map((d) => d.valeurAnnees))} à ${Math.max(...fiche.dureeVie.map((d) => d.valeurAnnees))} ans`}
        </dd>
      </div>

      <div className="synthese-case">
        <dt>Zone d’application</dt>
        <dd>{LIBELLE_ZONE[fiche.zoneApplication]}</dd>
      </div>

      <div className="synthese-case">
        <dt>Version</dt>
        <dd>
          {fiche.version}
          <span className="synthese-unite">depuis le {dateFr(fiche.dateApplication)}</span>
        </dd>
      </div>
    </dl>
  );
}
