import type { Metadata } from 'next';
import Page from '@/components/Page';
import SimulateurPage from '@/components/SimulateurPage';
import { url } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Simulateur de prime CEE | Ultra Énergie',
  description: "Estimez le montant de votre prime CEE à partir du barème officiel de la fiche d'opération standardisée.",
};

export default function Simulateur() {
  return (
    <Page
      chemin={url.simulateur}
      titre="Simulateur de prime CEE"
      chapo="Le montant en kWh cumac calculé à partir du barème officiel de la fiche, puis converti en euros au cours du moment."
    >
      <SimulateurPage />
    </Page>
  );
}
