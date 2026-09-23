import { useRef, useState } from 'react'
import { itemHref, type CatalogItem } from '../data/catalog'
import { useStore } from '../lib/store'
import { IconArrow, IconHeart } from './Icons'
import { Pic } from './Pic'
import { Reveal } from './Reveal'

/** Scorrimento orizzontale di modelli con snap e indicatore di avanzamento sottile. */
export function ProductRail({ items, eyebrow, title }: { items: CatalogItem[]; eyebrow: string; title: string }) {
  const { t, wishlist, dispatch } = useStore()
  const track = useRef<HTMLUListElement>(null)
  const [p, setP] = useState(0)

  const onScroll = () => {
    const el = track.current!
    setP(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth))
  }
  const by = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.7, behavior: 'smooth' })

  return (
    <section aria-label={title} className="py-24 xl:py-36">
      <div className="mx-auto flex max-w-[1920px] items-end justify-between px-5 xl:px-12">
        <Reveal>
          <p className="eyebrow text-mute">{eyebrow}</p>
          <h2 className="display mt-3 text-[40px] xl:text-[64px]">{title}</h2>
        </Reveal>
        <div className="hidden gap-2 xl:flex">
          <button type="button" onClick={() => by(-1)} aria-label="Precedente" className="grid h-11 w-11 place-items-center border border-line transition-colors duration-500 hover:border-ink"><IconArrow dir="left" width={18} /></button>
          <button type="button" onClick={() => by(1)} aria-label="Successivo" className="grid h-11 w-11 place-items-center border border-line transition-colors duration-500 hover:border-ink"><IconArrow width={18} /></button>
        </div>
      </div>

      <ul ref={track} onScroll={onScroll} className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 xl:gap-4 xl:px-12" style={{ scrollPaddingLeft: 'max(1.25rem, 3rem)' }} tabIndex={-1}>
        {items.map((c) => {
          const wished = wishlist.includes(c.id)
          return (
            <li key={c.id} className="w-[62vw] shrink-0 snap-start md:w-[30vw] xl:w-[19vw] xl:max-w-[320px]">
              <div className="relative">
                <a href={itemHref(c)} {...(!c.internal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group block" aria-label={`${c.name}${!c.internal ? ' — ' + t('col.external') : ''}`}>
                  <div className="zoom-frame aspect-[4/5] bg-stone">
                    <Pic name={c.img} alt="" sizes="(min-width:1280px) 26vw, (min-width:768px) 38vw, 72vw" imgClassName="blend h-full w-full object-cover" />
                  </div>
                </a>
                <button type="button" aria-pressed={wished} aria-label={wished ? t('product.unwish') : t('product.wish')} onClick={() => dispatch({ t: 'wish', id: c.id })} className="absolute right-2 top-2 grid h-10 w-10 place-items-center">
                  <IconHeart width={18} height={18} filled={wished} />
                </button>
              </div>
              <p className="mt-4 flex items-baseline justify-between">
                <span className="serif text-[24px] font-light leading-none">{c.name}</span>
                <span className="eyebrow text-mute">{t('col.bag')}</span>
              </p>
            </li>
          )
        })}
      </ul>

      <div className="mx-auto mt-10 max-w-[1920px] px-5 xl:px-12" aria-hidden>
        <div className="relative h-px w-full bg-line">
          <div className="absolute left-0 top-0 h-px bg-ink" style={{ width: '22%', left: `${p * 78}%`, transition: 'left .2s linear' }} />
        </div>
      </div>
    </section>
  )
}
