import type { DocumentFiche, Fiche } from '@/lib/fiches';
import { LIBELLE_NATURE, documentsEnVigueur, historiqueDocuments, DATE_BUILD } from '@/lib/fiches';
import { dateFr } from '@/lib/dates';

/** L'historique : versions passées et versions publiées mais pas encore applicables. */
export function HistoriqueVersions({ fiche }: { fiche: Fiche }) {
  return (
    <div className="tableau-cadre">
      <table className="tableau">
        <thead>
          <tr>
            <th scope="col">Document</th>
            <th scope="col">Version</th>
            <th scope="col">Date d’effet</th>
            <th scope="col">État</th>
          </tr>
        </thead>
        <tbody>
          {historiqueDocuments(fiche).map((d) => (
            <tr key={`${d.nature}-${d.version}-${d.dateEffet}`}>
              <th scope="row">{LIBELLE_NATURE[d.nature]}</th>
              <td>{d.version}</td>
              <td>{dateFr(d.dateEffet)}</td>
              <td>{etat(d, fiche)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function etat(doc: DocumentFiche, fiche: Fiche): string {
  if (doc.dateEffet > DATE_BUILD) return 'À venir';
  return documentsEnVigueur(fiche).includes(doc) ? 'En vigueur' : 'Remplacée';
}
