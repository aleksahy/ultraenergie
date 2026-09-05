import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageFiche, { metadataFiche } from '@/components/PageFiche';
import { FICHES_EN_LIGNE, ficheParCode, slugFiche } from '@/lib/fiches';

/**
 * ⚠️ CETTE ROUTE NE VIT QUE PAR `DETAILS` DE `lib/fiches.ts`. Le catalogue compte 216 codes,
 * mais une fiche n'a de page que si son détail est importé : une page sans barème ni
 * conditions ne dirait rien de plus que sa ligne dans le hub.
 *
 * ⛔ Si `DETAILS` redevient vide, `generateStaticParams` renvoie un tableau vide et
 * `output: export` refuse la route — le build s'arrête. Retirer le dossier plutôt que de
 * fabriquer une entrée pour le contenter.
 */
export function generateStaticParams() {
  return FICHES_EN_LIGNE.map((f) => ({ secteur: f.secteur, code: slugFiche(f.code) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const fiche = ficheParCode(code);
  return fiche ? metadataFiche(fiche) : {};
}

export default async function Page({ params }: { params: Promise<{ secteur: string; code: string }> }) {
  const { secteur, code } = await params;
  const fiche = ficheParCode(code);
  if (!fiche || fiche.secteur !== secteur) notFound();
  return <PageFiche fiche={fiche} />;
}
