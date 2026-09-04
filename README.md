# Ultra Énergie

Site vitrine d'Ultra Énergie, mandataire CEE indépendant. Page unique, Next.js 16 en export
statique, déployée sur Cloudflare Pages.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- `output: 'export'` : aucun serveur, le dossier `out/` est publié tel quel
- CSS pur, une seule feuille globale (`app/globals.css`) avec des variables sur `:root`
- Satoshi (Fontshare) servi en local via `next/font/local`

## Commandes

```bash
npm run dev      # développement sur http://localhost:3000
npm run build    # export statique dans out/
npm run lint     # eslint
npm run images   # dérivées web des photos (cf. ci-dessous)
```

## Couleur

L'accent est le vert `#4C8C2B`. Il n'a ni variante ni sélecteur.

**Toute couleur du site est déclarée sur `:root` dans `app/globals.css`, et nulle part
ailleurs.** Les composants et les SVG n'écrivent jamais un hexadécimal : ils appellent une
variable (`var(--accent)`) ou héritent de `currentColor`. Une couleur codée en dur dans un
composant survit à un changement de charte sans rien signaler.

⚠️ Le texte posé sur un fond d'accent est **blanc** (`--sur-accent`), jamais l'encre : sur ce
vert, `#141414` tombe sous le seuil de lisibilité.

## Photos

Les sources pleine résolution vivent dans `images/` (0,7 à 1,4 Mo pièce). **Elles ne sont
jamais importées par le site** : l'export statique sert les fichiers tels quels, donc ce
qu'on importe est exactement ce que le visiteur télécharge.

`npm run images` fabrique les dérivées dans `assets/photos/` : **800×450, qualité 78**,
recadrage centré (`fit: cover`, les sources ne sont pas en 16:9). Les trois photos sont
passées de 3,4 Mo à 99 Ko au total.

Pour ajouter une photo : la déposer en pleine résolution dans `images/`, lancer
`npm run images`, puis l'importer comme module depuis `assets/photos/` :

```tsx
import photo from '@/assets/photos/ma-photo.jpg';
<Image src={photo} alt="" sizes="(max-width: 900px) 100vw, 33vw" />
```

L'import en module, plutôt qu'un fichier dans `public/`, donne un nom porteur d'une empreinte
du contenu (`/_next/static/media/ma-photo.<hash>.jpg`) et laisse Next déduire `width`/`height`,
ce qui réserve la place avant chargement. C'est aussi ce qui autorise la règle `immutable` de
`public/_headers`.

Le script tourne sur tout ce qu'il trouve dans `images/` ; les réglages (dimensions, qualité)
sont en tête de `scripts/derive-photos.mjs`.

## Cache

`public/_headers` met `/_next/static/*` en `Cache-Control: public, max-age=31536000, immutable`.
Tout ce qui s'y trouve porte une empreinte du contenu dans son nom : bundles, polices et
photos importées. Le défaut de Cloudflare Pages est `max-age=14400, must-revalidate`, soit
quatre heures puis un aller-retour de revalidation par fichier et par visite.

⛔ Ne jamais étendre ce bloc à un chemin dont les noms de fichiers sont stables : un
navigateur qui a mis un fichier `immutable` en cache ne le redemande pas, et aucune purge
Cloudflare ne le rattrape.

## Déploiement

Cloudflare Pages connecté à GitHub (`aleksahy/ultraenergie`) :

| Réglage           | Valeur                          |
| ----------------- | ------------------------------- |
| Preset            | Next.js (Static HTML Export)    |
| Build command     | `npm run build`                 |
| Output directory  | `out`                           |

`wrangler.jsonc` porte `pages_build_output_dir: "out"`.

## Conventions git

- Jamais de `Co-Authored-By` dans les commits.
- Pas de push automatique : attendre l'accord explicite.

## Structure

```
app/          layout, page d'accueil, feuille de style globale
components/   les sections de la page, l'en-tête, le pied, les modales, les icônes
lib/          contenu éditorial (contenu.ts) et arbre de navigation (nav.ts)
assets/       polices et photos dérivées — importées comme modules
images/       photos sources pleine résolution — jamais importées
cee.png       logo officiel du dispositif CEE (pied de page), importé comme module
public/       _headers
scripts/      derive-photos.mjs
```
