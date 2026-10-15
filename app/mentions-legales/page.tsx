import type { Metadata } from 'next';
import Page, { Section } from '@/components/Page';
import { COORDONNEES } from '@/lib/contenu';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Mentions légales | Ultra Énergie',
  description: 'Mentions légales du site d’Ultra Énergie, mandataire CEE indépendant à Saint-Cloud : éditeur, hébergeur, données personnelles.',
  alternates: { canonical: '/mentions-legales/' },
};

/**
 * Les mentions légales (article 6 de la loi pour la confiance dans l'économie numérique).
 *
 * ⚠️ SAS EN COURS D'IMMATRICULATION au 15/10/2026 : le numéro RCS s'ajoute au bloc « Éditeur »
 * dès qu'il existe.
 *
 * ⚠️ Le téléphone SEUL comme contact de l'éditeur, pas l'email (choix d'Alek du 15/10/2026).
 * Les demandes sur les données vont à `rgpd@`, un alias de `contact@` chez OVH. Tout vient de
 * `COORDONNEES` (lib/contenu.ts), comme le pied et /contact.
 *
 * ⚠️ LA SECTION « DONNÉES PERSONNELLES » NE DÉCRIT QUE LA LETTRE, seul formulaire branché.
 * Le jour où les modales (estimation, rappel, partenariat) partiront quelque part, elle doit
 * dire ce qu'elles collectent et qui le reçoit.
 */
export default function MentionsLegales() {
  return (
    <Page chemin={url.mentionsLegales} titre="Mentions légales" lecture>
      <Section titre="Éditeur du site">
        <p className="page-texte">
          Ultra Énergie, SAS au capital de 10 000 €, en cours d&apos;immatriculation au registre du
          commerce et des sociétés.
        </p>
        <address className="page-coordonnees">
          {COORDONNEES.adresse.map((ligne) => <span key={ligne}>{ligne}</span>)}
          <a href={`tel:${COORDONNEES.telephoneLien}`}>{COORDONNEES.telephone}</a>
        </address>
      </Section>

      <Section titre="Directeur de la publication">
        <p className="page-texte">Alek Hasoyan.</p>
      </Section>

      <Section titre="Hébergement">
        <p className="page-texte">
          Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.
        </p>
      </Section>

      <Section titre="Propriété intellectuelle">
        <p className="page-texte">
          Les textes, schémas et illustrations de ce site appartiennent à Ultra Énergie, sauf
          mention contraire. Leur reproduction sans autorisation écrite est interdite. Le logo
          « Certificats d&apos;économies d&apos;énergie » est celui du dispositif public. Le fond de
          la carte des zones climatiques vient d&apos;Admin Express (IGN, licence ouverte), par
          france-geojson. Les photographies sont des images sous licence.
        </p>
      </Section>

      <Section titre="Données personnelles">
        <p className="page-texte">
          Responsable de traitement : Ultra Énergie, représentée par Alek Hasoyan, à l&apos;adresse
          ci-dessus.
        </p>
        <p className="page-texte">
          L&apos;inscription à la lettre « Veille CEE » recueille votre adresse email, avec votre
          accord, dans le seul but de vous envoyer cette lettre. L&apos;adresse est conservée
          jusqu&apos;à votre désinscription, possible à tout moment par le lien présent dans
          chaque envoi. L&apos;envoi est assuré par notre prestataire Brevo.
        </p>
        <p className="page-texte">
          Les formulaires d&apos;estimation, de rappel et de partenariat recueillent les informations
          nécessaires pour vous répondre : identité, société, coordonnées, et la description du
          chantier ou du projet. Elles ne sont utilisées que pour traiter votre demande, ne sont
          transmises à aucun tiers à des fins commerciales, et sont conservées au plus trois ans
          après le dernier échange.
        </p>
        <p className="page-texte">
          Vous pouvez demander l&apos;accès à vos données, leur rectification, leur effacement,
          la limitation de leur traitement ou leur portabilité, et vous opposer à leur
          traitement, en écrivant à <strong>{COORDONNEES.emailRgpd}</strong>. Vous pouvez aussi
          adresser une réclamation à la CNIL.
        </p>
        <p className="page-texte">
          Le site ne dépose aucun cookie de mesure d&apos;audience ni de publicité.
        </p>
      </Section>
    </Page>
  );
}
