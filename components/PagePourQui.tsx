import Page, { Section } from './Page';
import ListeFaq from './ListeFaq';
import ContactBande from './ContactBande';
import { PHOTOS_PAGES } from './PhotosPages';
import type { Argumentaire } from '@/lib/argumentaires';

/**
 * Le gabarit des pages « Pour qui », sur le modèle des pages intérieures d'EBS Énergie
 * (Alek, 15/10/2026) : un haut propre au profil, un bas identique partout.
 *
 *   1. le bandeau photo et le titre (⛔ pas de chapô dessous, retiré par Alek ; le `chapo`
 *      reste la description de la page pour les moteurs) ;
 *   2. « Le contexte » : deux ou trois paragraphes propres au profil (`intro`) ;
 *   3. « Les opérations éligibles » : les familles de travaux, avec les fiches en exemple ;
 *   4. « L'accompagnement Ultra Énergie » : les quatre étapes à l'horizontale, reliées ;
 *   5. les questions fréquentes, centrées, propres au thème, aussi en données structurées ;
 *   6. la bande de contact, hors du conteneur (prop `pied`). ⛔ Pas de « Voir aussi » sur ces
 *      pages (Alek, 15/10/2026) : le menu et le pied font le maillage.
 *
 * ⛔ Pas de repères chiffrés en haut de page « pour le moment » (Alek). ⛔ Plus de « Ce que
 * vous y gagnez », de « Où se place la prime », de chronologie verticale ni d'encadré.
 *
 * ⚠️ CE GABARIT N'EST PAS CELUI DES PARTENAIRES (`PagePartenaire.tsx`).
 */
export default function PagePourQui({ argumentaire: a, chemin }: {
  argumentaire: Argumentaire;
  chemin: string;
}) {
  /* Les questions en données structurées (schema.org FAQPage), pour les moteurs. */
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.r },
    })),
  };
  return (
    <Page
      chemin={chemin}
      titre={a.titre}
      surtitre={a.surtitre}
      photo={PHOTOS_PAGES[a.photo].src}
      photoPosition={PHOTOS_PAGES[a.photo].position}
      pied={<ContactBande titre={a.appel.titre} bouton={a.appel.bouton} modale={a.appel.modale} contexte={a.titre} />}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Section titre="Le contexte" surtitre="Contexte" colonnes>
        {a.intro.map((p) => <p key={p} className="page-texte">{p}</p>)}
      </Section>

      <Section titre="Les opérations éligibles à la prime CEE" surtitre="Opérations">
        <ul className="operations" role="list">
          {a.operations.map((o) => (
            <li key={o.titre} className="operation">
              <h3 className="operation-titre">{o.titre}</h3>
              <p className="operation-texte">{o.texte}</p>
            </li>
          ))}
        </ul>
        <p className="mention">Les fiches citées sont des exemples : chaque opération est qualifiée au regard de la fiche en vigueur à la date de l’engagement.</p>
      </Section>

      <Section titre="Le déroulé, étape par étape" surtitre="L’accompagnement Ultra Énergie">
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
    </Page>
  );
}
