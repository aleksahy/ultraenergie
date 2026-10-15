import Link from 'next/link';
import TeteSection from './TeteSection';
import { IconeArgument } from './Icones';
import { PUBLICS } from '@/lib/publics';
import { url } from '@/lib/routes';

/* L'icône de chaque page « Pour qui », parmi celles des arguments. */
const ICONES: Record<string, string> = {
  'syndics-coproprietes': 'dossier',
  'bailleurs-sociaux': 'calendrier',
  'public-collectivites': 'mairie',
  'entreprises-industriels': 'usine',
};

/**
 * « Nos solutions » : les quatre pages « Pour qui » sur une ligne, la tête de section dans la
 * première case. Au sens d'EBS Énergie (« Nos solutions pour les syndicats de copropriété ») :
 * ce que nous faisons pour chaque profil (Alek, 15/10/2026).
 *
 * ⛔ PAS LES PARTENAIRES (obligés, apporteurs) : Alek, 15/10/2026, « il fallait retirer les
 * objets partenaire dans la section interlocuteurs ».
 */
export default function NosSolutions() {
  return (
    <section id="solutions" className="section">
      <div className="solutions">
        <div className="solutions-intro">
          <TeteSection surtitre="Nos solutions" compact>Une solution pour chaque profil</TeteSection>
          <p>Ce que nous faisons pour les copropriétés, les bailleurs, les collectivités et les entreprises, et ce que la prime change pour eux.</p>
        </div>
        {/* Les quatre maîtres d'ouvrage : pas les installateurs, à qui l'accueil parle. */}
        {PUBLICS.filter((p) => p.slug !== 'installateurs').map((p) => (
          <Link key={p.slug} href={url.public(p.slug)} className="solution-tuile">
            <IconeArgument nom={ICONES[p.slug]} />
            <span>{p.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
