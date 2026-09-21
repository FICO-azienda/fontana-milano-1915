// Genera AVIF/WebP responsive per le foto dei modelli selezionate da build_products.py.
// Le foto su fondo bianco vengono ritagliate (3:2) attorno al soggetto, così la borsa ha sempre
// una dimensione coerente in galleria.
import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const OUT = 'public/img'
const WIDTHS = [640, 1200, 1920]
const TILE_WIDTHS = [480, 800, 1200]
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

function widthsFor(list, w) {
  const out = list.filter((x) => x < w * 0.92)
  out.push(w) // sempre la risoluzione nativa (mai upscaling)
  return out
}

/** true se la borsa non tocca i bordi della foto (margine ≥ 3%). */
async function fullyInFrame(src) {
  const flat = await sharp(src).flatten({ background: '#ffffff' }).toBuffer()
  const meta = await sharp(flat).metadata()
  const { info } = await sharp(flat).trim({ background: '#ffffff', threshold: 22 }).toBuffer({ resolveWithObject: true })
  const l = -info.trimOffsetLeft, t = -info.trimOffsetTop
  const mx = meta.width * 0.03, my = meta.height * 0.03
  return l > mx && t > my && meta.width - (l + info.width) > mx && meta.height - (t + info.height) > my
}

/** Miniatura quadrata (liste, mega-menu, ricerca): soggetto centrato al ~62% del lato. */
async function makeTile(name, src, studio) {
  const flat = await sharp(src).flatten({ background: '#ffffff' }).toBuffer()
  const meta = await sharp(flat).metadata()
  let side = Math.min(meta.width, meta.height), left = Math.round((meta.width - side) / 2), top = Math.round((meta.height - side) / 2)
  if (studio) {
    const { info } = await sharp(flat).trim({ background: '#ffffff', threshold: 22 }).toBuffer({ resolveWithObject: true })
    const bx = -info.trimOffsetLeft, by = -info.trimOffsetTop
    side = Math.floor(Math.min(Math.max(info.width, info.height) / 0.62, meta.width, meta.height))
    left = Math.max(0, Math.min(Math.round(bx + info.width / 2 - side / 2), meta.width - side))
    top = Math.max(0, Math.min(Math.round(by + info.height / 2 - side / 2), meta.height - side))
  }
  const img = sharp(flat).extract({ left, top, width: side, height: side })
  const ws = widthsFor(TILE_WIDTHS, side)
  for (const width of ws) {
    const r = width < side ? img.clone().resize({ width, kernel: 'lanczos3' }).sharpen({ sigma: 0.5, m1: 0.5, m2: 1 }) : img.clone()
    await r.clone().webp({ quality: 88, smartSubsample: true }).toFile(`${OUT}/${name}-${width}.webp`)
    await r.clone().avif({ quality: 62, effort: 4, chromaSubsampling: '4:4:4' }).toFile(`${OUT}/${name}-${width}.avif`)
  }
  manifest[name] = { w: ws[ws.length - 1], h: ws[ws.length - 1], widths: ws, studio }
}

let n = 0
for (const [slug, p] of Object.entries(selection)) {
  // miniatura: prima foto del primo colore (A Man: la vista frontale grigia già curata)
  let first = 'assets-src/ita-2152.jpg', firstStudio = true
  if (slug !== 'a-man') {
    const cands = p.colorways.flatMap((c) => c.images).map((f) => ({ f, studio: scraped[slug].images.find((i) => i.file === f).studio }))
    let pick = cands[0]
    for (const c of cands) if (c.studio && (await fullyInFrame(`assets-src/products/${slug}/${c.f}`))) { pick = c; break }
    first = `assets-src/products/${slug}/${pick.f}`; firstStudio = pick.studio
  }
  await makeTile(`t-${slug}`, first, firstStudio)
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
    const ws = widthsFor(WIDTHS, w)
    for (const width of ws) {
      const r = width < w ? img.clone().resize({ width, kernel: 'lanczos3' }).sharpen({ sigma: 0.5, m1: 0.5, m2: 1 }) : img.clone()
      await r.clone().webp({ quality: 88, smartSubsample: true }).toFile(`${OUT}/${name}-${width}.webp`)
      await r.clone().avif({ quality: 62, effort: 4, chromaSubsampling: '4:4:4' }).toFile(`${OUT}/${name}-${width}.avif`)
    }
    manifest[name] = { w: ws[ws.length - 1], h: Math.round((ws[ws.length - 1] * h) / w), widths: ws, studio }
    n++
  }
  console.log(slug)
}
await writeFile('src/data/product-images.json', JSON.stringify(manifest, null, 1))
console.log(n, 'immagini')
