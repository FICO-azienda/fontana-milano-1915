import { useState } from 'react'
import { useStore } from '../lib/store'
import type { Product } from '../data/products'
import { Lightbox } from './Lightbox'
import { Pic } from './Pic'
import { Reveal } from './Reveal'

/** Galleria editoriale: immagini grandi in griglia asimmetrica (largo / coppia / largo / coppia). */
export function ProductGallery({ product, colorId }: { product: Product; colorId: string }) {
  const { lang, t } = useStore()
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0]
  const n = color.images.length
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <ul key={color.id} className="contents xl:col-span-8 xl:grid xl:grid-cols-2 xl:gap-3" aria-label={t('product.gallery')}>
        {color.images.map((img, i) => {
          const wide = i % 3 === 0 || (i === n - 1 && i % 3 === 1)
          return (
            <li key={img} className={`${wide ? 'xl:col-span-2' : ''} ${i === 0 ? '' : 'order-2 xl:order-none'}`}>
              <Reveal delay={i % 3 === 2 ? 90 : 0} instant={i === 0}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`${t('product.open')}: ${color.alts[lang][i]}`}
                  className={`zoom-frame group relative block w-full cursor-zoom-in bg-stone ${wide ? 'aspect-[4/3] md:aspect-[3/2]' : 'aspect-square'}`}
                >
                  <Pic
                    name={img}
                    alt={color.alts[lang][i]}
                    eager={i === 0}
                    sizes={wide ? '(min-width:1280px) 62vw, 100vw' : '(min-width:1280px) 31vw, 50vw'}
                    imgClassName={`blend h-full w-full ${img.startsWith('detail') ? 'object-cover' : 'object-cover'}`}
                  />
                </button>
              </Reveal>
            </li>
          )
        })}
      </ul>
      <Lightbox images={color.images} alts={color.alts[lang]} index={open} onIndex={setOpen} />
    </>
  )
}
