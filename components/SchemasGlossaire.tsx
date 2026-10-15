/**
 * Les schémas des articles « Comprendre les CEE » : un dessin filaire en deux tons par idée.
 * Chaque schéma dit UNE chose, celle que la section qui l'appelle vient d'expliquer.
 *
 * ⚠️ AUCUN HEXADÉCIMAL. Les tracés héritent de `currentColor` ; `.schema-accent`,
 * `.schema-plein`, `.schema-doux` et `.schema-texte-*` posent les couleurs depuis la feuille
 * de style. Le blanc d'un texte sur aplat se déclare texte par texte (`sur`), jamais par une
 * règle de fratrie : cf. la revue du 19/09/2026 sur les schémas argumentaires.
 *
 * ⚠️ LES SEULS CHIFFRES DESSINÉS SONT RÉGLEMENTAIRES ET SOURCÉS dans l'article qui porte le
 * schéma (1,04 ; 0,015 € ; 14 jours ; 12 mois ; 2 et 6 mois d'instruction ; 50 GWh cumac ;
 * 2026-2030). Aucun montant de
 * prime, aucun taux : un chiffre dessiné se lit comme une promesse.
 *
 * ⚠️ ANGLES NETS : aucun `rx` sur les rectangles, jonctions en onglet. La charte « Bureau »
 * (15/10/2026) a des cartes à 4px et des boutons droits ; les boîtes arrondies des schémas
 * juraient dessous. Les cercles (jalons, coefficient) restent des cercles.
 *
 * Les SVG sont `aria-hidden` : la phrase-clé va dans la légende HTML (`figcaption`), pas ici,
 * et aucun schéma ne la répète en bas de dessin (revue du 20/09/2026).
 * Les identifiants de marqueur sont suffixés par schéma, parce qu'un article peut en afficher
 * deux sur la même page.
 */
import type { NomSchemaGlossaire } from '@/lib/glossaire';
import { CARTE_ZONES, TRACES_ZONES, CENTRES_ZONES } from './traces-zones';

const COMMUN = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'butt' as const,
  strokeLinejoin: 'miter' as const,
};

function T({ x, y, children, accent = false, petit = false, sur = false, ancre = 'middle' }: {
  x: number; y: number; children: string; accent?: boolean; petit?: boolean; sur?: boolean; ancre?: 'start' | 'middle' | 'end';
}) {
  const classes = ['schema-texte', accent && 'schema-texte-accent', petit && 'schema-texte-petit', sur && 'schema-texte-sur-accent']
    .filter(Boolean).join(' ');
  return <text x={x} y={y} textAnchor={ancre} className={classes}>{children}</text>;
}

/* Deux pointes de flèche : l'accent pour le trait clé, l'encre pour un trait ordinaire. Un
   trait doux n'a pas de pointe : une pointe verte sur un trait gris trahissait le ton. */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" className="schema-pointe" />
      </marker>
      <marker id={`${id}-encre`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="currentColor" stroke="none" />
      </marker>
    </defs>
  );
}

/* Une boîte à angles nets avec son libellé centré, pleine (accent) ou en contour. */
function Boite({ x, y, w, h, lignes, accent = false, doux = false }: {
  x: number; y: number; w: number; h: number; lignes: string[]; accent?: boolean; doux?: boolean;
}) {
  const debut = y + h / 2 - ((lignes.length - 1) * 15) / 2 + 4;
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h}
        className={accent ? 'schema-accent schema-plein' : doux ? 'schema-doux' : undefined}
        strokeWidth={accent ? 0 : 1.6}
      />
      {lignes.map((l, i) => <T key={l} x={x + w / 2} y={debut + i * 15} sur={accent} petit={lignes.length > 1}>{l}</T>)}
    </g>
  );
}

/* ── kWh cumac ─────────────────────────────────────────────────────── */

/* L'actualisation : dix années d'économies, chacune valant la précédente divisée par 1,04. La
   somme de toutes les barres est le volume cumac. */
function Actualisation() {
  const annees = 10; const h0 = 150; const x0 = 44; const pas = 34; const base = 232;
  const barres = Array.from({ length: annees }, (_, i) => h0 / 1.04 ** i);
  return (
    <svg viewBox="0 0 440 270" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-actualisation" />
      <path d={`M${x0 - 10} ${base} H${x0 + annees * pas}`} />
      {barres.map((h, i) => (
        <rect
          key={i} x={x0 + i * pas} y={base - h} width={pas - 8} height={h}
          className={i === 0 ? 'schema-accent schema-plein' : undefined} strokeWidth={i === 0 ? 0 : 1.6}
        />
      ))}
      <T x={x0 + (pas - 8) / 2} y={base + 18} petit>Année 1</T>
      <T x={x0 + (annees - 1) * pas + (pas - 8) / 2} y={base + 18} petit>Année 10</T>
      <path d={`M${x0 + pas + 6} ${base - barres[1] - 30} C${x0 + pas + 30} ${base - h0 - 40} ${x0 + 4 * pas} ${base - barres[4] - 60} ${x0 + 4 * pas + 8} ${base - barres[4] - 8}`} className="schema-accent" markerEnd="url(#pointe-actualisation)" />
      <T x={x0 + 5 * pas} y={base - h0 - 14} accent ancre="start">÷ 1,04 chaque année</T>
      <path d={`M${x0 - 2} ${base - h0 - 34} V${base - h0 - 42} H${x0 + annees * pas - 8} V${base - h0 - 34}`} className="schema-doux" />
      <T x={x0 + (annees * pas) / 2} y={base - h0 - 50} petit>La somme des barres est le volume en kWh cumac</T>
    </svg>
  );
}

/* ── Durée de vie conventionnelle ──────────────────────────────────── */

/* Deux règles de temps : la durée que la fiche compte, la durée que l'équipement vit. Seule la
   première entre dans le calcul, quelle que soit la seconde. */
function DureeConventionnelle() {
  return (
    <svg viewBox="0 0 440 220" className="schema" aria-hidden="true" {...COMMUN}>
      <T x={40} y={46} ancre="start" accent>Durée conventionnelle, fixée par la fiche</T>
      <rect x="40" y="58" width="250" height="26" className="schema-accent schema-plein" strokeWidth={0} />
      <T x={165} y={75} sur>comptée dans le calcul</T>
      <path d="M290 50 V190" className="schema-accent" strokeDasharray="4 4" />
      <T x={40} y={130} ancre="start">Durée réelle de l’équipement</T>
      <rect x="40" y="142" width="330" height="26" className="schema-doux" />
      <path d="M370 142 h30 M370 168 h30" className="schema-doux" strokeDasharray="3 5" />
      <T x={412} y={161} ancre="start">?</T>
      <path d="M40 190 H400" />
      <T x={40} y={208} petit ancre="start">Mise en service</T>
      <T x={400} y={208} petit ancre="end">Le temps passe</T>
    </svg>
  );
}

/* ── Obligé ────────────────────────────────────────────────────────── */

/* La chaîne de l'obligation : des ventes d'énergie naît une obligation en kWh cumac ; les
   certificats la couvrent ; ce qui manque se paie. */
function ChaineObligation() {
  return (
    <svg viewBox="0 0 440 210" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-chaine" />
      <Boite x={20} y={30} w={120} h={54} lignes={['Ventes', 'd’énergie']} />
      <path d="M140 57 H176" className="schema-accent" markerEnd="url(#pointe-chaine)" />
      <Boite x={180} y={30} w={120} h={54} lignes={['Obligation', 'en kWh cumac']} />
      <path d="M300 57 H336" className="schema-accent" markerEnd="url(#pointe-chaine)" />
      <Boite x={340} y={30} w={84} h={54} lignes={['Fin de', 'période']} />
      <Boite x={180} y={130} w={120} h={54} lignes={['Certificats', 'détenus']} accent />
      <path d="M240 130 V88" className="schema-accent" markerEnd="url(#pointe-chaine)" />
      <T x={158} y={162} petit ancre="end">obtenus, achetés</T>
      <T x={158} y={176} petit ancre="end">ou délégués</T>
      <path d="M382 84 V130" className="schema-doux" />
      <Boite x={320} y={130} w={110} h={54} lignes={['Ce qui manque :', '0,015 € par kWhc']} doux />
    </svg>
  );
}

/* Les six périodes du dispositif, la sixième en cours. */
function Periodes() {
  const periodes: [string, string, boolean][] = [
    ['P1', '2006-2009', false], ['P2', '2011-2014', false], ['P3', '2015-2017', false],
    ['P4', '2018-2021', false], ['P5', '2022-2025', false], ['P6', '2026-2030', true],
  ];
  return (
    <svg viewBox="0 0 440 130" className="schema" aria-hidden="true" {...COMMUN}>
      <path d="M20 98 H420" />
      {periodes.map(([nom, annees, accent], i) => {
        const x = 24 + i * 66;
        return (
          <g key={nom}>
            <rect x={x} y={40} width={58} height={36} className={accent ? 'schema-accent schema-plein' : undefined} strokeWidth={accent ? 0 : 1.6} />
            <path d={`M${x + 29} 76 V98`} className="schema-doux" />
            <T x={x + 29} y={63} sur={accent} accent={false}>{nom}</T>
            <T x={x + 29} y={118} petit accent={accent}>{annees}</T>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Délégataire ───────────────────────────────────────────────────── */

/* L'obligation change de mains : le délégataire porte la part déléguée, avec la pénalité. */
function Delegation() {
  return (
    <svg viewBox="0 0 440 215" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-delegation" />
      <Boite x={10} y={40} w={120} h={60} lignes={['Obligé', 'vendeur d’énergie']} />
      <path d="M130 70 H256" className="schema-accent" strokeWidth={2} markerEnd="url(#pointe-delegation)" />
      <T x={193} y={58} petit accent>contrat de délégation</T>
      <Boite x={260} y={40} w={130} h={60} lignes={['Délégataire', 'devient obligé']} accent />
      <path d="M325 100 V150" className="schema-doux" />
      <Boite x={250} y={154} w={150} h={50} lignes={['Rend les certificats', 'ou paie la pénalité']} doux />
      <path d="M70 100 V132" className="schema-doux" />
      <T x={70} y={150} petit>reste obligé pour</T>
      <T x={70} y={164} petit>la part non déléguée</T>
    </svg>
  );
}

/* ── Mandataire ────────────────────────────────────────────────────── */

/* Trois acteurs : le mandataire agit au nom du demandeur, l'obligation ne bouge pas. */
function Mandat() {
  return (
    <svg viewBox="0 0 440 220" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-mandat" />
      <Boite x={10} y={30} w={140} h={60} lignes={['Demandeur', 'obligé ou délégataire']} />
      <T x={80} y={110} petit>porte l’obligation</T>
      <T x={80} y={124} petit>et la responsabilité</T>
      <path d="M150 60 H236" className="schema-accent" strokeWidth={2} markerEnd="url(#pointe-mandat)" />
      <T x={193} y={48} petit accent>mandat écrit</T>
      <Boite x={240} y={30} w={170} h={60} lignes={['Mandataire', 'agit au nom du demandeur']} accent />
      <path d="M325 90 V150" className="schema-accent" markerEnd="url(#pointe-mandat)" />
      <T x={312} y={124} petit ancre="end">monte le dossier,</T>
      <T x={312} y={138} petit ancre="end">verse la contribution</T>
      <Boite x={250} y={154} w={150} h={54} lignes={['Bénéficiaire', 'maître d’ouvrage']} />
    </svg>
  );
}

/* ── Fiche d'opération standardisée ────────────────────────────────── */

/* L'anatomie d'une fiche : son code décodé, puis les quatre rubriques qui font le forfait. */
function AnatomieFiche() {
  const rubriques = ['Secteur d’application', 'Dénomination', 'Conditions pour la délivrance', 'Durée de vie conventionnelle', 'Montant en kWh cumac : le forfait'];
  return (
    <svg viewBox="0 0 440 300" className="schema" aria-hidden="true" {...COMMUN}>
      <rect x="30" y="20" width="380" height="262" />
      {[['BAR', 'secteur', 90], ['EN', 'famille', 190], ['101', 'numéro', 290]].map(([code, sens, x]) => (
        <g key={code as string}>
          <rect x={(x as number) - 36} y={38} width={72} height={34} />
          <T x={x as number} y={60}>{code as string}</T>
          <T x={x as number} y={92} petit accent>{sens as string}</T>
        </g>
      ))}
      <path d="M126 55 H154 M226 55 H254" className="schema-doux" />
      <T x={360} y={60} petit>v. A64.6</T>
      <path d="M50 108 H390" className="schema-doux" />
      {rubriques.map((r, i) => {
        const cle = i === rubriques.length - 1;
        return (
          <g key={r}>
            <circle cx={62} cy={124 + i * 28} r={cle ? 5 : 4} className={cle ? 'schema-plein' : undefined} stroke={cle ? 'none' : undefined} />
            <T x={78} y={128 + i * 28} ancre="start" accent={cle}>{r}</T>
          </g>
        );
      })}
      <path d="M50 258 H390" className="schema-doux" />
      <T x={220} y={274} petit>Annexe : attestation sur l’honneur à faire signer</T>
    </svg>
  );
}

/* ── Opération spécifique ──────────────────────────────────────────── */

/* La bifurcation : une fiche existe, le forfait s'applique ; aucune fiche, on démontre. */
function Bifurcation() {
  return (
    <svg viewBox="0 0 440 260" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-bifurcation" />
      <Boite x={130} y={16} w={180} h={50} lignes={['Une fiche standardisée', 'couvre l’opération ?']} />
      <path d="M170 66 C170 100 110 96 110 124" markerEnd="url(#pointe-bifurcation-encre)" />
      <T x={120} y={92} petit ancre="end">oui</T>
      <path d="M270 66 C270 100 330 96 330 124" className="schema-accent" markerEnd="url(#pointe-bifurcation)" />
      <T x={320} y={92} petit accent ancre="start">non</T>
      <Boite x={30} y={128} w={160} h={54} lignes={['Forfait de la fiche', 'appliqué tel quel']} />
      <Boite x={250} y={128} w={160} h={54} lignes={['Opération spécifique', 'économies démontrées']} accent />
      {['audit et situation de référence', 'calcul des kWh cumac', 'temps de retour brut', 'instruction du PNCEE : 6 mois'].map((l, i) => (
        <T key={l} x={330} y={204 + i * 14} petit>{l}</T>
      ))}
      <T x={110} y={204} petit>dossier standard,</T>
      <T x={110} y={218} petit>instruction : 2 mois</T>
    </svg>
  );
}

/* ── Rôle actif et incitatif ───────────────────────────────────────── */

/* La chronologie du rôle actif : la contribution s'engage avant que le bénéficiaire ne
   s'engage lui-même ; la tolérance de quatorze jours ne vaut que pour les particuliers et les
   copropriétés, et jamais après le début des travaux. */
function ChronologieRai() {
  const jalons: [string, string, boolean][] = [
    ['Contribution', 'engagée par écrit', true], ['Devis signé', 'date d’engagement', false],
    ['Début', 'des travaux', false], ['Achèvement', 'facture', false], ['Dépôt', 'sous 12 mois', false],
  ];
  return (
    <svg viewBox="0 0 440 260" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-rai" />
      <path d="M40 120 H400" />
      {jalons.map(([nom, sous, accent], i) => {
        const x = 50 + i * 85;
        return (
          <g key={nom}>
            <circle cx={x} cy="120" r={accent ? 13 : 8} className={accent ? 'schema-accent schema-plein' : undefined} strokeWidth={accent ? 2.4 : 1.6} />
            <T x={x} y={i % 2 ? 160 : 78} accent={accent}>{nom}</T>
            <T x={x} y={i % 2 ? 174 : 92} petit>{sous}</T>
          </g>
        );
      })}
      <path d="M50 60 C50 30 135 30 135 60" className="schema-accent" markerEnd="url(#pointe-rai)" />
      <T x={92} y={26} accent>avant</T>
      <path d="M135 200 H185" className="schema-doux" />
      <path d="M135 194 V206 M185 194 V206" className="schema-doux" />
      <T x={160} y={222} petit>particuliers et copropriétés : contribution admise</T>
      <T x={160} y={236} petit>jusqu’à 14 jours après le devis, avant les travaux</T>
    </svg>
  );
}

/* ── PNCEE ─────────────────────────────────────────────────────────── */

/* Le parcours d'un dossier : des opérations achevées au compte sur le registre, avec le
   PNCEE au milieu et les contrôles de part et d'autre. */
function ParcoursDossier() {
  return (
    <svg viewBox="0 0 440 235" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-parcours" />
      <Boite x={16} y={40} w={118} h={58} lignes={['Opérations', 'achevées']} />
      <path d="M134 69 H160" className="schema-accent" markerEnd="url(#pointe-parcours)" />
      <Boite x={164} y={40} w={112} h={58} lignes={['Demande', '50 GWhc au moins']} />
      <path d="M276 69 H302" className="schema-accent" markerEnd="url(#pointe-parcours)" />
      <Boite x={306} y={40} w={118} h={58} lignes={['PNCEE', 'instruit et délivre']} accent />
      <path d="M365 98 V150" className="schema-accent" markerEnd="url(#pointe-parcours)" />
      <T x={352} y={128} petit ancre="end">2 mois, ou 6 pour</T>
      <T x={352} y={142} petit ancre="end">une opération spécifique</T>
      <Boite x={296} y={154} w={138} h={54} lignes={['Certificats inscrits', 'au registre national']} />
      <path d="M220 98 V162" className="schema-doux" />
      <Boite x={150} y={166} w={140} h={54} lignes={['Contrôles par organisme', 'accrédité, avant dépôt']} doux />
    </svg>
  );
}

/* ── Zone climatique ───────────────────────────────────────────────── */

/* Une carte volontairement simplifiée : le nord, l'est et le Massif central en H1, l'ouest et le sud-ouest en H2, le
   pourtour méditerranéen en H3. Les frontières exactes sont dans l'annexe de l'arrêté. */
/* La carte des zones : les géométries réelles des départements, fusionnées par zone et
   simplifiées (scripts/genere-carte-zones.py). H1 en aplat d'accent, H2 en accent atténué,
   H3 en blanc : trois valeurs d'une même couleur, du plus froid au plus doux, sans
   hexadécimal. La légende est en HTML sous la figure, pas dans le dessin. */
function ZonesClimatiques() {
  const { largeur, hauteur } = CARTE_ZONES;
  return (
    <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="schema schema-carte" aria-hidden="true" {...COMMUN}>
      <path d={TRACES_ZONES.H2} className="schema-accent schema-plein schema-plein-attenue" strokeWidth={0} />
      <path d={TRACES_ZONES.H1} className="schema-accent schema-plein" strokeWidth={0} />
      <path d={TRACES_ZONES.H3} className="schema-carte-h3" strokeWidth={0} />
      {/* Les contours par-dessus les aplats, en blanc fin, pour que les frontières entre
          zones se lisent sans alourdir le dessin. */}
      <path d={TRACES_ZONES.H1} className="schema-carte-contour" />
      <path d={TRACES_ZONES.H2} className="schema-carte-contour" />
      <path d={TRACES_ZONES.H3} className="schema-carte-contour schema-carte-contour-h3" />
      <T x={CENTRES_ZONES.H1.x} y={CENTRES_ZONES.H1.y} sur>H1</T>
      <T x={CENTRES_ZONES.H2.x} y={CENTRES_ZONES.H2.y} sur>H2</T>
      {/* Le point représentatif de H3 tombe sur la côte varoise, sur la frontière : l'étiquette
          est posée à la main dans la partie large de la zone, entre Gard et Hérault. */}
      <T x={CENTRES_ZONES.H3.x - 60} y={CENTRES_ZONES.H3.y + 24}>H3</T>
      <T x={CENTRES_ZONES.corse.x} y={CENTRES_ZONES.corse.y + 4} petit>H3</T>
    </svg>
  );
}

/* ── Coup de pouce ─────────────────────────────────────────────────── */

/* Le multiplicateur : le forfait de la fiche, un coefficient venu de la charte, un volume plus
   grand. Les hauteurs sont des proportions de dessin, pas des valeurs. */
function Multiplicateur() {
  return (
    <svg viewBox="0 0 440 250" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs id="pointe-multiplicateur" />
      <path d="M30 190 H410" />
      <rect x="50" y="130" width="70" height="60" />
      <T x={85} y={210} petit>Forfait de la fiche</T>
      <T x={85} y={224} petit>en kWh cumac</T>
      <circle cx="190" cy="120" r="38" className="schema-accent" strokeWidth={2.2} />
      <T x={190} y={116} accent>×</T>
      <T x={190} y={132} petit accent>coefficient</T>
      <T x={190} y={178} petit>fixé par la charte</T>
      <path d="M228 120 H262" className="schema-accent" markerEnd="url(#pointe-multiplicateur)" />
      <rect x="290" y="40" width="70" height="150" className="schema-accent schema-plein" strokeWidth={0} />
      <rect x="290" y="130" width="70" height="60" className="schema-doux" strokeDasharray="3 4" />
      <T x={325} y={210} petit>Volume bonifié</T>
      <T x={325} y={224} petit>même opération</T>
    </svg>
  );
}

const SCHEMAS: Record<NomSchemaGlossaire, () => React.JSX.Element> = {
  actualisation: Actualisation,
  'duree-conventionnelle': DureeConventionnelle,
  'chaine-obligation': ChaineObligation,
  periodes: Periodes,
  delegation: Delegation,
  mandat: Mandat,
  'anatomie-fiche': AnatomieFiche,
  bifurcation: Bifurcation,
  'chronologie-rai': ChronologieRai,
  'parcours-dossier': ParcoursDossier,
  'zones-climatiques': ZonesClimatiques,
  multiplicateur: Multiplicateur,
};

export default function SchemaGlossaire({ nom }: { nom: NomSchemaGlossaire }) {
  const Dessin = SCHEMAS[nom];
  return <Dessin />;
}
