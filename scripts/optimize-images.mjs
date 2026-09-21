// Genera versioni responsive WebP/AVIF a partire dagli originali in assets-src/.
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const SRC = 'assets-src'
const OUT = 'public/img'
const WIDTHS = [480, 800, 1280, 1920]

// nome-output -> file sorgente  |  { file, crop: [left, top, width, height] }
const map = {
  'carbon-front': 'ita-14664.jpg',
  'carbon-side': 'ita-14663.jpg',
  'carbon-back': 'ita-14665.jpg',
  'carbon-lying': 'ita-14666.jpg',
  'slate-front': 'ita-2152.jpg',
  'slate-back': 'ita-2151.jpg',
  'slate-side': 'ita-2149.jpg',
  'slate-lying': 'ita-2150.jpg',
  'slate-open': 'ita-2169.jpg',
  'detail-buckle': { file: 'ita-14664.jpg', crop: [440, 180, 1040, 650] },
  'detail-clasp': { file: 'ita-14664.jpg', crop: [520, 420, 900, 675] },
  'detail-slate': { file: 'ita-2152.jpg', crop: [440, 180, 1040, 650] },
  'workshop': 'ita-502.jpg',
  'special-projects': 'ita-1979.jpg',
}

await mkdir(OUT, { recursive: true })
const manifest = {}
for (const [name, def] of Object.entries(map)) {
  const { file, crop } = typeof def === 'string' ? { file: def } : def
  const input = `${SRC}/${file}`
  if (!existsSync(input)) { console.warn('manca', input); continue }
  let base = sharp(input).flatten({ background: '#ffffff' })
  if (crop) base = base.extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] })
  const buf = await base.toBuffer()
  const meta = await sharp(buf).metadata()
  // larghezze reali (mai oltre l'originale), l'ultima è l'originale stesso
  const ws = [...new Set([...WIDTHS.filter((w) => w < meta.width), meta.width])]
  for (const width of ws) {
    const img = sharp(buf).resize({ width, withoutEnlargement: true })
    await img.clone().webp({ quality: 88, smartSubsample: true }).toFile(`${OUT}/${name}-${width}.webp`)
    await img.clone().avif({ quality: 62, effort: 4, chromaSubsampling: '4:4:4' }).toFile(`${OUT}/${name}-${width}.avif`)
  }
  manifest[name] = { w: meta.width, h: meta.height, widths: ws, studio: !['workshop', 'special-projects'].includes(name) }
  console.log(name, meta.width + 'x' + meta.height)
}

await writeFile('src/data/images.json', JSON.stringify(manifest, null, 1))
