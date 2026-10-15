import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PUBLICS, PARTENAIRES } from '@/lib/publics';
import { argumentaireDe } from '@/lib/argumentaires';
import { url } from '@/lib/routes';
import { metaPage } from '@/lib/meta';
import PagePourQui from '@/components/PagePourQui';
import PagePartenaire from '@/components/PagePartenaire';

/**
 * ⚠️ UN SEUL SEGMENT DYNAMIQUE AU PREMIER NIVEAU, ET IL LES PORTE TOUS LES SEPT : les cinq
 * « Pour qui » (installateurs compris, depuis le 15/10/2026), les deux « Partenaires ». Ce n'est pas un fourre-tout, c'est la traduction
 * en code d'une contrainte de l'architecture — `/obliges`, `/contact` et `/comprendre-les-cee` partagent un
 * espace de noms. (Les six pages secteur commerciales passaient aussi par ici ; retirées le
 * 19/09/2026, leurs slugs restent réservés dans `PREMIER_NIVEAU`.) Trois segments dynamiques frères sont
 * d'ailleurs impossibles dans Next : il fallait de toute façon n'en avoir qu'un.
 *
 * ⚠️ Les routes statiques (`/contact`, `/comprendre-les-cee`, `/fiches-cee`…) l'emportent sur ce segment.
 * Une collision ne lèverait donc aucune erreur : la page fixe gagnerait, et la page dynamique
 * du même nom deviendrait inatteignable en silence. C'est `PREMIER_NIVEAU` dans
 * `lib/routes.ts` qui refuse le doublon au build. Y ajouter tout nouveau premier niveau.
 */
export function generateStaticParams() {
  return [
    ...PUBLICS.map((p) => ({ slug: p.slug })),
    ...PARTENAIRES.map((p) => ({ slug: p.slug })),
  ];
}

export const dynamicParams = false;

function resoudre(slug: string) {
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
  // Le <title> (`titreSeo`, distinct du H1) et la description viennent de l'argumentaire.
  const a = argumentaireDe(slug);
  if (!a) return {};
  return metaPage({ titre: a.titreSeo, description: a.chapo, chemin: cible.type === 'public' ? url.public(slug) : url.partenaire(slug) });
}

export default async function PagePremierNiveau({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cible = resoudre(slug);
  if (!cible) notFound();

  if (cible.type === 'public') {
    const a = argumentaireDe(cible.slug);
    if (!a) throw new Error(`Page « pour qui » sans argumentaire : ${cible.slug}`);
    return <PagePourQui argumentaire={a} chemin={url.public(cible.slug)} />;
  }
  return <PagePartenaire slug={cible.slug} label={cible.label} />;
}
