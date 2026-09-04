'use client';

import { useState } from 'react';
import TeteSection from './TeteSection';
import { FAQ } from '@/lib/contenu';

export default function Faq() {
  const [ouverte, setOuverte] = useState<number | null>(null);

  return (
    <section id="faq" className="section section-faq">
      <TeteSection surtitre="Questions fréquentes">FAQ</TeteSection>
      <div className="faq">
        {FAQ.map((f, i) => {
          const estOuverte = ouverte === i;
          return (
            <div key={f.q} className="faq-item">
              <button
                type="button"
                className="faq-question"
                aria-expanded={estOuverte}
                onClick={() => setOuverte(estOuverte ? null : i)}
              >
                <span>{f.q}</span>
                <span className="faq-signe" aria-hidden="true">{estOuverte ? '−' : '+'}</span>
              </button>
              {estOuverte && <p className="faq-reponse">{f.r}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
