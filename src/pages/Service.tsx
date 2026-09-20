import { Accordion } from '../components/Accordion'
import { useStore } from '../lib/store'

export function Service({ section }: { section?: string }) {
  const { t } = useStore()
  const valid = ['contatti', 'spedizioni', 'resi', 'faq']
  return (
    <main id="main" tabIndex={-1} className="pt-[var(--header-h)]">
      <div className="mx-auto max-w-[900px] px-5 pb-40 pt-16 xl:pt-28">
        <h1 className="display mb-16 text-[48px] md:text-[80px]">{t('service.title')}</h1>
        <Accordion
          key={section}
          defaultOpen={valid.includes(section ?? '') ? section : 'contatti'}
          items={[
            { id: 'contatti', title: t('service.contacts'), content: <p>{t('service.contacts.body')}</p> },
            { id: 'spedizioni', title: t('service.shipping'), content: <p>{t('service.shipping.body')}</p> },
            { id: 'resi', title: t('service.returns'), content: <p>{t('service.returns.body')}</p> },
            { id: 'faq', title: t('service.faq'), content: <p>{t('service.faq.body')}</p> },
          ]}
        />
      </div>
    </main>
  )
}
