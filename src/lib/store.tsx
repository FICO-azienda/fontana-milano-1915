import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { dict, type Key, type Lang } from './i18n'
import { findProduct } from '../data/products'

export type CartLine = { productId: string; colorId: string; qty: number }
export const lineKey = (l: { productId: string; colorId: string }) => `${l.productId}:${l.colorId}`
type State = {
  lang: Lang
  cart: CartLine[]
  wishlist: string[]
  miniCart: boolean
  justAdded: boolean
  search: boolean
  menu: boolean
}
type Action =
  | { t: 'lang'; v: Lang }
  | { t: 'add'; productId: string; colorId: string; qty: number }
  | { t: 'qty'; productId: string; colorId: string; qty: number }
  | { t: 'remove'; productId: string; colorId: string }
  | { t: 'clear' }
  | { t: 'wish'; id: string }
  | { t: 'mini'; v: boolean }
  | { t: 'search'; v: boolean }
  | { t: 'menu'; v: boolean }

const KEY = 'fm1915:v2'
const initial = (): State => {
  let saved: Partial<State> = {}
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') } catch { /* storage non disponibile */ }
  const nav = typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'it'
  return {
    lang: saved.lang === 'en' || saved.lang === 'it' ? saved.lang : nav,
    cart: Array.isArray(saved.cart) ? saved.cart.filter((l) => l?.productId && findProduct(l.productId)) : [],
    wishlist: Array.isArray(saved.wishlist) ? saved.wishlist : [],
    miniCart: false, justAdded: false, search: false, menu: false,
  }
}

const clamp = (n: number) => Math.max(1, Math.min(9, n))

function reduce(s: State, a: Action): State {
  switch (a.t) {
    case 'lang': return { ...s, lang: a.v }
    case 'add': {
      const k = lineKey(a)
      const found = s.cart.find((l) => lineKey(l) === k)
      const cart = found
        ? s.cart.map((l) => (lineKey(l) === k ? { ...l, qty: clamp(l.qty + a.qty) } : l))
        : [...s.cart, { productId: a.productId, colorId: a.colorId, qty: clamp(a.qty) }]
      return { ...s, cart, miniCart: true, justAdded: true }
    }
    case 'qty': return { ...s, cart: s.cart.map((l) => (lineKey(l) === lineKey(a) ? { ...l, qty: clamp(a.qty) } : l)) }
    case 'remove': return { ...s, cart: s.cart.filter((l) => lineKey(l) !== lineKey(a)) }
    case 'clear': return { ...s, cart: [] }
    case 'wish': return { ...s, wishlist: s.wishlist.includes(a.id) ? s.wishlist.filter((x) => x !== a.id) : [...s.wishlist, a.id] }
    case 'mini': return { ...s, miniCart: a.v, justAdded: a.v ? s.justAdded : false, search: a.v ? false : s.search, menu: a.v ? false : s.menu }
    case 'search': return { ...s, search: a.v, miniCart: a.v ? false : s.miniCart, menu: a.v ? false : s.menu }
    case 'menu': return { ...s, menu: a.v }
  }
}

type Ctx = State & {
  t: (k: Key) => string
  money: (n: number) => string
  count: number
  total: number
  dispatch: React.Dispatch<Action>
}
const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reduce, undefined, initial)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ lang: s.lang, cart: s.cart, wishlist: s.wishlist })) } catch { /* noop */ }
    document.documentElement.lang = s.lang
  }, [s.lang, s.cart, s.wishlist])

  const t = useCallback((k: Key) => dict[s.lang][k], [s.lang])
  const money = useCallback(
    (n: number) => '€ ' + new Intl.NumberFormat(s.lang === 'it' ? 'it-IT' : 'en-GB', { useGrouping: 'always', maximumFractionDigits: 0 } as unknown as Intl.NumberFormatOptions).format(n),
    [s.lang],
  )
  const value = useMemo<Ctx>(() => {
    const count = s.cart.reduce((n, l) => n + l.qty, 0)
    const total = s.cart.reduce((n, l) => n + l.qty * (findProduct(l.productId)?.price ?? 0), 0)
    return { ...s, t, money, count, total, dispatch }
  }, [s, t, money])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('StoreProvider mancante')
  return c
}
