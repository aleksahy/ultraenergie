'use client';

import { useState } from 'react';

/** L'accordéon de questions : un seul item ouvert à la fois. Partagé par l'accueil et les pages argumentaires. */
export default function ListeFaq({ items }: { items: readonly { q: string; r: string }[] }) {
  const [ouverte, setOuverte] = useState<number | null>(null);

  return (
    <div className="faq">
      {items.map((f, i) => {
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
  );
}
