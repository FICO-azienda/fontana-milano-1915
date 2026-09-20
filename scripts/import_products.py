#!/usr/bin/env python3
"""
Importa dal sito Fontana Milano 1915 le schede di tutti i modelli (Uomo + Donna):
titolo, testi IT/EN e fotografie. Analizza ogni foto (fondo bianco? colore dominante?) per poterle
raggruppare per colore. Scrive:
  assets-src/products/<slug>/*        immagini originali (non versionate)
  scripts/products-scraped.json       dati grezzi + analisi (versionato)
Uso:  python3 scripts/import_products.py      (richiede Pillow)
"""
import html, json, re, statistics, sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

BASE = 'https://www.fontanamilano1915.com'
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets-src' / 'products'

PRODUCTS = [
    ('uomo', 'a-man'), ('uomo', 'summit'), ('uomo', 'wonderland'), ('uomo', 'back24-back48'), ('uomo', 'rush-peterpan'),
    ('uomo', 'timothy'), ('uomo', 'bazooka'), ('uomo', 'titan'), ('uomo', 'wall-street'),
    ('donna', 'mina'), ('donna', 'wight'), ('donna', 'gallery'), ('donna', 'tum-tum'), ('donna', 'aretha'),
    ('donna', 'chelsea'), ('donna', 'noemi'), ('donna', 'key-west'), ('donna', 'trebbia-26'), ('donna', 'a'),
    ('donna', 'mini-lucky'), ('donna', 'lulli'), ('donna', 'milano'), ('donna', 'mimosa'), ('donna', 'mymosa'),
    ('donna', 'mini-a'), ('donna', 'angie'), ('donna', 'bambi'), ('donna', 'busy-day'), ('donna', 'coccodrillo'),
]


def get(url, binary=False):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    err = None
    for _ in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                d = r.read()
                return d if binary else d.decode('utf-8', 'replace')
        except Exception as e:  # noqa: BLE001
            err = e
    raise err


def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).replace('\xa0', ' ').strip()


def parse(page):
    m = re.search(r'<h1 class="view-section-title">(.*?)</h1>', page, re.S)
    spans = [clean(x) for x in re.findall(r'<span>(.*?)</span>', m.group(1), re.S)] if m else []
    title = next((s for s in reversed(spans) if s), '')
    c = re.search(r'<div class="view-section-content">(.*?)</main>', page, re.S)
    paras = []
    if c:
        blob = re.sub(r'</(div|p|li)>|<br\s*/?>', '\n', c.group(1))
        paras = [clean(l) for l in re.sub(r'<[^>]+>', '\n', blob).split('\n')]
        paras = [p for p in paras if len(p) > 3]
    imgs = re.findall(r'<img class="responsive-image" alt="([^"]*)" src="([^"]*)"', page)
    eng = re.search(r'href="([^"]*)" title="[^"]*">eng', page)
    return title, paras, imgs, eng.group(1) if eng else None


def analyze(path):
    im = Image.open(path).convert('RGBA')
    im = Image.alpha_composite(Image.new('RGBA', im.size, (255, 255, 255, 255)), im).convert('RGB')
    w, h = im.size
    sw, sh = 100, max(8, int(100 * h / w))
    sm = im.resize((sw, sh))
    px = sm.load()
    p = max(3, sh // 12)

    def patch(x0, y0):
        return statistics.mean(sum(px[x, y]) / 3 for x in range(x0, x0 + p) for y in range(y0, y0 + p))

    corners = [patch(0, 0), patch(sw - p, 0), patch(0, sh - p), patch(sw - p, sh - p)]
    studio = min(corners) > 236
    fg, core = [], []
    for y in range(sh):
        for x in range(sw):
            r, g, b = px[x, y]
            if (255 - r) + (255 - g) + (255 - b) > 120:
                fg.append((r, g, b))
                if sw // 4 <= x < sw * 3 // 4 and sh // 4 <= y < sh * 3 // 4:
                    core.append((r, g, b))
    frac = len(fg) / (sw * sh)
    pool = core if len(core) > 40 else fg
    rgb = [int(statistics.median(c[i] for c in pool)) for i in range(3)] if pool else [128, 128, 128]
    return dict(w=w, h=h, studio=bool(studio), frac=round(frac, 3), rgb=rgb)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    result = {}
    for gender, slug in PRODUCTS:
        title, paras_it, imgs, eng = parse(get(f'{BASE}/{gender}/{slug}'))
        paras_en = parse(get(BASE + eng))[1] if eng else []
        folder = OUT / slug
        folder.mkdir(exist_ok=True)

        def dl(item):
            i, (alt, src) = item
            dest = folder / f'{i:02d}.{src.rsplit(".", 1)[-1].lower()}'
            if not dest.exists():
                dest.write_bytes(get(BASE + src, binary=True))
            return dict(file=dest.name, alt=alt, **analyze(dest))

        with ThreadPoolExecutor(8) as ex:
            images = list(ex.map(dl, enumerate(imgs)))
        result[slug] = dict(gender=gender, title=title, desc_it=paras_it, desc_en=paras_en, images=images)
        print(f'{gender}/{slug}: {title!r} — {len(images)} foto, {len(paras_it)}/{len(paras_en)} paragrafi', file=sys.stderr)
    (ROOT / 'scripts' / 'products-scraped.json').write_text(json.dumps(result, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
