import { CATALOG, MEN, WOMEN, itemHref, type CatalogItem } from '../data/catalog'
import { Pic } from '../components/Pic'
import { IconHeart } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { useStore } from '../lib/store'

export function Grid({ items }: { items: CatalogItem[] }) {
  const { t, wishlist, dispatch } = useStore()
  return (
    <ul className="grid grid-cols-2 gap-x-2 gap-y-12 md:grid-cols-3 md:gap-x-3 xl:grid-cols-4 xl:gap-y-16">
      {items.map((c, i) => {
        const wished = wishlist.includes(c.id)
        return (
          <li key={c.id}>
            <Reveal delay={(i % 4) * 70}>
              <div className="relative">
                <a href={itemHref(c)} {...(!c.internal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group block" aria-label={`${c.name}${!c.internal ? ' — ' + t('col.external') : ''}`}>
                  <div className="zoom-frame aspect-[4/5] bg-stone">
                    <Pic name={c.img} alt="" sizes="(min-width:1280px) 24vw, (min-width:768px) 32vw, 48vw" imgClassName="blend h-full w-full object-cover" />
                  </div>
                </a>
                <button type="button" aria-pressed={wished} aria-label={wished ? t('product.unwish') : t('product.wish')} onClick={() => dispatch({ t: 'wish', id: c.id })} className="absolute right-1 top-1 grid h-10 w-10 place-items-center">
                  <IconHeart width={18} height={18} filled={wished} />
                </button>
              </div>
              <p className="mt-4 flex items-baseline justify-between gap-2 px-1">
                <span className="serif text-[22px] font-light leading-none">{c.name}{!c.internal && <span aria-hidden className="ml-1 text-[13px] text-mute">↗</span>}</span>
                <span className="eyebrow text-mute">{c.gender === 'men' ? t('col.men') : t('col.women')}</span>
              </p>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}

export function Collection({ scope }: { scope: 'all' | 'men' | 'women' }) {
  const { t } = useStore()
  const items = scope === 'men' ? MEN : scope === 'women' ? WOMEN : CATALOG
  const title = scope === 'men' ? t('col.title.men') : scope === 'women' ? t('col.title.women') : t('col.title.all')
  const tabs = [
    { id: 'all', href: '#/collezioni', label: t('col.title.all') },
    { id: 'men', href: '#/uomo', label: t('col.title.men') },
    { id: 'women', href: '#/donna', label: t('col.title.women') },
  ]
  return (
    <main id="main" tabIndex={-1} className="pt-[var(--header-h)]">
      <div className="mx-auto max-w-[1920px] px-5 pb-32 pt-16 xl:px-12 xl:pt-28">
        <header className="mb-16 flex flex-col justify-between gap-8 xl:mb-24 xl:flex-row xl:items-end">
          <h1 className="display text-[56px] md:text-[104px]">{title}</h1>
          <nav aria-label={t('col.title.all')} className="eyebrow flex gap-8">
            {tabs.map((tab) => (
              <a key={tab.id} href={tab.href} aria-current={tab.id === scope ? 'page' : undefined} className="u-link">{tab.label}</a>
            ))}
          </nav>
        </header>
        <Grid items={items} />
      </div>
    </main>
  )
}
