import { IconeEtape } from './Icones';

export interface Etape {
  icone: string;
  delai: string;
  titre: string;
  desc: string;
}

/**
 * Une rangée d'étapes : le motif de l'accueil (icône), réutilisé par les pages partenaires
 * en version numérotée, pour ne pas y répéter le micro-langage de la chronologie « Pour qui ».
 */
export default function ListeEtapes({ etapes, numerote = false }: { etapes: readonly Etape[]; numerote?: boolean }) {
  return (
    <div className="etapes">
      {etapes.map((e, i) => (
        <div key={e.titre} className="etape">
          {numerote
            ? <span className="etape-numero" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            : <IconeEtape nom={e.icone} />}
          <div className="etape-delai">{e.delai}</div>
          <div className="etape-titre">{e.titre}</div>
          <p className="etape-desc">{e.desc}</p>
        </div>
      ))}
    </div>
  );
}
