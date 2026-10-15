import Page, { Section } from './Page';
import ListeLiens from './ListeLiens';
import ListeEtapes from './ListeEtapes';
import ListeFaq from './ListeFaq';
import { PHOTOS_PAGES } from './PhotosPages';
import { BoutonModale } from './Modales';
import ContactBande from './ContactBande';
import { PARTENAIRES } from '@/lib/publics';
import { argumentaireDe } from '@/lib/argumentaires';
import { url } from '@/lib/routes';

/**
 * Le gabarit des pages « Partenaires » : une page pour qui APPORTE ou ACHÈTE des opérations.
 *
 * Le lecteur est un professionnel qui évalue une relation d'affaires : à qui ça s'adresse,
 * qui fait quoi, ce qu'il y gagne, comment on démarre. D'où l'ordre : titre et pastilles de
 * profils, intro en deux colonnes de prose, le partage
 * « vous / nous », les raisons en liste numérotée, les étapes de démarrage, la règle, la
 * FAQ, l'appel à l'action.
 *
 * ⚠️ CE GABARIT N'EST PAS CELUI DES PAGES « POUR QUI » (`PagePourQui.tsx`) : autre lecteur,
 * autre mise en page, c'est voulu.
 */
export default function PagePartenaire({ slug }: { slug: string; label: string }) {
  const a = argumentaireDe(slug);
  if (!a) throw new Error(`Page partenaire sans argumentaire : ${slug}`);
  const autres = PARTENAIRES.filter((p) => p.slug !== slug).map((p) => ({ href: url.partenaire(p.slug), label: p.label }));

  return (
    <Page
      chemin={url.partenaire(slug)}
      titre={a.titre}
      chapo={a.chapo}
      surtitre={a.surtitre}
      photo={PHOTOS_PAGES[a.photo].src}
      photoPosition={PHOTOS_PAGES[a.photo].position}
      pied={<ContactBande titre={a.appel.titre} bouton={a.appel.bouton} modale={a.appel.modale} contexte={a.titre} />}
    >
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
      {/* Le bouton dès le haut de page : sur téléphone, le premier était à 4 700 px. */}
      <div className="page-action">
        <BoutonModale modale={a.appel.modale} contexte={a.titre} className="pilule pilule-accent">{a.appel.bouton}</BoutonModale>
      </div>


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
          {a.arguments.map((arg) => (
            <li key={arg.titre} className="raison">
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

      <Section titre="Questions fréquentes">
        <ListeFaq items={a.faq} />
      </Section>

      <Section titre="Voir aussi">
        <ListeLiens
          liens={[
            ...autres,
            { href: url.comprendreLesCee, label: 'Comprendre le dispositif CEE' },
          ]}
        />
      </Section>
      {/* L'appel à l'action ferme la page, en bande pleine largeur (prop `pied`). ⛔ Pas de
          téléphone : retiré des appels à l'action le 15/10/2026, demande d'Alek. */}
    </Page>
  );
}
