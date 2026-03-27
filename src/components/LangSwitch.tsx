import { useSite } from '../context/SiteContentContext'
import type { Lang } from '../hooks/useSiteContent'

export function LangSwitch() {
  const { lang, setLang } = useSite()

  const options: { value: Lang; label: string }[] = [
    { value: 'cs', label: 'CS' },
    { value: 'en', label: 'EN' },
  ]

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Jazyk obsahu"
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLang(value)}
          className={`rounded-md px-2 py-1 transition ${
            lang === value
              ? 'bg-white text-[#2c4ab1] shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
