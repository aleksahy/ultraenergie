/**
 * Les schémas des pages argumentaires : des dessins filaires en deux tons, chacun disant une
 * chose de la page.
 *
 * ⚠️ AUCUN HEXADÉCIMAL. Les tracés héritent de `currentColor` (l'encre) ; `.schema-accent`
 * pose l'accent depuis la feuille de style, `.schema-doux` un trait atténué, et
 * `.schema-texte-sur-accent` le blanc d'un texte posé sur un aplat d'accent. ⛔ Ce blanc se
 * déclare explicitement, texte par texte : une règle de fratrie CSS (`.schema-plein ~ text`)
 * blanchissait des libellés entiers sur fond clair (revue du 19/09/2026).
 *
 * ⛔ PAS DE CHIFFRES DANS LES SCHÉMAS. Le schéma de financement montre des parts, pas des
 * montants : un pourcentage dessiné se lit comme une promesse. Et la part de la prime y est
 * la plus petite, parce que c'est le cas général.
 *
 * Les légendes des schémas de partenaires sont en HTML, dans la bande (`figcaption`), pas
 * dans le SVG : un SVG `aria-hidden` ne doit pas porter la phrase-clé de la page.
 */
import type { Argumentaire } from '@/lib/argumentaires';

const COMMUN = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function T({ x, y, children, accent = false, petit = false, sur = false, ancre = 'middle' }: {
  x: number; y: number; children: string; accent?: boolean; petit?: boolean; sur?: boolean; ancre?: 'start' | 'middle' | 'end';
}) {
  const classes = ['schema-texte', accent && 'schema-texte-accent', petit && 'schema-texte-petit', sur && 'schema-texte-sur-accent']
    .filter(Boolean).join(' ');
  return <text x={x} y={y} textAnchor={ancre} className={classes}>{children}</text>;
}

function Defs() {
  return (
    <defs>
      <marker id="pointe" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" className="schema-pointe" />
      </marker>
    </defs>
  );
}

/* Une ligne de rappel : un point d'accent à l'origine, un trait doux vers l'étiquette. */
function Rappel({ x, y, vers }: { x: number; y: number; vers: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={3} className="schema-plein" stroke="none" />
      <path d={`M${x} ${y} H${vers}`} className="schema-doux" />
    </>
  );
}

/* ── Pour qui : l'introduction ─────────────────────────────────────── */

/* Un immeuble en coupe, ses trois postes de travaux et l'assemblée qui vote. */
function Copropriete() {
  return (
    <svg viewBox="0 0 440 320" className="schema" aria-hidden="true" {...COMMUN}>
      <path d="M40 96 L140 40 L240 96" className="schema-accent" strokeWidth={2.2} />
      <rect x="52" y="96" width="176" height="196" rx="3" />
      <path d="M52 140h176M52 184h176M52 228h176" className="schema-doux" />
      {[104, 148, 192].map((y) => [72, 116, 160].map((x) => <rect key={`${x}${y}`} x={x} y={y + 8} width="24" height="22" rx="2" />))}
      <rect x="120" y="248" width="40" height="44" rx="2" />
      <path d="M72 248h32v24H72zM176 248h32v24h-32z" className="schema-doux" />
      <Rappel x={236} y={66} vers={296} />
      <T x={306} y={70} ancre="start">Toiture et combles</T>
      <Rappel x={236} y={160} vers={296} />
      <T x={306} y={164} ancre="start">Murs et planchers</T>
      <Rappel x={236} y={270} vers={296} />
      <T x={306} y={274} ancre="start">Chaufferie, réseau</T>
      <T x={140} y={312} accent>Parties communes, votées en assemblée</T>
    </svg>
  );
}

/* Un parc : trois immeubles sur un même sol, un programme, une seule valorisation. */
function Parc() {
  return (
    <svg viewBox="0 0 440 320" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs />
      {[[30, 92, 180, 'Réhabilitation'], [140, 62, 210, 'Chaufferie'], [250, 112, 160, 'Isolation']].map(([x, y, h, l]) => (
        <g key={x}>
          <rect x={x as number} y={y as number} width="84" height={h as number} rx="3" />
          {Array.from({ length: Math.floor(((h as number) - 30) / 36) }, (_, r) => (
            <g key={r}>
              <rect x={(x as number) + 14} y={(y as number) + 14 + r * 36} width="18" height="18" rx="2" />
              <rect x={(x as number) + 52} y={(y as number) + 14 + r * 36} width="18" height="18" rx="2" />
            </g>
          ))}
          <path d={`M${(x as number) + 42} ${y} V56`} className="schema-doux" />
          <T x={(x as number) + 42} y={290} petit>{l as string}</T>
        </g>
      ))}
      <path d="M30 272 H334" className="schema-doux" />
      <path d="M72 56 H292" className="schema-doux" />
      <path d="M292 56 H372" className="schema-accent" markerEnd="url(#pointe)" />
      <circle cx="400" cy="56" r="26" className="schema-accent" strokeWidth={2} />
      <T x={400} y={60} accent>Prime</T>
      <T x={400} y={100} petit>part précarité</T>
      <T x={400} y={114} petit>comptée</T>
      <T x={220} y={312} accent>Un programme, une opération par bâtiment, un dossier chacune</T>
    </svg>
  );
}

/* La chronologie d'une collectivité : l'engagement CEE se place avant la signature du marché. */
function CommandePublique() {
  const jalons = [
    ['Programmation', false], ['Engagement CEE', true], ['Marché signé', false], ['Travaux', false], ['Prime', false],
  ] as const;
  return (
    <svg viewBox="0 0 440 320" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs />
      <path d="M40 170 H400" />
      {jalons.map(([nom, accent], i) => {
        const x = 50 + i * 85;
        return (
          <g key={nom}>
            <circle cx={x} cy="170" r={accent ? 13 : 8} className={accent ? 'schema-accent schema-plein' : undefined} strokeWidth={accent ? 2.4 : 1.6} />
            <path d={`M${x} ${accent ? 183 : 178} V${i % 2 ? 236 : 210}`} className="schema-doux" />
            <T x={x} y={i % 2 ? 254 : 228} accent={accent}>{nom}</T>
          </g>
        );
      })}
      <path d="M135 132 C135 96 220 96 220 132" className="schema-accent" markerEnd="url(#pointe)" />
      <T x={178} y={88} accent>avant</T>
      <T x={220} y={300}>Le marché se signe après l’engagement de prime</T>
    </svg>
  );
}

/* Un site : le bâtiment, et les quatre gisements qui ont chacun leur fiche. */
function Site() {
  return (
    <svg viewBox="0 0 440 320" className="schema" aria-hidden="true" {...COMMUN}>
      <path d="M40 260 V150 l48-28 v28 l48-28 v28 l48-28 v138 Z" />
      <rect x="56" y="200" width="28" height="28" rx="2" /><rect x="100" y="200" width="28" height="28" rx="2" /><rect x="144" y="200" width="28" height="28" rx="2" />
      <rect x="58" y="98" width="16" height="42" rx="1" />
      <path d="M66 98c0-10 8-10 8-20" className="schema-doux" />
      <g>
        <circle cx="270" cy="92" r="22" className="schema-accent" strokeWidth={2} />
        <path d="M270 70v-8M270 122v-8M248 92h-8M300 92h-8" />
        <T x={270} y={97} accent>M</T>
        <T x={270} y={134} petit>Moteurs,</T><T x={270} y={147} petit>variateurs</T>
      </g>
      <g>
        <rect x="340" y="70" width="60" height="44" rx="6" className="schema-accent" strokeWidth={2} />
        <path d="M350 82h40M350 94h40M350 106h22" />
        <T x={370} y={134} petit>GTB,</T><T x={370} y={147} petit>régulation</T>
      </g>
      <g>
        <path d="M260 200 h40 a12 12 0 0 1 12 12 v20" className="schema-accent" strokeWidth={2} />
        <path d="M262 190 c4-8 12-8 16 0M280 190 c4-8 12-8 16 0" className="schema-doux" />
        <T x={286} y={258} petit>Vapeur,</T><T x={286} y={271} petit>chaleur fatale</T>
      </g>
      <g>
        <rect x="350" y="196" width="44" height="44" rx="22" className="schema-accent" strokeWidth={2} />
        <path d="M372 204v32M356 218h32M361 208l22 22M383 208l-22 22" className="schema-doux" />
        <T x={372} y={258} petit>Froid,</T><T x={372} y={271} petit>air comprimé</T>
      </g>
      <T x={220} y={300} accent>Chaque gisement a sa fiche et son forfait</T>
    </svg>
  );
}

/* ── Pour qui : le financement (parts, pas de montants ; la prime est la plus petite) ── */

function Financement() {
  return (
    <svg viewBox="0 0 440 150" className="schema schema-financement" aria-hidden="true" {...COMMUN}>
      <rect x="20" y="30" width="400" height="34" rx="6" />
      <T x={220} y={22} petit>Coût des travaux</T>
      <rect x="20" y="86" width="80" height="34" rx="6" className="schema-accent schema-plein" strokeWidth={0} />
      <T x={60} y={107} sur>Prime CEE</T>
      <rect x="106" y="86" width="110" height="34" rx="6" className="schema-doux" />
      <T x={161} y={107} petit>Autres aides</T>
      <rect x="222" y="86" width="198" height="34" rx="6" />
      <T x={321} y={107}>Reste à charge</T>
      <path d="M20 70 V80M420 70 V80" className="schema-doux" />
      <T x={220} y={142} petit>Les parts varient selon l’opération et l’offre retenue</T>
    </svg>
  );
}

/* ── Partenaires ───────────────────────────────────────────────────── */

/* L'entonnoir des obligés : des opérations signalées à des dossiers prêts à déposer. */
function Entonnoir() {
  const etages = [
    { w: 360, l: 'Opérations signalées', a: false },
    { w: 290, l: 'Qualifiées : fiche, rôle actif daté', a: false },
    { w: 220, l: 'Pièces contrôlées avant dépôt', a: false },
    { w: 190, l: 'Dossiers prêts à déposer', a: true },
  ];
  return (
    <svg viewBox="0 0 440 300" className="schema" aria-hidden="true" {...COMMUN}>
      {etages.map((e, i) => {
        const y = 24 + i * 66; const x = (440 - e.w) / 2;
        return (
          <g key={e.l}>
            <rect x={x} y={y} width={e.w} height="44" rx="22" className={e.a ? 'schema-accent schema-plein' : undefined} strokeWidth={e.a ? 0 : 1.6} />
            <T x={220} y={y + 27} sur={e.a}>{e.l}</T>
          </g>
        );
      })}
      {[0, 1, 2].map((i) => <path key={i} d={`M220 ${72 + i * 66} v14`} className="schema-accent" strokeWidth={2} />)}
    </svg>
  );
}

/* La chronologie d'un chantier : le devis se signe après l'engagement ; l'autre ordre est inéligible. */
function Chronologie() {
  const jalons = ['Signalement', 'Engagement', 'Devis signé', 'Travaux', 'Prime'];
  return (
    <svg viewBox="0 0 440 300" className="schema" aria-hidden="true" {...COMMUN}>
      <Defs />
      <path d="M40 150 H400" />
      {jalons.map((j, i) => {
        const x = 50 + i * 85; const accent = i === 1;
        return (
          <g key={j}>
            <circle cx={x} cy="150" r={accent ? 13 : 8} className={accent ? 'schema-accent schema-plein' : undefined} strokeWidth={accent ? 2.4 : 1.6} />
            <T x={x} y={i % 2 ? 196 : 118} accent={accent}>{j}</T>
          </g>
        );
      })}
      <path d="M135 100 C135 66 220 66 220 100" className="schema-accent" markerEnd="url(#pointe)" />
      <T x={178} y={58} accent>avant</T>
      <g className="schema-doux">
        <path d="M60 250 H400" />
        <circle cx="135" cy="250" r="8" /><circle cx="220" cy="250" r="8" />
      </g>
      <path d="M129 244l12 12M141 244l-12 12" className="schema-accent" strokeWidth={2} />
      <T x={135} y={230} petit>Devis signé</T>
      <T x={220} y={230} petit>Engagement</T>
    </svg>
  );
}

/* Le réseau des apporteurs : qui voit les projets tôt, et ce qui en sort. */
function Reseau() {
  const noeuds = [
    { x: 84, y: 62, l: 'Syndic' }, { x: 356, y: 62, l: 'Bureau d’études' },
    { x: 64, y: 218, l: 'Mainteneur' }, { x: 376, y: 218, l: 'Distributeur' },
  ];
  return (
    <svg viewBox="0 0 440 250" className="schema" aria-hidden="true" {...COMMUN}>
      {noeuds.map((n) => {
        const dx = 220 - n.x, dy = 140 - n.y, d = Math.hypot(dx, dy);
        const x1 = n.x + (dx / d) * 48, y1 = n.y + (dy / d) * 48;
        const x2 = 220 - (dx / d) * 52, y2 = 140 - (dy / d) * 52;
        return (
          <g key={n.l}>
            <path d={`M${x1} ${y1} L${x2} ${y2}`} className="schema-doux" />
            <rect x={n.x - 54} y={n.y - 16} width="108" height="32" rx="16" />
            <T x={n.x} y={n.y + 4} petit>{n.l}</T>
          </g>
        );
      })}
      <circle cx="220" cy="140" r="44" className="schema-accent" strokeWidth={2.2} />
      <T x={220} y={136} accent>Projet</T>
      <T x={220} y={152} accent>signalé</T>
    </svg>
  );
}

const SCHEMAS: Record<Argumentaire['schema'], () => React.JSX.Element> = {
  copropriete: Copropriete,
  parc: Parc,
  'commande-publique': CommandePublique,
  site: Site,
  entonnoir: Entonnoir,
  chronologie: Chronologie,
  reseau: Reseau,
};

export default function Schema({ nom }: { nom: Argumentaire['schema'] }) {
  const Dessin = SCHEMAS[nom];
  return <Dessin />;
}

export { Financement as SchemaFinancement };
