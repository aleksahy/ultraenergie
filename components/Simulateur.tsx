'use client';

import { useState } from 'react';
import type { Calcul, Saisie } from '@/lib/calcul';
import { champs, evalue } from '@/lib/calcul';
import { nombreFr } from '@/lib/site';

/**
 * Le simulateur d'une fiche : un champ par dimension du barème, et le montant en kWh cumac.
 *
 * ⛔ PAS DE CONVERSION EN EUROS. Le site en affichait une au cours EMMY ; retirée le
 * 19/09/2026. La cotation est un prix entre détenteurs de certificats, pas la prime versée
 * au bénéficiaire, qui est plus basse et dépend du contrat. Afficher l'une pour l'autre
 * surestimait ce que le client touchera. Le jour où un prix revient, c'est un prix de prime
 * fixé par Ultra Énergie, daté, pas la cotation.
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
            <p className="simulateur-avertissement">
              Volume indicatif pour la fiche {code}, sous réserve de validation du dossier. Le montant
              de la prime dépend de l'offre retenue.
            </p>
          </>
        )}
      </output>
    </div>
  );
}
