import type { CSSProperties } from 'react'
import base_manifest from '../data/images.json'
import product_manifest from '../data/product-images.json'

type Entry = { w: number; h: number; widths: number[]; studio?: boolean }
const manifest = { ...base_manifest, ...product_manifest } as Record<string, Entry>

export type ImgName = keyof typeof base_manifest | keyof typeof product_manifest

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
  const cls = [m.studio ? 'blend' : '', imgClassName].filter(Boolean).join(' ')
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
        className={cls}
        style={style}
      />
    </picture>
  )
}
