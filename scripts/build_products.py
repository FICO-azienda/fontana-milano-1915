#!/usr/bin/env python3
"""
Legge scripts/products-scraped.json, raggruppa le foto di ogni modello per colore e scrive
scripts/product-selection.json (colorway → foto scelte, nomi colore IT/EN, testi).
Uso:  python3 scripts/build_products.py
"""
import colorsys, json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAX_COLORWAYS, MAX_PER_COLOR = 3, 5


def lab(rgb):
    def f(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(x) for x in rgb)
    x, y, z = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, 0.2126 * r + 0.7152 * g + 0.0722 * b, (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    h = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116  # noqa: E731
    fx, fy, fz = h(x), h(y), h(z)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def dist(a, b):
    return math.dist(a, b)


def color_name(rgb):
    """Nome descrittivo (IT, EN) del colore dominante."""
    r, g, b = (c / 255 for c in rgb)
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    h *= 360
    if v < 0.24: return ('Nero', 'Black')
    if s < 0.13:
        if v > 0.86: return ('Bianco', 'White')
        if v > 0.66: return ('Grigio perla', 'Pearl grey')
        if v > 0.42: return ('Grigio', 'Grey')
        return ('Antracite', 'Charcoal')
    if h < 12 or h >= 345:
        return ('Rosso', 'Red') if v > 0.5 else ('Bordeaux', 'Burgundy')
    if h < 22:
        if v < 0.45: return ('Testa di moro', 'Dark brown')
        return ('Rosso mattone', 'Brick') if s > 0.6 else ('Cipria', 'Blush')
    if h < 42:
        if v < 0.45: return ('Marrone', 'Brown')
        if s > 0.62: return ('Cognac', 'Cognac')
        if s > 0.38: return ('Cuoio', 'Tan')
        return ('Beige', 'Beige') if v > 0.72 else ('Tortora', 'Taupe')
    if h < 68:
        if s > 0.5 and v > 0.6: return ('Giallo', 'Yellow')
        return ('Sabbia', 'Sand') if v > 0.6 else ('Oliva', 'Olive')
    if h < 165: return ('Verde', 'Green') if v > 0.4 else ('Verde bosco', 'Forest green')
    if h < 200: return ('Petrolio', 'Petrol') if v < 0.6 else ('Turchese', 'Turquoise')
    if h < 262:
        if s < 0.3: return ('Grigio ardesia', 'Slate grey')
        return ('Blu', 'Blue') if v > 0.45 else ('Blu notte', 'Navy')
    if h < 300: return ('Viola', 'Purple') if v > 0.4 else ('Melanzana', 'Aubergine')
    if h < 330: return ('Fucsia', 'Fuchsia')
    return ('Rosa', 'Pink')


def main():
    data = json.loads((ROOT / 'scripts' / 'products-scraped.json').read_text())
    out = {}
    for slug, p in data.items():
        imgs = [i for i in p['images'] if i['w'] >= 900]
        studio = [i for i in imgs if i['studio'] and i['frac'] > 0.02]
        pool = studio if len(studio) >= 3 else imgs  # es. Coccodrillo: nessuna foto su bianco
        clusters = []  # {c: centroid lab, items: []}
        for i in pool:
            L = lab(i['rgb'])
            best = min(clusters, key=lambda k: dist(k['c'], L), default=None)
            if best and dist(best["c"], L) < 20:
                best['items'].append(i)
                n = len(best['items'])
                best['c'] = tuple((best['c'][j] * (n - 1) + L[j]) / n for j in range(3))
            else:
                clusters.append(dict(c=L, items=[i]))
        clusters.sort(key=lambda k: -len(k['items']))
        keep = [k for k in clusters if len(k['items']) >= 2][:MAX_COLORWAYS] or clusters[:1]
        cws, used = [], set()
        for k in keep:
            rgbs = [i['rgb'] for i in k['items']]
            rgb = [int(sum(c[j] for c in rgbs) / len(rgbs)) for j in range(3)]
            it, en = color_name(rgb)
            if it in used:  # nome già usato → aggiungi la sfumatura
                it, en = it + ' II', en + ' II'
            used.add(it)
            cws.append(dict(name=dict(it=it, en=en), swatch='#%02x%02x%02x' % tuple(rgb), images=[i['file'] for i in k['items'][:MAX_PER_COLOR]]))
        out[slug] = dict(gender=p['gender'], title=p['title'], desc_it=p['desc_it'], desc_en=p['desc_en'], colorways=cws)
        print(f"{slug:15}", ' | '.join(f"{c['name']['it']}({len(c['images'])})" for c in cws))
    (ROOT / 'scripts' / 'product-selection.json').write_text(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
