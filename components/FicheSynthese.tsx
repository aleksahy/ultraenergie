import Terme from './Terme';
import type { Fiche } from '@/lib/fiches';
import { LIBELLE_ZONE } from '@/lib/fiches';
import { familleLabel } from '@/lib/familles';
import { secteurParSlug } from '@/lib/secteurs';
import { montantVitrine } from '@/lib/calcul';
import { nombreFr, decimalFr } from '@/lib/site';
import { dateFr, dateCourte } from '@/lib/dates';

/**
 * L'encadré de synthèse : ce qu'on vient chercher en premier, et l'ancre vers les documents.
 *
 * ⛔ CHAQUE LIGNE TIENT À SA DONNÉE. Pas de ligne vide, pas de zéro, pas de tiret de
 * remplacement : une ligne « Volume engagé — » n'apprend rien et fait douter du reste.
 */
export default function FicheSynthese({ fiche }: { fiche: Fiche }) {
  const secteur = secteurParSlug(fiche.secteur);
  const montant = montantVitrine(fiche.calcul);

  return (
    <div className="synthese">
      <dl className="synthese-liste">
        <Ligne terme="Secteur">
          {secteur?.label} — {familleLabel(fiche.code)}
        </Ligne>

        <Ligne terme="Montant">
          <strong>{nombreFr.format(montant.valeur)} {montant.unite}</strong>
          {/* ⚠️ La condition fait partie du montant, pas d'une note : « 1 700 kWh cumac/m² »
              sans « en zone H1 » se lit comme une promesse valable partout. */}
          {montant.condition && <span className="synthese-precision"> en {montant.condition}</span>}
        </Ligne>

        <Ligne terme={<Terme slug="duree-de-vie-conventionnelle">Durée de vie</Terme>}>
          {fiche.dureeVie.length === 1
            ? `${fiche.dureeVie[0].valeurAnnees} ans`
            : fiche.dureeVie.map((d) => `${d.valeurAnnees} ans (${d.condition})`).join(', ')}
        </Ligne>

        <Ligne terme="Version">
          {fiche.version}, applicable depuis le {dateCourte(fiche.dateApplication)}
        </Ligne>

        {/* Date future : c'est une date limite d'engagement, pas une alerte. */}
        {fiche.dateAbrogation && (
          <Ligne terme="Engageable jusqu’au">{dateFr(fiche.dateAbrogation)}</Ligne>
        )}

        {fiche.volumeEngage && (
          <Ligne terme="Volume engagé">
            {decimalFr.format(fiche.volumeEngage.twhCumac)} TWh cumac depuis {fiche.volumeEngage.depuis}
          </Ligne>
        )}

        {fiche.zoneApplication !== 'metropole' && (
          <Ligne terme="Zone d’application">{LIBELLE_ZONE[fiche.zoneApplication]}</Ligne>
        )}

      </dl>

      {/* ⚠️ L'ANCRE MÈNE À LA SECTION, JAMAIS AU FICHIER. Un lien direct vers le PDF fait
          sortir du site avant le CTA ; l'ancre fait défiler la page, qui traverse le montant
          et l'appel à l'action au passage. */}
      <a className="synthese-ancre" href="#documents">Télécharger la fiche ↓</a>
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
