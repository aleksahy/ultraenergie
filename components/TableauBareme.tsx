/**
 * Un tableau de barème tel que la fiche officielle le publie : la première ligne est
 * l'en-tête, le reste des lignes.
 *
 * ⚠️ C'EST UNE COPIE, PAS UNE INTERPRÉTATION. Les cellules viennent du PDF par
 * scripts/importe-details.py, sans réécriture : une cellule vide reste vide, un libellé sur
 * deux lignes est recollé, rien n'est déplacé. Le jour où quelqu'un modélise ce barème dans
 * lib/baremes.ts, c'est GrilleCalcul qui prend le relais, et le simulateur avec.
 */
export default function TableauBareme({ lignes }: { lignes: string[][] }) {
  const [entete, ...corps] = lignes;
  return (
    <div className="tableau-cadre tableau-publie">
      <table className="tableau">
        <thead>
          <tr>{entete.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr>
        </thead>
        <tbody>
          {corps.map((l, i) => (
            <tr key={i}>
              {l.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
