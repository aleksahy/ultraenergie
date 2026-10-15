"""
La chronologie des fiches du POC, reconstituée depuis le Journal officiel par l'API Légifrance.

Phase 0 : on constitue l'encyclopédie des fiches, à la main ET par le code. Ce script fait la
part du code, par RÈGLES, sans modèle de langage, et dit précisément ce qui reste à la main.

Trois sources, de la plus sûre à la moins sûre :
  1. Les ARRÊTÉS du JO qui publient ou remplacent la fiche : leurs articles disent à partir de
     quand elle s'applique ; sans date écrite, le texte entre en vigueur le lendemain de sa
     publication.
  2. La VERSION CONSOLIDÉE de l'arrêté du 22 décembre 2014 (LEGITEXT000030077390) : une annexe
     par secteur (1 AGRI, 2 BAR, 3 BAT, 4 IND, 5 RES, 6 TRA), chacune avec ses versions datées
     et des notes « Conformément à l'article X de l'arrêté du …, la fiche … est remplacée ».
     Elle sert à TROUVER les versions et leur arrêté.
     ⚠️ SA DATE N'EST PAS LA DATE D'APPLICATION. Légifrance intègre une fiche quand l'arrêté entre
     en vigueur ; l'arrêté peut la rendre applicable plus tard (BAR-EN-101 A64-6 : intégrée le
     21/11/2024, applicable au 01/01/2025).
  3. Les PDF déposés par Alek (data/fiches/catalogue.json) : leur nom donne le numéro de
     version et une date, à confronter.

Pièges connus, tous rencontrés sur les 22 fiches :
  · « annexe 2 » a deux sens : l'annexe du résidentiel dans l'arrêté de 2014, et l'annexe de
    dépôt (tableau récapitulatif) de chaque fiche. Seul le second ne change pas la version.
  · Un arrêté peut porter une date par annexe : on retient la phrase qui vise l'annexe du
    secteur de la fiche dans l'arrêté de 2014, ou la lettre d'annexe donnée par la note.
  · Un arrêté peut remplacer une fiche publiée par un arrêté précédent et pas encore
    applicable : on remonte la chaîne jusqu'à une date.
  · La consolidation a des trous (fiche sans note, fiche absente avant une date) : les arrêtés
    du JO qui publient le texte de la fiche créent aussi des versions.
  · Ce que la règle ne sait pas trancher est marqué « à trancher », avec les candidats : c'est
    le travail à la main de la phase 0, pas un échec.

Trois niveaux d'exigence (décision d'Alek du 15/10/2026) :
  1. toutes les versions : la chronologie (numéro, dates, arrêté) ;
  2. versions applicables depuis le 1er janvier 2024 : en plus, le texte de la fiche ;
  3. version en vigueur et version à venir : en plus, les neuf informations et le visa d'Alek.

Sortie : data/fiches/chronologie/<CODE>.json, généré, lu par l'atelier.

Réseau : l'API Légifrance en DIRECT (compte PISTE, pas du scraping), 10 requêtes par seconde au
plus. Réponses en cache dans .cache/legifrance/ (non versionné). Identifiants dans .env.local.

Usage : npm run fiches:chronologie
"""
import datetime as dt
import hashlib
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ENV = Path('.env.local')
POC = Path('data/fiches/poc.txt')
CATALOGUE = Path('data/fiches/catalogue.json')
SORTIE = Path('data/fiches/chronologie')
CACHE = Path('.cache/legifrance')
BASE = 'https://api.piste.gouv.fr/dila/legifrance/lf-engine-app'
ARRETE_2014 = 'LEGITEXT000030077390'
NOR_ARRETE_2014 = 'DEVR1428341A'
ANNEXE_DU_SECTEUR = {'AGRI': 1, 'BAR': 2, 'BAT': 3, 'IND': 4, 'RES': 5, 'TRA': 6}
SEUIL_TEXTE = '2024-01-01'
AUJOURDHUI = dt.date.today().isoformat()

# ── Client ───────────────────────────────────────────────────────────────────

_jeton = {'v': None, 'exp': 0.0}
_dernier = [0.0]
APPELS = {'reseau': 0, 'cache': 0}


def identifiants():
    v = {}
    for l in ENV.read_text(encoding='utf-8').splitlines():
        m = re.match(r'^(PISTE_CLIENT_ID|PISTE_CLIENT_SECRET)=(.*)$', l)
        if m:
            v[m.group(1)] = m.group(2).strip().strip('"\'')
    if not v.get('PISTE_CLIENT_ID') or not v.get('PISTE_CLIENT_SECRET'):
        sys.exit('PISTE_CLIENT_ID ou PISTE_CLIENT_SECRET absent de .env.local')
    return v['PISTE_CLIENT_ID'], v['PISTE_CLIENT_SECRET']


def jeton():
    if _jeton['v'] and time.time() < _jeton['exp'] - 60:
        return _jeton['v']
    cid, sec = identifiants()
    corps = urllib.parse.urlencode({'grant_type': 'client_credentials', 'client_id': cid,
                                    'client_secret': sec, 'scope': 'openid'}).encode()
    with urllib.request.urlopen(urllib.request.Request('https://oauth.piste.gouv.fr/api/oauth/token', data=corps), timeout=30) as r:
        t = json.loads(r.read())
    _jeton.update(v=t['access_token'], exp=time.time() + t['expires_in'])
    return _jeton['v']


def appel(chemin, corps, cache=True):
    cle = hashlib.sha256((chemin + json.dumps(corps, sort_keys=True)).encode()).hexdigest()[:24]
    f = CACHE / chemin.strip('/').replace('/', '_') / f'{cle}.json'
    if cache and f.exists():
        APPELS['cache'] += 1
        return json.loads(f.read_text())
    for essai in range(4):
        attente = 0.1 - (time.time() - _dernier[0])
        if attente > 0:
            time.sleep(attente)
        _dernier[0] = time.time()
        req = urllib.request.Request(BASE + chemin, data=json.dumps(corps).encode(), headers={
            'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + jeton()})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                d = json.loads(r.read())
            APPELS['reseau'] += 1
            break
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and essai < 3:
                time.sleep(2 ** essai)
                continue
            raise SystemExit(f'{chemin} {json.dumps(corps)[:120]} : HTTP {e.code}')
        except (urllib.error.URLError, TimeoutError):
            if essai < 3:
                time.sleep(2 ** essai)
                continue
            raise
    if cache:
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps(d, ensure_ascii=False))
    return d


# ── Outils ───────────────────────────────────────────────────────────────────

def brut(h):
    t = html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))
    t = t.replace('’', "'").replace('\xa0', ' ').replace('º', '°')
    return ' '.join(t.split())


def jour(ms):
    return dt.datetime.fromtimestamp(ms / 1000, dt.timezone.utc).date().isoformat() if ms is not None else None


MOIS = {'janvier': 1, 'février': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6, 'juillet': 7,
        'août': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12}
DATE = r'\d{1,2}\s*(?:er)?\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}'


def date_fr(s):
    m = re.search(r'(\d{1,2})\s*(?:er)?\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})', s or '')
    return f'{m.group(3)}-{MOIS[m.group(2)]:02d}-{int(m.group(1)):02d}' if m else None


def lendemain(iso):
    return (dt.date.fromisoformat(iso) + dt.timedelta(days=1)).isoformat()


def veille(iso):
    return (dt.date.fromisoformat(iso) - dt.timedelta(days=1)).isoformat()


def num_article(n):
    return re.sub(r'\s*(?:er|ᵉʳ)$', '', (n or '').strip(), flags=re.I)


# « Fiche d'opération n° », « Fiche d'opération standardisée n° » ou « Opération n° » : la
# consolidation emploie les trois, selon l'époque de la note.
DEBUT_ENTREE = r"(?:Fiche d'opération(?:\s+standardisée)?|Opération)\s+n\s*°\s*"


def marqueur(code):
    return re.compile(DEBUT_ENTREE + re.escape(code) + r'\b')


AUTRE_FICHE = re.compile(DEBUT_ENTREE + r'([A-Z]{3,4}-[A-Z]{2}-\d{3})\b')

# L'annexe de DÉPÔT d'une fiche (tableau récapitulatif), à ne pas confondre avec l'annexe 2 de
# l'arrêté de 2014, qui est celle du résidentiel.
ANNEXE_DE_DEPOT = re.compile(r"annexes?\s+(?:(?:2|ii)\s+)?(?:de la (?:présente )?fiche|des fiches|à la fiche|de cette fiche)|tableaux? récapitulatifs?", re.I)


def version_citee(texte, code):
    v = re.search(re.escape(code) + r'\s*\(v\.?\s*(A\d+[.\-]\d+)\)', texte)
    return v.group(1).replace('.', '-') if v else None


# ── 1. La version consolidée ─────────────────────────────────────────────────

def annexes_du_jour():
    d = appel('/consult/legiPart', {'textId': ARRETE_2014, 'date': AUJOURDHUI}, cache=False)
    return {a['num']: a['id'] for s in d.get('sections') or [] for a in s.get('articles') or []
            if re.fullmatch(r'Annexe [1-6]', a.get('num') or '')}


def versions_annexe(id_courant):
    a = appel('/consult/getArticle', {'id': id_courant}, cache=False)
    out = []
    for v in sorted((a.get('article') or a).get('articleVersions') or [], key=lambda v: (v.get('dateDebut') or 0, v.get('id'))):
        art = appel('/consult/getArticle', {'id': v['id']})
        art = art.get('article') or art
        out.append({'id': v['id'], 'debut': jour(v.get('dateDebut')), 'fin': jour(v.get('dateFin')),
                    'etat': v.get('etat'), 'texte': brut(art.get('texteHtml') or art.get('texte') or art.get('content'))})
    return out


NOTE = re.compile(r"Conformément\s+(?:à|aux)\s+.*?(?=Conformément\s+(?:à|aux)\s|Vous pouvez consulter|$)|\(Abrogée à compter du [^)]*\)")


def entree(texte, code):
    m = marqueur(code).search(texte)
    if not m:
        return None
    suite = texte[m.end():]
    prochaine = next((x for x in AUTRE_FICHE.finditer(suite) if x.group(1) != code), None)
    corps = suite[:prochaine.start()] if prochaine else suite[:6000]
    corps = re.sub(r'\s-\s*[^/]{3,250}/\s*$', '', corps.strip())          # intitulé de la fiche suivante
    avant = texte[max(0, m.start() - 400):m.start()]
    t = re.search(r'(?:^|\s)-\s*([^/]{5,300}?)\s*/\s*$', avant)          # « - intitulé / »
    integral = bool(re.search(r"1\.\s*Secteur d'application", corps[:3000]))
    intitule = None
    if integral:
        i = re.search(r"^(.*?)\s*1\.\s*Secteur d'application", corps)
        intitule = i.group(1).strip() if i else None
    elif t:
        intitule = t.group(1).strip()
    if intitule:
        intitule = re.sub(r'^Opération\s+n\s*°\s*\S+\s*', '', intitule)
    return {'intitule': intitule, 'texteIntegral': integral, 'version': version_citee(corps, code),
            'notes': [' '.join(n.split()) for n in NOTE.findall(corps)]}


def analyse_note(note, code):
    m = re.search(r"article\s+(\d+)\s*(?:er)?\s+(?:de\s+)+l'arrêté du\s+(.*?)\s*\(NOR\s*:\s*([A-Z0-9]+)\)", note)
    sujet = note.lower()
    avant_verbe = re.split(r'remplac|ajout|abrog|supprim', sujet, maxsplit=1)[0]
    if re.search(r'abrogée|supprimée', sujet):
        effet = 'fiche abrogée'
    elif ANNEXE_DE_DEPOT.search(avant_verbe):
        effet = 'annexe de dépôt ajoutée' if 'ajout' in sujet else 'annexe de dépôt remplacée'
    elif 'remplac' in sujet and 'fiche' in avant_verbe:
        effet = 'fiche remplacée'
    elif 'ajout' in sujet:
        effet = 'ajout'
    else:
        effet = 'autre'
    lettre = re.search(r"(?:à l'annexe|en annexe|figurant en annexe|présente à l'annexe)\s+([A-Z])\b", note)
    return {'article': m.group(1) if m else None, 'arrete': date_fr(m.group(2)) if m else None,
            'nor': m.group(3) if m else None, 'effet': effet, 'lettre': lettre.group(1) if lettre else None,
            'aCompterDu': date_fr(note.split('compter du', 1)[1]) if 'compter du' in note else None, 'texte': note[:600]}


def periodes(versions, code):
    out = []
    for v in versions:
        e = entree(v['texte'], code)
        sig = json.dumps(e, sort_keys=True, ensure_ascii=False) if e else 'absente'
        mort = v['etat'] == 'MODIFIE_MORT_NE'
        if out and not mort and not out[-1]['morteNee'] and out[-1]['_sig'] == sig:
            out[-1]['fin'] = v['fin']
            out[-1]['versionsAnnexe'].append(v['id'])
            continue
        out.append({'debut': v['debut'], 'fin': v['fin'], 'morteNee': mort, 'presente': e is not None,
                    'entree': e, 'versionsAnnexe': [v['id']], '_sig': sig})
    for p in out:
        p.pop('_sig')
        if p['fin'] == '2999-01-01':
            p['fin'] = None
    return out


# ── 2. Le JO ─────────────────────────────────────────────────────────────────

def textes_qui_citent(code):
    out, page = [], 1
    while True:
        r = appel('/search', {'fond': 'JORF', 'recherche': {
            'champs': [{'typeChamp': 'ALL', 'operateur': 'ET', 'criteres': [{'typeRecherche': 'EXACTE', 'valeur': code, 'operateur': 'ET'}]}],
            'filtres': [], 'pageNumber': page, 'pageSize': 100, 'operateur': 'ET', 'sort': 'PERTINENCE', 'typePagination': 'DEFAUT'}}, cache=False)
        res = r.get('results') or []
        out += res
        if len(out) >= (r.get('totalResultNumber') or 0) or not res:
            return out
        page += 1


def blocs(n):
    if isinstance(n, dict):
        if n.get('content'):
            yield n.get('num'), brut(n['content'])
        for v in n.values():
            if isinstance(v, (dict, list)):
                yield from blocs(v)
    elif isinstance(n, list):
        for x in n:
            yield from blocs(x)


_arretes = {}


def arrete(nor):
    """Un arrêté du JO : publication, date du texte, titre, articles, tout son texte."""
    if nor not in _arretes:
        d = appel('/consult/getJoWithNor', {'nor': nor})
        tout = list(blocs(d))
        _arretes[nor] = {
            'nor': nor, 'cid': d.get('cid'), 'titre': brut(d.get('title')),
            'publication': jour(d.get('dateParution')), 'dateTexte': jour(d.get('dateTexte')),
            'articles': [(num_article(a.get('num')), brut(a.get('content'))) for a in d.get('articles') or []],
            'tout': ' '.join(x for _, x in tout),
            'image': any('fac-similé' in x or 'avec ses images' in x for _, x in tout),
        }
    return _arretes[nor]


def fiche_en_texte(a, code):
    return bool(re.search(marqueur(code).pattern + r".{0,400}?1\.\s*Secteur d'application", a['tout']))


def nature(a, code):
    t = a['tout'].lower() + ' ' + a['titre'].lower()
    if fiche_en_texte(a, code):
        return 'publie la fiche'
    phrases = ' '.join(ph for _, x in a['articles'] for ph in re.split(r'(?<=\.)\s+', x) if code in ph).lower()
    if re.search(r'remplacent les fiches|sont ajoutées à l.annexe|est complétée par les fiches', t) and a['image']:
        return 'publie peut-être la fiche, en image'
    if re.search(r'abrog|supprim', phrases):
        return 'abrogation possible'
    if ANNEXE_DE_DEPOT.search(phrases or t):
        return 'annexe de dépôt'
    if re.search(r'bonification|multiplié|coup de pouce', phrases or t):
        return 'bonification'
    if 'contrôle' in (phrases or t):
        return 'contrôles'
    if re.search(r'programme|cumulable', phrases or t):
        return 'programme ou cumul'
    return 'autre'


# ── 3. La date d'application d'une fiche publiée par un arrêté ───────────────

A_COMPTER = re.compile(r'(?:à compter du|à partir du)\s+(' + DATE + ')')
VISE = re.compile(r"annexe\s+(\d|[A-Z])\s+(?:à|de)\s+l'\s?arrêté du\s+(" + DATE + ')')


def phrases_de(a):
    return [(n, ph) for n, x in a['articles'] for ph in re.split(r'(?<=\.)\s+(?=[A-ZÀ-Ý«])', x)]


def publie_des_fiches(ph):
    """Une phrase qui publie des fiches : « les fiches … figurant en annexe B au présent arrêté
    remplacent … », « l'annexe 2 de l'arrêté du 22 décembre 2014 est complétée par les fiches
    … figurant à l'annexe 5 du présent arrêté ». Pas une phrase qui remplace une annexe de dépôt,
    ni un article de l'arrêté « modalités »."""
    # « au présent arrêté », ou une annexe désignée par une LETTRE (« figurant en annexe A ») : les
    # annexes à lettre sont toujours celles de l'arrêté lui-même (arrêté du 17 décembre 2021).
    if not (re.search(r'(?:présent|dudit) arrêté', ph) or re.search(r"(?:figurant|figurent)\s+(?:en|à l')\s*annexe\s+[A-Z]\b", ph)) or not re.search(r'fiches?', ph):
        return False
    m = re.search(r'remplac|complété|ajouté|inséré', ph)
    if not m:
        return False
    return not ANNEXE_DE_DEPOT.search(ph[:m.start()]) and bool(re.search(r'fiches?', ph[:m.start()] + ph[m.end():m.end() + 60]))


def annexe_ici(ph):
    """L'annexe du présent arrêté dont parle la phrase : « figurant en annexe B au présent arrêté »."""
    m = re.search(r"(?:en|à l'|à l')\s*annexe\s+(\w+)\s+(?:au|du|de ce) présent arrêté", ph) or \
        re.search(r"figurant (?:en|à l')\s*annexe\s+(\w+)\b", ph)
    return m.group(1) if m else None


def couvre_annexe(ph, a_ici):
    """Une phrase de date qui vise « les annexes 1 à 6 », « l'annexe 3 », « les annexes 7 et 8 »."""
    if not a_ici:
        return None
    vues = set()
    for x, y in re.findall(r'annexes?\s+(\d+)\s+à\s+(\d+)', ph):
        vues |= {str(k) for k in range(int(x), int(y) + 1)}
    for grp in re.findall(r'annexes?\s+((?:[A-Z\d]+(?:\s*,\s*|\s+et\s+))*[A-Z\d]+)\b', ph):
        vues |= set(re.findall(r'[A-Z\d]+', grp))
    return (a_ici in vues) if vues else None


def arrete_du(date_iso, textes):
    """Le NOR de l'arrêté d'une date donnée parmi les textes qui citent la fiche."""
    for t in textes:
        a = arrete(t['nor'])
        if a['dateTexte'] == date_iso and a['titre'].lower().startswith('arrêté'):
            return t['nor']
    return None


def date_application(nor, code, lettre, textes, profondeur=0, creation=False):
    """
    À partir de quand la fiche publiée par cet arrêté s'applique. Rend la date, sa source, et
    son genre : « article », « lendemain », « chaîne », « à trancher ».
    """
    a = arrete(nor)
    n_secteur = str(ANNEXE_DU_SECTEUR[code.split('-')[0]])
    rempl = [(n, ph) for n, ph in phrases_de(a) if publie_des_fiches(ph)]
    def vise_2014(ph):
        return any(x == n_secteur and date_fr(d) == '2014-12-22' for x, d in VISE.findall(ph)) or \
            bool(re.search(r"annexe\s+" + n_secteur + r"\s+de l'arrêté du 22 décembre 2014", ph))
    choix = [(n, ph) for n, ph in rempl if code in ph]
    pourquoi = 'cite la fiche'
    if not choix and lettre:
        choix = [(n, ph) for n, ph in rempl if re.search(r'annexe\s+' + lettre + r'\b', ph)]
        pourquoi = f'vise l’annexe {lettre}'
    if not choix:
        choix = [(n, ph) for n, ph in rempl if vise_2014(ph)]
        pourquoi = f'vise l’annexe {n_secteur} de l’arrêté de 2014'
    if not choix and len(rempl) == 1:
        choix, pourquoi = rempl, 'seule phrase de remplacement'
    # Une création se lit dans une phrase qui COMPLÈTE ou AJOUTE, pas dans celle qui remplace les
    # fiches existantes de la même annexe (arrêté du 17 décembre 2021 : art. 2 remplace, art. 3 complète).
    if creation and len(choix) > 1:
        ajouts = [(n, ph) for n, ph in choix if re.search(r'complété|ajouté|inséré', ph)]
        if ajouts:
            choix, pourquoi = ajouts, pourquoi + ', phrase de création'
    if not choix and nor == NOR_ARRETE_2014:
        return {'date': '2015-01-01', 'genre': 'article', 'source': "arrêté du 22 décembre 2014, en vigueur au 1er janvier 2015"}
    if not choix:
        return {'date': None, 'genre': 'à trancher', 'source': f'aucune phrase de cet arrêté ne vise clairement la fiche ({len(rempl)} phrases de remplacement)',
                'candidats': [f'art. {n} : {ph[:200]}' for n, ph in rempl][:6]}
    dates = sorted({date_fr(x) for _, ph in choix for x in A_COMPTER.findall(ph)})
    if len(dates) == 1:
        n, ph = next((n, ph) for n, ph in choix if A_COMPTER.search(ph))
        return {'date': dates[0], 'genre': 'article', 'source': f'art. {n} ({pourquoi}) : « {ph[:200]} »'}
    if len(dates) > 1:
        return {'date': None, 'genre': 'à trancher', 'source': f'{len(dates)} dates dans les phrases retenues ({pourquoi})',
                'candidats': [f'art. {n} : {ph[:200]}' for n, ph in choix][:6]}
    # Sans date dans la phrase : une phrase de date qui vise cet article, cette annexe, ou cette
    # fiche par son code. Pas celles qui parlent du dépôt (tableaux récapitulatifs, demandes).
    nums = {n for n, _ in choix}
    ici = {annexe_ici(ph) for _, ph in choix} - {None}
    DATE_VIGUEUR = re.compile(r"(?:entre(?:nt)? en vigueur|applicables?|s'applique(?:nt)?)[^.]{0,160}?(?:à compter du|à partir du|le)\s+(" + DATE + r")")
    for n, ph in phrases_de(a):
        if ANNEXE_DE_DEPOT.search(ph) or re.search(r'demandes? de certificats|faisant l.objet d.un dépôt', ph):
            continue
        codes_cites = set(re.findall(r'[A-Z]{3,4}-[A-Z]{2}-\d{3}', ph))
        if codes_cites and code not in codes_cites:
            continue
        m = DATE_VIGUEUR.search(ph)
        if not m:
            if re.search(r"applicables?[^.]{0,160}engagées à partir de l.entrée en vigueur du présent arrêté", ph):
                if any(couvre_annexe(ph, x) for x in ici) or code in codes_cites:
                    return {'date': lendemain(a['publication']), 'genre': 'lendemain', 'source': f'art. {n} : « {ph[:200]} »'}
            continue
        par_annexe = [couvre_annexe(ph, x) for x in ici]
        if code in codes_cites or any(par_annexe):
            return {'date': date_fr(m.group(1)), 'genre': 'article', 'source': f'art. {n} : « {ph[:200]} »'}
        if any(x is False for x in par_annexe):
            continue
        vise = set()
        for x, y in re.findall(r'articles?\s+(\d+)\s*(?:er)?\s+à\s+(\d+)', ph):
            vise |= {str(k) for k in range(int(x), int(y) + 1)}
        vise |= set(re.findall(r"(?:\barticles?|,|\bet|de l'article|du I+ de l'article)\s+(\d+)\s*(?:er)?\b", ph))
        if (not vise and not re.search(r'\bannexes?\b', ph)) or nums & vise:
            return {'date': date_fr(m.group(1)), 'genre': 'article', 'source': f'art. {n} : « {ph[:200]} »'}
    # Une fiche qui en remplace une autre pas encore applicable : on remonte la chaîne.
    for n, ph in choix:
        for x, d in VISE.findall(ph):
            if date_fr(d) != '2014-12-22' and profondeur < 3:
                autre = arrete_du(date_fr(d), textes)
                if autre:
                    r = date_application(autre, code, x if x.isalpha() else None, textes, profondeur + 1)
                    if r['date']:
                        return {'date': r['date'], 'genre': 'chaîne',
                                'source': f'art. {n} remplace la fiche de l’arrêté du {date_fr(d)} ({autre}), qui s’applique : {r["source"][:160]}'}
    return {'date': lendemain(a['publication']), 'genre': 'lendemain',
            'source': f'aucune date dans l’arrêté : lendemain de la publication au JO du {a["publication"]}'}


# ── 4. Les versions ──────────────────────────────────────────────────────────

def modificateurs(id_version_annexe):
    """Les arrêtés (NOR) qui ont produit une version d'annexe, d'après ses liens Légifrance."""
    a = appel('/consult/getArticle', {'id': id_version_annexe})
    a = a.get('article') or a
    out = []
    for l in a.get('lienModifications') or []:
        if l.get('linkType') == 'MODIFIE' and l.get('textCid'):
            d = appel('/consult/jorf', {'textCid': l['textCid']})
            if d.get('nor') and d['nor'] not in out:
                out.append(d['nor'])
    return out


def versions_de_fiche(code, pers, textes, docs):
    # Les notes consolidées, dédoublonnées ; une note vue dans une version mort-née puis dans
    # une version réelle compte comme réelle.
    evts = {}
    for p in pers:
        for n in (p['entree'] or {}).get('notes', []):
            e = analyse_note(n, code)
            cle = (e['nor'], e['effet'], e['aCompterDu'])
            if cle in evts and not evts[cle]['morteNee']:
                continue
            e.update(vuDansLaPeriode=p['debut'], morteNee=p['morteNee'])
            evts[cle] = e
    evts = sorted(evts.values(), key=lambda e: e['aCompterDu'] or e['vuDansLaPeriode'])

    # Les candidats : (nor, version, date de consolidation, lettre, date de la note, origine)
    cands = []
    def ajoute(**k):
        for c in cands:
            if (k.get('nor') and c['nor'] == k['nor']) or (k.get('version') and c['version'] == k['version']):
                for cle, val in k.items():
                    if val and not c.get(cle):
                        c[cle] = val
                if k.get('nor') and k['nor'] != c['nor']:
                    c.setdefault('republiePar', []).append(k['nor'])
                c['origines'].append(k['origine'])
                return
        cands.append({'nor': k.get('nor'), 'version': k.get('version'), 'consolidation': k.get('consolidation'),
                      'lettre': k.get('lettre'), 'noteDate': k.get('noteDate'), 'origines': [k['origine']]})

    for e in evts:
        if e['effet'] == 'fiche remplacée' and e['nor']:
            art = next((x for n, x in arrete(e['nor'])['articles'] if n == e['article']), '')
            morceaux = re.split(r'\s(?=[IVX]+\.\s?-)', art)            # « I. - … II. - … »
            du_code = [x for x in morceaux if code in x]
            def depot(x):
                m = re.search(r'remplac|ajout', x)
                return bool(m and ANNEXE_DE_DEPOT.search(x[:m.start()]))
            if du_code and all(depot(x) for x in du_code):
                e['effet'] = 'annexe de dépôt remplacée (la note consolidée dit « fiche »)'
    for e in evts:
        if e['effet'] == 'fiche remplacée' and not e['morteNee']:
            v = version_citee(arrete(e['nor'])['tout'], code) if e['nor'] else None
            ajoute(nor=e['nor'], version=v, consolidation=e['vuDansLaPeriode'], lettre=e['lettre'], noteDate=e['aCompterDu'],
                   origine=f"note consolidée (art. {e['article']} de l'arrêté du {e['arrete']})")
    precedente = None
    for p in pers:
        if p['morteNee'] or not p['entree'] or not p['entree']['version']:
            continue
        if p['entree']['version'] != precedente:
            precedente = p['entree']['version']
            ajoute(version=precedente, consolidation=p['debut'], origine='texte intégral consolidé')
    for t in textes:
        if t['nature'] == 'publie la fiche':
            ajoute(nor=t['nor'], version=t['versionCitee'], origine='arrêté du JO qui publie la fiche')
    # La création : la première apparition dans la consolidation, rattachée à un arrêté.
    premiere = next((p for p in pers if p['presente']), None)
    if premiere and not any(c['consolidation'] == premiere['debut'] for c in cands):
        if premiere['debut'] == '2015-01-01':
            nor, origine = NOR_ARRETE_2014, 'création : arrêté du 22 décembre 2014'
        else:
            mods = modificateurs(premiere['versionsAnnexe'][0])
            citant = [n for n in mods if code in arrete(n)['tout']]
            nor = (citant or mods or [None])[0]
            origine = ('création : texte qui a produit la version d’annexe où la fiche apparaît'
                       + (f' ({len(mods)} textes, choisi parmi ceux qui la citent)' if len(mods) > 1 and citant else
                          f' ({len(mods)} textes, le premier faute de mieux : À VÉRIFIER)' if len(mods) > 1 else ''))
        ajoute(nor=nor, consolidation=premiere['debut'], origine=origine)

    versions = []
    for c in cands:
        v = {'version': c['version'], 'nor': c['nor'], 'republiePar': c.get('republiePar', []),
             'integreeLe': c['consolidation'], 'origines': c['origines']}
        if c['nor']:
            r = date_application(c['nor'], code, c['lettre'], textes, creation=any(o.startswith('création') for o in c['origines']))
            if r['date'] is None and c['noteDate']:
                r = {'date': c['noteDate'], 'genre': 'note', 'source': 'date écrite dans la note consolidée', 'candidats': r.get('candidats')}
            a = arrete(c['nor'])
            v.update(debut=r['date'], genreDate=r['genre'], sourceDate=r['source'], candidats=r.get('candidats'),
                     arrete={'nor': a['nor'], 'cid': a['cid'], 'titre': a['titre'], 'publication': a['publication']},
                     texteAuJo=fiche_en_texte(a, code) or any(fiche_en_texte(arrete(n), code) for n in v['republiePar']),
                     annexeEnImage=a['image'])
            v['version'] = v['version'] or version_citee(a['tout'], code)
        elif c['noteDate']:
            v.update(debut=c['noteDate'], genreDate='note', sourceDate='date écrite dans la note consolidée, arrêté non identifié', arrete=None, texteAuJo=False)
        else:
            v.update(debut=None, genreDate='à trancher', sourceDate='arrêté non identifié', arrete=None, texteAuJo=False)
        if not v['debut'] and v['version']:
            d = next((d for d in docs if d['code'] == code and d['version'] == v['version'] and d['du']), None)
            if d:
                v.update(debut=d['du'], genreDate='PDF, à confirmer',
                         sourceDate=f"date du nom du PDF déposé ; la règle n'a pas tranché : {v['sourceDate'][:140]}")
        versions.append(v)
    # Une version sans date de début ne peut pas être placée : on la garde à part, à trancher.
    datees = sorted([v for v in versions if v['debut']], key=lambda v: (v['debut'], v['version'] or ''))
    # Deux candidats tombés à la même date et au même numéro sont la même version.
    fusion = []
    for v in datees:
        if fusion and fusion[-1]['debut'] == v['debut'] and (not v['version'] or not fusion[-1]['version'] or fusion[-1]['version'] == v['version']):
            f = fusion[-1]
            f['version'] = f['version'] or v['version']
            f['origines'] += v['origines']
            if v['nor'] and v['nor'] != f['nor']:
                f['republiePar'].append(v['nor'])
            f['texteAuJo'] = f['texteAuJo'] or v['texteAuJo']
            continue
        fusion.append(v)
    for i, v in enumerate(fusion):
        v['fin'] = veille(fusion[i + 1]['debut']) if i + 1 < len(fusion) else None
    abrog = [e for e in evts if e['effet'] == 'fiche abrogée' and e['aCompterDu']]
    if abrog and fusion:
        fusion[-1]['fin'] = veille(abrog[0]['aCompterDu'])
        fusion[-1]['finSource'] = 'abrogation notée dans la consolidation'
    fin_consolidee = next((p['debut'] for p in pers if not p['presente'] and premiere and premiere['debut'] < p['debut'] < '2999-01-01'), None)
    if fin_consolidee and fusion and not abrog:
        fusion[-1]['fin'] = veille(fin_consolidee)
        fusion[-1]['finSource'] = 'disparition de la version consolidée'
    # Numéro de version donné par un PDF déposé dont la date tombe pile au début.
    for v in fusion:
        if not v['version']:
            d = next((d for d in docs if d['code'] == code and d['du'] == v['debut'] and d['version']), None)
            if d:
                v['version'] = d['version']
                v['versionSource'] = 'nom du PDF déposé'
        elif 'versionSource' not in v:
            v['versionSource'] = 'texte du JO'
    sans_date = [v for v in versions if not v['debut']]
    return fusion, sans_date, evts


# ── 5. Ce qui manque, par niveau ─────────────────────────────────────────────

def niveau(v):
    if (v['debut'] <= AUJOURDHUI and (not v['fin'] or AUJOURDHUI <= v['fin'])) or v['debut'] > AUJOURDHUI:
        return 3
    if not v['fin'] or v['fin'] >= SEUIL_TEXTE:
        return 2
    return 1


def manques(v, code, docs):
    m = []
    # Niveau 1 : le numéro est souhaité, pas exigé (« numéro si on le connaît »).
    if not v['version'] and v['niveau'] >= 2:
        m.append(f"numéro de version à confirmer : {v['versionProposee']} ({v.get('versionProposeeSource', 'proposé')})" if v.get('versionProposee') else 'numéro de version inconnu')
    if v['genreDate'] not in ('article', 'lendemain', 'chaîne'):
        m.append('date d’application à confirmer' if v['genreDate'] == 'PDF, à confirmer' else 'date d’application sûre')
    if not v['nor']:
        m.append('arrêté')
    num = v['version'] or v.get('versionProposee')
    pdf = next((d for d in docs if d['code'] == code and num and d['version'] == num), None)
    v['pdf'] = Path(pdf['fichier']).name if pdf else None
    if v['niveau'] >= 2 and not v.get('texteAuJo') and not pdf:
        m.append('texte de la fiche (PDF du ministère)')
    if v['niveau'] == 3:
        m += ['neuf informations', 'visa d’Alek']
    return m


def confronte(code, versions, docs):
    out = []
    for d in docs:
        if d['code'] != code:
            continue
        v = next((v for v in versions if d['version'] and v['version'] == d['version']), None)
        v = v or next((v for v in versions if d['du'] and v['debut'] <= d['du'] and (not v['fin'] or d['du'] <= v['fin'])), None)
        ecarts = []
        if not v:
            ecarts.append('aucune version du JO ne correspond')
        else:
            if d['du'] and v['debut'] != d['du']:
                ecarts.append(f"début JO {v['debut']} ≠ nom du PDF {d['du']}")
            if v['version'] and d['version'] and v['version'] != d['version']:
                ecarts.append(f"version JO {v['version']} ≠ PDF {d['version']}")
        out.append({'pdf': Path(d['fichier']).name, 'versionPdf': d['version'], 'duPdf': d['du'],
                    'versionJo': v['version'] if v else None, 'debutJo': v['debut'] if v else None, 'ecarts': ecarts})
    return out


def rangs_des_arretes(toutes):
    """Le rang de chaque arrêté, lu dans les numéros connus : « A65-2 » publié par ECOR2435303A
    dit que cet arrêté est le 65e. Un arrêté qui reçoit deux rangs différents n'en reçoit aucun."""
    vus = {}
    for versions in toutes.values():
        for v in versions:
            m = re.fullmatch(r'A(\d+)-\d+', v.get('version') or '')
            if m and v.get('nor') and v.get('versionSource') != 'proposée':
                vus.setdefault(v['nor'], set()).add(int(m.group(1)))
    return {nor: r.pop() for nor, r in vus.items() if len(r) == 1}


def controle_et_propositions(versions, rangs, pdfs):
    """Le second nombre du numéro est le rang de la version dans la vie de la fiche : A73-3 est la
    troisième. S'il ne tombe pas sur la position trouvée, la chronologie a un trou ou un doublon.
    Pour une version sans numéro, on propose A{rang de l'arrêté}-{position}, à confirmer.

    Republication : une version sans numéro suivie d'une version numérotée qui dit occuper SA
    position (BAR-TH-171 : créée en octobre 2023 sans numéro lisible, republiée en décembre 2023
    sous « A55-1 ») sont une seule version. On garde la première date, et la seconde publication
    est notée comme republication, à vérifier.
    """
    i = 1
    while i < len(versions):
        prec, v = versions[i - 1], versions[i]
        m = re.fullmatch(r'A(\d+)-(\d+)', v.get('version') or '')
        if m and not prec.get('version') and int(m.group(2)) == i:
            prec['version'] = v['version']
            prec['versionSource'] = 'numéro de sa republication'
            prec['republications'] = prec.get('republications', []) + [{
                'nor': v.get('nor'), 'appliqueeLe': v['debut'], 'source': v['sourceDate'][:200]}]
            prec['fin'] = v['fin']
            prec['manquesAVerifier'] = 'republiée sous le même numéro : même texte, ou version corrigée ?'
            del versions[i]
            continue
        i += 1
    # Un PDF dont le nom ne donne que l'arrêté (« A35 ») : rattaché à la version en vigueur s'il est
    # le seul PDF sans version correspondante et qu'elle est la seule sans numéro.
    seuls = [d for d in pdfs if re.fullmatch(r'A\d+', d['version'] or '')]
    courantes = [v for v in versions if not v.get('version') and v['debut'] <= AUJOURDHUI and (not v['fin'] or AUJOURDHUI <= v['fin'])]
    if len(seuls) == 1 and len(courantes) == 1:
        courantes[0]['versionProposee'] = seuls[0]['version']
        courantes[0]['versionProposeeSource'] = 'PDF déposé, seul candidat (son nom ne donne pas la position)'
    for i, v in enumerate(versions):
        m = re.fullmatch(r'A(\d+)-(\d+)', v.get('version') or '')
        if m and int(m.group(2)) != i + 1:
            ecart = int(m.group(2)) - (i + 1)
            v['incoherence'] = (f"le numéro {v['version']} dit {m.group(2)}e version, le script la trouve en position {i + 1} : "
                                + (f"il manque {ecart} version(s) avant" if ecart > 0 else f"{-ecart} version(s) en trop avant (republication ?)"))
        if not v.get('version') and not v.get('versionProposee'):
            d = next((d for d in pdfs if re.fullmatch(r'A\d+-(\d+)', d['version'] or '') and int(d['version'].split('-')[1]) == i + 1), None)
            if d:
                v['versionProposee'] = d['version']
                v['versionProposeeSource'] = f'PDF déposé, {i + 1}e version'
                continue
        if not v.get('version') and v.get('nor') in rangs and not v.get('versionProposee'):
            v['versionProposee'] = f"A{rangs[v['nor']]}-{i + 1}"
            v['versionProposeeSource'] = 'rang de l’arrêté × position dans la chronologie'


def main():
    codes = [l.strip() for l in POC.read_text().splitlines() if l.strip() and not l.startswith('#')]
    docs = json.loads(CATALOGUE.read_text())['documents'] if CATALOGUE.exists() else []
    SORTIE.mkdir(parents=True, exist_ok=True)
    annexes = annexes_du_jour()
    versions_annexes = {}
    for num in sorted({f"Annexe {ANNEXE_DU_SECTEUR[c.split('-')[0]]}" for c in codes}):
        versions_annexes[num] = versions_annexe(annexes[num])
    fiches = {}
    for code in codes:
        num = f"Annexe {ANNEXE_DU_SECTEUR[code.split('-')[0]]}"
        pers = periodes(versions_annexes[num], code)
        textes = []
        for x in sorted(textes_qui_citent(code), key=lambda x: x.get('datePublication') or ''):
            if not x.get('nor'):
                continue
            a = arrete(x['nor'])
            textes.append({'publication': a['publication'], 'nor': x['nor'], 'cid': a['cid'], 'titre': a['titre'],
                           'nature': nature(a, code), 'versionCitee': version_citee(a['tout'], code), 'annexeEnImage': a['image']})
        versions, sans_date, evts = versions_de_fiche(code, pers, textes, docs)
        intitule = next((p['entree']['intitule'] for p in reversed(pers) if p['entree'] and p['entree']['intitule']), None)
        fiches[code] = {'code': code, 'intitule': intitule, 'annexe': num, 'genereLe': AUJOURDHUI, 'versions': versions,
                        'versionsSansDate': sans_date, 'textesDuJo': textes, 'notesConsolidees': evts, 'periodesConsolidees': pers}
    # Second passage : ce qu'on apprend d'une fiche sert aux autres (rang des arrêtés).
    rangs = rangs_des_arretes({c: f['versions'] for c, f in fiches.items()})
    bilan = {}
    for code, f in fiches.items():
        controle_et_propositions(f['versions'], rangs, [d for d in docs if d['code'] == code])
        for v in f['versions']:
            v['niveau'] = niveau(v)
            v['manques'] = manques(v, code, docs)
            if v.get('incoherence'):
                v['manques'].insert(0, 'chronologie : ' + v['incoherence'])
            if v.get('manquesAVerifier'):
                v['manques'].insert(0, 'à vérifier : ' + v['manquesAVerifier'])
            bilan[v['genreDate']] = bilan.get(v['genreDate'], 0) + 1
        f['confrontationPdf'] = confronte(code, f['versions'], docs)
        json.dump(f, open(SORTIE / f'{code}.json', 'w'), ensure_ascii=False, indent=1)
        trous = sum(1 for v in f['versions'] for m in v['manques'] if m not in ('neuf informations', 'visa d’Alek'))
        print(f"{code:12} {len(f['versions']):2} version(s){f' + {len(f['versionsSansDate'])} sans date' if f['versionsSansDate'] else ''}, trous hors niveau 3 : {trous}", flush=True)
    json.dump({'genereLe': AUJOURDHUI, 'rangsDesArretes': rangs}, open(SORTIE / '_rangs.json', 'w'), ensure_ascii=False, indent=1)
    print('\nversions par origine de date : ' + ', '.join(f'{k} {v}' for k, v in sorted(bilan.items(), key=lambda kv: -kv[1])))
    print(f"rangs d'arrêtés connus : {len(rangs)} ; appels réseau {APPELS['reseau']}, lus en cache {APPELS['cache']} → {SORTIE}/")


if __name__ == '__main__':
    main()
