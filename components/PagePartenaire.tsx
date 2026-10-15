import Page, { Section } from './Page';
import ListeFaq from './ListeFaq';
import TeteSection from './TeteSection';
import ContactBande from './ContactBande';
import { PHOTOS_PAGES } from './PhotosPages';
import { argumentaireDe } from '@/lib/argumentaires';
import { SECTEURS_OPERATIONS } from '@/lib/contenu';
import { url } from '@/lib/routes';

/**
 * Le gabarit des pages « Partenaires » : une page pour qui APPORTE ou ACHÈTE des opérations.
 * Refait le 15/10/2026 (proposition acceptée par Alek) dans la grammaire des pages « Pour
 * qui » (bandeau photo, têtes à barre, tuiles, déroulé, FAQ centrée, bande de contact), avec
 * une structure propre à un lecteur qui évalue une relation d'affaires :
 *
 *   1. le bandeau photo et le titre (⛔ ni chapô ni pastilles de profils dessous) ;
 *   2. « Notre proposition » : tête à gauche, prose à droite (`intro`), qui dit ce qu'on
 *      apporte, d'où viennent les opérations et ce qu'on n'est pas ;
 *   3. « Pourquoi travailler avec Ultra Énergie » : les `arguments` en tuiles 2×2, dans la
 *      même disposition que la proposition, tête à gauche et contenu à droite (Alek,
 *      15/10/2026 : « reprendre celle du haut » ; la version centrée n'a pas tenu) ;
 *   4. les SIX secteurs du dispositif en bande forêt pleine largeur, les mêmes que sur
 *      l'accueil (`SECTEURS_OPERATIONS`). ⛔ Pas de sélection par page : Alek, 15/10/2026,
 *      « ta répartition des secteurs n'est pas logique, et rien n'explique qu'on ne
 *      travaille qu'avec ça » ;
 *   5. « Comment on démarre » : les étapes dans le déroulé horizontal des pages « Pour qui »,
 *      le « vous faites, nous faisons » dans le texte de chaque étape ;
 *   6. la FAQ centrée (balisage FAQPage), puis la bande de contact avec un texte propre à
 *      la page (`appel.texte`).
 *
 * ⛔ Disparus avec l'ancien gabarit : les pastilles « Pour », l'intro en deux colonnes, le
 * bouton isolé en milieu de page, « Qui fait quoi » (vous / nous en colonnes, « grossier »
 * pour Alek), la liste des raisons, l'encadré de la règle (fondu dans la proposition) et
 * « Voir aussi ».
 *
 * ⚠️ CE GABARIT N'EST PAS CELUI DES PAGES « POUR QUI » (`PagePourQui.tsx`) : même langage
 * visuel, autre lecteur, autres sections. C'est voulu.
 */
export default function PagePartenaire({ slug }: { slug: string; label: string }) {
  const a = argumentaireDe(slug);
  if (!a) throw new Error(`Page partenaire sans argumentaire : ${slug}`);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
  };

  return (
    <Page
      chemin={url.partenaire(slug)}
      titre={a.titre}
      surtitre={a.surtitre}
      photo={PHOTOS_PAGES[a.photo].src}
      photoPosition={PHOTOS_PAGES[a.photo].position}
      pied={<ContactBande titre={a.appel.titre} texte={a.appel.texte} bouton={a.appel.bouton} href={a.appel.href} />}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Section titre="Notre proposition" surtitre="Partenariat" colonnes>
        {a.intro.map((p) => <p key={p} className="page-texte">{p}</p>)}
      </Section>

      <Section titre="Pourquoi travailler avec Ultra Énergie" surtitre="Pourquoi nous" colonnes>
        <ul className="operations est-deux" role="list">
          {a.arguments.map((arg) => (
            <li key={arg.titre} className="operation">
              <h3 className="operation-titre">{arg.titre}</h3>
              <p className="operation-texte">{arg.texte}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Pleine largeur dans la colonne de page : `.page-pleine` déborde des gouttières de
          `.page` jusqu'aux bords de la fenêtre (le `body` rogne l'excédent de barre de
          défilement). Même bande que « Notre méthode » sur l'accueil. */}
      <section className="bande page-pleine">
        <div className="bande-inner">
          <TeteSection surtitre="Secteurs d’opérations" blanc>Les six secteurs du dispositif</TeteSection>
          <div className="bande-tuiles est-trois">
            {SECTEURS_OPERATIONS.map((s) => (
              <div key={s.nom} className="bande-tuile">
                <h3>{s.nom}</h3>
                <p>{s.exemples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section titre="Comment on démarre" surtitre="Étape par étape">
        <ol className="deroule" role="list">
          {a.etapes.map((e, i) => (
            <li key={e.titre} className="deroule-etape">
              <span className="deroule-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="deroule-delai">{e.delai}</span>
              <span className="deroule-titre">{e.titre}</span>
              <span className="deroule-desc">{e.desc}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section titre="Questions fréquentes" surtitre="On nous demande souvent" centree>
        <ListeFaq items={a.faq} />
      </Section>
      {/* La bande de contact ferme la page, hors du `<main>` (prop `pied`). ⛔ Pas de
          téléphone dans les appels à l'action (Alek, 15/10/2026). */}
    </Page>
  );
}
