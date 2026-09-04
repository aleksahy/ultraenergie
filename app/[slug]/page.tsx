import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SECTEURS, secteurParSlug } from '@/lib/secteurs';
import { PUBLICS, PARTENAIRES } from '@/lib/publics';
import PageSecteur from '@/components/PageSecteur';
import PagePublic from '@/components/PagePublic';
import PagePartenaire from '@/components/PagePartenaire';

/**
 * ⚠️ UN SEUL SEGMENT DYNAMIQUE AU PREMIER NIVEAU, ET IL LES PORTE TOUS LES TREIZE : les six
 * pages secteur, les quatre « Pour qui », les trois « Partenaires ». Ce n'est pas un
 * fourre-tout, c'est la traduction en code d'une contrainte de l'architecture — `/industrie`,
 * `/contact` et `/blog` partagent un espace de noms. Trois segments dynamiques frères sont
 * d'ailleurs impossibles dans Next : il fallait de toute façon n'en avoir qu'un.
 *
 * ⚠️ Les routes statiques (`/contact`, `/blog`, `/fiches-cee`…) l'emportent sur ce segment.
 * Une collision ne lèverait donc aucune erreur : la page fixe gagnerait, et la page secteur
 * du même nom deviendrait inatteignable en silence. C'est `PREMIER_NIVEAU` dans
 * `lib/routes.ts` qui refuse le doublon au build. Y ajouter tout nouveau premier niveau.
 */
export function generateStaticParams() {
  return [
    ...SECTEURS.map((s) => ({ slug: s.slug })),
    ...PUBLICS.map((p) => ({ slug: p.slug })),
    ...PARTENAIRES.map((p) => ({ slug: p.slug })),
  ];
}

export const dynamicParams = false;

function resoudre(slug: string) {
  const secteur = secteurParSlug(slug);
  if (secteur) return { type: 'secteur' as const, secteur };
  const pub = PUBLICS.find((p) => p.slug === slug);
  if (pub) return { type: 'public' as const, ...pub };
  const partenaire = PARTENAIRES.find((p) => p.slug === slug);
  if (partenaire) return { type: 'partenaire' as const, ...partenaire };
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cible = resoudre(slug);
  if (!cible) return {};
  const titre = cible.type === 'secteur' ? `CEE ${cible.secteur.label}` : cible.label;
  return { title: `${titre} | Ultra Énergie` };
}

export default async function PagePremierNiveau({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cible = resoudre(slug);
  if (!cible) notFound();

  if (cible.type === 'secteur') return <PageSecteur secteur={cible.secteur} />;
  if (cible.type === 'public') return <PagePublic slug={cible.slug} label={cible.label} />;
  return <PagePartenaire slug={cible.slug} label={cible.label} />;
}
