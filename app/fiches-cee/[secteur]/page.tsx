import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Page, { Section } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import { SECTEURS, secteurParSlug } from '@/lib/secteurs';
import { fichesParFamille, fichesDuSecteur, ancreFiche } from '@/lib/fiches';
import { url } from '@/lib/routes';

export function generateStaticParams() {
  return SECTEURS.map((s) => ({ secteur: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ secteur: string }> }): Promise<Metadata> {
  const { secteur } = await params;
  const s = secteurParSlug(secteur);
  return { title: `Fiches CEE ${s?.label ?? secteur} | Ultra Énergie` };
}

/**
 * Le hub catalogue d'un secteur. Son maillage est fixé par l'architecture :
 *   → toutes ses fiches, groupées par usage en sections à ancres
 *   → les cinq autres hubs
 *   → sa page secteur commerciale (ancre différente de celle qui vient d'en face)
 *
 * ⛔ LES USAGES SONT DES SECTIONS À ANCRES, PAS DES PAGES. Pas de niveau sous-secteur, ni en
 * URL ni en page : `#utilites` est un point d'entrée dans ce hub, pas une adresse à lui.
 */
export default async function HubSecteur({ params }: { params: Promise<{ secteur: string }> }) {
  const { secteur: slug } = await params;
  const secteur = secteurParSlug(slug);
  if (!secteur) notFound();

  const groupes = fichesParFamille(slug);
  const autres = SECTEURS.filter((s) => s.slug !== slug);

  return (
    <Page
      chemin={url.hubFiches(slug)}
      titre={`Fiches CEE ${secteur.label}`}
      chapo={`Les ${fichesDuSecteur(slug).length} fiches d'opérations standardisées du secteur ${secteur.label.toLowerCase()}.`}
    >
      {groupes.length > 1 && (
        <nav className="ancres" aria-label="Les familles d’opérations de ce secteur">
          {groupes.map((g) => <a key={g.id} href={`#${g.id}`}>{g.label}</a>)}
        </nav>
      )}

      {groupes.map((g) => (
        <Section key={g.id} id={g.id} titre={g.label}>
          {/* L'ancre porte le code ET l'intitulé (cf. `ancreFiche`) : le code situe,
              l'intitulé annonce, et un lien a besoin des deux. */}
          <ListeLiens
            liens={g.fiches.map((f) => ({
              href: url.fiche(f.secteur, f.code),
              label: ancreFiche(f),
            }))}
          />
        </Section>
      ))}

      <Section titre={`${secteur.label} : notre accompagnement`}>
        <p className="page-texte">
          <Link className="lien-appuye" href={url.secteur(slug)}>
            Comment nous valorisons vos opérations {secteur.label.toLowerCase()} →
          </Link>
        </p>
      </Section>

      <Section titre="Les autres secteurs">
        <ListeLiens liens={autres.map((s) => ({ href: url.hubFiches(s.slug), label: `Fiches CEE ${s.label}` }))} />
      </Section>
    </Page>
  );
}
