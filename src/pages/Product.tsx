import { useState } from 'react'
import { EditorialSection } from '../components/EditorialSection'
import { ProductGallery } from '../components/ProductGallery'
import { ProductInfo } from '../components/ProductInfo'
import { ProductRail } from '../components/ProductRail'
import { CATALOG } from '../data/catalog'
import type { Product as ProductT } from '../data/products'
import { useStore } from '../lib/store'

export function Product({ product }: { product: ProductT }) {
  const { t } = useStore()
  const [colorId, setColorId] = useState<string>(product.colors[0].id)
  const men = product.gender === 'men'
  const others = CATALOG.filter((c) => c.gender === product.gender && c.id !== product.id)
  return (
    <main id="main" tabIndex={-1} className="pt-[var(--header-h)]">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1920px] px-5 pb-6 pt-6 xl:px-12">
        <ol className="eyebrow flex gap-3 text-mute">
          <li><a href={men ? '#/uomo' : '#/donna'} className="u-link">{t(men ? 'nav.men' : 'nav.women')}</a></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <section className="mx-auto flex max-w-[1920px] flex-col gap-2 px-2 md:px-3 xl:grid xl:grid-cols-12 xl:gap-12 xl:px-12">
        <ProductGallery product={product} colorId={colorId} />
        <div className="order-1 px-3 py-8 xl:order-none xl:col-span-4 xl:p-0">
          <div className="no-scrollbar xl:sticky xl:top-[calc(64px+2rem)] xl:max-h-[calc(100svh-64px-2rem)] xl:overflow-y-auto xl:pb-8 xl:pl-4">
            <ProductInfo product={product} colorId={colorId} onColor={setColorId} />
          </div>
        </div>
      </section>

      <ProductRail items={others} eyebrow={t('rail.eyebrow')} title={t('product.more')} />
      <EditorialSection />
    </main>
  )
}
