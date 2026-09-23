import { MEN, WOMEN } from '../data/catalog'
import { useStore } from '../lib/store'
import { IconArrow } from './Icons'
import { Pic } from './Pic'
import { Reveal } from './Reveal'

/**
 * Punto di accesso alla collezione Uomo e alla collezione Donna già esistenti nel sito
 * (rotte #/uomo e #/donna, gestite da <Collection> — vedi pages/Collection.tsx).
 * Le immagini sono quelle già usate altrove (mega-menu, gallerie): nessun asset nuovo.
 */
export function CollectionGate() {
  const { t } = useStore()
  const gates = [
    { gender: 'men' as const, href: '#/uomo', label: t('nav.men'), img: MEN[0].img },
    { gender: 'women' as const, href: '#/donna', label: t('nav.women'), img: WOMEN[0].img },
  ]

  return (
    <section aria-label={t('nav.collections')} className="mx-auto max-w-[1920px] px-5 py-24 xl:px-12 xl:py-36">
      <Reveal><p className="eyebrow text-mute">{t('nav.collections')}</p></Reveal>
      <div className="mt-10 grid gap-3 md:grid-cols-2 md:gap-4 xl:gap-6">
        {gates.map((g, i) => (
          <Reveal key={g.gender} delay={i * 120}>
            <a href={g.href} className="group block" aria-label={`${g.label} — ${t('rail.all')}`}>
              <div className="zoom-frame aspect-[4/5] bg-stone md:aspect-[4/3]">
                <Pic name={g.img} alt="" sizes="(min-width:768px) 49vw, 100vw" imgClassName="blend h-full w-full object-cover" />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                <span>
                  <span className="serif block text-[32px] font-light leading-none xl:text-[44px]">{g.label}</span>
                  <span className="eyebrow mt-2 block text-mute">{t('rail.all')}</span>
                </span>
                <IconArrow width={20} height={20} className="shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
