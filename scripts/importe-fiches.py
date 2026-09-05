"""
Importe le catalogue des fiches CEE depuis data/fiches_cee.xlsx vers data/fiches.json.

⚠️ LE TABLEUR EST LA SOURCE, LE JSON EN EST LA COPIE GÉNÉRÉE. On ne modifie jamais
data/fiches.json à la main : la prochaine exécution l'écraserait sans prévenir.

Le script refuse d'écrire si quoi que ce soit cloche — code en double, secteur inconnu,
sous-secteur en désaccord avec le segment du code. Sur 216 lignes recopiées à la main, c'est
la seule façon de voir une faute de saisie autrement qu'en la lisant plus tard sur le site.

Usage : npm run fiches
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

import openpyxl

SOURCE = Path('data/fiches_cee.xlsx')
CIBLE = Path('data/fiches.json')

# Le libellé du tableur vers le slug du site.
SECTEURS = {
    'Agriculture': 'agriculture',
    'Industrie': 'industrie',
    'Réseau': 'reseau',
    'Résidentiel': 'residentiel',
    'Tertiaire': 'tertiaire',
    'Transport': 'transport',
}

# Le préfixe attendu du code, par secteur.
PREFIXES = {
    'agriculture': 'AGRI', 'industrie': 'IND', 'reseau': 'RES',
    'residentiel': 'BAR', 'tertiaire': 'BAT', 'transport': 'TRA',
}

# Le sous-secteur annoncé et le segment du code doivent dire la même chose.
SEGMENTS = {
    'Thermique': 'TH', 'Équipement': 'EQ', 'Enveloppe': 'EN', 'Service': 'SE',
    'Utilités': 'UT', 'Bâtiment': 'BA', 'Chaleur': 'CH', 'Éclairage': 'EC',
}

erreurs = []
fiches = []

feuille = openpyxl.load_workbook(SOURCE, data_only=True).worksheets[0]
for numero, ligne in enumerate(feuille.iter_rows(min_row=2, values_only=True), start=2):
    secteur_libelle, sous_secteur, code = (str(v).strip() if v is not None else '' for v in ligne[:3])
    if not code:
        continue

    def faute(message):
        erreurs.append(f'ligne {numero} ({code or "sans code"}) : {message}')

    if not re.fullmatch(r'[A-Z]+(-[A-Z0-9]+){2}', code):
        faute('code de forme inattendue')
        continue

    secteur = SECTEURS.get(secteur_libelle)
    if not secteur:
        faute(f'secteur inconnu « {secteur_libelle} »')
        continue

    prefixe, segment, _ = code.split('-', 2)
    if prefixe != PREFIXES[secteur]:
        faute(f'préfixe {prefixe} incohérent avec le secteur {secteur_libelle} (attendu {PREFIXES[secteur]})')
    attendu = SEGMENTS.get(sous_secteur)
    if attendu is None:
        faute(f'sous-secteur inconnu « {sous_secteur} »')
    elif attendu != segment:
        faute(f'sous-secteur « {sous_secteur} » incohérent avec le segment {segment} (attendu {attendu})')

    fiches.append({'code': code, 'secteur': secteur})

for code, n in Counter(f['code'] for f in fiches).items():
    if n > 1:
        erreurs.append(f'code en double : {code} ({n} fois)')

if erreurs:
    print(f'✗ {len(erreurs)} problème(s), rien n’a été écrit :', file=sys.stderr)
    for e in erreurs:
        print(f'  {e}', file=sys.stderr)
    sys.exit(1)

fiches.sort(key=lambda f: f['code'])
CIBLE.write_text(json.dumps(fiches, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

repartition = Counter(f['secteur'] for f in fiches)
print(f'✓ {len(fiches)} fiches → {CIBLE}')
for secteur, n in sorted(repartition.items()):
    print(f'    {secteur:<13} {n}')
