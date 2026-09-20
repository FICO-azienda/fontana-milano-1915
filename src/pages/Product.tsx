import { useState } from 'react'
import { EditorialSection } from '../components/EditorialSection'
import { ProductGallery } from '../components/ProductGallery'
import { ProductInfo } from '../components/ProductInfo'
import { ProductRail } from '../components/ProductRail'
import { A_MAN, MEN } from '../data/catalog'
import { useStore } from '../lib/store'

export function Product() {
  const { t } = useStore()
  const [colorId, setColorId] = useState<string>(A_MAN.colors[0].id)
  return (
    <main id="main" tabIndex={-1} className="pt-[var(--header-h)]">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1920px] px-5 pb-6 pt-6 xl:px-12">
        <ol className="eyebrow flex gap-3 text-mute">
          <li><a href="#/uomo" className="u-link">{t('nav.men')}</a></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">A Man</li>
        </ol>
      </nav>

      <section className="mx-auto flex max-w-[1920px] flex-col gap-2 px-2 md:px-3 xl:grid xl:grid-cols-12 xl:gap-12 xl:px-12">
        <ProductGallery colorId={colorId} />
        <div className="order-1 px-3 py-8 xl:order-none xl:col-span-4 xl:p-0">
          <div className="no-scrollbar xl:sticky xl:top-[calc(64px+2rem)] xl:max-h-[calc(100svh-64px-2rem)] xl:overflow-y-auto xl:pb-8 xl:pl-4">
            <ProductInfo colorId={colorId} onColor={setColorId} />
          </div>
        </div>
      </section>

      <ProductRail items={MEN.filter((c) => c.id !== 'a-man')} eyebrow={t('rail.eyebrow')} title={t('product.more')} />
      <EditorialSection />
    </main>
  )
}
