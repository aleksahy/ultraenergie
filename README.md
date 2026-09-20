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

36 pages, toutes statiques. La source unique des URL est `lib/routes.ts` ; rien n'écrit une
URL à la main.

```
/                                    accueil
/qui-sommes-nous  /contact           pages fixes
/veille-cee                          la newsletter
/{public}                            4 pages « Pour qui »
/{partenaire}                        3 pages « Partenaires »
/fiches-cee/                         index du catalogue
/fiches-cee/{secteur}/               hub catalogue (6)
/fiches-cee/{secteur}/{code}/        fiche (32)
/comprendre-les-cee/                 index du glossaire
/comprendre-les-cee/{terme}/         terme (8)
/blog/  /blog/{article}/             index et articles (3)
```

### Espace de noms de premier niveau

`/obliges`, `/contact` et `/blog` cohabitent. Les sept pages de premier niveau passent par
**un seul segment dynamique** (`app/[slug]/page.tsx`) qui dispatche vers la page « pour qui »
ou partenaire — Next n'accepte de toute façon qu'un segment dynamique par niveau.

⛔ Les six pages secteur commerciales (`/industrie/`, `/tertiaire/`…) ont été **retirées le
19/09/2026**, pour le moment. Leurs slugs restent réservés dans `PREMIER_NIVEAU` afin qu'une
page fixe ne s'y installe pas entre-temps.

⚠️ Une route statique l'emporte sur ce segment **sans lever d'erreur** : une page dynamique
nommée comme une page fixe deviendrait inatteignable en silence. C'est `PREMIER_NIVEAU` dans
`lib/routes.ts` qui refuse le doublon, au build. Tout nouveau premier niveau s'y déclare.

### Navigation

Quatre entrées, dans cet ordre :

| Entrée | Sous-menu |
| --- | --- |
| Qui sommes-nous | *(lien direct)* |
| Pour qui ▾ | les 4 pages « Pour qui » |
| Ressources ▾ | Fiches CEE · Comprendre les CEE · Blog · Veille CEE |
| Partenaires ▾ | Obligés · Installateurs · Apporteurs d'affaires |

`/contact` est un bouton, hors des cinq entrées.

**« Pour qui » et « Partenaires » n'ont pas d'URL** : ce sont des libellés de
menu. Le type `GroupeNav` ne porte pas de champ `href`, et le déclencheur est rendu en
`<button>` — un groupe ne peut donc pas être lié par accident.

⛔ Les six hubs `/fiches-cee/{secteur}` ne sont pas dans le menu : « Fiches CEE » y est une
entrée parmi les ressources, pas un bloc. Ils restent atteignables par quatre chemins
(l'index, les hubs voisins, le pied de page, les pages « Pour qui », les blocs « Travaux
éligibles » de l'accueil),
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
| Hub `/fiches-cee/{secteur}` | ses fiches groupées par usage · les 5 autres hubs |
| Fiche | son hub (par le fil d'Ariane) · 6 liens : jumelles d'abord, voisines d'usage ensuite |


## Les pages « Pour qui » et « Partenaires »

Sept pages, **deux gabarits distincts**, un contenu par slug dans `lib/argumentaires.ts`.

- **« Pour qui »** (`components/PagePourQui.tsx`), pour qui décide des travaux : intro et
  schéma du bâti côte à côte, financement en parts (schéma sans chiffres, la prime est la part
  la plus petite), avantages en rangées à icônes, chronologie verticale avec le moment en
  marge, règle, fiches clés, FAQ, « Voir aussi », appel à l'action en dernier.
- **« Partenaires »** (`components/PagePartenaire.tsx`), pour qui apporte ou achète des
  opérations : pastilles de profils, chapeau et deux paragraphes, bande de schéma avec sa
  légende en HTML, « Qui fait quoi » (vous / nous), raisons numérotées, étapes numérotées,
  règle, fiches (installateurs), FAQ, « Voir aussi », appel avec le téléphone.

Les schémas (`components/Schemas.tsx`) sont en deux tons, `currentColor` et `.schema-accent`,
et le blanc d'un texte sur aplat se déclare texte par texte (`sur`) : une règle de fratrie CSS
blanchissait des libellés sur fond clair. Les fiches clés sont des codes du catalogue, liées
si elles ont une page, refusées au build sinon.

Revue du 19/09/2026 par trois agents (design « Pour qui », design « Partenaires », relecture
CEE) : correctifs appliqués, dont la règle du devis pour les éligibles (le dépôt en nom propre
reste possible), la précarité (part comptée par département, plus de « bonification »), le
cumul MaPrimeRénov' Copropriété (copropriétés fragiles à part), les contrôles (organisme
accrédité avant dépôt, PNCEE après), le seuil de dépôt et les bornes en marché public.

⛔ **Aucune promesse chiffrée dans ces pages** : ni délai de paiement, ni taux de prime, ni
« montant garanti ». Rien ne les documente à ce jour. Ce qui est affirmé du dispositif vient
des textes ; ce qui est affirmé de l'offre est ce qu'un mandataire indépendant fait par
construction (mise en concurrence, montage et dépôt, aucune obligation portée).

## Comprendre les CEE

Onze articles, dans `lib/glossaire.ts` (modèle `Terme` : intro, sections avec schéma
optionnel, « À retenir », sources datées, `dateMaj` ; temps de lecture calculé, mots / 200).
Schémas dans `components/SchemasGlossaire.tsx`, mêmes conventions que `Schemas.tsx`. La carte des
zones climatiques est tracée depuis les géométries réelles des départements :
`scripts/genere-carte-zones.py` (shapely, GeoJSON france-geojson en cache) écrit
`components/traces-zones.ts`, généré, jamais édité. Écrits
le 20/09/2026 par un agent depuis des sources officielles (ecologie.gouv.fr, Légifrance, ATEE,
Cour des comptes), relus par trois agents experts (juriste du dispositif, pédagogue, directeur
artistique avec rendu des schémas en image), correctifs appliqués en un tour. Les doutes
résiduels sont écrits au conditionnel dans les articles (chiffres de présentation DGEC,
déductions des textes, plafond des bonifications).

## Le catalogue

216 fiches, importées du tableur fourni, et leur détail importé des PDF officiels :

```bash
npm run fiches    # data/fiches_cee.xlsx → data/fiches.json (le catalogue : code + secteur)
npm run details   # data/fiches_sources.json → data/details.json (le détail, depuis les PDF)
```

### Le détail vient des PDF officiels

`data/fiches_sources.json` est le manifeste : pour chaque code, l'URL du PDF de la fiche
(relevée sur les pages du Club C2E de l'ATEE le 19/09/2026, version la plus récente), la
version et la date d'application quand la page les donnait. `scripts/importe-details.py`
télécharge les PDF dans `.cache/fiches-pdf/` (non versionné), en extrait le texte des cinq
sections et la Partie A, et lit les tableaux de barème avec PyMuPDF. Résultat :
`data/details.json`, **généré, jamais édité**.

Deux sources se fondent champ par champ dans `lib/fiches.ts` : l'import, et `DETAILS_EDITES`,
écrit à la main, qui l'emporte. C'est là que vit un **barème modélisé** (`calcul`, qui ouvre
le simulateur), des conditions titrées, une note sur les jumelles. Sans `calcul`, la page rend
le barème **tel que le PDF le publie** (`bareme.tableaux`), et signale, avec un lien vers le
PDF, quand la détection a manqué un tableau (`bareme.incomplet`). Le simulateur ne s'ouvre que
sur un barème modélisé.

État au 19/09/2026 : 209 fiches ont leur page, 7 PDF ne se lisent pas (scans : BAT-EN-110,
BAT-EQ-123, BAT-SE-104, BAT-TH-156, IND-UT-127, TRA-EQ-133, TRA-SE-113), 1 barème est
modélisé (BAR-EN-101). Le H1 des fiches importées est la première phrase de la dénomination
quand elle tient en 140 caractères, sinon l'intitulé. La date d'application n'est connue que
pour 110 fiches.

⚠️ **Le tableur est la source, le JSON en est la copie générée.** Ne jamais éditer
`data/fiches.json` à la main. L'import refuse d'écrire si quoi que ce soit cloche : code en
double, préfixe incohérent avec le secteur, sous-secteur en désaccord avec le segment du code.
Sur 216 lignes recopiées, c'est la seule façon de voir une faute de saisie autrement qu'en la
lisant plus tard sur le site.

**Deux niveaux, et c'est voulu.** Le *catalogue* (code + secteur) est complet et bâtit les
hubs. Le *détail* donne sa page à une fiche dès que le PDF a livré son intitulé et ses
conditions ; sinon elle est listée dans son hub **sans être liée**.

Les hubs portent une barre « Tous » + une entrée par famille, qui **filtre** la liste (le HTML
prérendu contient toutes les fiches, le filtre ne fait que masquer ; l'adresse suit, `#enveloppe`).

⛔ Ne pas inventer de détail pour remplir. Un barème plausible attaché à un code réel est plus
dangereux qu'une page absente : il se lit comme une information.

## Le gabarit de fiche CEE

`components/PageFiche.tsx`, branché par `app/fiches-cee/[secteur]/[code]/page.tsx`.
Rendu aujourd'hui pour **BAR-EN-101**, la seule fiche dont le détail est importé.

### L'ordre des sections est un ordre d'intention

1. La fiche en bref · 2. Barème · 3. Bénéficiaires · 4. Conditions · 5. Justificatifs ·
6. Coup de pouce · 7. Jumelles · 8. Complémentaires · 9. CTA de clôture

⛔ **Plus de sections « Durée de vie » ni « Versions »** (retirées le 19/09/2026). La durée
de vie et la version applicable restent dans l'encadré de synthèse. Le volume engagé a été
retiré de l'encadré (provenance non établie), et le registre EMMY des sources avec lui.
L'encadré porte en revanche la qualification exigée du professionnel (« Professionnel RGE »),
premier motif de refus d'un dossier.

**Chaque section ouvre par une phrase, pas par un tableau.** La prose est écrite au niveau du
gabarit, vraie pour toute fiche, et ne dit rien que le modèle ne contienne. La seule phrase
propre à une fiche, en tête de l'encadré, est composée depuis la donnée.

- La section 2 dit **le barème, et rien d'autre**. Ni exemple chiffré ni appel à l'action
  sous la grille : le calcul appartient au simulateur, et l'appel à l'action est porté par la
  bande latérale, visible tout du long. Trois blocs empilés sous le tableau repoussaient les
  conditions d'éligibilité hors de l'écran, alors que ce sont elles qu'on lit juste après un
  montant.
⛔ **Pas de section Téléchargement pour l'instant** (retirée le 05/09/2026). Les documents
restent dans le modèle et alimentent la date de mise à jour de la bande latérale :
c'est la section qui est retirée, pas la donnée. Le jour où elle revient, elle reprend sa place
**après** l'appel à l'action — c'est une sortie, elle ne doit pas le précéder — et l'encadré de
synthèse retrouve son ancre vers elle.

⚠️ La numérotation des sections vient de leur rang dans la liste : retirer une section
renumérote le corps et le sommaire d'un coup, sans qu'on ait à y toucher.

### La bande latérale

Trois blocs : appel à l'action en accent, sommaire, sources. Collée sous l'en-tête, masquée
sous 1120px.

⚠️ **Le sommaire et les sections sortent de la même liste.** Une table des matières écrite à
part annoncerait tôt ou tard une section absente — le nombre de sections varie de cinq à neuf.

⚠️ **Les organismes cités suivent le contenu** (`lib/sources.ts`) : le registre n'apparaît que
sur les fiches dont on affiche la donnée correspondante. Une source citée pour une donnée absente est
une source fausse. Le PNCEE et l'ATEE n'y figurent pas : ils instruisent et documentent, ils
ne sont la provenance d'aucun chiffre de la page.

⚠️ La mention de sources **revient en pied de colonne** quand la bande disparaît : masquer de
la navigation est une chose, masquer la provenance en serait une autre.

### Les deux titres couvrent deux vocabulaires

| | Source | Exemple |
| --- | --- | --- |
| `<title>` | intitulé officiel | `BAR-EN-101 : Isolation de combles ou de toitures, prime CEE 2026` |
| `<h1>` | `h1Edite` (§2 + contexte §1) | `BAR-EN-101 — Isolation en comble perdu ou rampant de toiture dans un logement existant` |

Les intervertir revient à ne couvrir qu'un vocabulaire. Un contrôle signale au build les mots
pleins communs aux deux — **non bloquant**, la fiche fournie en partage un (« isolation »).

### Le montant

Cinq formes de calcul (`lib/calcul.ts`), rendues génériquement : forfait, correspondance,
croisement à n dimensions, produit de tables, variantes conditionnelles.

⛔ **Aucun montant en euros.** Le site donne des kWh cumac, jamais une prime chiffrée. La
cotation EMMY est un prix entre détenteurs de certificats, pas la prime versée au bénéficiaire,
qui est plus basse et dépend de l'offre. Si un prix revient un jour, c'est un prix de prime fixé
par Ultra Énergie, daté, déclaré à un seul endroit.

Le montant de l'encadré porte **la condition qui le produit** : « 1 700 kWh cumac/m² en zone
climatique H1 ». Sans elle, il se lit comme une promesse valable partout. Jamais une moyenne.

### Abrogation

Date **future** : c'est une date limite d'engagement, affichée en synthèse
(« Engageable jusqu'au… »), **sans bandeau ni alarme**. Date **passée** : au build suivant la
page n'est plus générée et une 301 vers le hub est écrite dans `out/_redirects`. Chemin
éprouvé en avançant une date.

## 🚨 Ce qui reste à fournir

Les 216 codes viennent du tableur fourni. En revanche, `lib/glossaire.ts` et `lib/blog.ts`
restent des amorces, et les **URL des documents de BAR-EN-101 ne sont pas renseignées** : les
documents sont listés sans être liés plutôt que de pointer vers un lien inventé. Il manque, pour ouvrir les 215 autres pages : les intitulés officiels, les `h1Edite`, les
versions et dates, les barèmes, les conditions, les justificatifs et les URL de documents.
`lib/fiches.ts` porte une petite table `INTITULES` provisoire, qui disparaîtra le jour où
l'export les fournira.

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
