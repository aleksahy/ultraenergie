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

## Architecture

68 pages, toutes statiques. La source unique des URL est `lib/routes.ts` ; rien n'écrit une
URL à la main.

```
/                                    accueil
/qui-sommes-nous  /contact           pages fixes
/{public}                            4 pages « Pour qui »
/{secteur}                           6 pages secteur commerciales
/{partenaire}                        3 pages « Partenaires »
/fiches-cee/                         index du catalogue
/fiches-cee/{secteur}/               hub catalogue (6)
/fiches-cee/{secteur}/{code}/        fiche (32)
/comprendre-les-cee/                 index du glossaire
/comprendre-les-cee/{terme}/         terme (8)
/blog/  /blog/{article}/             index et articles (3)
```

### Espace de noms de premier niveau

`/industrie`, `/contact` et `/blog` cohabitent. Les treize pages de premier niveau passent par
**un seul segment dynamique** (`app/[slug]/page.tsx`) qui dispatche vers la page secteur,
« pour qui » ou partenaire — Next n'accepte de toute façon qu'un segment dynamique par niveau.

⚠️ Une route statique l'emporte sur ce segment **sans lever d'erreur** : une page secteur
nommée comme une page fixe deviendrait inatteignable en silence. C'est `PREMIER_NIVEAU` dans
`lib/routes.ts` qui refuse le doublon, au build. Tout nouveau premier niveau s'y déclare.

### Navigation

Six entrées. **« Pour qui », « Secteurs » et « Partenaires » n'ont pas d'URL** : ce sont des
libellés de menu. Le type `GroupeNav` ne porte pas de champ `href`, et le déclencheur est
rendu en `<button>` — un groupe ne peut donc pas être lié par accident. `/contact` est un
bouton, hors des six entrées.

### Fils d'Ariane

`BreadcrumbList` sur toutes les pages sauf l'accueil, qui n'a pas de trace à montrer. Les
niveaux sont **déduits du chemin** (`lib/fil-ariane.ts`), jamais déclarés page par page : une
page de premier niveau n'a pas de parent, donc elle reste à un seul niveau. La trace visible
et le balisage sortent de la même source.

### Slugs

Le slug d'une fiche est **son code, jamais son intitulé**, et il est stable à vie.
Les ancres des liens vers une fiche portent l'inverse : l'intitulé, jamais le code. Un fil
d'Ariane situe, un lien annonce.

Pas de niveau sous-secteur : les usages sont des sections à ancres dans le hub.

### Maillage

| Depuis | Vers |
| --- | --- |
| Hub `/fiches-cee/{secteur}` | ses fiches groupées par usage · les 5 autres hubs · sa page secteur |
| Fiche | son hub (par le fil d'Ariane) · 6 liens : jumelles d'abord, voisines d'usage ensuite |
| Page secteur `/{secteur}` | son hub catalogue |

Le lien entre une page secteur et son hub est réciproque, **sous deux ancres différentes** :
sous la même, les deux pages se disputent la même requête.

## 🚨 Le catalogue de fiches est une amorce

Les codes et intitulés de `lib/fiches.ts` **n'ont pas été vérifiés** contre la liste en
vigueur. Et c'est urgent, parce que **le slug est le code** : corriger un code après mise en
ligne, c'est changer une URL censée être stable à vie. Remplacer cette amorce par le
catalogue réel avant la première indexation.

Même statut pour `lib/glossaire.ts` et `lib/blog.ts`.

## Contrôles au build

`npm run build` lance `scripts/verifie-routes.mjs` (script `postbuild`), qui tient quatre
garde-fous sur le HTML **produit**, pas sur les sources :

1. le sitemap et `out/` disent la même chose, **dans les deux sens** — une page apparue sans
   être déclarée (archive, média, auteur) casse le build, une entrée de sitemap sans page aussi ;
2. aucun lien interne ne pointe vers une page inexistante ;
3. toutes les URL sont sous leur forme canonique, minuscules et barre finale comprises ;
4. `out/_redirects` est écrit à partir du sitemap : la forme sans barre part en 301.

S'y ajoutent des contrôles qui s'exécutent à l'import, donc au build : unicité des codes de
fiches, symétrie de la relation « jumelle », usages déclarés, collisions de premier niveau.

## URL

La forme canonique porte **une barre oblique finale**, sur toutes les pages
(`trailingSlash: true`). L'architecture demandait à la fois que `/fiches-cee/`,
`/comprendre-les-cee/` et `/blog/` répondent 200 telles qu'écrites, et que la forme soit
cohérente partout : les deux ensemble ne laissent qu'une possibilité.

⛔ Ne pas repasser à `false` sans refaire les redirections en sens inverse : toutes les URL
déjà indexées changeraient.

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
app/          les routes, le layout, sitemap.ts, robots.ts, la feuille de style globale
components/   l'en-tête, le pied, les sections d'accueil, les coquilles de pages, les icônes
lib/          routes.ts (le registre), nav.ts, fil-ariane.ts, et les données
              (secteurs, publics, fiches, glossaire, blog, contenu d'accueil)
assets/       polices et photos dérivées — importées comme modules
images/       photos sources pleine résolution — jamais importées
cee.png       logo officiel du dispositif CEE (pied de page), importé comme module
public/       _headers
scripts/      derive-photos.mjs, verifie-routes.mjs
```
