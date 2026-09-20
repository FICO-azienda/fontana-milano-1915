import type { NavItem } from '../data/nav'
import { linkHref } from '../data/nav'
import { useStore } from '../lib/store'
import { Pic } from './Pic'

/** Pannello del mega-menu: poche voci in serif + immagini. Posizionato sotto l'header. */
export function MegaMenu({ item, open, id, onNavigate }: { item: NavItem; open: boolean; id: string; onNavigate: () => void }) {
  const { t } = useStore()
  return (
    <div
      id={id}
      className="absolute inset-x-0 top-full border-b border-line bg-ivory transition-[opacity,transform,visibility] duration-[600ms] ease-lux"
      style={{
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        transform: open ? 'none' : 'translateY(-8px)',
        transitionDelay: open ? '0ms' : '0ms, 0ms, 600ms',
      }}
    >
      <div className="mx-auto grid max-w-[1680px] grid-cols-[minmax(240px,1fr)_3fr] gap-16 px-12 pb-14 pt-12">
        <ul className="flex flex-col gap-3">
          {item.links.map((l, i) => (
            <li key={l.href + i} style={{ transition: `opacity .7s var(--ease-lux) ${open ? 120 + i * 50 : 0}ms, transform .7s var(--ease-lux) ${open ? 120 + i * 50 : 0}ms`, opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(6px)' }}>
              <a
                href={linkHref(l)}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: onNavigate })}
                className="serif u-link text-[28px] font-light leading-tight"
              >
                {l.key ? t(l.key) : l.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-3 gap-6">
          {item.cards.map((c, i) => (
            <li key={c.href} style={{ transition: `opacity .9s var(--ease-lux) ${open ? 180 + i * 80 : 0}ms`, opacity: open ? 1 : 0 }}>
              <a
                href={linkHref(c)}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: onNavigate })}
                className="group block"
              >
                <div className="zoom-frame aspect-[4/3] bg-stone">
                  <Pic name={c.img} alt="" sizes="(min-width:1280px) 22vw, 30vw" imgClassName="blend h-full w-full object-cover" />
                </div>
                <span className="eyebrow mt-4 block">{c.key ? t(c.key) : c.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
