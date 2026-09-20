import { useEffect, useRef } from 'react'
import { useDialog, useScrollLock } from '../lib/hooks'
import { useStore } from '../lib/store'
import { IconArrow, IconClose } from './Icons'
import { Pic, type ImgName } from './Pic'

type Props = { images: ImgName[]; alts: string[]; index: number | null; onIndex: (i: number | null) => void }

export function Lightbox({ images, alts, index, onIndex }: Props) {
  const { t } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const active = index !== null
  useScrollLock(active)
  useDialog(ref, active, () => onIndex(null))

  const n = images.length
  const step = (d: number) => onIndex(index === null ? null : (index + d + n) % n)

  useEffect(() => {
    if (!active) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  })

  // swipe su touch
  const x0 = useRef(0)

  if (!active) return null
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t('product.gallery')}
      className="fade-in fixed inset-0 z-[70] flex flex-col bg-ivory"
      onTouchStart={(e) => { x0.current = e.touches[0].clientX }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - x0.current; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1) }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-5 xl:px-12">
        <p className="eyebrow tabular-nums text-mute" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
        <button type="button" data-autofocus onClick={() => onIndex(null)} aria-label={t('util.close')} className="-mr-2 grid h-11 w-11 place-items-center">
          <IconClose />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <button type="button" onClick={() => step(-1)} aria-label="Precedente" className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center md:grid xl:left-8">
          <IconArrow dir="left" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Successiva" className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center md:grid xl:right-8">
          <IconArrow />
        </button>
        <div key={index} className="fade-in absolute inset-0 grid place-items-center bg-ivory px-4 md:px-24">
          <Pic name={images[index]} alt={alts[index]} eager sizes="100vw" className="contents" imgClassName="blend max-h-full max-w-full object-contain" />
        </div>
      </div>

      <ul className="flex shrink-0 justify-center gap-2 pb-6 pt-3" aria-hidden>
        {images.map((_, i) => (
          <li key={i}><span className="block h-px w-8 bg-ink transition-opacity duration-500" style={{ opacity: i === index ? 1 : 0.2 }} /></li>
        ))}
      </ul>
    </div>
  )
}
