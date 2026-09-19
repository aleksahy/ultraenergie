import { IconeEtape } from './Icones';

export interface Etape {
  icone: string;
  delai: string;
  titre: string;
  desc: string;
}

/** Une rangée d'étapes : le motif de l'accueil, réutilisé par les pages argumentaires. */
export default function ListeEtapes({ etapes }: { etapes: readonly Etape[] }) {
  return (
    <div className="etapes">
      {etapes.map((e) => (
        <div key={e.titre} className="etape">
          <IconeEtape nom={e.icone} />
          <div className="etape-delai">{e.delai}</div>
          <div className="etape-titre">{e.titre}</div>
          <p className="etape-desc">{e.desc}</p>
        </div>
      ))}
    </div>
  );
}
