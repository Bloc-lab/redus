import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'
import { PricingPlans } from './PricingPlans'

function isSectionEnabled(content: Record<string, string>, key: string): boolean {
  const v = (content[key] ?? '').trim().toLowerCase()
  if (v === 'hide' || v === '0' || v === 'false' || v === 'off') return false
  return true
}

export function ExtraSections() {
  const { content } = useSite()
  const pricingTitle = pick(content, 'pricing.title')
  const pricingTeaser = pick(content, 'pricing.teaser')
  const taxTitle = pick(content, 'tax.title')
  const taxTeaser = pick(content, 'tax.teaser')

  return (
    <>
      {isSectionEnabled(content, 'pricing.enabled') ? (
        <section
          id="cenik"
          className="scroll-mt-24 bg-[#F8FAFC] px-6 py-20 lg:py-32"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {pricingTitle}
            </h2>
            <p className="mt-3 text-pretty text-neutral-600">
              {pricingTeaser}
            </p>
          </div>
          <PricingPlans />
        </section>
      ) : null}

      {isSectionEnabled(content, 'tax.enabled') ? (
        <section
          id="danove"
          className="scroll-mt-24 bg-white px-6 py-20 lg:py-32"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {taxTitle}
            </h2>
            <p className="mt-3 text-pretty text-neutral-600">{taxTeaser}</p>
          </div>
        </section>
      ) : null}
    </>
  )
}
