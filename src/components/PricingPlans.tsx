import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

function parseFeatureLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** `dual` = přepínač měsíčně/ročně; `single` = jedna zobrazená cena na kartě */
function isPricingDualMode(c: Record<string, string>): boolean {
  const raw = (c['pricing.billingMode'] ?? '').trim().toLowerCase()
  if (
    raw === 'single' ||
    raw === 'one' ||
    raw === '0' ||
    raw === 'ne' ||
    raw === 'false' ||
    raw === 'off' ||
    raw === 'jen_karty'
  ) {
    return false
  }
  return true
}

export function PricingPlans() {
  const { content } = useSite()
  const [yearly, setYearly] = useState(true)

  const dual = useMemo(() => isPricingDualMode(content), [content])

  const monthlyLabel = pick(content, 'pricing.billingMonthly')
  const yearlyLabel = pick(content, 'pricing.billingYearly')
  const featuresHeading = pick(content, 'pricing.featuresHeading')

  const plans = useMemo(() => {
    return [1, 2, 3]
      .map((n) => {
        const title = pick(content, `pricing.plan${n}.title`)
        const ctaHrefRaw = pick(content, `pricing.plan${n}.ctaHref`)
        const ctaHref =
          ctaHrefRaw.trim().length > 0 ? ctaHrefRaw.trim() : '#kontakt'
        return {
          key: n,
          title,
          priceMonthly: pick(content, `pricing.plan${n}.priceMonthly`),
          priceYearly: pick(content, `pricing.plan${n}.priceYearly`),
          desc: pick(content, `pricing.plan${n}.desc`),
          cta: pick(content, `pricing.plan${n}.cta`),
          ctaHref,
          popularBadge: pick(content, `pricing.plan${n}.popularBadge`),
          features: parseFeatureLines(
            pick(content, `pricing.plan${n}.features`)
          ),
        }
      })
      .filter((p) => p.title.trim().length > 0)
  }, [content])

  if (plans.length === 0) return null

  return (
    <div className="mx-auto mt-12 max-w-6xl">
      {dual ? (
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                yearly
                  ? 'bg-[#2c4ab1] text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              {yearlyLabel}
            </button>
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                !yearly
                  ? 'bg-[#2c4ab1] text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              {monthlyLabel}
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`grid gap-6 ${
          dual ? 'mt-10' : 'mt-0'
        } ${
          plans.length === 1
            ? 'grid-cols-1 justify-items-center'
            : plans.length === 2
              ? 'sm:grid-cols-2'
              : 'lg:grid-cols-3'
        }`}
      >
        {plans.map((plan) => {
          const highlighted = plan.popularBadge.trim().length > 0
          const price = dual
            ? yearly
              ? plan.priceYearly
              : plan.priceMonthly
            : plan.priceYearly.trim() || plan.priceMonthly

          return (
            <article
              key={plan.key}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition ${
                highlighted
                  ? 'border-neutral-800 bg-neutral-900 text-white shadow-lg dark:border-neutral-700'
                  : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
              }`}
            >
              {plan.popularBadge.trim() ? (
                <span
                  className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    highlighted
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                  }`}
                >
                  {plan.popularBadge}
                </span>
              ) : null}

              <h3
                className={`text-lg font-semibold ${
                  highlighted
                    ? 'text-white'
                    : 'text-neutral-900 dark:text-neutral-50'
                }`}
              >
                {plan.title}
              </h3>
              <p
                className={`mt-2 text-2xl font-bold tracking-tight ${
                  highlighted
                    ? 'text-white'
                    : 'text-[#2c4ab1] dark:text-[#5a7ae0]'
                }`}
              >
                {price}
              </p>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  highlighted
                    ? 'text-white/80'
                    : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {plan.desc}
              </p>

              <a
                href={plan.ctaHref}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  highlighted
                    ? 'bg-[#5a4fcf] text-white hover:bg-[#4a3fbf]'
                    : 'bg-[#2c4ab1] text-white hover:bg-[#243f96]'
                }`}
              >
                {plan.cta}
              </a>

              {plan.features.length > 0 ? (
                <div className="mt-6">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      highlighted
                        ? 'text-white/70'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {featuresHeading}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {plan.features.map((line) => (
                      <li
                        key={line}
                        className={`flex gap-2 text-sm ${
                          highlighted
                            ? 'text-white/90'
                            : 'text-neutral-700 dark:text-neutral-200'
                        }`}
                      >
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            highlighted
                              ? 'text-emerald-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                          aria-hidden
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
