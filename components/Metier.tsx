import TeteSection from './TeteSection';
import { METIER } from '@/lib/contenu';

/**
 * Notre métier en trois paragraphes. ⚠️ L'ancre `qui-sommes-nous` est l'entrée « Qui
 * sommes-nous » du menu et du pied : la page du même nom a été retirée le 15/10/2026, cette
 * section la remplace (`url.quiSommesNous` dans lib/routes.ts). C'est la « matière » demandée par Alek le 15/10/2026 :
 * ce que le comparatif en trois colonnes disait en puces, dit en prose. ⛔ Ni phrase sur la
 * rémunération, ni encadré sur la règle du devis : retirés à sa demande le même jour.
 */
export default function Metier() {
  return (
    <section id="qui-sommes-nous" className="section">
      <div className="metier">
        <TeteSection surtitre="Notre métier" compact>{METIER.titre}</TeteSection>
        <div>
          {METIER.paragraphes.map((p) => <p key={p} className="prose">{p}</p>)}
        </div>
      </div>
    </section>
  );
}
