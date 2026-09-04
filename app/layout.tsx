import type { Metadata } from 'next';
import localFont from 'next/font/local';
import ProviderModales from '@/components/Modales';
import EnTete from '@/components/EnTete';
import PiedDePage from '@/components/PiedDePage';
import './globals.css';

/* Satoshi (Fontshare) en local plutôt que par le CDN de Fontshare : une requête tierce de
   moins au premier rendu, et le fichier passe par `/_next/static/media/` donc il hérite du
   `immutable` de `public/_headers`. Trois graisses, ce sont celles que la charte emploie. */
const satoshi = localFont({
  src: [
    { path: '../assets/fonts/Satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/Satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/Satoshi-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-satoshi',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ultraenergie.fr'),
  title: 'Ultra Énergie, mandataire CEE indépendant',
  description:
    "Nous mettons plusieurs obligés en concurrence pour valoriser vos kWh cumac au meilleur niveau, sans porter l'obligation ni vendre d'équipement.",
  openGraph: {
    siteName: 'Ultra Énergie',
    locale: 'fr_FR',
    type: 'website',
    title: 'Ultra Énergie, mandataire CEE indépendant',
    description: 'Financez vos travaux d\'économies d\'énergie avec la prime CEE.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={satoshi.variable}>
      <body>
        <ProviderModales>
          <EnTete />
          {children}
          <PiedDePage />
        </ProviderModales>
      </body>
    </html>
  );
}
