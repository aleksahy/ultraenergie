import type { Metadata } from 'next';
import Page, { Section, AChantier } from '@/components/Page';
import { COORDONNEES } from '@/lib/contenu';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Contact | Ultra Énergie',
  description: 'Contacter Ultra Énergie, mandataire CEE indépendant : une opération à estimer, un chantier à signaler, un partenariat.',
  alternates: { canonical: '/contact/' },
};

export default function Contact() {
  return (
    <Page chemin={url.contact} titre="Contact" chapo="Une question, une opération à estimer, un partenariat.">
      <AChantier>Page à rédiger. L&apos;ossature et le maillage sont posés.</AChantier>

      <Section titre="Nous joindre">
        <address className="page-coordonnees">
          {COORDONNEES.adresse.map((ligne) => <span key={ligne}>{ligne}</span>)}
          <a href={`mailto:${COORDONNEES.email}`}>{COORDONNEES.email}</a>
          <a href={`tel:${COORDONNEES.telephoneLien}`}>{COORDONNEES.telephone}</a>
        </address>
      </Section>
    </Page>
  );
}
