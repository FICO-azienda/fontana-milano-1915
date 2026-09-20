import type { ReactNode } from 'react'
import { SITE } from '../data/catalog'
import { useParallax } from '../lib/hooks'
import { useStore } from '../lib/store'
import type { Key } from '../lib/i18n'
import { Cta } from './Cta'
import { Pic, type ImgName } from './Pic'
import { Reveal } from './Reveal'

function ParallaxPic({ name, alt, sizes, ratio, speed = 0.07, className = '' }: { name: ImgName; alt: string; sizes: string; ratio: string; speed?: number; className?: string }) {
  const ref = useParallax<HTMLDivElement>(speed)
  return (
    <div className={`zoom-frame relative overflow-hidden bg-stone ${className}`} style={{ aspectRatio: ratio }}>
      <div ref={ref} className="absolute inset-x-0 -top-[9%] h-[118%] will-change-transform">
        <Pic name={name} alt={alt} sizes={sizes} imgClassName="h-full w-full object-cover" className="block h-full w-full" />
      </div>
    </div>
  )
}

function Chapter({ id, num, title, children }: { id: string; num: string; title: string; children?: ReactNode }) {
  return (
    <header>
      <p className="eyebrow text-mute" id={`h-${id}`}>{num}</p>
      <h3 className="display mt-4 text-[38px] md:text-[56px]">{title}</h3>
      {children}
    </header>
  )
}

/** Sezione editoriale "Il Mondo Fontana": impaginazione da rivista di moda. */
export function EditorialSection({ showIntro = true }: { showIntro?: boolean }) {
  const { t, lang } = useStore()
  const body = (k: Key) => <p className="mt-8 max-w-[46ch] text-[15px] leading-[1.95] text-mute">{t(k)}</p>
  const more = (path: string, external = true) => (
    <div className="mt-10"><Cta href={external ? SITE + path : '#' + path} external={external}>{t('world.more')}</Cta></div>
  )

  return (
    <div className="bg-ivory">
      {showIntro && (
        <section aria-labelledby="world-title" className="mx-auto max-w-[1920px] px-5 pb-24 pt-28 xl:px-12 xl:pb-36 xl:pt-44">
          <Reveal>
            <p className="eyebrow text-mute">Fontana Milano 1915</p>
            <h2 id="world-title" className="display mt-5 text-[52px] md:text-[104px] xl:text-[136px]">{t('world.title')}</h2>
          </Reveal>
          <Reveal delay={150}><p className="serif mt-10 max-w-[30ch] text-[24px] font-light leading-[1.4] md:text-[32px]">{t('world.intro')}</p></Reveal>
        </section>
      )}

      {/* 01 — LA STORIA */}
      <section id="sec-storia" aria-labelledby="h-storia" className="scroll-mt-20 bg-stone py-24 xl:py-40">
        <div className="mx-auto grid max-w-[1920px] gap-14 px-5 xl:grid-cols-12 xl:gap-8 xl:px-12">
          <Reveal className="xl:col-span-7">
            <p aria-hidden className="serif select-none font-light leading-[0.85] text-ink/90" style={{ fontSize: 'clamp(120px, 24vw, 420px)', letterSpacing: '-0.03em' }}>1915</p>
          </Reveal>
          <Reveal className="self-end xl:col-span-4 xl:col-start-9" delay={120}>
            <Chapter id="storia" num="01" title={t('world.history')} />
            {body('world.history.body')}
            {more('/il-mondo-fontana/la-storia')}
          </Reveal>
        </div>
      </section>

      {/* 02 — MADE IN ITALY */}
      <section id="sec-made-in-italy" aria-labelledby="h-made-in-italy" className="scroll-mt-20 py-24 xl:py-40">
        <div className="mx-auto grid max-w-[1920px] items-center gap-12 px-5 xl:grid-cols-12 xl:gap-8 xl:px-12">
          <Reveal className="xl:col-span-7">
            <ParallaxPic name="detail-buckle" alt={lang === 'it' ? 'Dettaglio delle fibbie di A Man' : 'Detail of the A Man buckles'} sizes="(min-width:1280px) 58vw, 100vw" ratio="16 / 10" speed={0.05} />
          </Reveal>
          <Reveal className="xl:col-span-4 xl:col-start-9" delay={120}>
            <Chapter id="made-in-italy" num="02" title={t('world.italy')} />
            {body('world.italy.body')}
            {more('/il-mondo-fontana/la-storia')}
          </Reveal>
        </div>
      </section>

      {/* 03 — WORKSHOP */}
      <section id="sec-workshop" aria-labelledby="h-workshop" className="scroll-mt-20 pb-24 xl:pb-40">
        <Reveal>
          <ParallaxPic name="workshop" alt={lang === 'it' ? 'Ingresso del Fontana Workshop in via Trebbia, Milano' : 'Entrance of the Fontana Workshop on via Trebbia, Milan'} sizes="100vw" ratio="21 / 9" speed={0.08} className="max-md:!aspect-[4/3]" />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1920px] gap-8 px-5 xl:mt-20 xl:grid-cols-12 xl:px-12">
          <Reveal className="xl:col-span-5"><Chapter id="workshop" num="03" title={t('world.workshop')} /></Reveal>
          <Reveal className="xl:col-span-4 xl:col-start-9" delay={120}>
            <p className="max-w-[46ch] text-[15px] leading-[1.95] text-mute">{t('world.workshop.body')}</p>
            {more('/il-mondo-fontana/workshop')}
          </Reveal>
        </div>
      </section>

      {/* 04 — DESIGN */}
      <section id="sec-design" aria-labelledby="h-design" className="scroll-mt-20 bg-stone py-24 xl:py-40">
        <div className="mx-auto grid max-w-[1920px] items-center gap-12 px-5 xl:grid-cols-12 xl:gap-8 xl:px-12">
          <Reveal className="order-2 xl:order-1 xl:col-span-4 xl:col-start-2">
            <Chapter id="design" num="04" title={t('world.design')} />
            {body('world.design.body')}
            <div className="mt-10"><Cta href="#/uomo/a-man">{t('intro.cta')}</Cta></div>
          </Reveal>
          <Reveal className="order-1 xl:order-2 xl:col-span-5 xl:col-start-7" delay={120}>
            <ParallaxPic name="detail-clasp" alt={lang === 'it' ? 'Dettaglio della chiusura in metallo' : 'Detail of the metal closure'} sizes="(min-width:1280px) 40vw, 100vw" ratio="4 / 3" speed={0.04} />
          </Reveal>
        </div>
      </section>

      {/* 05 — SPECIAL PROJECTS */}
      <section id="sec-special-projects" aria-labelledby="h-special-projects" className="on-dark scroll-mt-20 bg-umber py-24 text-ivory xl:py-40">
        <div className="mx-auto grid max-w-[1920px] items-center gap-12 px-5 xl:grid-cols-12 xl:gap-8 xl:px-12">
          <Reveal className="xl:col-span-7">
            <ParallaxPic name="special-projects" alt="Marco Massa, Boxeador" sizes="(min-width:1280px) 58vw, 100vw" ratio="16 / 9" speed={0.05} />
          </Reveal>
          <Reveal className="xl:col-span-4 xl:col-start-9" delay={120}>
            <header>
              <p className="eyebrow opacity-60" id="h-special-projects">05</p>
              <h3 className="display mt-4 text-[38px] md:text-[56px]">{t('world.special')}</h3>
            </header>
            <p className="mt-8 max-w-[46ch] text-[15px] leading-[1.95] opacity-70">{t('world.special.body')}</p>
            {more('/il-mondo-fontana/special-projects')}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
