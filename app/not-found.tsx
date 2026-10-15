import type { Metadata } from 'next';
import Link from 'next/link';
import { url } from '@/lib/routes';

/**
 * La page 404, en français et hors index, sur le modèle de celle de Salons en France (Alek,
 * 15/10/2026) : centrée, surtitre « Erreur 404 », un seul bouton, de l'air autour.
 */
export const metadata: Metadata = {
  title: 'Page introuvable | Ultra Énergie',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="introuvable">
      <div className="surtitre">Erreur 404</div>
      <h1 className="page-titre">Page introuvable</h1>
      <p className="page-chapo">Cette adresse ne correspond à aucune page du site.</p>
      <Link href={url.accueil} className="pilule pilule-accent">Retour à l’accueil</Link>
    </main>
  );
}
