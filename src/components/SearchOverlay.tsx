import { useMemo, useRef, useState } from 'react'
import { CATALOG, itemHref, type CatalogItem } from '../data/catalog'
import { useStore } from '../lib/store'
import { useDialog, useScrollLock } from '../lib/hooks'
import { IconClose } from './Icons'
import { Pic } from './Pic'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
const SUGGESTED = ['a-man', 'summit', 'mina', 'wight']

function Card({ c, onPick, t }: { c: CatalogItem; onPick: () => void; t: (k: 'col.men' | 'col.women') => string }) {
  const external = !c.internal
  return (
    <a href={itemHref(c)} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: onPick })} className="group block">
      <div className="zoom-frame aspect-[4/3] bg-stone">
        <Pic name={c.img} alt="" sizes="(min-width:1024px) 22vw, 46vw" imgClassName="blend h-full w-full object-cover" />
      </div>
      <p className="mt-3 flex items-baseline justify-between">
        <span className="serif text-[20px] font-light">{c.name}</span>
        <span className="eyebrow text-mute">{c.gender === 'men' ? t('col.men') : t('col.women')}</span>
      </p>
    </a>
  )
}

/** Ricerca a tutto schermo con risultati visuali. */
export function SearchOverlay() {
  const { search, dispatch, t } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const [q, setQ] = useState('')
  const close = () => dispatch({ t: 'search', v: false })
  useScrollLock(search)
  useDialog(ref, search, close)

  const results = useMemo(() => {
    const n = norm(q.trim())
    if (!n) return []
    const genderWords: Record<string, string[]> = { men: ['uomo', 'men', 'man'], women: ['donna', 'women', 'woman'] }
    return CATALOG.filter((c) => {
      const hay = norm(`${c.name} ${c.keywords ?? ''} ${genderWords[c.gender].join(' ')} borsa bag`)
      return n.split(/\s+/).every((w) => hay.includes(w))
    })
  }, [q])

  const suggested = SUGGESTED.map((id) => CATALOG.find((c) => c.id === id)!)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t('search.title')}
      aria-hidden={!search}
      className="fixed inset-0 z-[66] overflow-y-auto bg-ivory"
      style={{ opacity: search ? 1 : 0, visibility: search ? 'visible' : 'hidden', transition: `opacity .6s var(--ease-lux), visibility 0s linear ${search ? '0s' : '.6s'}` }}
    >
      <div className="mx-auto max-w-[1400px] px-5 pb-20 xl:px-12">
        <div className="flex h-16 items-center justify-between xl:h-[88px]">
          <p className="eyebrow">{t('search.title')}</p>
          <button type="button" onClick={close} aria-label={t('util.close')} className="-mr-2 grid h-11 w-11 place-items-center"><IconClose /></button>
        </div>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-6 xl:mt-10">
          <label htmlFor="q" className="sr-only">{t('search.title')}</label>
          <input
            id="q"
            data-autofocus
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            className="serif w-full border-0 border-b border-ink bg-transparent pb-4 text-[28px] font-light placeholder:text-mute/70 focus:outline-none md:text-[48px]"
          />
        </form>

        <div className="mt-12" aria-live="polite">
          {q.trim() ? (
            results.length ? (
              <>
                <p className="eyebrow mb-6 text-mute">{t('search.results')} ({results.length})</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                  {results.map((c) => <li key={c.id}><Card c={c} onPick={close} t={t} /></li>)}
                </ul>
              </>
            ) : (
              <p className="serif text-[22px] font-light italic text-mute">{t('search.none')}</p>
            )
          ) : (
            <>
              <ul className="mb-12 flex flex-wrap gap-x-8 gap-y-3">
                {t('search.terms').split('|').map((term) => (
                  <li key={term}><button type="button" onClick={() => setQ(term)} className="u-link serif text-[22px] font-light">{term}</button></li>
                ))}
              </ul>
              <p className="eyebrow mb-6 text-mute">{t('search.suggested')}</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
                {suggested.map((c) => <li key={c.id}><Card c={c} onPick={close} t={t} /></li>)}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
