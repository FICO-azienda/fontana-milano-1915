import type { Lang } from '../lib/i18n'
import type { ImgName } from '../components/Pic'

export const SITE = 'https://www.fontanamilano1915.com'

export type Colorway = {
  id: 'carbon' | 'slate'
  name: Record<Lang, string>
  swatch: string
  images: ImgName[]
  alts: Record<Lang, string[]>
}

/** Unico prodotto acquistabile in questa demo. Il prezzo è indicativo (il sito originale non lo espone). */
export const A_MAN = {
  id: 'a-man-a-travel',
  price: 2450,
  colors: [
    {
      id: 'carbon',
      name: { it: 'Carbon', en: 'Carbon' },
      swatch: '#1b1917',
      images: ['carbon-front', 'carbon-side', 'carbon-back', 'carbon-lying', 'detail-buckle', 'detail-clasp'],
      alts: {
        it: [
          'A Man A Travel in Carbon, vista frontale',
          'A Man A Travel in Carbon, vista tre quarti',
          'A Man A Travel in Carbon, vista posteriore',
          'A Man A Travel in Carbon, appoggiata sul lato',
          'Dettaglio delle fibbie e del logo Fontana',
          'Dettaglio della chiusura a linguetta in metallo',
        ],
        en: [
          'A Man A Travel in Carbon, front view',
          'A Man A Travel in Carbon, three-quarter view',
          'A Man A Travel in Carbon, back view',
          'A Man A Travel in Carbon, lying on its side',
          'Detail of the buckles and the Fontana logo',
          'Detail of the metal tab closure',
        ],
      },
    },
    {
      id: 'slate',
      name: { it: 'Grigio ardesia', en: 'Slate grey' },
      swatch: '#48525c',
      images: ['slate-front', 'slate-side', 'slate-back', 'slate-lying', 'slate-open', 'detail-slate'],
      alts: {
        it: [
          'A Man A Travel in grigio ardesia, vista frontale',
          'A Man A Travel in grigio ardesia, vista tre quarti',
          'A Man A Travel in grigio ardesia, vista posteriore',
          'A Man A Travel in grigio ardesia, appoggiata sul lato',
          'A Man A Travel in grigio ardesia, aperta',
          'Dettaglio delle fibbie e del logo Fontana',
        ],
        en: [
          'A Man A Travel in slate grey, front view',
          'A Man A Travel in slate grey, three-quarter view',
          'A Man A Travel in slate grey, back view',
          'A Man A Travel in slate grey, lying on its side',
          'A Man A Travel in slate grey, open',
          'Detail of the buckles and the Fontana logo',
        ],
      },
    },
  ] as Colorway[],
}

export type CatalogItem = {
  id: string
  name: string
  gender: 'men' | 'women'
  img: ImgName
  /** percorso sul sito Fontana (o rotta interna se internal) */
  path: string
  internal?: boolean
  keywords?: string
}

const men = (id: string, name: string, img: ImgName, path: string, keywords = ''): CatalogItem => ({ id, name, gender: 'men', img, path, keywords })
const women = (id: string, name: string, img: ImgName, path: string, keywords = ''): CatalogItem => ({ id, name, gender: 'women', img, path, keywords })

export const CATALOG: CatalogItem[] = [
  { ...men('a-man', 'A Man', 'c-a-man', '/uomo/a-man', 'a travel cartella briefcase carbon'), internal: true },
  men('summit', 'Summit', 'c-summit', '/uomo/summit', 'cartella briefcase'),
  men('wonderland', 'Wonderland', 'c-wonderland', '/uomo/wonderland', 'borsone duffle viaggio travel'),
  men('back', 'Back24 & Back48', 'c-back', '/uomo/back24-back48', 'zaino backpack'),
  men('rush', 'Rush', 'c-rush', '/uomo/rush-peterpan', 'tracolla messenger'),
  men('timothy', 'Timothy', 'c-timothy', '/uomo/timothy', 'zaino sling'),
  men('bazooka', 'Bazooka', 'c-bazooka', '/uomo/bazooka', 'shopper tote'),
  men('titan', 'Titan', 'c-titan', '/uomo/titan', 'portadocumenti folder pochette'),
  men('wall-street', 'Wall Street', 'c-wallstreet', '/uomo/wall-street', 'pochette busta envelope'),
  women('mina', 'Mina', 'c-mina', '/donna/mina', 'tracolla shoulder'),
  women('wight', 'Wight', 'c-wight', '/donna/wight', 'zaino backpack'),
  women('gallery', 'Gallery', 'c-gallery', '/donna/gallery', 'hobo tracolla'),
  women('tum-tum', 'Tum Tum', 'c-tumtum', '/donna/tum-tum', 'shopper tote'),
  women('aretha', 'Aretha', 'c-aretha', '/donna/aretha', 'hobo'),
  women('chelsea', 'Chelsea', 'c-chelsea', '/donna/chelsea', ''),
  women('noemi', 'Noemi', 'c-noemi', '/donna/noemi', ''),
  women('key-west', 'Key West', 'c-keywest', '/donna/key-west', ''),
  women('trebbia', 'Trebbia 26', 'c-trebbia', '/donna/trebbia-26', ''),
  women('a', 'A', 'c-a', '/donna', 'a travel cartella'),
]

export const MEN = CATALOG.filter((c) => c.gender === 'men')
export const WOMEN = CATALOG.filter((c) => c.gender === 'women')

export const itemHref = (c: CatalogItem) => (c.internal ? '#' + c.path : SITE + c.path)
