import type { Lang } from '../lib/i18n'
import type { ImgName } from '../components/Pic'
import { CATALOG, type Gender } from './catalog'
import selection from '../../scripts/product-selection.json'

export type Colorway = {
  id: string
  name: Record<Lang, string>
  swatch: string
  images: ImgName[]
  alts: Record<Lang, string[]>
}

export type Product = {
  id: string
  name: string
  gender: Gender
  /** Prezzo indicativo (segnaposto: il sito originale non espone i prezzi). */
  price: number
  /** Solo A Man: titolo esteso e sottotitolo editoriale. */
  eyebrow?: string
  title?: string
  subtitle?: Record<Lang, string>
  colors: Colorway[]
  desc: Record<Lang, string[]>
  /** true = testi tecnici curati a mano (A Man); altrimenti testi generici. */
  curated?: boolean
}

const PRICES: Record<string, number> = {
  'a-man': 2450, summit: 1980, wonderland: 2350, 'back24-back48': 1650, 'rush-peterpan': 1480, timothy: 1590,
  bazooka: 1750, titan: 1290, 'wall-street': 690,
  mina: 1650, wight: 1490, gallery: 1590, 'tum-tum': 1790, aretha: 1690, chelsea: 1850, noemi: 1550, 'key-west': 1450,
  'trebbia-26': 1950, a: 2150, 'mini-lucky': 1250, lulli: 1750, milano: 1690, mimosa: 1590, mymosa: 1490,
  'mini-a': 1650, angie: 2250, bambi: 1050, 'busy-day': 1290, coccodrillo: 6900,
}

const A_MAN: Product = {
  id: 'a-man', name: 'A Man', gender: 'men', price: PRICES['a-man'], curated: true,
  eyebrow: 'A Man', title: 'A Travel',
  subtitle: { it: 'Cartella da città in pelle.', en: 'Leather city briefcase.' },
  desc: {
    it: [
      'A: essenziale, minimale, strutturata.',
      'A: anche per Lui.',
      'Più lunga e più stretta rispetto alla versione femminile, mantiene ogni elemento distintivo del primo modello “senza tempo”, realizzato dalla maison.',
      'Una cartella da città, che si fa riconoscere, tra la folla, nel corso di un meeting, durante un pranzo di lavoro e in mille altre occasioni, tutte da vivere.',
    ],
    en: [
      'A: quintessential, minimalist, structured.',
      'A: for him too.',
      'Longer and narrower than the women’s version, it retains each distinctive element of the first Timeless model created by our firm.',
      'A briefcase for the city, which stands out in the crowd, in a meeting, during a business lunch and a host of other occasions, all for his enjoyment.',
    ],
  },
  colors: [
    {
      id: 'carbon', name: { it: 'Carbon', en: 'Carbon' }, swatch: '#1b1917',
      images: ['carbon-front', 'carbon-side', 'carbon-back', 'carbon-lying', 'detail-buckle', 'detail-clasp'],
      alts: {
        it: ['A Man A Travel in Carbon, vista frontale', 'A Man A Travel in Carbon, vista tre quarti', 'A Man A Travel in Carbon, vista posteriore', 'A Man A Travel in Carbon, appoggiata sul lato', 'Dettaglio delle fibbie e del logo Fontana', 'Dettaglio della chiusura a linguetta in metallo'],
        en: ['A Man A Travel in Carbon, front view', 'A Man A Travel in Carbon, three-quarter view', 'A Man A Travel in Carbon, back view', 'A Man A Travel in Carbon, lying on its side', 'Detail of the buckles and the Fontana logo', 'Detail of the metal tab closure'],
      },
    },
    {
      id: 'slate', name: { it: 'Grigio ardesia', en: 'Slate grey' }, swatch: '#48525c',
      images: ['slate-front', 'slate-side', 'slate-back', 'slate-lying', 'slate-open', 'detail-slate'],
      alts: {
        it: ['A Man A Travel in grigio ardesia, vista frontale', 'A Man A Travel in grigio ardesia, vista tre quarti', 'A Man A Travel in grigio ardesia, vista posteriore', 'A Man A Travel in grigio ardesia, appoggiata sul lato', 'A Man A Travel in grigio ardesia, aperta', 'Dettaglio delle fibbie e del logo Fontana'],
        en: ['A Man A Travel in slate grey, front view', 'A Man A Travel in slate grey, three-quarter view', 'A Man A Travel in slate grey, back view', 'A Man A Travel in slate grey, lying on its side', 'A Man A Travel in slate grey, open', 'Detail of the buckles and the Fontana logo'],
      },
    },
  ],
}

type Sel = { colorways: { name: Record<Lang, string>; swatch: string; images: string[] }[]; desc_it: string[]; desc_en: string[] }
const sel = selection as unknown as Record<string, Sel>

const fromSelection = (slug: string): Product | null => {
  const meta = CATALOG.find((c) => c.id === slug)
  const s = sel[slug]
  if (!meta || !s) return null
  const colors: Colorway[] = s.colorways.map((c, i) => {
    const images = c.images.map((f) => `p-${slug}-${f.replace(/\..*$/, '')}` as ImgName)
    return {
      id: `c${i + 1}`, name: c.name, swatch: c.swatch, images,
      alts: {
        it: images.map((_, n) => `${meta.name} — ${c.name.it}, foto ${n + 1}`),
        en: images.map((_, n) => `${meta.name} — ${c.name.en}, photo ${n + 1}`),
      },
    }
  })
  return { id: slug, name: meta.name, gender: meta.gender, price: PRICES[slug] ?? 1500, colors, desc: { it: s.desc_it, en: s.desc_en.length ? s.desc_en : s.desc_it } }
}

export const PRODUCTS: Product[] = CATALOG.map((c) => (c.id === 'a-man' ? A_MAN : fromSelection(c.id))).filter((p): p is Product => !!p)
export const findProduct = (id: string) => PRODUCTS.find((p) => p.id === id)
