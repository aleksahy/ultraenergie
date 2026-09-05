import type { Calcul, CalculSimple, CalculCroisement } from '@/lib/calcul';
import { cleGrille } from '@/lib/calcul';
import { nombreFr } from '@/lib/site';

/**
 * La grille officielle d'une fiche, rendue côté serveur.
 *
 * ⚠️ ELLE EST DANS LE HTML, SANS JAVASCRIPT. C'est la donnée de référence : quelqu'un qui
 * vérifie un montant doit pouvoir lire le barème même si le simulateur ne s'exécute pas. Le
 * simulateur enrichit, il ne remplace pas.
 */
export default function GrilleCalcul({ calcul }: { calcul: Calcul }) {
  if (calcul.type === 'variantes') {
    return (
      <div className="grilles">
        {calcul.cas.map((cas) => (
          <div key={cas.libelle} className="grille-variante">
            <h3 className="grille-titre">
              <span className="grille-condition">{calcul.condition}</span> {cas.libelle}
            </h3>
            <GrilleSimple calcul={cas.calcul} />
          </div>
        ))}
      </div>
    );
  }
  return <GrilleSimple calcul={calcul} />;
}

function GrilleSimple({ calcul }: { calcul: CalculSimple }) {
  return (
    <div className="grilles">
      {calcul.type === 'forfait' && (
        <p className="grille-formule">
          <strong>{nombreFr.format(calcul.coefficient)} {calcul.unite}</strong>
          {' × '}
          {calcul.variable.toLowerCase()} <span className="grille-unite">en {calcul.variableUnite}</span>
        </p>
      )}

      {calcul.type === 'correspondance' && (
        <Tableau
          entetes={[calcul.libelleEntree, 'kWh cumac']}
          lignes={calcul.entrees.map((e) => [e.libelle, nombreFr.format(e.montant)])}
        />
      )}

      {calcul.type === 'croisement' && <GrilleCroisement calcul={calcul} />}

      {calcul.type === 'produit_tables' && (
        <>
          <p className="grille-formule">
            Le montant est le <strong>produit</strong> des deux tables ci-dessous.
          </p>
          {calcul.tables.map((t) => (
            <div key={t.nom}>
              <h4 className="grille-sous-titre">{t.nom}</h4>
              <Tableau
                entetes={[t.dimension.nom, t.unite ?? 'Facteur']}
                lignes={t.dimension.valeurs.map((v) => [v, nombreFr.format(t.valeurs[v])])}
              />
            </div>
          ))}
        </>
      )}

      <Notes notes={calcul.notes} />
    </div>
  );
}

function GrilleCroisement({ calcul }: { calcul: CalculCroisement }) {
  const [premiere, seconde, ...reste] = calcul.dimensions;

  // Une seule dimension : deux colonnes suffisent.
  if (!seconde) {
    return (
      <Tableau
        entetes={[premiere.nom, uniteColonne(calcul)]}
        lignes={premiere.valeurs.map((v) => [v, nombreFr.format(calcul.grille[cleGrille([v])])])}
      />
    );
  }

  // Trois dimensions ou plus : une matrice par valeur de la première, plutôt qu'un tableau
  // à double en-tête que personne ne lit sur un téléphone.
  if (reste.length > 0) {
    return (
      <>
        {premiere.valeurs.map((v) => (
          <div key={v}>
            <h4 className="grille-sous-titre">{premiere.nom} : {v}</h4>
            <Matrice calcul={calcul} prefixe={[v]} lignes={seconde} colonnes={reste[0]} />
          </div>
        ))}
      </>
    );
  }

  return <Matrice calcul={calcul} prefixe={[]} lignes={premiere} colonnes={seconde} />;
}

function Matrice({
  calcul, prefixe, lignes, colonnes,
}: {
  calcul: CalculCroisement;
  prefixe: string[];
  lignes: { nom: string; valeurs: string[] };
  colonnes: { nom: string; valeurs: string[] };
}) {
  return (
    <Tableau
      entetes={[`${lignes.nom}  /  ${colonnes.nom}`, ...colonnes.valeurs]}
      lignes={lignes.valeurs.map((l) => [
        l,
        ...colonnes.valeurs.map((c) => {
          const valeur = calcul.grille[cleGrille([...prefixe, l, c])];
          return valeur === undefined ? '—' : nombreFr.format(valeur);
        }),
      ])}
      legende={uniteColonne(calcul)}
    />
  );
}

function uniteColonne(calcul: CalculCroisement): string {
  if (calcul.libelleMontant) return calcul.libelleMontant;
  return calcul.multiplicateur ? `kWh cumac/${calcul.multiplicateur.unite}` : 'kWh cumac';
}

/* Le tableau déborde sur un téléphone : il défile DANS son propre cadre, jamais en poussant
   la page (cf. `.tableau-cadre` en CSS). */
function Tableau({ entetes, lignes, legende }: { entetes: string[]; lignes: string[][]; legende?: string }) {
  return (
    <div className="tableau-cadre">
      <table className="tableau">
        <thead>
          <tr>{entetes.map((e) => <th key={e} scope="col">{e}</th>)}</tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr key={ligne[0]}>
              <th scope="row">{ligne[0]}</th>
              {ligne.slice(1).map((cellule, i) => <td key={i}>{cellule}</td>)}
            </tr>
          ))}
        </tbody>
        {legende && <caption className="tableau-legende">Montants en {legende}.</caption>}
      </table>
    </div>
  );
}

function Notes({ notes }: { notes?: string[] }) {
  if (!notes?.length) return null;
  return (
    <ol className="grille-notes">
      {notes.map((n) => <li key={n}>{n}</li>)}
    </ol>
  );
}
