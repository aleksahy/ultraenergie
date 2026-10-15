import type { Metadata } from 'next';
import Link from 'next/link';
import { url } from '@/lib/routes';

/** La page 404, en français et hors index ; celle de Next était en anglais (audit du 15/10/2026). */
export const metadata: Metadata = {
  title: 'Page introuvable | Ultra Énergie',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="page page-lecture">
      <h1 className="page-titre">Page introuvable</h1>
      <p className="page-chapo">Cette adresse ne correspond à aucune page du site.</p>
      <p><Link href={url.accueil} className="pilule pilule-accent">Retour à l’accueil</Link></p>
    </main>
  );
}
