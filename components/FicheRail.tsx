import Link from 'next/link';
import { BoutonModale } from './Modales';
import type { SectionFiche } from './PageFiche';
import { dateMajDe, type Fiche } from '@/lib/fiches';
import { organismesDe } from '@/lib/sources';
import { url } from '@/lib/routes';
import { dateFr } from '@/lib/dates';

/**
 * La bande latérale d'une page de fiche : appel à l'action, sommaire, provenance.
 *
 * ⚠️ LE SOMMAIRE VIENT DE LA MÊME LISTE QUE LES SECTIONS. Une table des matières écrite à
 * part annoncerait tôt ou tard une section que la fiche ne rend pas — le nombre de sections
 * varie de six à douze selon la matière disponible, c'est le cas le plus favorable qui soit
 * pour ce genre de dérive.
 *
 * ⛔ MASQUÉE SOUS 1120px, et rien d'unique n'y est perdu : navigation vers des sections
 * présentes juste en dessous, et appels à l'action déjà présents dans le fil de la page. La
 * mention de sources, elle, est reprise en pied de la colonne principale.
 */
export default function FicheRail({ fiche, sections }: { fiche: Fiche; sections: SectionFiche[] }) {
  return (
    <aside className="fiche-rail" aria-label="Repères de la fiche">
      <div className="rail-bloc rail-bloc-action">
        <div className="rail-surtitre">Votre opération</div>
        <p className="rail-accroche">Estimez la prime {fiche.code}, ou confiez-nous le dossier.</p>
        <Link className="pilule pilule-blanc rail-pilule" href={`${url.simulateur}?fiche=${fiche.code.toLowerCase()}`}>
          Estimer ma prime →
        </Link>
        <BoutonModale modale="estimation" contexte={`Fiche ${fiche.code}`} className="pilule rail-pilule rail-pilule-contour">
          Être rappelé →
        </BoutonModale>
      </div>

      <nav className="rail-bloc" aria-label="Sommaire de la fiche">
        <div className="rail-surtitre">Sommaire</div>
        <ol className="rail-sommaire">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                <span className="rail-numero">{String(i + 1).padStart(2, '0')}</span>
                {s.court}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <FicheSources fiche={fiche} />
    </aside>
  );
}

/**
 * D'où vient ce qui est écrit sur la page, et ce que la page ne prétend pas être.
 *
 * ⚠️ CE BLOC N'EST PAS UNE PRÉCAUTION JURIDIQUE DÉCORATIVE. Une page qui annonce des montants
 * et des conditions d'éligibilité sera lue comme une référence ; dire d'où viennent les
 * chiffres et que le texte officiel prime, c'est ce qui permet à quelqu'un de vérifier plutôt
 * que de nous croire. Il est exporté séparément parce que la colonne principale le reprend
 * lorsque la bande est masquée.
 */
export function FicheSources({ fiche, enPied = false }: { fiche: Fiche; enPied?: boolean }) {
  const maj = dateMajDe(fiche);
  const organismes = organismesDe();

  return (
    <div className={enPied ? 'sources-pied' : 'rail-bloc rail-bloc-sources'}>
      <div className="rail-surtitre">Sources</div>
      {/* ⛔ PLUS DE LISTE DE DOCUMENTS ICI. Les versions et leurs dates sont déjà dans
          l'encadré de synthèse et dans la section « Versions » : les répéter allongeait le
          bloc sans rien apprendre, et noyait la mention qui compte, celle du dessous. */}
      <p className="rail-organismes">
        {organismes.map((o, i) => (
          <span key={o.nom}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            <a href={o.url} target="_blank" rel="noopener noreferrer">{o.nom}</a>
          </span>
        ))}
      </p>
      {maj && <p className="rail-maj">Mise à jour le {dateFr(maj)}.</p>}
      <p className="rail-avertissement">
        Informations indicatives ; les textes officiels font seuls foi.
      </p>
    </div>
  );
}
