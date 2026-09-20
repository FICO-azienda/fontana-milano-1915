import type { ReactNode } from 'react'

/** Call to action editoriale: testo + linea sottile che si anima all'hover. */
export function Cta({ href, children, external, className = '' }: { href: string; children: ReactNode; external?: boolean; className?: string }) {
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`cta ${className}`}>
      <span>{children}</span>
      <span className="cta-line" aria-hidden />
    </a>
  )
}
