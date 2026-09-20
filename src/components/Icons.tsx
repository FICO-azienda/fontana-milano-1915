import type { SVGProps } from 'react'

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const
type P = SVGProps<SVGSVGElement>

export const IconSearch = (p: P) => (<svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>)
export const IconUser = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="8.5" r="3.6" /><path d="M4.8 20c.6-3.7 3.5-5.7 7.2-5.7s6.6 2 7.2 5.7" /></svg>)
export const IconBag = (p: P) => (<svg {...base} {...p}><path d="M5.5 8.5h13l1 11.5h-15z" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" /></svg>)
export const IconHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" /></svg>
)
export const IconClose = (p: P) => (<svg {...base} {...p}><path d="M5 5l14 14M19 5 5 19" /></svg>)
export const IconMenu = (p: P) => (<svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>)
export const IconPlus = (p: P) => (<svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>)
export const IconMinus = (p: P) => (<svg {...base} {...p}><path d="M5 12h14" /></svg>)
export const IconArrow = ({ dir = 'right', ...p }: P & { dir?: 'left' | 'right' }) => (
  <svg {...base} {...p} style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
)
export const IconChevron = (p: P) => (<svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>)
