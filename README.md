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

22 pages, toutes statiques. La source unique des URL est `lib/routes.ts` ; rien n'écrit une
URL à la main.

```
/                                    accueil (« Qui sommes-nous » en est une ancre : /#qui-sommes-nous)
/contact  /mentions-legales          pages fixes
/{public}                            5 pages « Pour qui »
/{partenaire}                        2 pages « Partenaires »
/comprendre-les-cee/                 index du glossaire
/comprendre-les-cee/{terme}/         terme (11)
```

⛔ Le blog (`/blog/`), la page `/qui-sommes-nous/` et la page `/veille-cee/` ont été retirés le
15/10/2026 pour le premier déploiement : le blog n'avait que trois titres sans article,
« Qui sommes-nous » est devenu une ancre de la section « Notre métier » de l'accueil, et la
lettre « Veille CEE » n'a plus que son formulaire dans le pied. Leurs slugs restent réservés
dans `PREMIER_NIVEAU`.

### Espace de noms de premier niveau

`/obliges`, `/contact` et `/comprendre-les-cee` cohabitent. Les sept pages de premier niveau passent par
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
| Qui sommes-nous | *(ancre de l'accueil, `/#qui-sommes-nous`)* |
| Pour qui ▾ | les 5 pages « Pour qui », installateurs en tête |
| Ressources | *(lien direct vers Comprendre les CEE depuis le 15/10/2026, pas de déroulant)* |
| Partenaires ▾ | Obligés · Apporteurs d'affaires |

`/contact` est un bouton, hors des cinq entrées.

**« Pour qui » et « Partenaires » n'ont pas d'URL** : ce sont des libellés de
menu. Le type `GroupeNav` ne porte pas de champ `href`, et le déclencheur est rendu en
`<button>` — un groupe ne peut donc pas être lié par accident.

⛔ Plus d'entrées « Fiches CEE » ni « Simulateur de prime » depuis le 14/10/2026 : le
catalogue et le simulateur ont été retirés pour être rebâtis (cf. « Fiches CEE : en
refonte »). Quand ils reviennent, « Fiches CEE » redevient une entrée parmi les ressources,
pas un bloc, et le contrôle d'orphelines vérifie à chaque build que ses hubs restent liés.

### Fils d'Ariane

`BreadcrumbList` sur toutes les pages sauf l'accueil, qui n'a pas de trace à montrer. Les
niveaux sont **déduits du chemin** (`lib/fil-ariane.ts`), jamais déclarés page par page : une
page de premier niveau n'a pas de parent, donc elle reste à un seul niveau. La trace visible
et le balisage sortent de la même source.

### Slugs

Les slugs de premier niveau sont déclarés dans `PREMIER_NIVEAU` (`lib/routes.ts`), y compris
ceux des pages retirées (`/industrie/`…, `/fiches-cee`, `/simulateur`), réservés pour que rien
ne s'y installe entre-temps. Le slug d'une fiche, quand le catalogue reviendra, sera son
code, jamais son intitulé.

## Les pages « Pour qui » et « Partenaires »

Sept pages, **deux gabarits distincts**, un contenu par slug dans `lib/argumentaires.ts`.

- **« Pour qui »** (`components/PagePourQui.tsx`), pour qui décide des travaux : intro et
  schéma du bâti côte à côte, financement en parts (schéma sans chiffres, la prime est la part
  la plus petite), avantages en rangées à icônes, chronologie verticale avec le moment en
  marge, règle, FAQ, « Voir aussi », appel à l'action en dernier.
- **« Partenaires »** (`components/PagePartenaire.tsx`), pour qui apporte ou achète des
  opérations : pastilles de profils, chapeau et deux paragraphes, bande de schéma avec sa
  légende en HTML, « Qui fait quoi » (vous / nous), raisons numérotées, étapes numérotées,
  règle, FAQ, « Voir aussi », appel avec le téléphone.

Les schémas (`components/Schemas.tsx`) sont en deux tons, `currentColor` et `.schema-accent`,
et le blanc d'un texte sur aplat se déclare texte par texte (`sur`) : une règle de fratrie CSS
blanchissait des libellés sur fond clair. Les « fiches clés » ont quitté les deux gabarits
avec le catalogue, le 14/10/2026, et reviendront avec lui.

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

## Fiches CEE : en refonte depuis le 14/10/2026

Le catalogue (216 codes d'un tableur), le détail importé des PDF, le gabarit de fiche et le
simulateur ont été **retirés le 14/10/2026** pour être rebâtis sur un nouveau modèle de
données. `/fiches-cee` et `/simulateur` restent réservés dans `lib/routes.ts`. L'ancien code
vit dans l'historique git (dernier état complet : commit 11bc4f3).

Ce qui est décidé pour la suite :

- **La source est l'état en vigueur de l'arrêté du 22 décembre 2014**, pas un tableur. L'ATEE
  (Club C2E) publie les PDF ; le Journal officiel annonce les modifications une à deux
  semaines plus tôt, et c'est lui qu'une veille quotidienne doit lire.
- **Une fiche est un code et des versions datées** (application, abrogation). La date
  d'engagement de l'opération dit quelle version s'applique.
- **Neuf informations par version**, écrites pour être vérifiées par une machine et pas
  seulement affichées : nom ; zone (métropole ou non) ; secteur d'application (neuf ou
  existant, exclusions) ; conditions et qualifications ; contenu de la note de
  dimensionnement ; qui la date et la signe ; mentions de la facture et de la preuve de
  réalisation ; durée de vie conventionnelle ; calcul du volume. Chaque champ garde la
  citation du PDF d'où il vient.
- **Extraction en deux passes** : expressions régulières pour le structuré, modèle de langage
  avec citation obligatoire pour la prose, puis validation humaine, fiche par fiche.
  ⛔ Rien n'est inventé pour remblayer : un champ que le PDF ne donne pas reste vide.
- **Un POC d'une vingtaine de fiches**, une par secteur et sous-secteur au minimum, avant
  d'étendre.
- Ce qui reste vrai de l'ancienne version : le slug d'une fiche est son code ; aucun montant
  en euros, seulement des kWh cumac ; une seule fonction d'évaluation partagée entre la grille
  affichée et le simulateur ; le simulateur ne s'ouvre que sur un calcul modélisé et vérifié
  contre le PDF.

### La chaîne actuelle (POC)

```bash
npm run fiches:extrait       # PDF déposés → texte + data/fiches/catalogue.json (règles)
npm run fiches:atelier       # page jetable, PDF à gauche, sortie à droite (localhost:8790)
npm run fiches:chronologie   # chronologie des 22 fiches du POC depuis le JO (API Légifrance)
```

L'atelier affiche la chronologie de chaque fiche et ses trous sur `/chronologie`, avec en tête
la liste des PDF du ministère à récupérer.

La liste du POC est dans `data/fiches/poc.txt`. La chronologie lit la version consolidée de
l'arrêté du 22 décembre 2014 (annexes 1 à 6, une par secteur) et la recherche plein texte du
JO, puis confronte aux PDF déposés. Sortie générée : `data/fiches/chronologie/<CODE>.json`. ⚠️ La date à laquelle Légifrance intègre une fiche n'est pas la date à partir
de laquelle elle s'applique : la date retenue est lue dans l'arrêté, sinon c'est le lendemain
de la publication au JO.

L'API Légifrance demande `PISTE_CLIENT_ID` et `PISTE_CLIENT_SECRET` dans `.env.local` (non
versionné). Ses conditions et quotas sont dans `docs/cgu/piste/`. La lecture de sites web
passe par le proxy `DATAIMPULSE_PROXY`, jamais par notre adresse.

## 🚨 Ce qui reste à fournir

`lib/glossaire.ts` est écrit et sourcé. Les deux variables Brevo du projet Cloudflare
(cf. Déploiement) sont à renseigner.

## Formulaires

Deux formulaires, un seul point d'entrée : `functions/api/contact.ts` (fonction Cloudflare
Pages) reçoit la page Contact (`components/FormulaireContact.tsx`, modèle EBS : deux volets,
coordonnées à gauche, formulaire sur forêt à droite) et la modale « Devenir partenaire »
(`components/Modales.tsx`), et envoie un mail à contact@ultraenergie.fr par Brevo
transactionnel (`functions/api/_mail.ts`), `Reply-To` sur le visiteur. Repris de Salons en
France le 15/10/2026 : validation d'adresse stricte, champs bornés, piège à robots, Turnstile
(`functions/api/_turnstile.ts`, `lib/turnstile.ts`) ; sans CRM, sans base, sans limiteur KV.

Variables du projet Cloudflare : `BREVO_API_KEY` (déjà posée pour la lettre) et
`TURNSTILE_SECRET_KEY` (secret du widget Turnstile, à créer dans le tableau de bord
Cloudflare avec les domaines `ultraenergie.fr` et `*.pages.dev`). Au BUILD :
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` (la clé publique du même widget, variable de build du projet
Pages et `.env.local`). ⛔ Déployé sans secret, tout envoi est refusé (503), visiblement ; en
local (`localhost`) la porte est ouverte. Sans clé publique au build, aucun jeton n'est produit.
L'expéditeur contact@ultraenergie.fr doit être un expéditeur validé chez Brevo, sinon 400.

En local : `npm run build && npx wrangler pages dev out` (`.dev.vars` porte les variables) ;
`next dev` répond 404 sur `/api/`, les formulaires affichent alors l'erreur.

⛔ Pas de simulateur en attendant le cœur (Alek, 15/10/2026) : tous les appels à l'action du
site (en-tête, héros, bandes de fin de page) mènent à `/contact/`. Un simulateur simplifié à
sept fiches a existé quelques heures ce jour-là ; il est dans l'historique git.

## Contrôles au build

`npm run build` lance `scripts/verifie-routes.mjs` (script `postbuild`), qui tient ses
garde-fous sur le HTML **produit**, pas sur les sources :

1. le sitemap et `out/` disent la même chose, **dans les deux sens** — une page apparue sans
   être déclarée (archive, média, auteur) casse le build, une entrée de sitemap sans page aussi ;
2. aucun lien interne ne pointe vers une page inexistante ;
3. toutes les URL sont sous leur forme canonique, minuscules et barre finale comprises ;
4. aucune page n'est orpheline : chacune est liée par au moins une autre ;
5. `out/_redirects` est écrit à partir du sitemap : la forme sans barre part en 301.

S'y ajoutent des contrôles qui s'exécutent à l'import, donc au build : collisions de premier
niveau et forme des URL.

## URL

La forme canonique porte **une barre oblique finale**, sur toutes les pages
(`trailingSlash: true`). L'architecture demandait à la fois que `/comprendre-les-cee/`
et `/contact/` répondent 200 telles qu'écrites, et que la forme soit
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

### Fonctions

`functions/` porte les fonctions Cloudflare Pages, déployées avec `out/` : c'est le seul code
qui s'exécute côté serveur (cf. « Formulaires » pour `api/contact.ts`). `functions/api/newsletter.ts` reçoit le formulaire « Veille CEE »
et ajoute l'adresse à la liste Brevo, sans double opt-in (décision du 14/10/2026). Deux
variables du projet Pages, à renseigner dans le tableau de bord (Settings → Variables and
secrets), pour Production et Preview :

| Variable | Nature |
| --- | --- |
| `BREVO_API_KEY` | secret, clé API v3 de Brevo |
| `BREVO_LIST_ID` | identifiant numérique de la liste, en clair |

Les mails partent du sous-domaine `infos.ultraenergie.fr`, authentifié dans Brevo (choix du
14/10/2026 : un sous-domaine dédié au marketing, générique, qui n'engage pas la réputation du
domaine racine).

⛔ La clé ne va jamais dans le navigateur ni dans le dépôt. `next dev` ne sert pas les
fonctions : en local, `npm run build` puis `npx wrangler pages dev out`, avec un `.dev.vars`
(non versionné) qui porte les deux variables.

## Conventions git

- Jamais de `Co-Authored-By` dans les commits.
- Pas de push automatique : attendre l'accord explicite.

## Structure

```
app/          les routes, le layout, sitemap.ts, robots.ts, la feuille de style globale
components/   l'en-tête, le pied, les sections d'accueil, les gabarits de pages, les formulaires, les icônes
lib/          routes.ts (le registre), nav.ts, fil-ariane.ts, turnstile.ts et formulaire.ts
              (côté navigateur), et les données (secteurs, publics, argumentaires, glossaire,
              contenu d'accueil)
functions/    les fonctions Cloudflare Pages : api/newsletter.ts, api/contact.ts et ses
              helpers _formulaire.ts, _turnstile.ts, _mail.ts
assets/       polices et photos dérivées — importées comme modules
images/       photos sources pleine résolution — jamais importées
cee.png       logo officiel du dispositif CEE (pied de page), importé comme module
public/       _headers
scripts/      derive-photos.mjs, verifie-routes.mjs, genere-carte-zones.py
```
