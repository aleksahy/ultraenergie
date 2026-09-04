import Link from 'next/link';
import Page, { Section, AChantier } from './Page';
import ListeLiens from './ListeLiens';
import { type Secteur } from '@/lib/secteurs';
import { fichesDuSecteur } from '@/lib/fiches';
import { url } from '@/lib/routes';

/**
 * La page secteur COMMERCIALE (`/{secteur}`), à ne pas confondre avec le hub catalogue
 * (`/fiches-cee/{secteur}`) : l'une s'adresse au client, l'autre à qui cherche une fiche.
 *
 * ⚠️ LIEN RÉCIPROQUE OBLIGATOIRE ENTRE LES DEUX, AVEC DES ANCRES DIFFÉRENTES. Deux pages qui
 * se pointent l'une l'autre sous la même ancre se disputent la même requête ; sous deux
 * ancres distinctes, chacune dit à quoi sert l'autre. Ici l'ancre annonce le catalogue ;
 * en face, elle annonce l'accompagnement.
 */
export default function PageSecteur({ secteur }: { secteur: Secteur }) {
  const fiches = fichesDuSecteur(secteur.slug);

  return (
    <Page
      chemin={url.secteur(secteur.slug)}
      titre={`CEE ${secteur.label}`}
      chapo={`Valorisation des certificats d'économies d'énergie pour les opérations du secteur ${secteur.label.toLowerCase()}.`}
    >
      <AChantier>Page commerciale à rédiger. L'ossature et le maillage sont posés.</AChantier>

      <Section titre="Les fiches CEE du secteur">
        <p className="page-texte">
          {fiches.length} fiches d&apos;opérations standardisées sont recensées pour ce secteur,
          réparties en {secteur.familles.length} familles d’opérations.
        </p>
        <p className="page-texte">
          <Link className="lien-appuye" href={url.hubFiches(secteur.slug)}>
            Consulter le catalogue des fiches CEE {secteur.label.toLowerCase()} →
          </Link>
        </p>
      </Section>

      <Section titre="Les autres secteurs">
        <ListeLiens
          liens={[
            { href: url.fichesCee, label: 'Tous les secteurs et toutes les fiches' },
            { href: url.comprendreLesCee, label: 'Comprendre le dispositif CEE' },
          ]}
        />
      </Section>
    </Page>
  );
}
