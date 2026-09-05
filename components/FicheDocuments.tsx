import type { DocumentFiche, Fiche } from '@/lib/fiches';
import { LIBELLE_NATURE, documentsEnVigueur, historiqueDocuments, DATE_BUILD } from '@/lib/fiches';
import { dateFr } from '@/lib/dates';

/**
 * Les documents en vigueur, ceux qu'on télécharge pour monter un dossier.
 *
 * ⛔ UNE SEULE VERSION PAR NATURE. Plusieurs versions d'une même Partie A côte à côte, c'est
 * un dossier déposé avec la mauvaise. L'historique a sa propre section.
 *
 * ⚠️ Un document sans URL est LISTÉ SANS ÊTRE LIÉ. Un lien mort serait pire que la mention :
 * le visiteur sait au moins quel document chercher, et le nom exact de sa version.
 */
export function DocumentsEnVigueur({ fiche }: { fiche: Fiche }) {
  const documents = documentsEnVigueur(fiche);
  if (documents.length === 0) return null;

  return (
    <ul className="documents">
      {documents.map((d) => <li key={`${d.nature}-${d.version}`}><LigneDocument doc={d} /></li>)}
    </ul>
  );
}

function LigneDocument({ doc }: { doc: DocumentFiche }) {
  const libelle = LIBELLE_NATURE[doc.nature];
  const meta = `Version ${doc.version}, en vigueur depuis le ${dateFr(doc.dateEffet)}`;

  if (!doc.url) {
    return (
      <span className="document document-absent">
        <span className="document-nom">{libelle}</span>
        <span className="document-meta">{meta}</span>
        {/* ⚠️ On dit ce qu'on sait — que le lien manque — et non que le document n'existe
            pas : la fiche officielle est publiée, c'est notre référence qui est incomplète. */}
        <span className="document-note">Lien du document à renseigner.</span>
      </span>
    );
  }

  return (
    <a className="document" href={doc.url} target="_blank" rel="noopener noreferrer">
      <span className="document-nom">{libelle}</span>
      <span className="document-meta">{meta}</span>
    </a>
  );
}

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
