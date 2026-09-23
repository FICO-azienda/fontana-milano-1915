import { useState } from 'react'
import { CATALOG } from '../data/catalog'
import { useStore } from '../lib/store'
import { Pic } from './Pic'
import { Reveal } from './Reveal'

type G = 'women' | 'men'

/** Due modelli già in catalogo per anteprima: cambiano con la tab, il click porta sempre alla collezione completa. */
const PREVIEW: Record<G, string[]> = { women: ['mina', 'wight'], men: ['a-man', 'summit'] }
const item = (slug: string) => CATALOG.find((c) => c.id === slug)!

/**
 * Punto di accesso alla collezione Uomo e alla collezione Donna già esistenti nel sito
 * (rotte #/uomo e #/donna, gestite da <Collection> — vedi pages/Collection.tsx).
 * Tab "Donna"/"Uomo" per scegliere l'anteprima; il click sulle immagini apre la collezione
 * completa. Le immagini sono quelle già usate altrove nel sito: nessun asset nuovo.
 */
export function CollectionGate() {
  const { t } = useStore()
  const [gender, setGender] = useState<G>('women')
  const items = PREVIEW[gender].map(item)
  const href = gender === 'women' ? '#/donna' : '#/uomo'
  const label = t(gender === 'women' ? 'nav.women' : 'nav.men')

  return (
    <section aria-label={t('nav.collections')} className="py-24 xl:py-36">
      <div className="mx-auto max-w-[720px] px-5 text-center">
        <Reveal><p className="eyebrow text-mute">{t('nav.collections')}</p></Reveal>
      </div>

      <Reveal delay={100}>
        <div role="tablist" aria-label={t('nav.collections')} className="mt-8 flex items-center justify-center gap-10">
          {(['women', 'men'] as const).map((g) => {
            const active = g === gender
            const gLabel = t(g === 'women' ? 'nav.women' : 'nav.men')
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setGender(g)}
                className={`serif border-b pb-2 text-[22px] font-light transition-colors duration-500 xl:text-[26px] ${active ? 'border-ink text-ink' : 'border-transparent text-mute hover:text-ink'}`}
              >
                {gLabel}
              </button>
            )
          })}
        </div>
      </Reveal>

      <div key={gender} className="fade-in mt-14 grid grid-cols-2 gap-px bg-line xl:mt-20">
        {items.map((it) => (
          <a key={it.id} href={href} className="group zoom-frame relative block aspect-[3/4] bg-stone md:aspect-[4/5]" aria-label={`${label} — ${t('rail.all')}`}>
            <Pic name={it.img} alt="" sizes="50vw" imgClassName="blend h-full w-full object-cover" />
            <span className="absolute bottom-2.5 left-2.5 bg-ivory/95 px-2.5 py-2 text-[9px] tracking-[0.14em] uppercase md:bottom-4 md:left-4 md:px-4 md:py-2.5 md:text-[11px] md:tracking-[0.24em] xl:bottom-8 xl:left-8 xl:px-5 xl:py-3">{label} · {t('rail.all')}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
