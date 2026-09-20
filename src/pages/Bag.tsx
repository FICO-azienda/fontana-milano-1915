import { useState, type FormEvent } from 'react'
import { Cta } from '../components/Cta'
import { IconMinus, IconPlus } from '../components/Icons'
import { Pic } from '../components/Pic'
import { A_MAN } from '../data/catalog'
import { useStore } from '../lib/store'

const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <main id="main" tabIndex={-1} className="pt-[var(--header-h)]">
    <div className="mx-auto max-w-[1400px] px-5 pb-32 pt-16 xl:px-12 xl:pt-24">
      <h1 className="display mb-14 text-[48px] md:text-[80px]">{title}</h1>
      {children}
    </div>
  </main>
)

function Summary({ cta }: { cta?: React.ReactNode }) {
  const { t, total, money } = useStore()
  return (
    <aside aria-label={t('bag.summary')} className="h-fit bg-stone p-8">
      <h2 className="eyebrow">{t('bag.summary')}</h2>
      <dl className="mt-8 space-y-4 text-[14px]">
        <div className="flex justify-between"><dt className="text-mute">{t('bag.subtotal')}</dt><dd className="tabular-nums">{money(total)}</dd></div>
        <div className="flex justify-between"><dt className="text-mute">{t('bag.shipping')}</dt><dd>{t('bag.free')}</dd></div>
        <div className="flex justify-between border-t border-line pt-5 text-[16px]"><dt className="eyebrow">{t('bag.total')}</dt><dd className="tabular-nums">{money(total)}</dd></div>
      </dl>
      {cta && <div className="mt-8">{cta}</div>}
    </aside>
  )
}

export function Bag() {
  const { t, cart, lang, money, dispatch } = useStore()
  if (!cart.length)
    return (
      <Shell title={t('bag.title')}>
        <p className="serif text-[24px] font-light italic text-mute">{t('bag.empty')}</p>
        <div className="mt-10"><Cta href="#/uomo/a-man">{t('bag.discover')}</Cta></div>
      </Shell>
    )
  return (
    <Shell title={t('bag.title')}>
      <div className="grid gap-12 xl:grid-cols-[1fr_400px] xl:gap-20">
        <ul className="border-t border-line">
          {cart.map((l) => {
            const c = A_MAN.colors.find((x) => x.id === l.colorId)!
            return (
              <li key={l.colorId} className="grid grid-cols-[120px_1fr] gap-6 border-b border-line py-8 md:grid-cols-[180px_1fr]">
                <a href="#/uomo/a-man" className="block aspect-[4/5] bg-stone">
                  <Pic name={c.images[0]} alt={c.alts[lang][0]} sizes="180px" className="block h-full w-full overflow-hidden" imgClassName="blend h-full w-full object-cover" />
                </a>
                <div className="flex flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="eyebrow">A Man</p>
                      <p className="serif mt-2 text-[28px] font-light leading-none">{t('product.name')}</p>
                      <p className="mt-2 text-[13px] text-mute">{c.name[lang]}</p>
                    </div>
                    <p className="tabular-nums">{money(A_MAN.price * l.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <div className="flex items-center border border-line" role="group" aria-label={t('mini.qty')}>
                      <button type="button" aria-label={t('mini.less')} onClick={() => l.qty > 1 && dispatch({ t: 'qty', colorId: l.colorId, qty: l.qty - 1 })} className="grid h-10 w-10 place-items-center"><IconMinus width={14} height={14} /></button>
                      <output className="w-8 text-center tabular-nums">{l.qty}</output>
                      <button type="button" aria-label={t('mini.more')} onClick={() => dispatch({ t: 'qty', colorId: l.colorId, qty: l.qty + 1 })} className="grid h-10 w-10 place-items-center"><IconPlus width={14} height={14} /></button>
                    </div>
                    <button type="button" onClick={() => dispatch({ t: 'remove', colorId: l.colorId })} className="u-link text-[11px] uppercase tracking-[0.16em] text-mute">{t('mini.remove')}</button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <Summary cta={<a href="#/checkout" className="btn">{t('bag.checkout')}</a>} />
      </div>
    </Shell>
  )
}

const Field = ({ id, label, type = 'text', autoComplete }: { id: string; label: string; type?: string; autoComplete?: string }) => (
  <div>
    <label htmlFor={id} className="eyebrow block text-mute">{label}</label>
    <input id={id} name={id} type={type} required autoComplete={autoComplete} className="mt-2 h-12 w-full border-0 border-b border-line bg-transparent text-[15px] transition-colors duration-500 focus:border-ink focus:outline-none" />
  </div>
)

export function Checkout() {
  const { t, cart, dispatch } = useStore()
  const [done, setDone] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); dispatch({ t: 'clear' }); setDone(true) }

  if (done)
    return (
      <Shell title={t('checkout.done.title')}>
        <p className="serif max-w-[30ch] text-[26px] font-light leading-snug">{t('checkout.done.body')}</p>
        <div className="mt-10"><Cta href="#/">{t('back')}</Cta></div>
      </Shell>
    )
  if (!cart.length)
    return (
      <Shell title={t('checkout.title')}>
        <p className="serif text-[24px] font-light italic text-mute">{t('bag.empty')}</p>
        <div className="mt-10"><Cta href="#/uomo/a-man">{t('bag.discover')}</Cta></div>
      </Shell>
    )
  return (
    <Shell title={t('checkout.title')}>
      <p className="mb-12 max-w-[60ch] border-l border-ink pl-5 text-[13px] leading-relaxed text-mute">{t('checkout.note')}</p>
      <div className="grid gap-16 xl:grid-cols-[1fr_400px] xl:gap-20">
        <form onSubmit={submit} className="space-y-12">
          <fieldset className="space-y-8">
            <legend className="eyebrow mb-8">{t('checkout.contact')}</legend>
            <Field id="email" type="email" label={t('checkout.email')} autoComplete="email" />
          </fieldset>
          <fieldset className="space-y-8">
            <legend className="eyebrow mb-8">{t('checkout.delivery')}</legend>
            <Field id="name" label={t('checkout.name')} autoComplete="name" />
            <Field id="address" label={t('checkout.address')} autoComplete="street-address" />
            <div className="grid grid-cols-[1fr_140px] gap-6">
              <Field id="city" label={t('checkout.city')} autoComplete="address-level2" />
              <Field id="zip" label={t('checkout.zip')} autoComplete="postal-code" />
            </div>
          </fieldset>
          <button type="submit" className="btn xl:hidden">{t('checkout.confirm')}</button>
        </form>
        <Summary cta={<button type="button" className="btn" onClick={() => (document.querySelector('form') as HTMLFormElement).requestSubmit()}>{t('checkout.confirm')}</button>} />
      </div>
    </Shell>
  )
}
