import Link from 'next/link';
import { BoutonModale } from './Modales';
import type { SectionFiche } from './PageFiche';
import { url } from '@/lib/routes';

/**
 * La bande latérale d'une page de fiche : appels à l'action, puis sommaire.
 *
 * ⚠️ LE SOMMAIRE VIENT DE LA MÊME LISTE QUE LES SECTIONS. Une table des matières écrite à
 * part annoncerait tôt ou tard une section que la fiche ne rend pas — le nombre de sections
 * varie de six à douze selon la matière disponible, c'est le cas le plus favorable qui soit
 * pour ce genre de dérive.
 *
 * ⛔ MASQUÉE SOUS 1120px, et rien n'y est perdu : elle ne contient que de la navigation vers
 * des sections présentes juste en dessous, et des appels à l'action qui existent déjà dans le
 * fil de la page. Masquer un contenu unique serait un autre sujet.
 */
export default function FicheRail({ code, sections }: { code: string; sections: SectionFiche[] }) {
  return (
    <aside className="fiche-rail" aria-label="Repères de la fiche">
      <div className="rail-bloc rail-bloc-action">
        <div className="rail-surtitre">Votre opération</div>
        <p className="rail-accroche">Estimez la prime {code}, ou confiez-nous le dossier.</p>
        <Link className="pilule pilule-accent rail-pilule" href={`${url.simulateur}?fiche=${code.toLowerCase()}`}>
          Estimer ma prime →
        </Link>
        <BoutonModale modale="estimation" contexte={`Fiche ${code}`} className="pilule pilule-blanc rail-pilule">
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
    </aside>
  );
}
