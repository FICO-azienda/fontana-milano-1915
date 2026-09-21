import type { ImgName } from '../components/Pic'

export const SITE = 'https://www.fontanamilano1915.com'

export type Gender = 'men' | 'women'
export type CatalogItem = {
  id: string // = slug della pagina prodotto
  name: string
  gender: Gender
  img: ImgName // miniatura per liste, mega-menu e ricerca
  path: string // rotta interna della scheda prodotto
  internal: true
  keywords?: string
}

const it = (gender: Gender, slug: string, name: string, keywords = ''): CatalogItem => ({
  id: slug, name, gender, img: `t-${slug}` as ImgName, path: `/${gender === 'men' ? 'uomo' : 'donna'}/${slug}`, internal: true, keywords,
})

export const CATALOG: CatalogItem[] = [
  it('men', 'a-man', 'A Man', 'a travel cartella briefcase carbon'),
  it('men', 'summit', 'Summit', 'cartella briefcase'),
  it('men', 'wonderland', 'Wonderland', 'borsone duffle viaggio travel'),
  it('men', 'back24-back48', 'Back24 & Back48', 'zaino backpack'),
  it('men', 'rush-peterpan', 'Rush', 'tracolla messenger'),
  it('men', 'timothy', 'Timothy', 'zaino sling'),
  it('men', 'bazooka', 'Bazooka', 'shopper tote porta pc'),
  it('men', 'titan', 'Titan', 'portadocumenti folder cartella a mano'),
  it('men', 'wall-street', 'Wall Street', 'pochette busta envelope'),
  it('women', 'mina', 'Mina', 'tracolla shoulder'),
  it('women', 'wight', 'Wight', 'soft bag zaino'),
  it('women', 'gallery', 'Gallery', 'secchiello bucket tracolla'),
  it('women', 'tum-tum', 'Tum Tum', 'shopper tote'),
  it('women', 'aretha', 'Aretha', 'hobo'),
  it('women', 'chelsea', 'Chelsea'),
  it('women', 'noemi', 'Noemi'),
  it('women', 'key-west', 'Key West', 'tracolla catena chain'),
  it('women', 'trebbia-26', 'Trebbia 26'),
  it('women', 'a', 'A', 'a timeless cartella'),
  it('women', 'mini-lucky', 'Darling', 'mini lucky'),
  it('women', 'lulli', 'Lulli', 'timeless'),
  it('women', 'milano', 'Milano', 'shopping bag genderless'),
  it('women', 'mimosa', 'Mimosa', 'timeless'),
  it('women', 'mymosa', 'Mymosa', 'destrutturata'),
  it('women', 'mini-a', 'Mini A', 'piccola small'),
  it('women', 'angie', 'Angie', 'bowling bag borsone weekend'),
  it('women', 'bambi', 'Bambi', 'tracolla'),
  it('women', 'busy-day', 'Busy Day', 'tracolla'),
  it('women', 'coccodrillo', 'Coccodrillo', 'croco crocodile'),
]

export const MEN = CATALOG.filter((c) => c.gender === 'men')
export const WOMEN = CATALOG.filter((c) => c.gender === 'women')

export const itemHref = (c: CatalogItem) => '#' + c.path
