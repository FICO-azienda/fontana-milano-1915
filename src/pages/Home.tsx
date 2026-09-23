import { CollectionGate } from '../components/CollectionGate'
import { Cta } from '../components/Cta'
import { EditorialSection } from '../components/EditorialSection'
import { Hero } from '../components/Hero'
import { Reveal } from '../components/Reveal'
import { useStore } from '../lib/store'

export function Home() {
  const { t } = useStore()
  return (
    <>
      <Hero />
      <main id="main" tabIndex={-1}>
        <section aria-label={t('intro.eyebrow')} className="mx-auto max-w-[1920px] px-5 py-28 xl:px-12 xl:py-48">
          <div className="grid gap-10 xl:grid-cols-12">
            <Reveal className="xl:col-span-2"><p className="eyebrow text-mute">{t('intro.eyebrow')}</p></Reveal>
            <div className="xl:col-span-7">
              <Reveal>
                <p className="display text-[40px] md:text-[72px] xl:text-[88px]">{t('intro.a')}</p>
                <p className="display mt-2 text-[40px] italic text-mute md:text-[72px] xl:text-[88px]">{t('intro.b')}</p>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-12 max-w-[52ch] text-[15px] leading-[1.95] text-mute">{t('intro.body')}</p>
                <div className="mt-10"><Cta href="#/uomo/a-man">{t('intro.cta')}</Cta></div>
              </Reveal>
            </div>
          </div>
        </section>

        <CollectionGate />
        <EditorialSection />
      </main>
    </>
  )
}
