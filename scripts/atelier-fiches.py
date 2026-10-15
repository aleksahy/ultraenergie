"""
L'atelier des fiches : une page JETABLE en localhost, à gauche le PDF, à droite ce que la
chaîne en a tiré. Elle sert à itérer sur l'extraction en voyant les deux côte à côte.

⚠️ CE N'EST PAS UNE PAGE DU SITE. Aucun lien avec Next, le registre des routes ou le build :
un petit serveur Python qui relit data/fiches/catalogue.json et les .txt à chaque requête,
donc relancer scripts/extrait-fiches.py puis rafraîchir suffit.

Usage : python3 scripts/atelier-fiches.py   puis http://localhost:8790/
"""
import html
import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = 8790
CATALOGUE = Path('data/fiches/catalogue.json')
CHRONO = Path('data/fiches/chronologie')

NOMS_SECTIONS = {
    'secteur': "1. Secteur d'application", 'denomination': '2. Dénomination',
    'conditions': '3. Conditions', 'duree': '4. Durée de vie', 'montant': '5. Montant',
    'annexe1': 'Annexe 1, Partie A', 'annexe2': 'Annexe 2',
}

STYLE = """
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 14px/1.5 -apple-system, "Helvetica Neue", Arial, sans-serif; color: #1a1a1a; background: #fff; }
  a { color: #4C8C2B; }
  .barre { display: flex; gap: 16px; align-items: center; padding: 10px 16px; border-bottom: 1px solid #ddd; background: #fafafa; position: sticky; top: 0; }
  .barre select { font: inherit; }
  .barre .nav a { margin-right: 10px; }
  .deux { display: grid; grid-template-columns: 1fr 1fr; height: calc(100vh - 49px); }
  .gauche { border-right: 1px solid #ddd; }
  .gauche iframe { width: 100%; height: 100%; border: 0; }
  .droite { overflow: auto; padding: 16px 20px 60px; }
  h2 { font-size: 15px; margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #eee; }
  h2:first-child { margin-top: 0; }
  table { border-collapse: collapse; font-size: 13px; }
  td, th { text-align: left; padding: 3px 12px 3px 0; vertical-align: top; }
  th { color: #666; font-weight: 500; white-space: nowrap; }
  pre { white-space: pre-wrap; font: 13px/1.5 ui-monospace, Menlo, monospace; background: #f6f6f6; padding: 10px 12px; border-radius: 6px; margin: 0; }
  .alerte { color: #a33; }
  .ok { color: #4C8C2B; }
  .gris { color: #888; }
  .index td a { font-weight: 600; }
  .index { padding: 20px; }
  .chrono { padding: 20px 24px 60px; max-width: 1400px; }
  .chrono table { width: 100%; margin-bottom: 8px; }
  .chrono td, .chrono th { border-bottom: 1px solid #eee; padding: 6px 10px 6px 0; }
  .n3 { background: #f1f7ec; }
  .manque { color: #a33; }
  .petit { font-size: 12px; }
  .pastille { display: inline-block; padding: 1px 8px; border-radius: 10px; background: #eee; font-size: 12px; }
  .pastille.ok { background: #e3f0da; color: #2f6b12; }
  .pastille.ko { background: #f6dede; color: #a33; }
  details summary { cursor: pointer; color: #555; }
</style>
"""


def charge():
    return json.loads(CATALOGUE.read_text())['documents']


def h(s):
    return html.escape(str(s if s is not None else '—'))


def page_index(docs):
    lignes = []
    for i, d in enumerate(docs):
        vig = '<span class="ok">en vigueur</span>' if d['enVigueur'] else ('<span class="gris">non</span>' if d['enVigueur'] is False else '<span class="alerte">?</span>')
        alertes = []
        if d['ossature']['manquants']: alertes.append('manque ' + ', '.join(d['ossature']['manquants']))
        if d['versionSource'] and d['versionSource'] != 'texte': alertes.append('version depuis ' + d['versionSource'])
        if not d['du']: alertes.append('début inconnu')
        lignes.append(f"<tr><td><a href='/fiche/{i}'>{h(d['code'])}</a></td><td>{h(d['version'])}</td><td>{h(d['du'])}</td>"
                      f"<td>{h(d['au'])}</td><td>{vig}</td><td class='gris'>{h(d['intitule'])}</td><td class='alerte'>{h('; '.join(alertes)) if alertes else ''}</td></tr>")
    return f"""<!doctype html><meta charset="utf-8"><title>Atelier fiches</title>{STYLE}
<div class="barre"><strong>Atelier fiches</strong> <span class="gris">{len(docs)} documents, page jetable</span> <a href="/chronologie">Chronologie et trous du POC →</a></div>
<div class="index"><table><tr><th>Code</th><th>Version</th><th>Du</th><th>Au</th><th>Statut</th><th>Intitulé lu</th><th>Alertes</th></tr>{''.join(lignes)}</table></div>"""


def page_fiche(docs, i):
    d = docs[i]
    texte = Path(d['texte']).read_text()
    options = ''.join(f"<option value='{j}'{' selected' if j == i else ''}>{h(x['code'])} {h(x['version'])}</option>" for j, x in enumerate(docs))
    prec = f"<a href='/fiche/{i-1}'>← précédente</a>" if i > 0 else ''
    suiv = f"<a href='/fiche/{i+1}'>suivante →</a>" if i + 1 < len(docs) else ''
    fin = d['finTexte']
    ident = f"""
<table>
<tr><th>Code</th><td>{h(d['code'])} <span class="gris">lu dans le texte : {h(d['codeTexte'])}</span></td></tr>
<tr><th>Intitulé</th><td>{h(d['intitule'])}</td></tr>
<tr><th>Version</th><td>{h(d['version'])} <span class="gris">source : {h(d['versionSource'])}</span></td></tr>
<tr><th>Du</th><td>{h(d['du'])} <span class="gris">source : {h(d['duSource'])}</span></td></tr>
<tr><th>Fin lue</th><td>{(h(fin['date']) + ' <span class="gris">' + h(fin['nature']) + ' : « ' + h(fin['citation']) + ' »</span>') if fin else '—'}</td></tr>
<tr><th>Fin déduite</th><td>{h(d['finDeduite'])} <span class="gris">{'du début de la version suivante' if d['finDeduite'] else ''}</span></td></tr>
<tr><th>Au</th><td>{h(d['au'])}</td></tr>
<tr><th>En vigueur</th><td>{'<span class="ok">oui</span>' if d['enVigueur'] else ('non' if d['enVigueur'] is False else '<span class="alerte">inconnu</span>')}</td></tr>
<tr><th>Document</th><td class="gris">{h(Path(d['fichier']).name)} · {d['pages']} pages · {d['caracteres']} caractères</td></tr>
</table>"""
    manquants = d['ossature']['manquants']
    ossature = ('<p class="ok">Les sept repères sont trouvés.</p>' if not manquants
                else f"<p class='alerte'>Repères absents : {h(', '.join(manquants))}</p>")
    blocs = []
    ordre = sorted(d['sections'].items(), key=lambda kv: kv[1][0])
    avant = texte[:ordre[0][1][0]] if ordre else texte
    blocs.append(f"<h2>En-tête</h2><pre>{h(avant.strip())}</pre>")
    for nom, (debut, fin_) in ordre:
        blocs.append(f"<h2>{h(NOMS_SECTIONS.get(nom, nom))} <span class='gris'>({fin_ - debut} car.)</span></h2><pre>{h(texte[debut:fin_].strip())}</pre>")
    return f"""<!doctype html><meta charset="utf-8"><title>{h(d['code'])} {h(d['version'])} · atelier</title>{STYLE}
<div class="barre">
  <a href="/">Atelier</a>
  <select onchange="location.href='/fiche/'+this.value">{options}</select>
  <span class="nav">{prec} {suiv}</span>
  <span class="gris">{i+1} / {len(docs)}</span>
</div>
<div class="deux">
  <div class="gauche"><iframe src="/pdf/{i}" title="PDF"></iframe></div>
  <div class="droite">
    <h2>Identité, étape 4</h2>{ident}
    <h2>Repères, étape 3</h2>{ossature}
    {''.join(blocs)}
  </div>
</div>"""


NIVEAUX = {1: 'chronologie seule', 2: 'texte de la fiche exigé', 3: 'en vigueur ou à venir : neuf informations et visa'}
TRAVAIL_COMMUN = ('neuf informations', 'visa d’Alek')


def chronos():
    return [json.loads(f.read_text()) for f in sorted(CHRONO.glob('[A-Z]*.json'))]


def lien_jo(v):
    a = v.get('arrete') or {}
    if a.get('cid'):
        return f"<a href='https://www.legifrance.gouv.fr/jorf/id/{h(a['cid'])}' target='_blank' title='{h(a.get('titre'))}'>{h(v.get('nor'))}</a>"
    return h(v.get('nor') or '?')


def numero(v):
    if v.get('version'):
        src = v.get('versionSource') or ''
        return h(v['version']) + (f" <span class='gris petit'>({h(src)})</span>" if src and src != 'texte du JO' else '')
    if v.get('versionProposee'):
        return f"<span class='manque'>?</span> <span class='gris petit'>proposé {h(v['versionProposee'])}</span>"
    return "<span class='manque'>?</span>"


def a_recuperer(fiches):
    """Les PDF du ministère à télécharger : versions de niveau 2 ou 3 dont le texte manque."""
    out = []
    for f in fiches:
        for v in f['versions']:
            if any(m.startswith('texte de la fiche') for m in v['manques']):
                out.append((f['code'], v))
    return out


def page_chronologie(docs):
    fiches = chronos()
    if not fiches:
        return '<p>Lance d’abord <code>npm run fiches:chronologie</code>.</p>'
    lignes = []
    for f in fiches:
        vs = f['versions']
        trous = [m for v in vs for m in v['manques'] if m not in TRAVAIL_COMMUN]
        courante = next((v for v in vs if v['niveau'] == 3 and v['debut'] <= f['genereLe']), None)
        etat = "<span class='pastille ok'>complète</span>" if not trous else f"<span class='pastille ko'>{len(trous)} trou(s)</span>"
        lignes.append(f"<tr><td><a href='/chronologie/{h(f['code'])}'><strong>{h(f['code'])}</strong></a></td><td>{h(f.get('intitule') or '')}</td>"
                      f"<td>{len(vs)}</td><td>{numero(courante) if courante else '—'}</td><td>{h(courante['debut']) if courante else ''}</td><td>{etat}</td></tr>")
    recup = a_recuperer(fiches)
    liste = ''.join(f"<tr><td><a href='/chronologie/{h(c)}'>{h(c)}</a></td><td>{numero(v)}</td><td>{h(v['debut'])} → {h(v['fin'] or 'en vigueur')}</td><td>{lien_jo(v)}</td>"
                    f"<td class='gris'>niveau {v['niveau']}</td></tr>" for c, v in recup)
    return f"""<!doctype html><meta charset="utf-8"><title>Chronologie du POC · atelier</title>{STYLE}
<div class="barre"><a href="/">Atelier</a> <strong>Chronologie et trous du POC</strong> <span class="gris">généré le {h(fiches[0]['genereLe'])}, relancer <code>npm run fiches:chronologie</code> puis rafraîchir</span></div>
<div class="chrono">
<h2>À récupérer sur le site du ministère ({len(recup)} PDF)</h2>
<p class="gris">Versions de niveau 2 ou 3 dont le texte n’est pas au JO et pour lesquelles aucun PDF n’est déposé. À déposer dans <code>data/fiches/pdf/&lt;CODE&gt;/</code>, nom d’origine conservé.</p>
<table><tr><th>Fiche</th><th>Version</th><th>S’applique</th><th>Arrêté</th><th></th></tr>{liste}</table>
<h2>Les 22 fiches</h2>
<p class="gris">Trous comptés hors « neuf informations » et « visa », qui sont le travail à faire ensemble sur les versions en vigueur.</p>
<table><tr><th>Code</th><th>Intitulé</th><th>Versions</th><th>Version en vigueur</th><th>Depuis le</th><th>État</th></tr>{''.join(lignes)}</table>
</div>"""


def page_chronologie_fiche(docs, code):
    f = json.loads((CHRONO / f'{code}.json').read_text())
    lignes = []
    for v in f['versions']:
        manques = ''.join(f"<li class='{'gris' if m in TRAVAIL_COMMUN else 'manque'}'>{h(m)}</li>" for m in v['manques']) or "<li class='ok'>rien</li>"
        repub = ''.join(f"<div class='gris petit'>republiée par {h(r['nor'])}, applicable le {h(r['appliqueeLe'])}</div>" for r in v.get('republications', []))
        texte = ('JO' if v.get('texteAuJo') else '') + ((' · PDF ' + h(v['pdf'])) if v.get('pdf') else '')
        lignes.append(f"""<tr class="{'n3' if v['niveau'] == 3 else ''}">
<td>{numero(v)}</td><td>{h(v['debut'])}</td><td>{h(v['fin'] or 'en vigueur')}</td><td>{lien_jo(v)}{repub}</td>
<td class="petit">[{h(v['genreDate'])}] {h(v['sourceDate'][:260])}<details><summary>trouvée par</summary>{h('; '.join(v['origines']))}</details></td>
<td class="petit">{texte or '<span class="manque">aucun</span>'}</td><td class="gris">{v['niveau']}</td><td class="petit"><ul style="margin:0;padding-left:16px">{manques}</ul></td></tr>""")
    sans = ''.join(f"<li>{h(v.get('version') or '?')} · {lien_jo(v)} · {h(v['sourceDate'][:200])}</li>" for v in f['versionsSansDate'])
    autres = ''.join(f"<tr><td>{h(t['publication'])}</td><td>{h(t['nature'])}</td><td><a href='https://www.legifrance.gouv.fr/jorf/id/{h(t['cid'])}' target='_blank'>{h(t['nor'])}</a></td><td class='petit'>{h(t['titre'][:160])}</td></tr>"
                     for t in f['textesDuJo'] if t['nature'] != 'publie la fiche')
    pdfs = [(i, d) for i, d in enumerate(docs) if d['code'] == code]
    conf = ''.join(f"<li>{h(c['pdf'])} : {'<span class=ok>conforme</span>' if not c['ecarts'] else '<span class=manque>' + h(' ; '.join(c['ecarts'])) + '</span>'}</li>" for c in f.get('confrontationPdf', []))
    gauche = f"<iframe src='/pdf/{pdfs[-1][0]}' title='PDF'></iframe>" if pdfs else "<p style='padding:20px' class='gris'>Aucun PDF déposé pour cette fiche.</p>"
    choix = ' '.join(f"<a href='/fiche/{i}'>{h(d['version'] or '?')}</a>" for i, d in pdfs)
    return f"""<!doctype html><meta charset="utf-8"><title>{h(code)} · chronologie</title>{STYLE}
<div class="barre"><a href="/">Atelier</a> <a href="/chronologie">Chronologie</a> <strong>{h(code)}</strong> <span class="gris">{h(f.get('intitule') or '')}</span> <span class="gris">PDF déposés : {choix or 'aucun'}</span></div>
<div class="deux"><div class="gauche">{gauche}</div><div class="droite">
<h2>Versions</h2>
<table><tr><th>Version</th><th>Du</th><th>Au</th><th>Arrêté</th><th>D’où vient la date</th><th>Texte</th><th>Niv.</th><th>Ce qui manque</th></tr>{''.join(lignes)}</table>
{f'<h2>Versions trouvées mais non datées</h2><ul>{sans}</ul>' if sans else ''}
<h2>Confrontation aux PDF déposés</h2><ul>{conf or '<li class="gris">aucun PDF</li>'}</ul>
<h2>Autres textes du JO qui citent la fiche</h2><p class="gris petit">Nature devinée par mots-clés, à relire.</p>
<table>{autres or '<tr><td class="gris">aucun</td></tr>'}</table>
</div></div>"""


class Atelier(BaseHTTPRequestHandler):
    def log_message(self, *a):  # silence
        pass

    def envoie(self, corps: bytes, type_: str, statut=200):
        self.send_response(statut)
        self.send_header('Content-Type', type_)
        self.send_header('Content-Length', str(len(corps)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(corps)

    def do_GET(self):
        try:
            docs = charge()
            if self.path == '/':
                return self.envoie(page_index(docs).encode(), 'text/html; charset=utf-8')
            if self.path == '/chronologie':
                return self.envoie(page_chronologie(docs).encode(), 'text/html; charset=utf-8')
            if self.path.startswith('/chronologie/'):
                code = self.path.split('/')[2]
                return self.envoie(page_chronologie_fiche(docs, code).encode(), 'text/html; charset=utf-8')
            if self.path.startswith('/fiche/'):
                i = int(self.path.split('/')[2])
                return self.envoie(page_fiche(docs, i).encode(), 'text/html; charset=utf-8')
            if self.path.startswith('/pdf/'):
                i = int(self.path.split('/')[2])
                return self.envoie(Path(docs[i]['fichier']).read_bytes(), 'application/pdf')
            self.envoie(b'404', 'text/plain', 404)
        except Exception as e:  # une page jetable : l'erreur s'affiche, c'est tout
            self.envoie(f'erreur : {e}'.encode(), 'text/plain; charset=utf-8', 500)


if __name__ == '__main__':
    if not CATALOGUE.exists():
        sys.exit('Lance d\'abord scripts/extrait-fiches.py')
    print(f'Atelier sur http://localhost:{PORT}/')
    ThreadingHTTPServer(('127.0.0.1', PORT), Atelier).serve_forever()
