# Handoff: Ultra Énergie — Landing Page

## Overview
Site vitrine pour Ultra Énergie, mandataire CEE indépendant. Objectif : convertir 3 profils (maîtres d'ouvrage, installateurs/artisans, apporteurs d'affaires) via une estimation de prime et une demande de rappel/partenariat.

## About the Design Files
Les fichiers de ce dossier sont des **références de design réalisées en HTML** — des prototypes montrant l'apparence et le comportement visés, pas du code de production à copier tel quel. La tâche consiste à **recréer ces designs HTML dans l'environnement du projet cible** (React, Vue, etc. — ou le framework le plus adapté si aucun n'existe encore) en suivant ses conventions.

## Fidelity
**Haute fidélité (hifi)** : couleurs, typographie, espacements et interactions finaux. À recréer au pixel près avec les composants/librairies déjà en place dans le codebase cible.

## Logo
Wordmark "Ultra Énergie" en noir (#141414), point final en couleur d'accent. Police Satoshi, poids 700. Voir `Logo Ultra Energie.dc.html` (dernière section validée) pour les variantes de couleur explorées.

## Screens / Views

### 1. Header (sticky)
- Fond blanc, `border-bottom: 1px solid #EEEDE9`, `position: sticky; top:0`.
- Container `max-width: 1320px`, padding `16px 32px`, flex `justify-content: space-between`.
- Logo à gauche (22px/700).
- Desktop (≥900px) : nav avec 3 dropdowns au survol (Pour qui, Fiches CEE, Ressources) + liens simples Partenaires/Contact, puis téléphone + bouton pilule accent "Estimer ma prime →".
- Dropdown : `position:absolute`, fond blanc, `border-radius:14px`, `box-shadow:0 16px 32px rgba(20,20,20,0.08)`, items `padding:9px 14px`, hover `background:#F7F7F5`.
- Mobile (<900px) : bouton "Estimer" + burger 3 traits (22×2px, gap 4px) ouvrant un overlay plein écran (accordéons pour les 3 hubs + liens + 2 CTA pilule + téléphone).

### 2. Hero
- Deux colonnes desktop (`flex-wrap:wrap; gap:56px`), colonne texte `flex:1 1 460px`, illustration `flex:1 1 420px`.
- Surtitre capitales 13px/700, letter-spacing 0.12em, couleur accent : "MANDATAIRE CEE INDÉPENDANT".
- Titre H1 : 52px, `font-weight:400`, `line-height:1.08`, 3 lignes, mots-clé en couleur accent : "Financez vos travaux d'économies d'énergie avec la meilleure **prime CEE**".
- Paragraphe 17px, `color:#6B6B68`, max-width 480px, sur la mise en concurrence des obligés.
- 2 boutons pilule : "Estimer ma prime →" (fond `#141414`, texte blanc) et "Être rappelé →" (fond accent, texte `#141414`), `border-radius:999px`, `padding:16px 26px`, 15px/700.
- Ligne réassurance 13px `#8A8A86` : "Sans engagement · Réponse sous 48h · Étude prise en charge par les obligés".
- Illustration : SVG flat deux tons (noir `#1E1E1C` + couleur accent, sans dégradé) — bâtiment central (toit triangle + façade + fenêtres), 3 obligés symbolisés en cercles autour avec icônes flèche, flux (lignes + flèches) convergeant vers le bâtiment. Deux blobs flous couleur accent en arrière-plan (`filter:blur(36-40px)`, `opacity:0.25-0.35`, cercles ~180-220px). Sur mobile, illustration réduite (`max-width:260px`) et positionnée sous le texte.

### 3. Qui êtes-vous (profils)
- Titre centré H2 36px/400 + surtitre accent.
- 5 cartes flex-wrap (`flex:1 1 220px`, max-width 260px), `border:1px solid #EEEDE9`, `border-radius:20px`, padding `28px 22px`, hover `border-color: accent`.
- Chaque carte : titre 18px/700 + description 14px `#6B6B68`.
- Profils : Copropriétés & bailleurs, Entreprises & tertiaire, Industrie, Collectivités, Installateurs & artisans.

### 4. Comment ça marche (4 étapes)
- 4 colonnes flex-wrap (`flex:1 1 240px`, max-width 280px).
- Icône filaire 44×44 (trait `#141414`, 1.6px) — loupe, document coché, échange, check-shield.
- Label délai 12px/700 accent capitales, titre 18px/700, description 14px `#6B6B68`.
- Étapes : Étude d'éligibilité (24-48h) → Engagement de prime avant devis → Consultation des obligés (1-2 sem) → Travaux/contrôle/versement.

### 5. Travaux éligibles à la CEE
- Titre centré H2 + surtitre.
- Grille 8 items (`repeat(auto-fit, minmax(260px,1fr))`, `gap:44px 32px`) — **pas de cartes ni bordures**, juste de l'espace.
- Chaque item : icône filaire 24×24 style Lucide/Tabler (`stroke: accent`, `stroke-width:1.5`, `stroke-linecap/join: round`), taille affichée 40×40, titre 16px/700, description 13px `#6B6B68`. Lien vers `#fiches` (futur hub Fiches CEE), hover `opacity:0.72`.
- Items : Isolation, Pompe à chaleur collective, Chaudière et réseau de chaleur, GTB, Calorifugeage, Éclairage LED, Moteurs et variateurs, Récupération de chaleur.
- Les 8 SVG icônes filaires sont dans le fichier source (`ICON_LAYERS`, `ICON_FAN`, `ICON_FLAME`, `ICON_GAUGE`, `ICON_PIPE`, `ICON_BULB`, `ICON_GEAR`, `ICON_RECOVER`).

### 6. Comparatif (indépendance)
- 3 colonnes flex-wrap (`flex:1 1 280px`), la colonne "Mandataire indépendant" mise en avant avec `border: 2px solid accent` (les 2 autres `1px solid #EEEDE9`).
- Titre 17px/700, liste de bullets (tiret coloré + texte 14px `#3A3A38`), footer exemple chiffré 13px `#8A8A86` + disclaimer astérisque global 12px `#9A9A96`.

### 7. Partenaires (`#partenaires`)
- 2 cartes flex (`flex:1 1 380px`), `border:1px solid #EEEDE9`, `border-radius:20px`, padding 32px.
- "Installateurs & artisans RGE" et "Apporteurs d'affaires", chacune avec bouton pilule accent "Devenir partenaire →".

### 8. Ressources (blog + newsletter)
- 3 cartes articles flex (image 16:9 placeholder + tag accent 12px/700 capitales + titre 16px/600).
- Bloc newsletter : `border:1px solid #EEEDE9`, `border-radius:20px`, padding 32px, input email pill + bouton "S'inscrire" (fond `#141414`).

### 9. FAQ
- Max-width 900px, accordéon simple (6 questions), bouton `width:100%` flex `justify-content:space-between`, chevron +/− en couleur accent, réponse 14px `#6B6B68` sur ouverture.

### 10. CTA final
- Bandeau plein `background: accent`, padding 72px 32px, texte centré, titre 36px/400 `#141414`, 2 boutons pilule (sombre + blanc).

### 11. Footer (`#contact`)
- 3 colonnes flex-wrap : coordonnées + logo, hub liens, liens légaux. Mentions légales bas de page 12px `#9A9A96`.

### 12. Modales (Lead / Rappel / Partenaire)
- Overlay `rgba(20,20,20,0.5)`, carte blanche `border-radius:24px`, padding 36px, formulaires simples (select/input pill), CTA pilule accent, lien "Fermer" texte gris.

## Interactions & Behavior
- Dropdowns nav desktop : ouverture au `mouseenter`, fermeture au `mouseleave`.
- Menu mobile : overlay plein écran toggle, accordéons indépendants par hub.
- FAQ : un seul item ouvert à la fois (index state).
- 3 modales indépendantes (lead / callback / partner), ouverture via CTA correspondants, fermeture par clic sur overlay, bouton "Fermer", ou clic sur la carte (stopPropagation empêche la fermeture accidentelle).
- Responsive breakpoint unique : `window.innerWidth < 900` bascule header et hero en mode mobile.

## State Management
- `isMobile: boolean` (resize listener)
- `openDropdown: string | null` (clé du hub survolé, desktop)
- `mobileMenuOpen: boolean`
- `mobileAccordionOpen: string | null`
- `faqOpenIndex: number | null`
- `leadOpen`, `callbackOpen`, `partnerOpen: boolean`
- Aucun appel réseau dans le prototype — formulaires soumettent sans backend (`preventDefault` uniquement). Prévoir intégration CRM/API côté implémentation réelle.

## Design Tokens
- **Couleurs** : encre `#141414`, gris texte secondaire `#6B6B68`, gris clair `#8A8A86` / `#9A9A96`, bordures `#EEEDE9`, fond `#FFFFFF`. Accent réglable — options validées : corail `#FF6B4A`, vert foncé `#4C8C2B`, bleu `#1E6FD9` / `#3454D1`.
- **Typo** : Satoshi (Fontshare), poids 400/500/700. Tailles : H1 52px, H2 36px, body 14-17px, labels 12-13px.
- **Radius** : boutons `999px` (pill), cartes `20px`, modales `24px`.
- **Ombre** : dropdown `0 16px 32px rgba(20,20,20,0.08)`.
- **Blur hero** : `filter: blur(36-40px)`, `opacity:0.25-0.35`.

## Assets
- Logo : wordmark texte, pas de fichier image.
- Illustration hero : SVG inline généré dans le code (voir fichier source).
- 8 icônes filaires travaux éligibles : SVG inline (voir fichier source).
- 4 icônes étapes "Comment ça marche" : SVG inline (voir fichier source).
- Placeholders image à remplacer : photo hero (si finalement utilisée), 3 photos articles blog. Ce ne sont pas des assets finaux.

## Files
- `Ultra Energie - Landing Page.dc.html` — page complète (référence principale).
- `Logo Ultra Energie.dc.html` — exploration et version retenue du logo.
