"""
Génère les tracés SVG de la carte des zones climatiques CEE (H1, H2, H3) à partir des
géométries réelles des départements, vers components/traces-zones.ts.

⚠️ LE FICHIER PRODUIT EST GÉNÉRÉ, NE PAS L'ÉDITER À LA MAIN : relancer ce script.

Source des géométries : le GeoJSON « départements, version simplifiée » du dépôt
france-geojson (Grégoire David, données IGN Admin Express), mis en cache dans
.cache/departements.geojson. Répartition des départements par zone : la liste ministérielle
des zones climatiques du dispositif (page « opérations standardisées » d'ecologie.gouv.fr),
la même que celle de l'article « Zone climatique » du site : 51 départements en H1, 36 en
H2, 8 en H3 avec la Corse.

Projection : Lambert conique conforme centrée sur la France (parallèles 44° et 49°,
méridien 3° E), la forme familière des cartes de France. Les géométries sont fusionnées par
zone, simplifiées à environ 2 km, puis mises à l'échelle dans une boîte de 440 × 400.

Usage : python3 scripts/genere-carte-zones.py   (dépend de shapely : pip3 install shapely)
"""
import json
import math
from pathlib import Path

from shapely.geometry import shape
from shapely.ops import unary_union, transform

SOURCE = Path('.cache/departements.geojson')
CIBLE = Path('components/traces-zones.ts')

ZONES = {
    'H1': '01 02 03 05 08 10 14 15 19 21 23 25 27 28 38 39 42 43 45 51 52 54 55 57 58 59 60 61 62 63 '
          '67 68 69 70 71 73 74 75 76 77 78 80 87 88 89 90 91 92 93 94 95'.split(),
    'H2': '04 07 09 12 16 17 18 22 24 26 29 31 32 33 35 36 37 40 41 44 46 47 48 49 50 53 56 64 65 72 '
          '79 81 82 84 85 86'.split(),
    'H3': '06 11 13 2A 2B 30 34 66 83'.split(),
}

# Lambert conique conforme, deux parallèles standards (formules classiques, sphère).
LAT0, LON0, LAT1, LAT2 = math.radians(46.5), math.radians(3.0), math.radians(44.0), math.radians(49.0)
N = math.log(math.cos(LAT1) / math.cos(LAT2)) / math.log(math.tan(math.pi / 4 + LAT2 / 2) / math.tan(math.pi / 4 + LAT1 / 2))
F = math.cos(LAT1) * math.tan(math.pi / 4 + LAT1 / 2) ** N / N
RHO0 = F / math.tan(math.pi / 4 + LAT0 / 2) ** N


def lambert(lon, lat):
    lon, lat = math.radians(lon), math.radians(lat)
    rho = F / math.tan(math.pi / 4 + lat / 2) ** N
    theta = N * (lon - LON0)
    # y vers le bas pour le SVG
    return rho * math.sin(theta), -(RHO0 - rho * math.cos(theta))


def main():
    geo = json.loads(SOURCE.read_text())
    par_code = {f['properties']['code']: shape(f['geometry']) for f in geo['features']}
    attendus = sum(len(v) for v in ZONES.values())
    manquants = [c for codes in ZONES.values() for c in codes if c not in par_code]
    if manquants:
        raise SystemExit(f'Départements absents du GeoJSON : {manquants}')
    if attendus != 96 - 1:  # 96 entrées dont 2A et 2B ; la liste en compte 95 + Corse = 96
        pass

    zones = {z: unary_union([par_code[c] for c in codes]) for z, codes in ZONES.items()}
    projetees = {z: transform(lambert, g) for z, g in zones.items()}

    # Boîte englobante commune, puis mise à l'échelle dans 440 × 400 avec une marge.
    tout = unary_union(list(projetees.values()))
    minx, miny, maxx, maxy = tout.bounds
    largeur, hauteur = 440, 400
    marge = 12
    echelle = min((largeur - 2 * marge) / (maxx - minx), (hauteur - 2 * marge) / (maxy - miny))
    dx = marge - minx * echelle + ((largeur - 2 * marge) - (maxx - minx) * echelle) / 2
    dy = marge - miny * echelle + ((hauteur - 2 * marge) - (maxy - miny) * echelle) / 2

    def vers_svg(x, y):
        return x * echelle + dx, y * echelle + dy

    def chemin(geom):
        geom = transform(vers_svg, geom).simplify(1.2, preserve_topology=True)
        polys = list(geom.geoms) if geom.geom_type == 'MultiPolygon' else [geom]
        morceaux = []
        for poly in polys:
            if poly.area < 6:  # îlots invisibles à cette échelle
                continue
            for anneau in [poly.exterior, *poly.interiors]:
                pts = list(anneau.coords)
                morceaux.append('M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in pts[:-1]) + 'Z')
        return ''.join(morceaux)

    traces = {z: chemin(g) for z, g in projetees.items()}
    centres = {z: transform(vers_svg, g).representative_point() for z, g in projetees.items()}
    corse = transform(vers_svg, unary_union([par_code['2A'], par_code['2B']]))
    corse = transform(lambert, unary_union([par_code['2A'], par_code['2B']]))
    corse_svg = transform(vers_svg, corse).representative_point()

    lignes = [
        '/**',
        ' * Les tracés de la carte des zones climatiques. GÉNÉRÉ par scripts/genere-carte-zones.py',
        ' * depuis les géométries réelles des départements : ne pas éditer, relancer le script.',
        ' */',
        f'export const CARTE_ZONES = {{ largeur: {largeur}, hauteur: {hauteur} }};',
        '',
        'export const TRACES_ZONES: Record<"H1" | "H2" | "H3", string> = {',
    ]
    for z in ('H1', 'H2', 'H3'):
        lignes.append(f"  {z}: '{traces[z]}',")
    lignes.append('};')
    lignes.append('')
    lignes.append('/** Un point à l\'intérieur de chaque zone, pour poser son étiquette. */')
    lignes.append('export const CENTRES_ZONES = {')
    for z in ('H1', 'H2', 'H3'):
        p = centres[z]
        lignes.append(f'  {z}: {{ x: {p.x:.0f}, y: {p.y:.0f} }},')
    lignes.append(f'  corse: {{ x: {corse_svg.x:.0f}, y: {corse_svg.y:.0f} }},')
    lignes.append('};')
    CIBLE.write_text('\n'.join(lignes) + '\n')
    print(f'{CIBLE} : ' + ', '.join(f'{z} {len(traces[z])} car.' for z in traces))
    for z, p in centres.items():
        print(f'  centre {z} : {p.x:.0f}, {p.y:.0f}')
    print(f'  corse : {corse_svg.x:.0f}, {corse_svg.y:.0f}')


if __name__ == '__main__':
    main()
