import Link from 'next/link';
import Page, { Section } from './Page';
import ListeLiens from './ListeLiens';
import ListeFaq from './ListeFaq';
import Schema, { SchemaFinancement } from './Schemas';
import { IconeArgument, IconeEtape } from './Icones';
import { BoutonModale } from './Modales';
import type { Argumentaire } from '@/lib/argumentaires';
import { aUnePage, ancreFiche, entreeParCode, intituleDe } from '@/lib/fiches';
import { url } from '@/lib/routes';

/**
 * Le gabarit des pages « Pour qui » : une page pour qui DÉCIDE des travaux.
 *
 * Le lecteur est un maître d'ouvrage : il veut savoir ce que ça change à son plan de
 * financement, dans quel ordre les choses se passent, et ce qu'il risque de rater. D'où
 * l'ordre : ce que c'est (intro et schéma du bâti), comment ça se finance (parts, pas de
 * montants), ce qu'on y gagne (avantages en rangées), la chronologie (verticale, avec les
 * moments clés en marge), la règle, les fiches concernées, la FAQ, l'appel à l'action.
 *
 * ⚠️ CE GABARIT N'EST PAS CELUI DES PARTENAIRES (`PagePartenaire.tsx`). Les deux pages
 * s'adressent à des lecteurs différents et ne se ressemblent pas, c'est voulu.
 */
export default function PagePourQui({ argumentaire: a, chemin, autres }: {
  argumentaire: Argumentaire;
  chemin: string;
  autres: { href: string; label: string }[];
}) {
  for (const code of a.fichesCles?.codes ?? []) {
    if (!entreeParCode(code)) throw new Error(`Page ${a.slug} : fiche clé absente du catalogue « ${code} »`);
  }

  return (
    <Page chemin={chemin} titre={a.titre} chapo={a.chapo} surtitre={a.surtitre}>
      <div className="argu-intro">
        <div className="argu-prose">
          {a.intro.map((p) => <p key={p} className="page-texte">{p}</p>)}
        </div>
        <div className="argu-schema">
          <Schema nom={a.schema} />
        </div>
      </div>

      {a.financement && (
        <Section titre="Comment se finance l’opération">
          <div className="financement">
            <div className="financement-schema">
              <SchemaFinancement />
            </div>
            <ul className="financement-legende">
              {a.financement.map((l, i) => (
                <li key={l}>
                  <span className={`financement-temoin financement-temoin-${i}`} aria-hidden="true" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <Section titre="Ce que vous y gagnez">
        <div className="avantages">
          {a.arguments.map((arg) => (
            <div key={arg.titre} className="avantage">
              <IconeArgument nom={arg.icone} />
              <div>
                <div className="avantage-titre">{arg.titre}</div>
                <p className="avantage-texte">{arg.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section titre="Dans quel ordre">
        <ol className="chrono" role="list">
          {a.etapes.map((e, i) => (
            <li key={e.titre} className="chrono-etape">
              <div className="chrono-marge">
                <span className="chrono-delai">{e.delai}</span>
              </div>
              <div className="chrono-point" aria-hidden="true">
                <IconeEtape nom={e.icone} />
              </div>
              <div className="chrono-corps">
                <div className="chrono-titre"><span className="chrono-numero" aria-hidden="true">{i + 1}.</span> {e.titre}</div>
                <p className="chrono-desc">{e.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <aside className="regle" aria-label={a.regle.titre}>
        <div className="regle-titre">{a.regle.titre}</div>
        <p className="regle-texte">{a.regle.texte}</p>
      </aside>

      {a.fichesCles && (
        <Section titre={a.fichesCles.titre}>
          <ListeLiens
            liens={a.fichesCles.codes.filter(aUnePage).map((code) => ({
              href: url.fiche(entreeParCode(code)!.secteur, code),
              label: ancreFiche(code),
            }))}
          />
          {a.fichesCles.codes.some((c) => !aUnePage(c)) && (
            <p className="mention">
              Également concernées, sans page pour l’instant :{' '}
              {a.fichesCles.codes.filter((c) => !aUnePage(c)).map((c) => `${c}${intituleDe(c) ? ` (${intituleDe(c)})` : ''}`).join(', ')}.
            </p>
          )}
          <p className="page-texte">
            <Link className="lien-appuye" href={url.fichesCee}>Toutes les fiches, par secteur →</Link>
          </p>
        </Section>
      )}

      <Section titre="Questions fréquentes">
        <ListeFaq items={a.faq} />
      </Section>

      <Section titre="Voir aussi">
        <ListeLiens
          liens={[
            ...autres,
            { href: url.comprendreLesCee, label: 'Comprendre le dispositif CEE' },
            { href: url.contact, label: 'Nous contacter' },
          ]}
        />
      </Section>

      {/* L'appel à l'action ferme la page : la dernière chose vue est le bouton, pas une
          liste de liens vers ailleurs. */}
      <div className="appel-page">
        <h2>{a.appel.titre}</h2>
        <BoutonModale modale={a.appel.modale} contexte={a.titre} className="pilule pilule-blanc">
          {a.appel.bouton}
        </BoutonModale>
      </div>
    </Page>
  );
}
