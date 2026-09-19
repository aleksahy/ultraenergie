import Link from 'next/link';
import Page, { Section } from './Page';
import ListeLiens from './ListeLiens';
import ListeEtapes from './ListeEtapes';
import ListeFaq from './ListeFaq';
import Schema from './Schemas';
import { BoutonModale } from './Modales';
import { PARTENAIRES } from '@/lib/publics';
import { argumentaireDe } from '@/lib/argumentaires';
import { aUnePage, ancreFiche, entreeParCode, intituleDe } from '@/lib/fiches';
import { url } from '@/lib/routes';
import { COORDONNEES } from '@/lib/contenu';

/**
 * Le gabarit des pages « Partenaires » : une page pour qui APPORTE ou ACHÈTE des opérations.
 *
 * Le lecteur est un professionnel qui évalue une relation d'affaires : à qui ça s'adresse,
 * qui fait quoi, ce qu'il y gagne, comment on démarre. D'où l'ordre : titre et pastilles de
 * profils, intro en deux colonnes de prose, le schéma en bande pleine largeur, le partage
 * « vous / nous », les raisons en liste numérotée, les étapes de démarrage, la règle, les
 * fiches (installateurs), la FAQ, l'appel à l'action avec le téléphone.
 *
 * ⚠️ CE GABARIT N'EST PAS CELUI DES PAGES « POUR QUI » (`PagePourQui.tsx`) : autre lecteur,
 * autre mise en page, c'est voulu.
 */
export default function PagePartenaire({ slug }: { slug: string; label: string }) {
  const a = argumentaireDe(slug);
  if (!a) throw new Error(`Page partenaire sans argumentaire : ${slug}`);
  for (const code of a.fichesCles?.codes ?? []) {
    if (!entreeParCode(code)) throw new Error(`Page ${a.slug} : fiche clé absente du catalogue « ${code} »`);
  }
  const autres = PARTENAIRES.filter((p) => p.slug !== slug).map((p) => ({ href: url.partenaire(p.slug), label: p.label }));

  return (
    <Page chemin={url.partenaire(slug)} titre={a.titre} chapo={a.chapo} surtitre={a.surtitre}>
      {a.profils && (
        <div className="pastilles">
          <span className="pastilles-label" id="pastilles-label">Pour</span>
          <ul className="pastilles-liste" role="list" aria-labelledby="pastilles-label">
            {a.profils.map((p) => <li key={p} className="pastille">{p}</li>)}
          </ul>
        </div>
      )}

      <div className="colonnes-prose">
        {a.intro.map((p) => <p key={p} className="page-texte">{p}</p>)}
      </div>

      <figure className="bande-schema">
        <figcaption className="bande-schema-legende">{a.schemaLegende}</figcaption>
        <Schema nom={a.schema} />
      </figure>

      {a.partage && (
        <Section titre="Qui fait quoi">
          <div className="partage">
            <div className="partage-col">
              <div className="partage-titre">Vous</div>
              <ul className="partage-liste">
                {a.partage.vous.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
            <div className="partage-col partage-col-nous">
              <div className="partage-titre">Ultra Énergie</div>
              <ul className="partage-liste">
                {a.partage.nous.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
          </div>
        </Section>
      )}

      <Section titre="Pourquoi travailler avec nous">
        <ol className="raisons" role="list">
          {a.arguments.map((arg, i) => (
            <li key={arg.titre} className="raison">
              <span className="raison-numero" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="raison-titre">{arg.titre}</div>
                <p className="raison-texte">{arg.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section titre="Comment on démarre">
        <ListeEtapes etapes={a.etapes} numerote />
      </Section>

      <aside className="regle" aria-label={a.regle.titre}>
        <div className="regle-titre">{a.regle.titre}</div>
        <p className="regle-texte">{a.regle.texte}</p>
      </aside>

      {a.fichesCles && (
        <Section titre={a.fichesCles.titre}>
          <ListeLiens
            colonnes={3}
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

      {/* L'appel à l'action ferme la page, avec le téléphone pour qui a un chantier à
          signaler tout de suite : un bouton ne peut pas promettre deux choses. */}
      <div className="appel-page">
        <h2>{a.appel.titre}</h2>
        <BoutonModale modale={a.appel.modale} contexte={a.titre} className="pilule pilule-blanc">
          {a.appel.bouton}
        </BoutonModale>
        <p className="appel-page-note">
          {a.appel.note ?? 'Ou directement :'}{' '}
          <a href={`tel:${COORDONNEES.telephoneLien}`}>{COORDONNEES.telephone}</a>
        </p>
      </div>
    </Page>
  );
}
