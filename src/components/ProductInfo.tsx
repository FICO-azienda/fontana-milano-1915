import { useState } from 'react'
import type { Product } from '../data/products'
import { useStore } from '../lib/store'
import { Accordion } from './Accordion'
import { IconHeart, IconMinus, IconPlus } from './Icons'

type Props = { product: Product; colorId: string; onColor: (id: string) => void }

export function ProductInfo({ product, colorId, onColor }: Props) {
  const { t, money, lang, wishlist, dispatch } = useStore()
  const [qty, setQty] = useState(1)
  const [flash, setFlash] = useState(false)
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0]
  const wished = wishlist.includes(product.id)
  const paras = product.desc[lang].length ? product.desc[lang] : product.desc.it
  const eyebrow = product.eyebrow ?? t(product.gender === 'men' ? 'nav.men' : 'nav.women')

  const add = () => {
    dispatch({ t: 'add', productId: product.id, colorId: color.id, qty })
    setFlash(true)
    window.setTimeout(() => setFlash(false), 2400)
  }

  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-4 text-[44px] md:text-[56px]">{product.title ?? product.name}</h1>
      {product.subtitle && <p className="serif mt-3 text-[20px] font-light italic text-mute">{product.subtitle[lang]}</p>}
      <p className="mt-8 text-[15px] tracking-[0.06em] tabular-nums">{money(product.price)}</p>
      <p className="mt-1 text-[11px] tracking-[0.08em] text-mute">{t('product.taxes')}</p>

      <div className="mt-10">
        <p className="eyebrow flex items-baseline justify-between">
          <span>{t('product.color')}</span>
          <span className="text-mute normal-case tracking-[0.06em]" aria-live="polite">{color.name[lang]}</span>
        </p>
        <div role="radiogroup" aria-label={t('product.color')} className="mt-4 flex gap-4">
          {product.colors.map((c) => {
            const on = c.id === colorId
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={c.name[lang]}
                onClick={() => onColor(c.id)}
                className="grid h-9 w-9 place-items-center rounded-full border transition-colors duration-500"
                style={{ borderColor: on ? 'var(--color-ink)' : 'transparent' }}
              >
                <span className="block h-6 w-6 rounded-full" style={{ background: c.swatch }} />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-y border-line py-3">
        <span className="eyebrow" id="qty-l">{t('product.qty')}</span>
        <div className="flex items-center" role="group" aria-labelledby="qty-l">
          <button type="button" aria-label={t('mini.less')} onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center"><IconMinus width={14} height={14} /></button>
          <output className="w-8 text-center tabular-nums" aria-live="polite">{qty}</output>
          <button type="button" aria-label={t('mini.more')} onClick={() => setQty((q) => Math.min(9, q + 1))} className="grid h-10 w-10 place-items-center"><IconPlus width={14} height={14} /></button>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={add} className="btn flex-1">
          <span aria-live="polite">{flash ? t('product.added') : t('product.add')}</span>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ t: 'wish', id: product.id })}
          aria-pressed={wished}
          aria-label={wished ? t('product.unwish') : t('product.wish')}
          className="btn btn-ghost !w-[52px] !px-0 !border-line hover:!border-ink"
        >
          <IconHeart width={18} height={18} filled={wished} />
        </button>
      </div>

      <div className="mt-12">
        <Accordion
          defaultOpen="description"
          items={[
            {
              id: 'description', title: t('acc.description'),
              content: (
                <div className="space-y-4">
                  {paras.map((p, i) =>
                    i < 2 && product.curated ? (
                      <p key={i} className="serif text-[19px] font-light leading-[1.6] text-ink">{p}</p>
                    ) : i === 0 && p.length <= 170 ? (
                      <p key={i} className="serif text-[19px] font-light leading-[1.6] text-ink">{p}</p>
                    ) : (
                      <p key={i} className="text-[14px] leading-[1.9] text-mute">{p}</p>
                    ),
                  )}
                </div>
              ),
            },
            ...(product.curated
              ? [{ id: 'details', title: t('acc.details'), content: <ul className="space-y-1">{t('det.list').split('|').map((d) => <li key={d}>{d}</li>)}</ul> }]
              : []),
            { id: 'materials', title: t('acc.materials'), content: <p>{t(product.curated ? 'mat.body' : 'mat.generic')}</p> },
            { id: 'dimensions', title: t('acc.dimensions'), content: <p>{t(product.curated ? 'dim.body' : 'dim.generic')}</p> },
            { id: 'shipping', title: t('acc.shipping'), content: <p>{t('ship.body')}</p> },
          ]}
        />
      </div>
    </div>
  )
}
