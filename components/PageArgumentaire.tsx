import Link from 'next/link';
import Page, { Section } from './Page';
import ListeLiens from './ListeLiens';
import ListeEtapes from './ListeEtapes';
import ListeFaq from './ListeFaq';
import Schema from './Schemas';
import { IconeArgument } from './Icones';
import { BoutonModale } from './Modales';
import type { Argumentaire } from '@/lib/argumentaires';
import { aUnePage, ancreFiche, entreeParCode, intituleDe } from '@/lib/fiches';
import { url } from '@/lib/routes';

/**
 * Le gabarit des pages « Pour qui » et « Partenaires » : une page argumentaire.
 *
 * L'ordre est celui d'une lecture qui décide : ce que c'est et pour qui (intro et schéma),
 * ce qu'on y gagne (arguments), comment ça se passe (étapes), la règle à ne pas manquer
 * (encadré), les fiches concernées, les questions qu'on se pose, puis l'appel à l'action.
 *
 * ⚠️ LES FICHES CLÉS SONT DES CODES DU CATALOGUE. Celles qui ont une page sont liées avec
 * leur intitulé ; les autres sont listées sans lien. Un code absent du catalogue est refusé
 * au rendu, donc au build : une page qui cite un code inexistant se lit comme une erreur de
 * référentiel.
 */
export default function PageArgumentaire({ argumentaire: a, chemin, autres }: {
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

      <Section titre="Ce que vous y gagnez">
        <div className="arguments">
          {a.arguments.map((arg) => (
            <div key={arg.titre} className="argument">
              <IconeArgument nom={arg.icone} />
              <div className="argument-titre">{arg.titre}</div>
              <p className="argument-texte">{arg.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section titre="Comment ça se passe">
        <ListeEtapes etapes={a.etapes} />
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

      <div className="appel-page">
        <h2>{a.appel.titre}</h2>
        <BoutonModale modale={a.appel.modale} contexte={a.titre} className="pilule pilule-blanc">
          {a.appel.bouton}
        </BoutonModale>
      </div>

      <Section titre="Voir aussi">
        <ListeLiens
          liens={[
            ...autres,
            { href: url.comprendreLesCee, label: 'Comprendre le dispositif CEE' },
            { href: url.contact, label: 'Nous contacter' },
          ]}
        />
      </Section>
    </Page>
  );
}
