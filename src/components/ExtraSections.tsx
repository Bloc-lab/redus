import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

export function ExtraSections() {
  const { content } = useSite()
  const pricingTitle = pick(content, 'pricing.title')
  const pricingTeaser = pick(content, 'pricing.teaser')
  const taxTitle = pick(content, 'tax.title')
  const taxTeaser = pick(content, 'tax.teaser')

  return (
    <>
      <section
        id="cenik"
        className="scroll-mt-24 border-y border-neutral-200 bg-neutral-50 px-4 py-12 lg:px-6"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            {pricingTitle}
          </h2>
          <p className="mt-3 text-neutral-600">{pricingTeaser}</p>
        </div>
      </section>
      <section
        id="danove"
        className="scroll-mt-24 bg-white px-4 py-12 lg:px-6"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
            {taxTitle}
          </h2>
          <p className="mt-3 text-neutral-600">{taxTeaser}</p>
        </div>
      </section>
    </>
  )
}
