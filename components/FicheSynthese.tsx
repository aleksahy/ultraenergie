import Terme from './Terme';
import type { Fiche } from '@/lib/fiches';
import { LIBELLE_ZONE } from '@/lib/fiches';
import { familleLabel } from '@/lib/familles';
import { secteurParSlug } from '@/lib/secteurs';
import { montantVitrine } from '@/lib/calcul';
import { nombreFr } from '@/lib/site';
import { dateFr, dateCourte } from '@/lib/dates';

/**
 * L'encadré de synthèse : ce qu'on vient chercher en premier, et l'ancre vers les documents.
 *
 * ⛔ CHAQUE LIGNE TIENT À SA DONNÉE. Pas de ligne vide, pas de zéro, pas de tiret de
 * remplacement : une ligne « Volume engagé — » n'apprend rien et fait douter du reste.
 */
export default function FicheSynthese({ fiche }: { fiche: Fiche }) {
  const secteur = secteurParSlug(fiche.secteur);
  const montant = fiche.calcul ? montantVitrine(fiche.calcul) : null;

  return (
    <div className="synthese">
      <dl className="synthese-liste">
        <Ligne terme="Secteur">
          {secteur?.label} — {familleLabel(fiche.code)}
        </Ligne>

        {/* Le montant n'a sa ligne que sur un barème modélisé : un tableau publié n'a pas de
            « valeur vitrine » qu'on puisse citer sans la condition qui la produit. */}
        {montant && (
          <Ligne terme="Montant">
            <strong>{nombreFr.format(montant.valeur)} {montant.unite}</strong>
            {/* ⚠️ La condition fait partie du montant, pas d'une note : « 1 700 kWh cumac/m² »
                sans « en zone H1 » se lit comme une promesse valable partout. */}
            {montant.condition && <span className="synthese-precision"> en {montant.condition}</span>}
          </Ligne>
        )}

        {(fiche.dureeVie.length > 0 || fiche.dureeVieTexte) && (
          <Ligne terme={<Terme slug="duree-de-vie-conventionnelle">Durée de vie</Terme>}>
            {fiche.dureeVieTexte
              ? fiche.dureeVieTexte
              : fiche.dureeVie.length === 1
                ? `${fiche.dureeVie[0].valeurAnnees} ans`
                : fiche.dureeVie.map((d) => `${d.valeurAnnees} ans (${d.condition})`).join(', ')}
          </Ligne>
        )}

        <Ligne terme="Version">
          {fiche.version}
          {fiche.dateApplication && <>, applicable depuis le {dateCourte(fiche.dateApplication)}</>}
        </Ligne>

        {/* Date future : c'est une date limite d'engagement, pas une alerte. */}
        {fiche.dateAbrogation && (
          <Ligne terme="Engageable jusqu’au">{dateFr(fiche.dateAbrogation)}</Ligne>
        )}

        {/* Le premier motif de refus d'un dossier mérite sa ligne, pas une lecture des
            conditions jusqu'au cinquième point. */}
        {fiche.qualification && <Ligne terme="Qualification">{fiche.qualification}</Ligne>}

        {fiche.zoneApplication !== 'metropole' && (
          <Ligne terme="Zone d’application">{LIBELLE_ZONE[fiche.zoneApplication]}</Ligne>
        )}

      </dl>

    </div>
  );
}

function Ligne({ terme, children }: { terme: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="synthese-ligne">
      <dt>{terme}</dt>
      <dd>{children}</dd>
    </div>
  );
}
