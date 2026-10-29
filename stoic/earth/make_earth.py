import json, math, warnings
warnings.filterwarnings('ignore')
import geopandas
from shapely.ops import unary_union
from shapely.geometry import Polygon, MultiPolygon
g = geopandas.read_file(geopandas.datasets.get_path('naturalearth_lowres'))
LON0, LAT0 = 118.0, 24.0
l0, p0 = math.radians(LON0), math.radians(LAT0)
def proj(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    cosc = math.sin(p0) * math.sin(p) + math.cos(p0) * math.cos(p) * math.cos(l - l0)
    x = math.cos(p) * math.sin(l - l0)
    y = math.cos(p0) * math.sin(p) - math.sin(p0) * math.cos(p) * math.cos(l - l0)
    if cosc < 0:  # behind the globe: push onto the rim
        n = math.hypot(x, y) or 1; x, y = x / n, y / n
    return x, -y, cosc
def dens(coords, step=1.0):
    out = []
    for (a, b), (c, d) in zip(coords[:-1], coords[1:]):
        n = max(1, int(max(abs(c - a), abs(d - b)) / step))
        for k in range(n): out.append((a + (c - a) * k / n, b + (d - b) * k / n))
    out.append(coords[-1]); return out
def ring_path(coords):
    pts = [proj(lo, la) for lo, la in dens(list(coords))]
    if all(p[2] < 0 for p in pts): return None
    if max(p[2] for p in pts) < 0.02: return None
    return 'M' + ' L'.join(f'{round(x*1000)} {round(y*1000)}' for x, y, _ in pts) + ' Z'
def geom_paths(geom):
    polys = [geom] if isinstance(geom, Polygon) else list(geom.geoms)
    ds = []
    for pg in polys:
        r = ring_path(pg.exterior.coords)
        if r: ds.append(r)
    return ' '.join(ds)
TAN = {'Australia', 'Mongolia', 'Kazakhstan', 'Saudi Arabia', 'Iran', 'Afghanistan', 'Pakistan', 'Turkmenistan', 'Uzbekistan', 'Oman', 'Yemen', 'Iraq', 'Egypt', 'Libya', 'Sudan', 'Algeria', 'Niger', 'Chad', 'Mali', 'Mauritania'}
land = []
for _, row in g.iterrows():
    if row['continent'] == 'Antarctica': continue
    d = geom_paths(row.geometry)
    if d: land.append({'d': d, 'c': 'tan' if row['name'] in TAN else ('ice' if row['name'] in ('Greenland',) else 'green'), 'n': row['name']})
outline = geom_paths(unary_union([gg for gg, c in zip(g.geometry, g.continent) if c != 'Antarctica']))
kx, ky, _ = proj(127.5, 36.5)
json.dump({'land': land, 'outline': outline, 'korea': [round(kx * 1000), round(ky * 1000)], 'np': [round(v * 1000) for v in proj(0, 90)[:2]]}, open('earth.json', 'w'))
s = json.dumps({'land': land, 'outline': outline, 'korea': [round(kx * 1000), round(ky * 1000)], 'np': [round(v * 1000) for v in proj(0, 90)[:2]]})
open('../earth_data.js', 'w').write('const EARTH = ' + s + ';\n')
print(len(land), 'shapes', len(s) // 1024, 'KB', 'korea', kx, ky)
