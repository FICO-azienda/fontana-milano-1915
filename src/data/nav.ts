import type { Key } from '../lib/i18n'
import type { ImgName } from '../components/Pic'
import { MEN, WOMEN } from './catalog'

export type NavLink = { key?: Key; label?: string; href: string; external?: boolean }
export type NavCard = { img: ImgName; label?: string; key?: Key; href: string; external?: boolean }
export type NavItem = { id: string; key: Key; href: string; links: NavLink[]; cards: NavCard[] }

const pick = (list: typeof MEN, ids: string[]) => ids.map((id) => list.find((c) => c.id === id)!)

export const NAV: NavItem[] = [
  {
    id: 'women', key: 'nav.women', href: '/donna',
    links: [
      { key: 'col.title.women', href: '/donna' },
      ...pick(WOMEN, ['mina', 'wight', 'gallery', 'tum-tum']).map((c) => ({ label: c.name, href: c.path })),
    ],
    cards: pick(WOMEN, ['mina', 'wight', 'key-west']).map((c) => ({ img: c.img, label: c.name, href: c.path })),
  },
  {
    id: 'men', key: 'nav.men', href: '/uomo',
    links: [
      { key: 'col.title.men', href: '/uomo' },
      { label: 'A Man', href: '/uomo/a-man' },
      ...pick(MEN, ['summit', 'wonderland', 'titan']).map((c) => ({ label: c.name, href: c.path })),
    ],
    cards: [
      { img: 'c-a-man', label: 'A Man', href: '/uomo/a-man' },
      ...pick(MEN, ['summit', 'wonderland']).map((c) => ({ img: c.img, label: c.name, href: c.path })),
    ],
  },
  {
    id: 'collections', key: 'nav.collections', href: '/collezioni',
    links: [
      { key: 'col.title.all', href: '/collezioni' },
      { key: 'col.title.women', href: '/donna' },
      { key: 'col.title.men', href: '/uomo' },
    ],
    cards: [
      { img: 'carbon-front', label: 'A Man', href: '/uomo/a-man' },
      { img: 'c-wight', label: 'Wight', href: '/donna/wight' },
      { img: 'c-titan', label: 'Titan', href: '/uomo/titan' },
    ],
  },
  {
    id: 'world', key: 'nav.world', href: '/il-mondo-fontana',
    links: [
      { key: 'world.history', href: '/il-mondo-fontana/storia' },
      { key: 'world.italy', href: '/il-mondo-fontana/made-in-italy' },
      { key: 'world.workshop', href: '/il-mondo-fontana/workshop' },
      { key: 'world.design', href: '/il-mondo-fontana/design' },
      { key: 'world.special', href: '/il-mondo-fontana/special-projects' },
    ],
    cards: [
      { img: 'workshop', key: 'world.workshop', href: '/il-mondo-fontana/workshop' },
      { img: 'detail-buckle', key: 'world.design', href: '/il-mondo-fontana/design' },
      { img: 'special-projects', key: 'world.special', href: '/il-mondo-fontana/special-projects' },
    ],
  },
]

export const linkHref = (l: { href: string; external?: boolean }) => (l.external ? l.href : '#' + l.href)
