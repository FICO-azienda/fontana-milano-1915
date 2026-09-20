import { useState } from 'react'
import { A_MAN } from '../data/catalog'
import { useStore } from '../lib/store'
import { Accordion } from './Accordion'
import { IconHeart, IconMinus, IconPlus } from './Icons'

type Props = { colorId: string; onColor: (id: string) => void }

export function ProductInfo({ colorId, onColor }: Props) {
  const { t, money, lang, wishlist, dispatch } = useStore()
  const [qty, setQty] = useState(1)
  const [flash, setFlash] = useState(false)
  const color = A_MAN.colors.find((c) => c.id === colorId)!
  const wished = wishlist.includes('a-man')

  const add = () => {
    dispatch({ t: 'add', colorId, qty })
    setFlash(true)
    window.setTimeout(() => setFlash(false), 2400)
  }

  return (
    <div>
      <p className="eyebrow">{t('product.eyebrow')}</p>
      <h1 className="display mt-4 text-[44px] md:text-[56px]">{t('product.name')}</h1>
      <p className="serif mt-3 text-[20px] font-light italic text-mute">{t('product.subtitle')}</p>
      <p className="mt-8 text-[15px] tracking-[0.06em] tabular-nums">{money(A_MAN.price)}</p>
      <p className="mt-1 text-[11px] tracking-[0.08em] text-mute">{t('product.taxes')}</p>

      <div className="mt-10">
        <p className="eyebrow flex items-baseline justify-between">
          <span>{t('product.color')}</span>
          <span className="text-mute normal-case tracking-[0.06em]" aria-live="polite">{color.name[lang]}</span>
        </p>
        <div role="radiogroup" aria-label={t('product.color')} className="mt-4 flex gap-4">
          {A_MAN.colors.map((c) => {
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
          onClick={() => dispatch({ t: 'wish', id: 'a-man' })}
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
                <div className="serif space-y-4 text-[19px] font-light leading-[1.6] text-ink">
                  <p>{t('desc.1')}</p>
                  <p>{t('desc.2')}</p>
                  <p className="font-sans text-[14px] leading-[1.9] text-mute">{t('desc.3')}</p>
                  <p className="font-sans text-[14px] leading-[1.9] text-mute">{t('desc.4')}</p>
                </div>
              ),
            },
            { id: 'details', title: t('acc.details'), content: <ul className="space-y-1">{t('det.list').split('|').map((d) => <li key={d}>{d}</li>)}</ul> },
            { id: 'materials', title: t('acc.materials'), content: <p>{t('mat.body')}</p> },
            { id: 'dimensions', title: t('acc.dimensions'), content: <p>{t('dim.body')}</p> },
            { id: 'shipping', title: t('acc.shipping'), content: <p>{t('ship.body')}</p> },
          ]}
        />
      </div>
    </div>
  )
}
