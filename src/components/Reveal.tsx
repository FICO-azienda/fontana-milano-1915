import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../lib/hooks'

type Props = { as?: ElementType; delay?: number; instant?: boolean; className?: string; children: ReactNode }

/** Fade + leggero slittamento verticale quando l'elemento entra in vista. */
export function Reveal({ as: Tag = 'div', delay = 0, instant, className = '', children }: Props) {
  const ref = useReveal<HTMLElement>()
  return (
    <Tag ref={ref} className={`${instant ? '' : 'reveal'} ${className}`} style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  )
}
