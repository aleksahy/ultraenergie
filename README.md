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

69 pages, toutes statiques. La source unique des URL est `lib/routes.ts` ; rien n'écrit une
URL à la main.

```
/                                    accueil
/qui-sommes-nous  /contact           pages fixes
/veille-cee                          la newsletter
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

Cinq entrées, dans cet ordre :

| Entrée | Sous-menu |
| --- | --- |
| Qui sommes-nous | *(lien direct)* |
| Pour qui ▾ | les 4 pages « Pour qui » |
| Secteurs ▾ | les 6 pages secteur |
| Ressources ▾ | Fiches CEE · Comprendre les CEE · Blog · Veille CEE |
| Partenaires ▾ | Obligés · Installateurs · Apporteurs d'affaires |

`/contact` est un bouton, hors des cinq entrées.

**« Pour qui », « Secteurs » et « Partenaires » n'ont pas d'URL** : ce sont des libellés de
menu. Le type `GroupeNav` ne porte pas de champ `href`, et le déclencheur est rendu en
`<button>` — un groupe ne peut donc pas être lié par accident.

⛔ Les six hubs `/fiches-cee/{secteur}` ne sont pas dans le menu : « Fiches CEE » y est une
entrée parmi les ressources, pas un bloc. Ils restent atteignables par quatre chemins
(l'index, les hubs voisins, les pages secteur, les blocs « Travaux éligibles » de l'accueil),
et le contrôle d'orphelines le vérifie à chaque build plutôt que de le supposer.

### Fils d'Ariane

`BreadcrumbList` sur toutes les pages sauf l'accueil, qui n'a pas de trace à montrer. Les
niveaux sont **déduits du chemin** (`lib/fil-ariane.ts`), jamais déclarés page par page : une
page de premier niveau n'a pas de parent, donc elle reste à un seul niveau. La trace visible
et le balisage sortent de la même source.

### Slugs

Le slug d'une fiche est **son code, jamais son intitulé**, et il est stable à vie.
Les ancres des liens vers une fiche portent le code ET l'intitulé : le code situe, l'intitulé
annonce, et un lien a besoin des deux. Le fil d'Ariane, lui, n'affiche que le code.

Pas de niveau sous-secteur : les familles sont des sections à ancres dans le hub.

### Les familles se lisent dans le code

⚠️ **Une fiche n'a pas de champ `famille`.** Sa famille est le deuxième segment de son code
officiel : BAR-**EN**-101 relève de l'enveloppe, IND-**UT**-102 des utilités. Le tableau de
[`lib/familles.ts`](lib/familles.ts) ne fait que donner un libellé à chaque segment, et dire
dans quels secteurs il existe.

| Libellé | Segment | Secteurs |
| --- | --- | --- |
| Thermique | TH | agriculture, résidentiel, tertiaire |
| Équipement | EQ | agriculture, résidentiel, tertiaire, transport |
| Enveloppe | EN | résidentiel, tertiaire, industrie |
| Service | SE | agriculture, résidentiel, tertiaire, transport |
| Utilités | UT | agriculture, industrie |
| Bâtiment | BA | industrie |
| Chaleur | CH | réseau |
| Éclairage | EC | réseau |

⛔ Ne jamais redonner à une fiche une famille écrite à la main. Une liste tenue à côté finit
par contredire les codes : c'est ce qui était arrivé, avec BAT-EQ-127 rangé dans « Éclairage »
alors que son segment dit EQ.

Deux contrôles au build, éprouvés en falsifiant un code :

- segment inconnu (`IND-ZZ-110`) → le build s'arrête ;
- segment réel mais impossible dans ce secteur (`IND-TH-110`, la famille thermique n'existe
  pas en industrie) → le build s'arrête aussi. C'est exactement à quoi ressemble une ligne
  mal recopiée depuis le catalogue officiel : elle se compile et s'affiche sans broncher.

### Maillage

| Depuis | Vers |
| --- | --- |
| Hub `/fiches-cee/{secteur}` | ses fiches groupées par usage · les 5 autres hubs · sa page secteur |
| Fiche | son hub (par le fil d'Ariane) · 6 liens : jumelles d'abord, voisines d'usage ensuite |
| Page secteur `/{secteur}` | son hub catalogue |

Le lien entre une page secteur et son hub est réciproque, **sous deux ancres différentes** :
sous la même, les deux pages se disputent la même requête.

## Le gabarit de fiche CEE

Un seul fichier rend toutes les pages `/fiches-cee/{secteur}/{code}/` :
[`app/fiches-cee/[secteur]/[code]/page.tsx`](app/fiches-cee/%5Bsecteur%5D/%5Bcode%5D/page.tsx).
Une ligne de `lib/fiches.ts` = une page.

### Le nombre de sections suit la matière

Douze sections possibles, six toujours présentes (synthèse, montant, documents, durée de vie,
opérations complémentaires, appel à l'action). Les six autres ne sont rendues que si la donnée
existe. Vérifié sur l'amorce :

| Fiche | Sections |
| --- | --- |
| IND-UT-102 (complète) | 12 |
| BAR-EN-101 | 11 |
| BAT-TH-116 | 10 |
| AGRI-TH-104, TRA-EQ-101, RES-CH-104 | 6 |

⛔ Jamais de texte générique pour atteindre un volume : une section « Conditions d'éligibilité »
qui dirait « nous consulter » sur cent pages coûterait la crédibilité des cent autres.

### Le champ `calcul`

Cinq formes, un type discriminant dans [`lib/calcul.ts`](lib/calcul.ts) : `forfait`,
`correspondance`, `croisement`, `produit_tables`, `variantes` (qui enveloppe l'une des quatre
autres). Ajouter une sixième forme casse la compilation partout où il faut la traiter.

Chaque forme est rendue deux fois :

1. **la grille officielle**, avec ses notes de bas de tableau, côté serveur, sans JavaScript ;
2. **le simulateur**, un champ par dimension, qui donne les kWh cumac puis les euros.

⚠️ Les deux passent par la même fonction `evalue()`. Un calcul réécrit dans le simulateur
finirait par annoncer un montant différent de celui que la grille juste au-dessus laisse
calculer à la main.

Les libellés des champs viennent de `champs(calcul)`, donc de la Partie A : la même liste sert
au simulateur et à la section « Justificatifs ».

Le taux de conversion est un réglage de site, déclaré une seule fois
(`TAUX_EURO_PAR_KWH_CUMAC` dans [`lib/site.ts`](lib/site.ts)). 🚨 C'est une valeur d'amorce,
à raccorder à une vraie source avant d'annoncer un euro à qui que ce soit.

### Abrogation

`dateAbrogation` non atteinte : la page reste en ligne avec un bandeau d'avertissement.
Date passée : **au build suivant**, la fiche sort du registre, sa page n'est plus générée, et
une 301 vers le hub de son secteur est écrite dans `out/_redirects`.

Le site étant statique, personne n'évalue une date au moment du clic : la bascule ne peut se
faire qu'au build. Le pont entre les données TypeScript et le script de fin de build est la
route `app/redirections-fiches.txt/route.ts`, dont le fichier est fusionné puis **supprimé**
de `out/`. Chemin vérifié de bout en bout en avançant une date d'abrogation.

### Cas limites couverts

- plusieurs durées de vie conditionnelles (RES-CH-104, BAT-TH-116) ;
- intitulé de plus de 100 caractères : le `<title>` prend `titreCourt`, le H1 l'intitulé
  officiel (BAT-TH-116), et un contrôle refuse un `titreCourt` de plus de 60 caractères ;
- absence de `volumeEngage` : le bloc disparaît, on n'affiche pas 0 — un `volumeEngage: []`
  casse le build, l'absence se dit en omettant le champ ;
- deux versions en vigueur à des dates différentes : la section Téléchargement n'affiche que
  celle applicable aujourd'hui, l'historique montre « Remplacée » et « À venir » ;
- fiche sans Partie A (BAT-EQ-127) ou sans PDF principal (RES-CH-106) : le document est listé
  sans être lié, jamais un lien mort.

### Maillage de la fiche

Six liens, jumelles d'abord (trois au plus), voisines pour compléter, répartis sur deux
sections : « À ne pas confondre avec » et « Opérations complémentaires ». Ancre au format
`{CODE} — {intitulé}`. Le fil d'Ariane porte le lien vers le hub. Liens contextuels vers le
glossaire pour kWh cumac, zone climatique, Coup de pouce et durée de vie conventionnelle.

L'appel à l'action ouvre la demande d'estimation en **transmettant le code de la fiche**, et
ne pointe jamais vers `/contact`.

## 🚨 Le catalogue de fiches est une amorce

Les codes, intitulés, versions, dates, barèmes et URL de documents de `lib/fiches.ts` et
`lib/calculs-seed.ts` **n'ont pas été vérifiés** contre la liste en vigueur. Et c'est urgent, parce que **le slug est le code** : corriger un code après mise en
ligne, c'est changer une URL censée être stable à vie. Remplacer cette amorce par le
catalogue réel avant la première indexation.

Même statut pour `lib/glossaire.ts` et `lib/blog.ts`.

## Contrôles au build

`npm run build` lance `scripts/verifie-routes.mjs` (script `postbuild`), qui tient ses
garde-fous sur le HTML **produit**, pas sur les sources :

1. le sitemap et `out/` disent la même chose, **dans les deux sens** — une page apparue sans
   être déclarée (archive, média, auteur) casse le build, une entrée de sitemap sans page aussi ;
2. aucun lien interne ne pointe vers une page inexistante ;
3. toutes les URL sont sous leur forme canonique, minuscules et barre finale comprises ;
4. aucune page n'est orpheline : chacune est liée par au moins une autre ;
5. `out/_redirects` est écrit à partir du sitemap : la forme sans barre part en 301.

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
