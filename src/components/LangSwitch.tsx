import { useLocation, useNavigate } from 'react-router-dom'
import { useSite } from '../context/SiteContentContext'
import type { Lang } from '../lib/lang'
import { persistPreviewLang } from '../lib/previewQuery'

export function LangSwitch() {
  const { lang, setLang, previewToken } = useSite()
  const navigate = useNavigate()
  const location = useLocation()

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
          onClick={() => {
            setLang(value)
            if (previewToken) {
              persistPreviewLang(value)
              const params = new URLSearchParams(location.search)
              params.set('previewToken', previewToken)
              params.set('lang', value)
              navigate(
                {
                  pathname: location.pathname,
                  search: `?${params.toString()}`,
                  hash: location.hash,
                },
                { replace: true }
              )
            }
          }}
          className={`rounded-md px-2 py-1 transition ${
            lang === value
              ? 'bg-white text-[var(--brand-primary)] shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
