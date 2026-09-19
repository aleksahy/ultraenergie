import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page, { Section } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import ListeFiches from '@/components/ListeFiches';
import FiltreFamilles from '@/components/FiltreFamilles';
import { SECTEURS, secteurParSlug } from '@/lib/secteurs';
import { catalogueParFamille, catalogueDuSecteur, FICHES_EN_LIGNE } from '@/lib/fiches';
import { url } from '@/lib/routes';

export function generateStaticParams() {
  return SECTEURS.map((s) => ({ secteur: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ secteur: string }> }): Promise<Metadata> {
  const { secteur } = await params;
  const s = secteurParSlug(secteur);
  if (!s) return {};
  return {
    title: `Fiches CEE ${s.label} | Ultra Énergie`,
    description: `Les ${catalogueDuSecteur(secteur).length} fiches d'opérations standardisées du secteur ${s.label.toLowerCase()}, classées par famille.`,
  };
}

/**
 * Le hub catalogue d'un secteur. Son maillage est fixé par l'architecture :
 *   → toutes ses fiches, groupées par famille, derrière une barre « Tous » + une entrée par
 *     famille qui FILTRE la liste (demande d'Alek du 19/09/2026 ; avant, les ancres
 *     faisaient défiler)
 *   → les cinq autres hubs
 *
 * ⛔ LES FAMILLES SONT DES FILTRES, PAS DES PAGES. Pas de niveau sous-secteur, ni en URL ni
 * en page : `#utilites` est un état de ce hub, pas une adresse à lui. Toutes les fiches sont
 * dans le HTML prérendu, le filtre ne fait que masquer.
 */
export default async function HubSecteur({ params }: { params: Promise<{ secteur: string }> }) {
  const { secteur: slug } = await params;
  const secteur = secteurParSlug(slug);
  if (!secteur) notFound();

  const familles = catalogueParFamille(slug);
  const total = catalogueDuSecteur(slug).length;
  const enLigne = FICHES_EN_LIGNE.filter((f) => f.secteur === slug).length;
  const autres = SECTEURS.filter((s) => s.slug !== slug);

  return (
    <Page
      chemin={url.hubFiches(slug)}
      titre={`Fiches CEE ${secteur.label}`}
      chapo={`Les ${total} fiches d’opérations standardisées du secteur ${secteur.label.toLowerCase()}, classées par famille d’opération.`}
    >
      {/* Tant que le détail des fiches n'est pas importé, le hub liste sans lier. Le dire est
          plus honnête que de laisser croire à des liens qui ne réagissent pas. */}
      {enLigne < total && (
        <p className="page-chantier">
          {enLigne === 0
            ? 'Les pages de fiche ne sont pas encore publiées : le catalogue est complet, le détail de chaque fiche (barème, conditions, documents) arrive ensuite.'
            : `${enLigne} fiches sur ${total} ont leur page publiée ; les autres suivent.`}
        </p>
      )}

      <FiltreFamilles
        familles={familles.map((f) => ({ slug: f.slug, label: f.label, compte: f.entrees.length }))}
        sections={familles.map((famille) => (
          <Section key={famille.slug} id={famille.slug} titre={famille.label}>
            <ListeFiches entrees={famille.entrees} />
          </Section>
        ))}
      />

      <Section titre="Les autres secteurs">
        <ListeLiens
          colonnes={3}
          liens={autres.map((s) => ({
            href: url.hubFiches(s.slug),
            label: `Fiches CEE ${s.label}`,
            note: `${catalogueDuSecteur(s.slug).length} fiches`,
          }))}
        />
      </Section>
    </Page>
  );
}
