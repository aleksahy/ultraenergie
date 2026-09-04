'use client';

import { useState } from 'react';
import type { Calcul, Saisie } from '@/lib/calcul';
import { champs, evalue } from '@/lib/calcul';
import { TAUX_EURO_PAR_KWH_CUMAC, nombreFr, euroFr } from '@/lib/site';

/**
 * Le simulateur de prime d'une fiche : un champ par dimension du barème, le montant en kWh
 * cumac, puis sa conversion en euros.
 *
 * ⚠️ IL CALCULE AVEC `lib/calcul.ts`, LA MÊME FONCTION QUI SERT À TOUT LE RESTE. Réécrire la
 * multiplication ici donnerait, tôt ou tard, un montant différent de celui que la grille
 * juste au-dessus laisse calculer à la main.
 *
 * ⚠️ LES LIBELLÉS DES CHAMPS VIENNENT DE `champs(calcul)`, donc de la Partie A : ce qu'on
 * demande ici est exactement ce que l'attestation réclamera. C'est aussi la source de la
 * section « Justificatifs » : une seule liste, deux usages.
 *
 * ⛔ PAS DE MONTANT AFFICHÉ TANT QUE LA SAISIE EST INCOMPLÈTE. Un « 0 kWh cumac » sur un
 * formulaire vide se lit comme un résultat, et sur une page qui parle d'argent c'est le
 * genre de zéro qu'on cite ensuite de travers. Le simulateur nomme ce qui manque.
 */
export default function Simulateur({ calcul, code }: { calcul: Calcul; code: string }) {
  const entrees = champs(calcul);
  const [saisie, setSaisie] = useState<Saisie>({});
  const { kwhCumac, manquants } = evalue(calcul, saisie);

  const change = (id: string, valeur: string) => setSaisie((s) => ({ ...s, [id]: valeur }));

  return (
    <div className="simulateur">
      <h3 className="simulateur-titre">Estimer le montant pour votre opération</h3>

      <div className="simulateur-champs">
        {entrees.map((champ) => (
          <label key={champ.id} className="simulateur-champ">
            <span className="simulateur-label">{champ.libelle}</span>
            {champ.nature === 'choix' ? (
              <select
                className="champ"
                value={saisie[champ.id] ?? ''}
                onChange={(e) => change(champ.id, e.target.value)}
              >
                <option value="">Choisir…</option>
                {champ.valeurs?.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            ) : (
              <span className="simulateur-nombre">
                <input
                  className="champ"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder="0"
                  value={saisie[champ.id] ?? ''}
                  onChange={(e) => change(champ.id, e.target.value)}
                />
                <span className="simulateur-unite">{champ.unite}</span>
              </span>
            )}
          </label>
        ))}
      </div>

      <output className="simulateur-resultat" aria-live="polite">
        {kwhCumac === null ? (
          <p className="simulateur-attente">
            Renseignez {manquants.length > 1 ? 'les champs' : 'le champ'}{' '}
            {manquants.map((m) => m.toLowerCase()).join(', ')} pour obtenir un montant.
          </p>
        ) : (
          <>
            <div className="simulateur-kwh">
              <strong>{nombreFr.format(kwhCumac)}</strong> kWh cumac
            </div>
            <div className="simulateur-euros">
              soit environ <strong>{euroFr.format(kwhCumac * TAUX_EURO_PAR_KWH_CUMAC)}</strong> de prime
            </div>
            <p className="simulateur-avertissement">
              Estimation indicative pour la fiche {code}, au taux de{' '}
              {TAUX_EURO_PAR_KWH_CUMAC.toLocaleString('fr-FR', { minimumFractionDigits: 4 })} € par kWh cumac.
              Le montant réel dépend de la valorisation obtenue auprès des obligés consultés.
            </p>
          </>
        )}
      </output>
    </div>
  );
}
