// Genera AVIF/WebP responsive per le foto dei modelli selezionate da build_products.py.
// Le foto su fondo bianco vengono ritagliate (3:2) attorno al soggetto, così la borsa ha sempre
// una dimensione coerente in galleria.
import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const OUT = 'public/img'
const WIDTHS = [640, 1200]
const RATIO = 1.5
const scraped = JSON.parse(await readFile('scripts/products-scraped.json', 'utf8'))
const selection = JSON.parse(await readFile('scripts/product-selection.json', 'utf8'))
const manifest = {}
await mkdir(OUT, { recursive: true })

async function cropAround(buf, meta) {
  const { info } = await sharp(buf).trim({ background: '#ffffff', threshold: 22 }).toBuffer({ resolveWithObject: true })
  const bw = info.width, bh = info.height
  const bx = -info.trimOffsetLeft, by = -info.trimOffsetTop
  let W = Math.max(bw / 0.5, (RATIO * bh) / 0.66)
  W = Math.min(W, meta.width, meta.height * RATIO)
  const Wr = Math.floor(W), Hr = Math.min(meta.height, Math.floor(W / RATIO))
  const left = Math.max(0, Math.min(Math.round(bx + bw / 2 - Wr / 2), meta.width - Wr))
  const top = Math.max(0, Math.min(Math.round(by + bh / 2 - Hr / 2), meta.height - Hr))
  return sharp(buf).extract({ left, top, width: Wr, height: Hr })
}

let n = 0
for (const [slug, p] of Object.entries(selection)) {
  if (slug === 'a-man') continue // A Man usa le foto già curate
  const files = new Set(p.colorways.flatMap((c) => c.images))
  for (const file of files) {
    const src = `assets-src/products/${slug}/${file}`
    if (!existsSync(src)) { console.warn('manca', src); continue }
    const studio = scraped[slug].images.find((i) => i.file === file).studio
    const name = `p-${slug}-${file.replace(/\..*$/, '')}`
    const flat = await sharp(src).flatten({ background: '#ffffff' }).toBuffer()
    const meta = await sharp(flat).metadata()
    let img = sharp(flat)
    let w = meta.width, h = meta.height
    if (studio) {
      img = await cropAround(flat, meta)
      const b = await img.toBuffer({ resolveWithObject: true })
      img = sharp(b.data); w = b.info.width; h = b.info.height
    }
    const ws = [...new Set([...WIDTHS.filter((x) => x < w), w >= 640 ? Math.min(w, 1200) : w])].sort((a, b) => a - b)
    for (const width of ws) {
      const r = img.clone().resize({ width, withoutEnlargement: true })
      await r.clone().webp({ quality: 74 }).toFile(`${OUT}/${name}-${width}.webp`)
      await r.clone().avif({ quality: 46, effort: 3 }).toFile(`${OUT}/${name}-${width}.avif`)
    }
    manifest[name] = { w: ws[ws.length - 1], h: Math.round((ws[ws.length - 1] * h) / w), widths: ws, studio }
    n++
  }
  console.log(slug)
}
await writeFile('src/data/product-images.json', JSON.stringify(manifest, null, 1))
console.log(n, 'immagini')
