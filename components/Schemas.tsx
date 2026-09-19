/**
 * Les schémas des pages argumentaires : un dessin filaire par page, en deux tons.
 *
 * ⚠️ AUCUN HEXADÉCIMAL. Les tracés héritent de `currentColor` (l'encre) et la classe
 * `schema-accent` pose l'accent depuis la feuille de style. Ce sont des schémas, pas des
 * illustrations décoratives : chacun dit une chose de la page (un flux, une chronologie, un
 * bâtiment et ses postes de travaux), et il est légendé dans le SVG lui-même.
 */
import type { Argumentaire } from '@/lib/argumentaires';

const COMMUN = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Etiquette({ x, y, children, accent = false }: { x: number; y: number; children: string; accent?: boolean }) {
  return (
    <text x={x} y={y} textAnchor="middle" className={`schema-texte${accent ? ' schema-texte-accent' : ''}`}>
      {children}
    </text>
  );
}

/* Un bâtiment collectif et ses postes de travaux, reliés à la prime. */
function Copropriete() {
  return (
    <svg viewBox="0 0 420 300" className="schema" aria-hidden="true" {...COMMUN}>
      <rect x="60" y="80" width="150" height="190" rx="3" />
      <path d="M50 80 L135 30 L220 80" className="schema-accent" strokeWidth={2} />
      {[110, 150, 190, 230].map((y) => (
        <g key={y}>
          <rect x="80" y={y} width="22" height="22" rx="2" />
          <rect x="124" y={y} width="22" height="22" rx="2" />
          <rect x="168" y={y} width="22" height="22" rx="2" />
        </g>
      ))}
      <rect x="225" y="200" width="40" height="70" rx="3" />
      <path d="M232 230h26M232 244h26" />
      <path d="M245 200v-30" className="schema-accent" />
      <circle cx="245" cy="165" r="4" className="schema-accent" fill="currentColor" />
      <path d="M240 55 L320 55" className="schema-accent" />
      <path d="M312 49l8 6-8 6" className="schema-accent" />
      <Etiquette x={345} y={59}>Toiture</Etiquette>
      <path d="M212 140 L320 140" className="schema-accent" />
      <path d="M312 134l8 6-8 6" className="schema-accent" />
      <Etiquette x={345} y={144}>Murs</Etiquette>
      <path d="M268 235 L320 235" className="schema-accent" />
      <path d="M312 229l8 6-8 6" className="schema-accent" />
      <Etiquette x={350} y={239}>Chaufferie</Etiquette>
      <Etiquette x={135} y={292} accent>Parties communes</Etiquette>
    </svg>
  );
}

/* Plusieurs immeubles d'un parc, un seul flux vers la valorisation. */
function Parc() {
  return (
    <svg viewBox="0 0 420 300" className="schema" aria-hidden="true" {...COMMUN}>
      {[30, 130, 230].map((x, i) => (
        <g key={x}>
          <rect x={x} y={90 + (i % 2) * 20} width="80" height={170 - (i % 2) * 20} rx="3" />
          {[110, 150, 190, 230].map((y) => (
            <g key={y}>
              <rect x={x + 14} y={y + (i % 2) * 20 - (y > 200 && i % 2 ? 40 : 0)} width="18" height="18" rx="2" />
              <rect x={x + 48} y={y + (i % 2) * 20 - (y > 200 && i % 2 ? 40 : 0)} width="18" height="18" rx="2" />
            </g>
          ))}
        </g>
      ))}
      <path d="M70 60 L70 40 L350 40 L350 60" className="schema-accent" />
      <path d="M170 60 L170 40M270 60 L270 40" className="schema-accent" />
      <path d="M350 60 L350 100" className="schema-accent" strokeWidth={2} />
      <path d="M344 92l6 8 6-8" className="schema-accent" />
      <circle cx="350" cy="130" r="26" className="schema-accent" strokeWidth={2} />
      <Etiquette x={350} y={135} accent>Prime</Etiquette>
      <Etiquette x={190} y={292} accent>Un programme, plusieurs opérations, un dossier chacune</Etiquette>
    </svg>
  );
}

/* Une mairie, une école, un lampadaire : trois postes d'une collectivité. */
function Collectivite() {
  return (
    <svg viewBox="0 0 420 300" className="schema" aria-hidden="true" {...COMMUN}>
      <path d="M40 130 L120 90 L200 130" className="schema-accent" strokeWidth={2} />
      <rect x="55" y="130" width="130" height="120" rx="2" />
      {[70, 102, 134, 166].map((x) => <rect key={x} x={x} y="160" width="14" height="60" rx="1" />)}
      <path d="M115 90 V72" /><path d="M115 72h14l-14 6" className="schema-accent" />
      <Etiquette x={120} y={272}>Mairie, école, gymnase</Etiquette>
      <rect x="230" y="150" width="120" height="100" rx="3" />
      <path d="M230 150 L290 115 L350 150" className="schema-accent" strokeWidth={2} />
      <rect x="250" y="175" width="24" height="24" rx="2" /><rect x="306" y="175" width="24" height="24" rx="2" />
      <rect x="278" y="205" width="24" height="45" rx="2" />
      <path d="M385 250 V120" /><path d="M385 120 h22" className="schema-accent" strokeWidth={2} />
      <circle cx="407" cy="126" r="5" className="schema-accent" fill="currentColor" />
      <Etiquette x={385} y={272}>Éclairage</Etiquette>
      <Etiquette x={210} y={40} accent>Chaque poste relève d’une fiche</Etiquette>
    </svg>
  );
}

/* Un site industriel et ses gisements : moteur, froid, vapeur, GTB. */
function Site() {
  return (
    <svg viewBox="0 0 420 300" className="schema" aria-hidden="true" {...COMMUN}>
      <path d="M40 250 V140 l50 -30 v30 l50 -30 v30 l50 -30 v140 Z" />
      <rect x="60" y="180" width="30" height="30" rx="2" /><rect x="110" y="180" width="30" height="30" rx="2" /><rect x="160" y="180" width="30" height="30" rx="2" />
      <rect x="60" y="70" width="18" height="40" rx="1" /><path d="M64 70 c0-10 10-10 10-20" className="schema-accent" />
      <circle cx="280" cy="90" r="24" className="schema-accent" strokeWidth={2} />
      <path d="M280 66 v-10M280 124 v-10M256 90 h-10M314 90 h-10" />
      <Etiquette x={280} y={95} accent>M</Etiquette>
      <Etiquette x={280} y={140}>Moteurs</Etiquette>
      <rect x="330" y="160" width="60" height="50" rx="6" className="schema-accent" strokeWidth={2} />
      <path d="M340 172 h40M340 185 h40M340 198 h25" />
      <Etiquette x={360} y={232}>GTB</Etiquette>
      <path d="M200 230 h30 v-60 h20" className="schema-accent" />
      <path d="M250 165 l6 5-6 5" className="schema-accent" />
      <Etiquette x={230} y={262}>Vapeur, froid, chaleur fatale</Etiquette>
      <Etiquette x={210} y={40} accent>Chaque gisement a sa fiche et son forfait</Etiquette>
    </svg>
  );
}

/* Le flux : des opérations qualifiées, un mandataire, plusieurs acheteurs. */
function Flux() {
  return (
    <svg viewBox="0 0 420 300" className="schema" aria-hidden="true" {...COMMUN}>
      {[70, 130, 190].map((y, i) => (
        <g key={y}>
          <rect x="30" y={y - 18} width="90" height="36" rx="18" />
          <Etiquette x={75} y={y + 4}>{['Copropriétés', 'Entreprises', 'Collectivités'][i]}</Etiquette>
          <path d={`M120 ${y} C160 ${y} 160 150 195 150`} className="schema-accent" />
        </g>
      ))}
      <circle cx="235" cy="150" r="40" className="schema-accent" strokeWidth={2.2} />
      <Etiquette x={235} y={146} accent>Ultra</Etiquette>
      <Etiquette x={235} y={162} accent>Énergie</Etiquette>
      {[90, 150, 210].map((y, i) => (
        <g key={y}>
          <path d={`M275 150 C310 150 310 ${y} 340 ${y}`} className="schema-accent" />
          <path d={`M334 ${y - 6}l6 6-6 6`} className="schema-accent" />
          <rect x="342" y={y - 16} width="60" height="32" rx="16" />
          <Etiquette x={372} y={y + 4}>{['Obligé A', 'Obligé B', 'Obligé C'][i]}</Etiquette>
        </g>
      ))}
      <Etiquette x={210} y={272} accent>Chaque dossier est proposé à plusieurs acheteurs</Etiquette>
    </svg>
  );
}

/* La chronologie d'un chantier : le seul ordre qui ouvre droit à la prime. */
function Chronologie() {
  const jalons = ['Signalement', 'Engagement', 'Devis signé', 'Travaux', 'Prime'];
  return (
    <svg viewBox="0 0 420 300" className="schema" aria-hidden="true" {...COMMUN}>
      <path d="M40 150 H380" />
      {jalons.map((j, i) => {
        const x = 50 + i * 80;
        const accent = i === 1;
        return (
          <g key={j}>
            <circle cx={x} cy="150" r={accent ? 14 : 9} className={accent ? 'schema-accent' : undefined} strokeWidth={accent ? 2.4 : 1.6} fill={accent ? 'currentColor' : 'none'} />
            <Etiquette x={x} y={i % 2 ? 200 : 118} accent={accent}>{j}</Etiquette>
          </g>
        );
      })}
      <path d="M130 100 C130 70 210 70 210 100" className="schema-accent" />
      <path d="M204 92l6 8 8-4" className="schema-accent" />
      <Etiquette x={170} y={60} accent>avant</Etiquette>
      <Etiquette x={210} y={262}>L’engagement précède le devis, toujours</Etiquette>
    </svg>
  );
}

/* Le réseau : l'apporteur au centre de ceux qui voient les projets tôt. */
function Reseau() {
  const noeuds = [
    { x: 80, y: 80, l: 'Syndic' }, { x: 340, y: 80, l: 'Bureau d’études' },
    { x: 60, y: 220, l: 'Mainteneur' }, { x: 360, y: 220, l: 'Distributeur' },
  ];
  return (
    <svg viewBox="0 0 420 300" className="schema" aria-hidden="true" {...COMMUN}>
      {noeuds.map((n) => (
        <g key={n.l}>
          <path d={`M${n.x} ${n.y} L210 150`} className="schema-accent" />
          <circle cx={n.x} cy={n.y} r="30" />
          <Etiquette x={n.x} y={n.y + 4}>{n.l}</Etiquette>
        </g>
      ))}
      <circle cx="210" cy="150" r="42" className="schema-accent" strokeWidth={2.2} />
      <Etiquette x={210} y={146} accent>Projet</Etiquette>
      <Etiquette x={210} y={162} accent>signalé</Etiquette>
      <path d="M210 192 V240" className="schema-accent" strokeWidth={2} />
      <path d="M204 232l6 8 6-8" className="schema-accent" />
      <Etiquette x={210} y={266}>Prime pour le client, commission pour vous</Etiquette>
    </svg>
  );
}

const SCHEMAS: Record<Argumentaire['schema'], () => React.JSX.Element> = {
  copropriete: Copropriete,
  parc: Parc,
  collectivite: Collectivite,
  site: Site,
  flux: Flux,
  chronologie: Chronologie,
  reseau: Reseau,
};

export default function Schema({ nom }: { nom: Argumentaire['schema'] }) {
  const Dessin = SCHEMAS[nom];
  return <Dessin />;
}
