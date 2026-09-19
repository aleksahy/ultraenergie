"""
Importe le détail des fiches CEE depuis les PDF officiels vers data/details.json.

⚠️ LE PDF DE LA FICHE EST LA SOURCE, LE JSON EN EST LA COPIE GÉNÉRÉE. On ne modifie jamais
data/details.json à la main : la prochaine exécution l'écraserait sans prévenir. Ce qui
demande une main humaine (barème modélisé pour le simulateur, conditions titrées, jumelles
particulières) se déclare dans `DETAILS` de lib/fiches.ts, qui l'emporte champ par champ.

D'où viennent les PDF : data/fiches_sources.json, un manifeste code → URL du PDF, relevé sur
les pages du Club C2E de l'ATEE (qui republient les arrêtés) le 19/09/2026, en retenant pour
chaque code la version la plus récente. Les fichiers sont mis en cache dans .cache/fiches-pdf/
(non versionné) ; supprimer un fichier du cache force son nouveau téléchargement.

Ce que le script lit dans chaque fiche, dans l'ordre du document officiel :
  1. Secteur d'application     → secteurApplication
  2. Dénomination              → denomination
  3. Conditions                → conditions (paragraphes)
  4. Durée de vie              → dureeVie (années) et dureeVieTexte
  5. Montant                   → bareme.tableaux (cellules, via PyMuPDF) et bareme.notes
  Annexe 1, Partie A           → justificatifs (les lignes marquées d'un astérisque), version
La date d'abrogation est lue dans le texte (« abrogée à compter du … »), la qualification
dans les conditions (« signe de qualité », décret 2014-812 = RGE).

⛔ NE RIEN INVENTER POUR COMBLER : un champ que le PDF ne donne pas reste absent, et la page
ne le rend pas. Les fiches dont la mise en page échappe à l'extraction (10 sur 216 à ce jour)
sont listées en fin d'exécution ; elles s'écrivent à la main dans lib/fiches.ts.

Usage : npm run details   (dépend de pymupdf : pip3 install pymupdf)
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

try:
    import fitz  # pymupdf
except ImportError:
    sys.exit('pymupdf manque : pip3 install pymupdf')

MANIFESTE = Path('data/fiches_sources.json')
CIBLE = Path('data/details.json')
CACHE = Path('.cache/fiches-pdf')

MOIS = {
    'janvier': 1, 'février': 2, 'fevrier': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6,
    'juillet': 7, 'août': 8, 'aout': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11,
    'décembre': 12, 'decembre': 12,
}


def telecharge(code: str, url: str) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    cible = CACHE / f'{code}.pdf'
    if cible.exists() and cible.stat().st_size > 1000:
        return cible
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        cible.write_bytes(r.read())
    return cible


def norm(t: str) -> str:
    return t.replace('’', "'").replace('\xa0', ' ')


def entre(t: str, debut: str, fin: str | None) -> str | None:
    """Le texte entre deux en-têtes de section, tolérant aux variantes (« de » / « des »)."""
    m = re.search(debut, t)
    if not m:
        return None
    i = m.end()
    if not fin:
        return t[i:]
    n = re.search(fin, t[i:])
    return t[i: i + n.start()] if n else t[i:]


H1 = r"1\. Secteur d'application"
H2 = r"2\. Dénomination"
H3 = r"3\. Conditions pour la délivrance de[s]? certificats"
H4 = r"4\. Durée de vie conventionnelle"
H5 = r"5\. Montant de[s]? certificats en kWh cumac"
ANNEXE = r"Annexe 1"


def paragraphes(s: str) -> list[str]:
    """Le texte d'une section en paragraphes : les lignes d'un même bloc sont recollées."""
    blocs: list[list[str]] = [[]]
    for ligne in s.split('\n'):
        ligne = ligne.strip()
        if not ligne:
            if blocs[-1]:
                blocs.append([])
            continue
        blocs[-1].append(ligne)
    return [' '.join(b) for b in blocs if b]


def date_iso(texte: str) -> str | None:
    m = re.search(r'(\d{1,2})(?:er)?\s+([a-zéû]+)\s+(\d{4})', texte.lower())
    if not m or m.group(2) not in MOIS:
        return None
    return f'{m.group(3)}-{MOIS[m.group(2)]:02d}-{int(m.group(1)):02d}'


def tableaux_du_montant(doc, code: str) -> list[list[list[str]]]:
    """Les tableaux des pages qui portent la section 5, cellule par cellule."""
    out = []
    for page in doc:
        if 'Montant de certificats' not in page.get_text():
            continue
        try:
            trouves = page.find_tables()
        except Exception as e:  # pragma: no cover
            print(f'  ⚠ {code} : détection de tableaux impossible ({e})')
            return []
        for tb in trouves.tables:
            lignes = [[(c or '').replace('\n', ' ').strip() for c in r] for r in tb.extract()]
            lignes = [l for l in lignes if any(l)]
            if len(lignes) >= 2:
                out.append(lignes)
    return out


def extrait(code: str, pdf: Path, source: dict) -> dict:
    doc = fitz.open(pdf)
    t = norm('\n'.join(p.get_text() for p in doc))
    d: dict = {'code': code, 'pdf': source['pdf']}

    m = re.search(r"Opération n° ?" + re.escape(code) + r"\s*\n(.*?)\n\s*" + H1, t, re.S)
    d['intitule'] = ' '.join(m.group(1).split()) if m else source.get('intituleSource')

    s1 = entre(t, H1, H2)
    s2 = entre(t, H2, H3)
    s3 = entre(t, H3, H4)
    s4 = entre(t, H4, H5)
    s5 = entre(t, H5, ANNEXE)
    if s1: d['secteurApplication'] = ' '.join(paragraphes(s1))
    if s2:
        # La phrase d'abrogation vit dans la dénomination ; elle est portée à part.
        paras = [p for p in paragraphes(s2) if not p.lower().startswith('la présente fiche est abrogée')]
        d['denomination'] = paras
    if s3: d['conditions'] = paragraphes(s3)
    if s4:
        texte = ' '.join(paragraphes(s4))
        ans = sorted({int(x) for x in re.findall(r'(\d+)\s*ans', texte)})
        if ans:
            d['dureeVieAns'] = ans
        d['dureeVieTexte'] = texte
    if s5:
        tableaux = tableaux_du_montant(doc, code)
        # Les notes : ce qui, dans la section 5, n'est pas le texte des tableaux. Le texte brut
        # découpe les cellules autrement que la détection de tableaux (une cellule sur deux
        # lignes devient deux lignes), donc on compare par mots : un paragraphe dont les mots
        # sont presque tous dans les cellules est du tableau, pas une note.
        mots_cellules = {m for tb in tableaux for l in tb for c in l for m in re.findall(r'\w+', c.lower()) if len(m) > 1}
        def est_du_tableau(p: str) -> bool:
            mots = [m for m in re.findall(r'\w+', p.lower()) if len(m) > 1]
            return bool(mots) and sum(m in mots_cellules for m in mots) / len(mots) >= 0.7
        def est_une_ligne_de_chiffres(p: str) -> bool:
            jetons = p.split()
            return len(jetons) >= 3 and sum(bool(re.fullmatch(r'[\d\s,.\-–]+|H[123]', j)) for j in jetons) / len(jetons) >= 0.5
        # Une ligne faite de nombres hors de tout tableau détecté, c'est un tableau que la
        # détection a manqué : on ne la rend pas en prose, et on le dit.
        manques = [p for p in paragraphes(s5) if est_une_ligne_de_chiffres(p) and not est_du_tableau(p)]
        paras = [p for p in paragraphes(s5) if len(p) > 25 and not est_du_tableau(p) and not est_une_ligne_de_chiffres(p)]
        # Ce qui précède le premier tableau dans le document (« Pour un système de classe A : »)
        # est rendu avant lui, le reste après.
        premiere_cellule = next((c for tb in tableaux for l in tb for c in l if len(c) > 3), None)
        pos = s5.find(premiere_cellule.split(' ')[0]) if premiere_cellule else -1
        def uniques(liste):
            vus = set(); out = []
            for x in liste:
                if x not in vus:
                    vus.add(x); out.append(x)
            return out
        avant = uniques([p for p in paras if pos >= 0 and s5.find(p[:30]) != -1 and s5.find(p[:30]) < pos])
        apres = uniques([p for p in paras if p not in avant])
        d['bareme'] = {'tableaux': tableaux, 'avant': avant, 'notes': apres, 'incomplet': bool(manques) or not tableaux}

    ab = re.search(r'abrogée à compter du ([^.\n]+)', t)
    if ab:
        iso = date_iso(ab.group(1))
        if iso: d['dateAbrogation'] = iso
    v = re.search(r'\(v\.? ?A(\d+)[.\-](\d+)\)', t)
    d['version'] = f'A{v.group(1)}-{v.group(2)}' if v else source.get('versionSource')
    if source.get('dateApplication'):
        d['dateApplication'] = source['dateApplication']

    annexe = entre(t, ANNEXE, None) or ''
    justificatifs = []
    for ligne in annexe.split('\n'):
        ligne = ligne.strip()
        if ligne.startswith('*'):
            # « (ex : date d'acceptation du devis) » contient un deux-points : on retire les
            # parenthèses avant de couper sur le premier.
            sans_parentheses = re.sub(r'\([^)]*\)?', '', ligne.lstrip('*'))
            j = sans_parentheses.split(':')[0].strip(' .…')
            if j and j not in justificatifs:
                justificatifs.append(j)
    if justificatifs: d['justificatifs'] = justificatifs

    if re.search(r'signe de qualité|décret n° ?2014-812|\bRGE\b', s3 or ''):
        d['qualification'] = 'Professionnel RGE'
    return d


def main():
    sources = json.loads(MANIFESTE.read_text())
    details = {}
    incomplets = []
    for code, source in sorted(sources.items()):
        pdf = telecharge(code, source['pdf'])
        d = extrait(code, pdf, source)
        details[code] = d
        if not d.get('intitule') or not d.get('conditions'):
            incomplets.append(code)
    CIBLE.write_text(json.dumps(details, ensure_ascii=False, indent=1) + '\n')
    champs = ['intitule', 'secteurApplication', 'denomination', 'conditions', 'dureeVieAns', 'bareme',
              'version', 'dateApplication', 'dateAbrogation', 'justificatifs', 'qualification']
    print(f'{len(details)} fiches → {CIBLE}')
    for c in champs:
        print(f'  {c:20s} {sum(1 for d in details.values() if d.get(c))}')
    avec_tableau = sum(1 for d in details.values() if d.get('bareme', {}).get('tableaux'))
    print(f'  {"bareme.tableaux":20s} {avec_tableau}')
    if incomplets:
        print(f'⚠ {len(incomplets)} fiche(s) sans intitulé ou sans conditions, à écrire à la main : {", ".join(incomplets)}')


if __name__ == '__main__':
    main()
