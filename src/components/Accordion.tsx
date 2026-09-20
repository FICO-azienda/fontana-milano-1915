import { useId, useState, type ReactNode } from 'react'
import { IconPlus } from './Icons'

export type AccordionItem = { id: string; title: string; content: ReactNode }

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null)
  const uid = useId()
  return (
    <div className="border-t border-line">
      {items.map((it) => {
        const isOpen = open === it.id
        const bid = `${uid}-b-${it.id}`, pid = `${uid}-p-${it.id}`
        return (
          <div key={it.id} className="border-b border-line">
            <h3>
              <button
                id={bid}
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="group flex w-full items-center justify-between py-6 text-left"
              >
                <span className="eyebrow">{it.title}</span>
                <IconPlus
                  width={14}
                  height={14}
                  className="transition-transform duration-700 ease-lux"
                  style={{ transform: isOpen ? 'rotate(135deg)' : 'none' }}
                />
              </button>
            </h3>
            <div id={pid} role="region" aria-labelledby={bid} className="acc-panel" data-open={isOpen}>
              <div>
                <div className="acc-inner pb-8 pr-6 text-[14px] leading-[1.9] text-mute">{it.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
