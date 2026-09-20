import type { FormEvent } from 'react'
import { CATALOG } from '../data/catalog'
import { Cta } from '../components/Cta'
import { useStore } from '../lib/store'
import { Grid } from './Collection'

export function Account() {
  const { t } = useStore()
  const stop = (e: FormEvent) => e.preventDefault()
  return (
    <main id="main" tabIndex={-1} className="pt-[var(--header-h)]">
      <div className="mx-auto max-w-[520px] px-5 pb-40 pt-20 xl:pt-32">
        <h1 className="display text-[48px] md:text-[72px]">{t('account.title')}</h1>
        <p className="eyebrow mt-10 text-mute">{t('account.login')}</p>
        <form onSubmit={stop} className="mt-8 space-y-8">
          <div>
            <label htmlFor="a-email" className="eyebrow block text-mute">{t('account.email')}</label>
            <input id="a-email" type="email" autoComplete="email" className="mt-2 h-12 w-full border-0 border-b border-line bg-transparent text-[15px] focus:border-ink focus:outline-none" />
          </div>
          <div>
            <label htmlFor="a-pw" className="eyebrow block text-mute">{t('account.password')}</label>
            <input id="a-pw" type="password" autoComplete="current-password" className="mt-2 h-12 w-full border-0 border-b border-line bg-transparent text-[15px] focus:border-ink focus:outline-none" />
          </div>
          <button type="submit" className="btn">{t('account.submit')}</button>
          <p className="text-[12px] text-mute">{t('account.note')}</p>
        </form>
        <div className="mt-16"><Cta href="#/preferiti">{t('account.wishlist')}</Cta></div>
      </div>
    </main>
  )
}

export function Wishlist() {
  const { t, wishlist } = useStore()
  const items = CATALOG.filter((c) => wishlist.includes(c.id))
  return (
    <main id="main" tabIndex={-1} className="pt-[var(--header-h)]">
      <div className="mx-auto max-w-[1920px] px-5 pb-32 pt-16 xl:px-12 xl:pt-28">
        <h1 className="display mb-16 text-[56px] md:text-[104px]">{t('wish.title')}</h1>
        {items.length ? <Grid items={items} /> : (
          <>
            <p className="serif text-[24px] font-light italic text-mute">{t('wish.empty')}</p>
            <div className="mt-10"><Cta href="#/collezioni">{t('bag.discover')}</Cta></div>
          </>
        )}
      </div>
    </main>
  )
}
