import type { ReactNode } from 'react'
import { SITE } from '../data/catalog'
import { useStore } from '../lib/store'
import { LanguageSelector } from './LanguageSelector'

function Col({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow">{title}</h2>
      <ul className="mt-6 space-y-3 text-[13px] text-mute [&_a]:transition-colors [&_a]:duration-500 [&_a:hover]:text-ink">{children}</ul>
    </div>
  )
}

export function Footer() {
  const { t } = useStore()
  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const
  return (
    <footer className="border-t border-line bg-ivory">
      <div className="mx-auto max-w-[1920px] px-5 pb-10 pt-24 xl:px-12 xl:pt-36">
        <div className="grid gap-16 xl:grid-cols-12 xl:gap-8">
          <div className="xl:col-span-4">
            <p className="serif text-[26px] font-normal leading-none tracking-[0.34em]">FONTANA</p>
            <p className="mt-3 text-[9px] tracking-[0.55em]">MILANO 1915</p>
            <address className="mt-10 text-[13px] not-italic leading-[1.9] text-mute">
              {t('footer.address')}<br />{t('footer.hours')}<br />
              <a href="tel:+390254030231" className="u-link">+39 02 54 03 02 313</a>
            </address>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 xl:col-span-8 xl:grid-cols-4">
            <Col title={t('footer.service')}>
              <li><a href="#/client-service/contatti" className="u-link">{t('footer.contacts')}</a></li>
              <li><a href="#/client-service/spedizioni" className="u-link">{t('footer.shipping')}</a></li>
              <li><a href="#/client-service/resi" className="u-link">{t('footer.returns')}</a></li>
              <li><a href="#/client-service/faq" className="u-link">{t('footer.faq')}</a></li>
            </Col>
            <Col title={t('footer.fontana')}>
              <li><a href="#/il-mondo-fontana/storia" className="u-link">{t('footer.history')}</a></li>
              <li><a href="#/il-mondo-fontana/workshop" className="u-link">{t('footer.workshop')}</a></li>
              <li><a href="#/il-mondo-fontana/special-projects" className="u-link">{t('footer.special')}</a></li>
            </Col>
            <Col title={t('footer.follow')}>
              <li><a href="https://www.instagram.com/fontanamilano1915/" {...ext} className="u-link">Instagram</a></li>
              <li><a href="https://www.facebook.com/FontanaMilano1915/" {...ext} className="u-link">Facebook</a></li>
            </Col>
            <div>
              <h2 className="eyebrow">{t('footer.language')}</h2>
              <LanguageSelector className="mt-6 !text-[13px] !tracking-[0.06em] [&_button]:normal-case" />
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col justify-between gap-3 border-t border-line pt-6 text-[11px] tracking-[0.06em] text-mute xl:flex-row">
          <p>© 1915 – {new Date().getFullYear()} Fontana Milano 1915. {t('footer.rights')}</p>
          <p><a href={SITE} {...ext} className="u-link">fontanamilano1915.com</a></p>
        </div>
      </div>
    </footer>
  )
}
