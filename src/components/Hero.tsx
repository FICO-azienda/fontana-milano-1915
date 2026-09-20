import { useStore } from '../lib/store'
import { useParallax } from '../lib/hooks'
import { Pic } from './Pic'
import { Cta } from './Cta'

/** Hero a tutto schermo: fotografia prodotto su fondo caldo, testo minimo e discreto. */
export function Hero() {
  const { t } = useStore()
  const par = useParallax<HTMLDivElement>(0.05)
  return (
    <section aria-label="A Man — A Travel" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-stone">
      <div ref={par} className="absolute inset-0 bg-stone will-change-transform">
        <div className="blend absolute left-1/2 top-[50%] h-[52svh] -translate-x-1/2 -translate-y-1/2 md:h-[78svh]" style={{ aspectRatio: '3 / 2', animation: 'slowScale 2.4s var(--ease-lux) both' }}>
          <Pic
            name="carbon-side"
            eager
            sizes="(min-width:768px) 130svh, 93svh"
            alt="A Man, A Travel: cartella da città in pelle Carbon"
            imgClassName="h-full w-full object-contain"
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-10 xl:px-12 xl:pb-14">
        <div>
          <p className="eyebrow rise-in" style={{ '--d': '700ms' } as React.CSSProperties}>{t('hero.eyebrow')}</p>
          <h1 className="display rise-in mt-3 text-[40px] xl:text-[56px]" style={{ '--d': '900ms' } as React.CSSProperties}>{t('hero.title')}</h1>
          <div className="rise-in mt-7" style={{ '--d': '1150ms' } as React.CSSProperties}>
            <Cta href="#/uomo/a-man">{t('hero.cta')}</Cta>
          </div>
        </div>
        <p className="eyebrow fade-in hidden text-mute md:block" style={{ animationDelay: '1500ms' }}>{t('hero.tag')}</p>
      </div>
    </section>
  )
}
