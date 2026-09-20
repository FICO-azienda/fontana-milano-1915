import { useRef, useState } from 'react'
import { NAV, linkHref } from '../data/nav'
import { useStore } from '../lib/store'
import { useDialog, useScrollLock } from '../lib/hooks'
import { IconChevron, IconClose, IconHeart, IconSearch, IconUser } from './Icons'
import { LanguageSelector } from './LanguageSelector'

export function MobileMenu() {
  const { menu, dispatch, t, wishlist } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<string | null>(null)
  const close = () => dispatch({ t: 'menu', v: false })
  useScrollLock(menu)
  useDialog(ref, menu, close)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t('util.menu')}
      aria-hidden={!menu}
      className="fixed inset-0 z-[60] flex flex-col bg-ivory xl:hidden"
      style={{
        opacity: menu ? 1 : 0,
        visibility: menu ? 'visible' : 'hidden',
        transition: 'opacity .6s var(--ease-lux), visibility 0s linear ' + (menu ? '0s' : '.6s'),
      }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <button type="button" onClick={close} aria-label={t('util.close')} className="-ml-2 grid h-11 w-11 place-items-center">
          <IconClose />
        </button>
        <span className="serif text-[18px] tracking-[0.36em]">FONTANA</span>
        <span className="w-11" />
      </div>

      <nav aria-label={t('util.menu')} className="flex-1 overflow-y-auto px-6 pb-8 pt-6">
        <ul>
          {NAV.map((it, i) => {
            const isOpen = open === it.id
            return (
              <li key={it.id} className="border-b border-line" style={{ opacity: menu ? 1 : 0, transform: menu ? 'none' : 'translateY(10px)', transition: `opacity .8s var(--ease-lux) ${menu ? 150 + i * 70 : 0}ms, transform .8s var(--ease-lux) ${menu ? 150 + i * 70 : 0}ms` }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`m-${it.id}`}
                  onClick={() => setOpen(isOpen ? null : it.id)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="serif text-[34px] font-light leading-none">{t(it.key)}</span>
                  <IconChevron width={16} height={16} className="transition-transform duration-500 ease-lux" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                <div id={`m-${it.id}`} className="acc-panel" data-open={isOpen}>
                  <div>
                    <ul className="acc-inner flex flex-col gap-3 pb-6 pl-1">
                      {it.links.map((l, j) => (
                        <li key={l.href + j}>
                          <a
                            href={linkHref(l)}
                            {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: close })}
                            tabIndex={isOpen ? 0 : -1}
                            className="text-[13px] tracking-[0.12em] uppercase text-mute"
                          >
                            {l.key ? t(l.key) : l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center justify-between border-t border-line px-6 py-5">
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
          <button type="button" className="flex items-center gap-2" onClick={() => dispatch({ t: 'search', v: true })}><IconSearch width={16} height={16} />{t('util.search')}</button>
          <a href="#/account" onClick={close} className="flex items-center gap-2"><IconUser width={16} height={16} />{t('util.account')}</a>
          <a href="#/preferiti" onClick={close} className="flex items-center gap-2" aria-label={t('util.wishlist')}><IconHeart width={16} height={16} />{wishlist.length || ''}</a>
        </div>
        <LanguageSelector />
      </div>
    </div>
  )
}
