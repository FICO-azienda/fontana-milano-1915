import { useRef } from 'react'
import { findProduct } from '../data/products'
import { lineKey, useStore } from '../lib/store'
import { useDialog, useScrollLock } from '../lib/hooks'
import { IconClose, IconMinus, IconPlus } from './Icons'
import { Pic } from './Pic'

/** Mini-cart laterale: si apre (senza redirect) quando si aggiunge un prodotto. */
export function MiniCart() {
  const { miniCart, justAdded, cart, total, count, t, money, lang, dispatch } = useStore()
  const ref = useRef<HTMLElement>(null)
  const close = () => dispatch({ t: 'mini', v: false })
  useScrollLock(miniCart)
  useDialog(ref, miniCart, close)

  return (
    <div className="fixed inset-0 z-[65]" style={{ visibility: miniCart ? 'visible' : 'hidden', transition: `visibility 0s linear ${miniCart ? '0s' : '.7s'}` }} aria-hidden={!miniCart}>
      <div
        onClick={close}
        className="absolute inset-0 bg-ink/30"
        style={{ opacity: miniCart ? 1 : 0, transition: 'opacity .7s var(--ease-lux)' }}
      />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={t('mini.title')}
        className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-ivory"
        style={{ transform: miniCart ? 'none' : 'translateX(100%)', transition: 'transform .8s var(--ease-lux)' }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 md:px-8">
          <h2 className="eyebrow">{t('mini.title')} <span className="text-mute">({count})</span></h2>
          <button type="button" data-autofocus onClick={close} aria-label={t('util.close')} className="-mr-2 grid h-11 w-11 place-items-center"><IconClose /></button>
        </div>

        {justAdded && (
          <p role="status" className="rise-in border-y border-line px-6 py-4 text-[13px] leading-snug md:px-8" key={count}>
            <span className="serif text-[18px] font-light italic">{t('mini.added')}</span>
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 md:px-8">
          {cart.length === 0 ? (
            <p className="py-16 text-center text-mute">{t('mini.empty')}</p>
          ) : (
            <ul>
              {cart.map((l) => {
                const pr = findProduct(l.productId)!
                const c = pr.colors.find((x) => x.id === l.colorId) ?? pr.colors[0]
                return (
                  <li key={lineKey(l)} className="grid grid-cols-[96px_1fr] gap-5 border-b border-line py-6">
                    <div className="aspect-[4/5] bg-stone">
                      <Pic name={c.images[0]} alt={c.alts[lang][0]} sizes="96px" imgClassName="blend h-full w-full object-cover" className="block h-full w-full overflow-hidden" />
                    </div>
                    <div className="flex flex-col">
                      <p className="eyebrow">{pr.eyebrow ?? t(pr.gender === 'men' ? 'nav.men' : 'nav.women')}</p>
                      <p className="serif mt-1 text-[22px] font-light leading-tight">{pr.title ?? pr.name}</p>
                      <p className="mt-1 text-[12px] text-mute">{c.name[lang]}</p>
                      <p className="mt-2 text-[13px] tabular-nums">{money(pr.price)}</p>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center border border-line" role="group" aria-label={t('mini.qty')}>
                          <button type="button" aria-label={t('mini.less')} onClick={() => l.qty > 1 && dispatch({ t: 'qty', productId: l.productId, colorId: l.colorId, qty: l.qty - 1 })} className="grid h-8 w-8 place-items-center"><IconMinus width={12} height={12} /></button>
                          <output className="w-6 text-center text-[13px] tabular-nums">{l.qty}</output>
                          <button type="button" aria-label={t('mini.more')} onClick={() => dispatch({ t: 'qty', productId: l.productId, colorId: l.colorId, qty: l.qty + 1 })} className="grid h-8 w-8 place-items-center"><IconPlus width={12} height={12} /></button>
                        </div>
                        <button type="button" onClick={() => dispatch({ t: 'remove', productId: l.productId, colorId: l.colorId })} className="u-link text-[11px] uppercase tracking-[0.16em] text-mute">{t('mini.remove')}</button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-line px-6 py-6 md:px-8">
          <div className="mb-5 flex items-baseline justify-between">
            <span className="eyebrow">{t('mini.total')}</span>
            <span className="text-[16px] tabular-nums">{money(total)}</span>
          </div>
          <a href="#/borsa" onClick={close} className="btn">{t('mini.go')}</a>
          <button type="button" onClick={close} className="u-link mx-auto mt-5 block text-[11px] uppercase tracking-[0.2em] text-mute">{t('mini.continue')}</button>
        </div>
      </aside>
    </div>
  )
}
