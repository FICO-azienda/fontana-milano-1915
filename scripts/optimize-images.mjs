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
  'detail-buckle': { file: 'ita-14664.jpg', crop: [520, 230, 880, 500] },
  'detail-clasp': { file: 'ita-14664.jpg', crop: [700, 640, 520, 380] },
  'detail-slate': { file: 'ita-2152.jpg', crop: [520, 230, 880, 500] },
  'workshop': 'ita-502.jpg',
  'special-projects': 'ita-1979.jpg',
  'c-summit': 'm-18413.jpg',
  'c-wonderland': 'm-18414.jpg',
  'c-back': 'm-18415.jpg',
  'c-rush': 'm-18416.jpg',
  'c-timothy': 'm-18417.jpg',
  'c-bazooka': 'm-18419.jpg',
  'c-titan': 'm-18421.jpg',
  'c-wallstreet': 'm-18423.jpg',
  'c-a-man': 'm-2354.jpg',
  'c-mina': 'w-11818.jpg',
  'c-noemi': 'w-17894.jpg',
  'c-gallery': 'w-18435.png',
  'c-tumtum': 'w-18439.png',
  'c-aretha': 'w-22666.jpg',
  'c-a': 'w-27173.png',
  'c-chelsea': 'w-27176.png',
  'c-wight': 'w-27179.png',
  'c-keywest': 'w-27244.png',
  'c-trebbia': 'w-27701.jpg',
  'c-darling': 'w-27702.jpg',
  'c-lulli': 'w-27177.png',
  'c-milano': 'w-27178.png',
  'c-mimosa': 'w-18440.png',
  'c-mini-a': 'w-18433.png',
  'c-busy-day': 'w-18437.png',
  'c-coccodrillo': 'w-681.jpg',
  'c-mymosa': 'w-mymosa.png',
  'c-angie': 'w-angie.png',
  'c-bambi': 'w-bambi.png',
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
    await img.clone().webp({ quality: 80 }).toFile(`${OUT}/${name}-${width}.webp`)
    await img.clone().avif({ quality: 55, effort: 4 }).toFile(`${OUT}/${name}-${width}.avif`)
  }
  manifest[name] = { w: meta.width, h: meta.height, widths: ws }
  console.log(name, meta.width + 'x' + meta.height)
}

await writeFile('src/data/images.json', JSON.stringify(manifest, null, 1))
