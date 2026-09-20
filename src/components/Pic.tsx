import type { CSSProperties } from 'react'
import manifest from '../data/images.json'

export type ImgName = keyof typeof manifest

const base = import.meta.env.BASE_URL + 'img/'

type Props = {
  name: ImgName
  alt: string
  sizes?: string
  eager?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
  onLoad?: () => void
}

/** <picture> con AVIF + WebP responsive, dimensioni intrinseche (niente layout shift) e lazy loading. */
export function Pic({ name, alt, sizes = '100vw', eager, className, imgClassName, style }: Props) {
  const m = manifest[name]
  const set = (ext: string) => m.widths.map((w) => `${base}${name}-${w}.${ext} ${w}w`).join(', ')
  const largest = m.widths[m.widths.length - 1]
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${base}${name}-${largest}.webp`}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        fetchPriority={eager ? 'high' : undefined}
        className={imgClassName}
        style={style}
      />
    </picture>
  )
}
