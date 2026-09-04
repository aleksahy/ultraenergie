import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section, AChantier } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import FilAriane from '@/components/FilAriane';
import { secteurParSlug } from '@/lib/secteurs';
import { FICHES, ficheParCode, fichesLiees, slugFiche } from '@/lib/fiches';
import { url } from '@/lib/routes';

export function generateStaticParams() {
  return FICHES.map((f) => ({ secteur: f.secteur, code: slugFiche(f.code) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const fiche = ficheParCode(code);
  if (!fiche) return {};
  return { title: `${fiche.code} : ${fiche.intitule} | Ultra Énergie` };
}

/**
 * Une fiche. Son maillage :
 *   → son hub, PAR LE FIL D'ARIANE (c'est une arête du maillage, pas un ornement)
 *   → un bloc fixe de six liens, jumelles d'abord, voisines d'usage ensuite
 *
 * ⛔ LE SLUG EST LE CODE, ET IL EST STABLE À VIE. Même si l'intitulé officiel est reformulé,
 * l'URL ne bouge pas.
 */
export default async function PageFiche({ params }: { params: Promise<{ secteur: string; code: string }> }) {
  const { secteur: slugSecteur, code } = await params;
  const fiche = ficheParCode(code);
  if (!fiche || fiche.secteur !== slugSecteur) notFound();

  const secteur = secteurParSlug(fiche.secteur);
  const liees = fichesLiees(fiche.code);

  return (
    <main className="page">
      <FilAriane chemin={url.fiche(fiche.secteur, fiche.code)} />
      <div className="fiche-code">{fiche.code}</div>
      <h1 className="page-titre">{fiche.intitule}</h1>
      <p className="page-chapo">
        Fiche d&apos;opération standardisée du secteur {secteur?.label.toLowerCase()}.
      </p>

      <AChantier>
        Contenu de fiche à rédiger : conditions d&apos;éligibilité, forfait de kWh cumac,
        pièces du dossier.
      </AChantier>

      <Section titre="Fiches liées">
        <ListeLiens
          liens={liees.map((f) => ({
            href: url.fiche(f.secteur, f.code),
            label: f.intitule,
            note: `${f.code} · ${secteurParSlug(f.secteur)?.label}`,
          }))}
        />
      </Section>
    </main>
  );
}
