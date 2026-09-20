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

const it = (gender: Gender, slug: string, name: string, img: ImgName, keywords = ''): CatalogItem => ({
  id: slug, name, gender, img, path: `/${gender === 'men' ? 'uomo' : 'donna'}/${slug}`, internal: true, keywords,
})

export const CATALOG: CatalogItem[] = [
  it('men', 'a-man', 'A Man', 'c-a-man', 'a travel cartella briefcase carbon'),
  it('men', 'summit', 'Summit', 'c-summit', 'cartella briefcase'),
  it('men', 'wonderland', 'Wonderland', 'c-wonderland', 'borsone duffle viaggio travel'),
  it('men', 'back24-back48', 'Back24 & Back48', 'c-back', 'zaino backpack'),
  it('men', 'rush-peterpan', 'Rush', 'c-rush', 'tracolla messenger'),
  it('men', 'timothy', 'Timothy', 'c-timothy', 'zaino sling'),
  it('men', 'bazooka', 'Bazooka', 'c-bazooka', 'shopper tote porta pc'),
  it('men', 'titan', 'Titan', 'c-titan', 'portadocumenti folder cartella a mano'),
  it('men', 'wall-street', 'Wall Street', 'c-wallstreet', 'pochette busta envelope'),
  it('women', 'mina', 'Mina', 'c-mina', 'tracolla shoulder'),
  it('women', 'wight', 'Wight', 'c-wight', 'soft bag zaino'),
  it('women', 'gallery', 'Gallery', 'c-gallery', 'secchiello bucket tracolla'),
  it('women', 'tum-tum', 'Tum Tum', 'c-tumtum', 'shopper tote'),
  it('women', 'aretha', 'Aretha', 'c-aretha', 'hobo'),
  it('women', 'chelsea', 'Chelsea', 'c-chelsea'),
  it('women', 'noemi', 'Noemi', 'c-noemi'),
  it('women', 'key-west', 'Key West', 'c-keywest', 'tracolla catena chain'),
  it('women', 'trebbia-26', 'Trebbia 26', 'c-trebbia'),
  it('women', 'a', 'A', 'c-a', 'a timeless cartella'),
  it('women', 'mini-lucky', 'Darling', 'c-darling', 'mini lucky'),
  it('women', 'lulli', 'Lulli', 'c-lulli', 'timeless'),
  it('women', 'milano', 'Milano', 'c-milano', 'shopping bag genderless'),
  it('women', 'mimosa', 'Mimosa', 'c-mimosa', 'timeless'),
  it('women', 'mymosa', 'Mymosa', 'c-mymosa', 'destrutturata'),
  it('women', 'mini-a', 'Mini A', 'c-mini-a', 'piccola small'),
  it('women', 'angie', 'Angie', 'c-angie', 'bowling bag borsone weekend'),
  it('women', 'bambi', 'Bambi', 'c-bambi', 'tracolla'),
  it('women', 'busy-day', 'Busy Day', 'c-busy-day', 'tracolla'),
  it('women', 'coccodrillo', 'Coccodrillo', 'c-coccodrillo', 'croco crocodile'),
]

export const MEN = CATALOG.filter((c) => c.gender === 'men')
export const WOMEN = CATALOG.filter((c) => c.gender === 'women')

export const itemHref = (c: CatalogItem) => '#' + c.path
