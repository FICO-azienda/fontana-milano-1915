import { useEffect, useRef, useState } from 'react'
import { NAV } from '../data/nav'
import { useStore } from '../lib/store'
import { useScrolled } from '../lib/hooks'
import { IconBag, IconHeart, IconMenu, IconSearch } from './Icons'
import { LanguageSelector } from './LanguageSelector'
import { MegaMenu } from './MegaMenu'

export function Header({ overHero, path }: { overHero: boolean; path: string }) {
  const { t, count, wishlist, dispatch } = useStore()
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState<string | null>(null)
  const timer = useRef<number>(0)

  useEffect(() => setOpen(null), [path])

  const enter = (id: string) => { window.clearTimeout(timer.current); setOpen(id) }
  const leave = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(null), 160) }

  const solid = scrolled || !overHero || open !== null
  const compact = scrolled

  return (
    <header
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(null) }}
      className="fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color,height] duration-[700ms] ease-lux"
      style={{
        height: compact ? 64 : 'var(--header-h)',
        background: solid ? 'rgb(248 247 244 / 0.86)' : 'transparent',
        backdropFilter: solid ? 'blur(16px) saturate(1.1)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(16px) saturate(1.1)' : 'none',
        borderBottom: `1px solid ${solid ? 'var(--color-line)' : 'transparent'}`,
      }}
    >
      <div className="mx-auto grid h-full max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center px-5 xl:px-12">
        {/* sinistra: menu (mobile) / navigazione (desktop) */}
        <div className="flex h-full items-center">
          <button type="button" aria-label={t('util.menu')} onClick={() => dispatch({ t: 'menu', v: true })} className="-ml-2 grid h-11 w-11 place-items-center xl:hidden">
            <IconMenu />
          </button>
          <nav aria-label="Principale" className="hidden h-full xl:block">
            <ul className="flex h-full items-stretch gap-9">
              {NAV.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center"
                  onMouseEnter={() => enter(it.id)}
                  onMouseLeave={leave}
                  onFocus={() => enter(it.id)}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) leave() }}
                >
                  <a
                    href={'#' + it.href}
                    aria-haspopup="true"
                    aria-expanded={open === it.id}
                    aria-controls={`mega-${it.id}`}
                    className={`eyebrow u-link ${open === it.id ? 'is-active' : ''}`}
                  >
                    {t(it.key)}
                  </a>
                  <MegaMenu item={it} id={`mega-${it.id}`} open={open === it.id} onNavigate={() => setOpen(null)} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* centro: wordmark */}
        <a href="#/" aria-label="Fontana Milano 1915" className="flex flex-col items-center text-center leading-none">
          <span className="serif font-normal transition-[font-size] duration-[700ms] ease-lux" style={{ fontSize: compact ? 20 : undefined, letterSpacing: '0.38em', marginRight: '-0.38em' }}>
            <span className={compact ? '' : 'text-[22px] xl:text-[30px]'}>FONTANA</span>
          </span>
          <span
            className="mt-[7px] text-[8px] tracking-[0.55em] transition-[opacity,max-height,margin] duration-[700ms] ease-lux xl:text-[9px]"
            style={{ marginRight: '-0.55em', maxHeight: compact ? 0 : 14, opacity: compact ? 0 : 1, marginTop: compact ? 0 : 7, overflow: 'hidden' }}
          >
            MILANO 1915
          </span>
        </a>

        {/* destra: utility */}
        <div className="flex items-center justify-end gap-1 xl:gap-8">
          <button type="button" onClick={() => dispatch({ t: 'search', v: true })} aria-label={t('util.search')} className="grid h-11 w-11 place-items-center xl:h-auto xl:w-auto">
            <IconSearch className="xl:hidden" />
            <span className="eyebrow u-link hidden xl:inline">{t('util.search')}</span>
          </button>
          <a href="#/account" aria-label={t('util.account')} className="hidden xl:block">
            <span className="eyebrow u-link">{t('util.account')}</span>
          </a>
          <a href="#/preferiti" aria-label={`${t('util.wishlist')}${wishlist.length ? ` (${wishlist.length})` : ''}`} className="relative hidden xl:block">
            <IconHeart width={18} height={18} filled={wishlist.length > 0} />
          </a>
          <button type="button" onClick={() => dispatch({ t: 'mini', v: true })} aria-label={`${t('util.bag')} (${count})`} className="relative grid h-11 w-11 place-items-center xl:h-auto xl:w-auto">
            <IconBag className="xl:hidden" />
            {count > 0 && <span className="absolute right-1 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] leading-none text-ivory xl:hidden">{count}</span>}
            <span className="eyebrow u-link hidden xl:inline">{t('util.bag')} ({count})</span>
          </button>
          <LanguageSelector className="ml-2 hidden xl:flex" />
        </div>
      </div>
    </header>
  )
}
