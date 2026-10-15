"""
Étapes 1 à 4 de la chaîne des fiches CEE : PDF → texte propre → repères → identité → catalogue.

Tout ici est RÈGLE, rien n'est lu par un modèle. Le texte produit est l'arbitre de toute la
suite : c'est contre lui que les citations des étapes de lecture sont vérifiées.

  data/fiches/pdf/<CODE>/<fichier>.pdf     ce qu'Alek dépose, nom d'origine de l'ATEE
  data/fiches/pdf/<CODE>/<fichier>.txt     étape 1 + 2 : le texte, GÉNÉRÉ, jamais édité
  data/fiches/catalogue.json               étapes 3 + 4 : une ligne par document, GÉNÉRÉ

Étape 1, extraire : la couche texte de chaque page, par PyMuPDF, dans l'ordre du flux.
Étape 2, nettoyer sans réécrire : apostrophes typographiques → droites, espaces insécables →
  espaces, mots coupés par un tiret en fin de ligne recollés (« celle-\\nci » → « celle-ci »),
  phrase coupée par un saut de page recollée, paquets de lignes vides réduits à une, en-têtes
  et pieds de page répétés retirés. Les lignes du PDF sont conservées : on ne reconstitue pas
  les paragraphes, et surtout pas les tableaux, ce serait déjà interpréter.
Étape 3, repérer : les titres officiels (1. à 5., Annexe 1, Annexe 2) et leurs positions.
Étape 4, identifier : code, intitulé, version (lue dans le texte, sinon dans le nom), date de
  début d'application (lue dans le nom du fichier, le texte ne la porte pas), fin lue dans la
  dénomination (« engagées jusqu'au », « abrogée à compter du »), fin déduite du début de la
  version suivante, et le document en vigueur aujourd'hui par code.

⛔ Un champ que ni le texte ni le nom ne donnent reste null, et le catalogue le montre.

Usage : python3 scripts/extrait-fiches.py        (dépend de pymupdf : pip3 install pymupdf)
"""
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

try:
    import fitz  # pymupdf
except ImportError:
    sys.exit('pymupdf manque : pip3 install pymupdf')

RACINE = Path('data/fiches/pdf')
CATALOGUE = Path('data/fiches/catalogue.json')

MOIS = {
    'janvier': 1, 'février': 2, 'fevrier': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6,
    'juillet': 7, 'août': 8, 'aout': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11,
    'décembre': 12, 'decembre': 12,
}

# Les titres officiels, dans l'ordre du document. Tolérants à « de » / « des ».
TITRES = [
    ('secteur', r"^1\.\s*Secteur d'application"),
    ('denomination', r"^2\.\s*Dénomination"),
    ('conditions', r"^3\.\s*Conditions pour la délivrance de[s]? certificats"),
    ('duree', r"^4\.\s*Durée de vie conventionnelle"),
    ('montant', r"^5\.\s*Montant de[s]? certificats en kWh cumac"),
    ('annexe1', r"^Annexe 1\b"),
    ('annexe2', r"^Annexe 2\b"),
]

FIN_DE_PHRASE = tuple('.:;!?»)')


# ── Étapes 1 et 2 ────────────────────────────────────────────────────────────

def texte_des_pages(pdf: Path) -> list[str]:
    doc = fitz.open(pdf)
    return [p.get_text() for p in doc]


def normalise(page: str) -> str:
    page = page.replace('’', "'").replace('\xa0', ' ')
    lignes = [l.rstrip() for l in page.split('\n')]
    page = '\n'.join(lignes)
    # Mot coupé par un tiret en fin de ligne : on retire le saut, on garde le tiret, qui est
    # celui du mot composé (« sous-traitant »). Word ne césure pas les syllabes.
    page = re.sub(r'(\w)-\n\s*(?=[a-zà-ÿ])', r'\1-', page)
    return page


def sans_entetes_repetes(pages: list[str]) -> list[str]:
    """Retire une ligne qui ouvre ou ferme la plupart des pages (numéro, rappel de titre)."""
    if len(pages) < 3:
        return pages
    premieres, dernieres = [], []
    for p in pages:
        nb = [l.strip() for l in p.split('\n') if l.strip()]
        premieres.append(nb[0] if nb else None)
        dernieres.append(nb[-1] if nb else None)
    seuil = max(3, int(0.6 * len(pages)))
    repetees = set()
    for liste in (premieres, dernieres):
        for l in set(liste):
            if l and liste.count(l) >= seuil:
                repetees.add(l)
    # Un simple numéro de page en pied, même s'il change à chaque page.
    propres = []
    for p in pages:
        lignes = p.split('\n')
        nb = [i for i, l in enumerate(lignes) if l.strip()]
        garde = set(range(len(lignes)))
        if nb:
            for i in (nb[0], nb[-1]):
                if lignes[i].strip() in repetees:
                    garde.discard(i)
            if re.fullmatch(r'\d{1,2}(\s*/\s*\d{1,2})?', lignes[nb[-1]].strip()):
                garde.discard(nb[-1])
        propres.append('\n'.join(l for i, l in enumerate(lignes) if i in garde))
    return propres


def assemble(pages: list[str]) -> str:
    """Recolle les pages : une phrase coupée par le saut de page continue sans ligne vide."""
    out = ''
    for p in pages:
        p = p.strip('\n')
        if not out:
            out = p
            continue
        derniere = out.rstrip().split('\n')[-1].strip()
        premiere = p.lstrip().split('\n')[0].strip()
        continue_ = derniere and premiere and not derniere.endswith(FIN_DE_PHRASE) and premiere[:1].islower()
        out += ('\n' if continue_ else '\n\n') + p
    out = re.sub(r'\n(\s*\n)+', '\n\n', out)
    return out.strip() + '\n'


def texte_propre(pdf: Path) -> tuple[str, int]:
    pages = texte_des_pages(pdf)
    pages = [normalise(p) for p in pages]
    pages = sans_entetes_repetes(pages)
    return assemble(pages), len(pages)


# ── Étape 3 ──────────────────────────────────────────────────────────────────

def reperes(texte: str) -> tuple[dict, list[str]]:
    trouves = []
    for nom, motif in TITRES:
        m = re.search(motif, texte, re.M)
        if m:
            trouves.append((nom, m.start()))
    trouves.sort(key=lambda x: x[1])
    sections = {}
    for i, (nom, debut) in enumerate(trouves):
        fin = trouves[i + 1][1] if i + 1 < len(trouves) else len(texte)
        sections[nom] = [debut, fin]
    manquants = [nom for nom, _ in TITRES if nom not in sections]
    return sections, manquants


# ── Étape 4 ──────────────────────────────────────────────────────────────────

def date_fr(s: str) -> str | None:
    m = re.search(r'(\d{1,2})(?:er)?\s+([a-zéû]+)\s+(\d{4})', s.lower())
    if not m or m.group(2) not in MOIS:
        return None
    return f'{m.group(3)}-{MOIS[m.group(2)]:02d}-{int(m.group(1)):02d}'


def identite(texte: str, pdf: Path, sections: dict) -> dict:
    d: dict = {}
    m = re.search(r'Opération n° ?([A-Z]{3,4}-[A-Z]{2}-\d{3})', texte)
    d['codeTexte'] = m.group(1) if m else None
    if m and 'secteur' in sections:
        d['intitule'] = ' '.join(texte[m.end():sections['secteur'][0]].split()) or None
    else:
        d['intitule'] = None

    v = re.search(r'\bv\.? ?A ?(\d+)[.\-](\d+)\b', texte)
    if v:
        d['version'], d['versionSource'] = f'A{v.group(1)}-{v.group(2)}', 'texte'
    else:
        v = re.search(r'[vV] ?\.?A?(\d+)(?:[.\-_](\d+))?', pdf.stem.replace('mod', ''))
        if v:
            d['version'] = f'A{v.group(1)}' + (f'-{v.group(2)}' if v.group(2) else '')
            d['versionSource'] = 'nom du fichier' + ('' if v.group(2) else ', incomplète')
        else:
            d['version'], d['versionSource'] = None, None

    n = re.search(r'compter[ _]du[ _](\d{2})-(\d{2})-(\d{4})', pdf.stem)
    d['du'] = f'{n.group(3)}-{n.group(2)}-{n.group(1)}' if n else None
    d['duSource'] = 'nom du fichier' if n else None

    denom = texte[sections['denomination'][0]:sections['denomination'][1]] if 'denomination' in sections else texte
    d['finTexte'] = None
    e = re.search(r"engagées jusqu'au ([^.\n]+)", denom)
    a = re.search(r'abrogée à compter du ([^.\n]+)', denom)
    if a and date_fr(a.group(1)):
        d['finTexte'] = {'nature': 'abrogation', 'date': date_fr(a.group(1)), 'citation': a.group(0)}
    elif e and date_fr(e.group(1)):
        d['finTexte'] = {'nature': 'engagement_jusquau', 'date': date_fr(e.group(1)), 'citation': e.group(0)}
    return d


def veille(iso: str) -> str:
    return (date.fromisoformat(iso) - timedelta(days=1)).isoformat()


def main():
    if not RACINE.exists():
        sys.exit(f'{RACINE} absent : rien à lire.')
    entrees = []
    for pdf in sorted(RACINE.rglob('*.pdf')):
        texte, nb_pages = texte_propre(pdf)
        txt = pdf.with_suffix('.txt')
        txt.write_text(texte)
        sections, manquants = reperes(texte)
        ident = identite(texte, pdf, sections)
        code = pdf.parent.name
        entrees.append({
            'code': code,
            'codeTexte': ident['codeTexte'],
            'intitule': ident['intitule'],
            'version': ident['version'],
            'versionSource': ident['versionSource'],
            'du': ident['du'],
            'duSource': ident['duSource'],
            'finTexte': ident['finTexte'],
            'finDeduite': None,
            'au': None,
            'enVigueur': None,
            'fichier': str(pdf),
            'texte': str(txt),
            'pages': nb_pages,
            'caracteres': len(texte),
            'ossature': {'manquants': manquants},
            'sections': sections,
        })

    # Fin déduite : le début de la version suivante du même code, moins un jour.
    aujourdhui = date.today().isoformat()
    par_code: dict[str, list] = {}
    for e in entrees:
        par_code.setdefault(e['code'], []).append(e)
    for code, docs in par_code.items():
        dates = sorted(docs, key=lambda e: e['du'] or '9999')
        for i, e in enumerate(dates):
            suivant = next((s for s in dates[i + 1:] if s['du']), None)
            if e['du'] and suivant:
                e['finDeduite'] = veille(suivant['du'])
            fins = []
            if e['finTexte']:
                f = e['finTexte']['date']
                fins.append(veille(f) if e['finTexte']['nature'] == 'abrogation' else f)
            if e['finDeduite']:
                fins.append(e['finDeduite'])
            e['au'] = min(fins) if fins else None
            if e['du']:
                e['enVigueur'] = e['du'] <= aujourdhui and (e['au'] is None or aujourdhui <= e['au'])

    entrees.sort(key=lambda e: (e['code'], e['du'] or '9999'))
    CATALOGUE.write_text(json.dumps({'genereLe': aujourdhui, 'documents': entrees}, ensure_ascii=False, indent=1) + '\n')

    print(f'{len(entrees)} documents, {len(par_code)} codes → {CATALOGUE}\n')
    print(f"{'code':12} {'version':9} {'du':10} {'au':10} {'vig.':4} {'p.':>2} {'car.':>6}  ossature / alertes")
    for e in entrees:
        alertes = []
        if e['ossature']['manquants']: alertes.append('manque ' + ', '.join(e['ossature']['manquants']))
        if e['codeTexte'] != e['code']: alertes.append(f"code lu « {e['codeTexte']} »")
        if e['versionSource'] and e['versionSource'] != 'texte': alertes.append(f"version depuis {e['versionSource']}")
        if not e['du']: alertes.append('date de début inconnue')
        vig = 'oui' if e['enVigueur'] else ('non' if e['enVigueur'] is False else '?')
        print(f"{e['code']:12} {e['version'] or '—':9} {e['du'] or '—':10} {e['au'] or '—':10} {vig:4} {e['pages']:2} {e['caracteres']:6}  {' ; '.join(alertes)}")


if __name__ == '__main__':
    main()
