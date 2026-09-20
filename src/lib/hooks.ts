import { useEffect, useRef, useState, type RefObject } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Blocca lo scroll del body mentre un pannello è aperto. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const sw = window.innerWidth - document.documentElement.clientWidth
    document.body.classList.add('scroll-lock')
    document.body.style.paddingRight = sw ? sw + 'px' : ''
    return () => {
      document.body.classList.remove('scroll-lock')
      document.body.style.paddingRight = ''
    }
  }, [active])
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Focus trap accessibile per dialog: Esc chiude, Tab resta dentro, il focus torna all'origine. */
export function useDialog(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    if (!active) return
    const node = ref.current
    const origin = document.activeElement as HTMLElement | null
    const first = node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(FOCUSABLE)
    const t = window.setTimeout(() => first?.focus({ preventScroll: true }), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); close.current(); return }
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const a = items[0], z = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      origin?.focus?.({ preventScroll: true })
    }
  }, [active, ref])
}

/** Aggiunge .is-in quando l'elemento entra nel viewport. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/** Parallax molto leggero: sposta l'elemento in Y in base allo scroll. */
export function useParallax<T extends HTMLElement>(speed = 0.06) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.parentElement!.getBoundingClientRect()
      if (r.bottom < -100 || r.top > window.innerHeight + 100) return
      const c = r.top + r.height / 2 - window.innerHeight / 2
      el.style.transform = `translate3d(0, ${(-c * speed).toFixed(1)}px, 0)`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [speed])
  return ref
}

export function useScrolled(threshold = 24) {
  const [s, set] = useState(false)
  useEffect(() => {
    const on = () => set(window.scrollY > threshold)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [threshold])
  return s
}
