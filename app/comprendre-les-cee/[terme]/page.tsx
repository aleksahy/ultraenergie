import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page, { Section } from '@/components/Page';
import ListeLiens from '@/components/ListeLiens';
import SchemaGlossaire from '@/components/SchemasGlossaire';
import { TERMES, termeParSlug, tempsLecture } from '@/lib/glossaire';
import { dateFr } from '@/lib/dates';
import { url } from '@/lib/routes';

export function generateStaticParams() {
  return TERMES.map((t) => ({ terme: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ terme: string }> }): Promise<Metadata> {
  const { terme } = await params;
  const t = termeParSlug(terme);
  if (!t) return {};
  return { title: `${t.terme} | Comprendre les CEE | Ultra Énergie`, description: t.resume };
}

/**
 * L'article d'un terme : chapô, repères de lecture, sections avec leurs schémas, l'encadré
 * « À retenir », les sources, puis les autres termes.
 *
 * Les sources sont des liens externes en fin d'article, réduits au strict minimum (Alek,
 * 15/10/2026) : intitulé court, pas de date par ligne. La date de lecture, commune à toutes,
 * tient sur la ligne de réserve sous la liste.
 */
export default async function PageTerme({ params }: { params: Promise<{ terme: string }> }) {
  const { terme: slug } = await params;
  const terme = termeParSlug(slug);
  if (!terme) notFound();

  const autres = TERMES.filter((t) => t.slug !== slug);
  const datesLecture = [...new Set(terme.sources.map((s) => s.consulteLe))].sort().map(dateFr);

  return (
    <Page chemin={url.terme(slug)} titre={terme.terme} chapo={terme.intro} surtitre="Comprendre les CEE" lecture>
      <p className="glossaire-meta">
        <span>Lecture : {tempsLecture(terme)} min</span>
        <span>Mis à jour le {dateFr(terme.dateMaj)}</span>
      </p>

      {terme.sections.map((s) => (
        <Section titre={s.titre} key={s.titre}>
          {s.paragraphes.map((p) => <p className="page-texte" key={p.slice(0, 40)}>{p}</p>)}
          {s.liste && (
            <ul className="liste-puces">
              {s.liste.map((l) => <li key={l.slice(0, 40)}>{l}</li>)}
            </ul>
          )}
          {s.schema && (
            <figure className="glossaire-figure">
              <SchemaGlossaire nom={s.schema} />
              {s.legendeSchema && <figcaption>{s.legendeSchema}</figcaption>}
            </figure>
          )}
        </Section>
      ))}

      <aside className="regle glossaire-retenir" aria-label="À retenir">
        <div className="regle-titre">À retenir</div>
        <ul className="liste-puces">
          {terme.aRetenir.map((r) => <li key={r.slice(0, 40)}>{r}</li>)}
        </ul>
      </aside>

      <Section titre="Sources">
        <ol className="glossaire-sources">
          {terme.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.titre}</a>
            </li>
          ))}
        </ol>
        <p className="mention glossaire-mention">
          Pages consultées le {datesLecture.join(' et le ')}. Informations indicatives ; les textes officiels font seuls foi.
        </p>
      </Section>

      <Section titre="Les autres termes">
        <ListeLiens liens={autres.map((t) => ({ href: url.terme(t.slug), label: t.terme }))} />
      </Section>
    </Page>
  );
}
