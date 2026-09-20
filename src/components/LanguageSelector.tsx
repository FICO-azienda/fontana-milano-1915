import { useStore } from '../lib/store'

export function LanguageSelector({ className = '' }: { className?: string }) {
  const { lang, dispatch, t } = useStore()
  return (
    <div role="group" aria-label={t('lang.label')} className={`flex items-center gap-2 text-[11px] tracking-[0.2em] ${className}`}>
      {(['it', 'en'] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-3 w-px bg-current opacity-30" />}
          <button
            type="button"
            lang={l}
            aria-pressed={lang === l}
            onClick={() => dispatch({ t: 'lang', v: l })}
            className={`u-link uppercase ${lang === l ? 'is-active' : 'opacity-60 hover:opacity-100'}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}
