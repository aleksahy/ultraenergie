import type { Metadata } from 'next';
import Page from '@/components/Page';
import FormulaireContact from '@/components/FormulaireContact';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Contact | Ultra Énergie',
  description: 'Contacter Ultra Énergie, mandataire CEE indépendant : un chantier à valoriser, une opération à estimer, un partenariat.',
  alternates: { canonical: url.contact },
};

/**
 * La page Contact : le formulaire, et rien d'autre (Alek, 15/10/2026 : « garde juste le
 * formulaire »). Deux habillages ont été essayés et refusés le même jour : les deux volets
 * du modèle EBS avec le formulaire sur forêt (« je n'aime pas trop l'habillage noir
 * complet »), et un bloc de coordonnées à côté. L'adresse et l'email sont dans le pied de
 * chaque page, le téléphone dans les mentions légales. C'est la destination de tous les
 * appels à l'action du site.
 */
export default function Contact() {
  return (
    <Page chemin={url.contact} titre="Contact" chapo="Une question, une opération à estimer, un partenariat." lecture>
      <FormulaireContact />
    </Page>
  );
}
