import { Building2, FileText, Gavel, Users } from 'lucide-react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

const icons = [Building2, FileText, Users, Gavel]

export function Services() {
  const { content } = useSite()

  const sectionTitle = pick(content, 'services.sectionTitle')
  const sectionDesc = pick(content, 'services.sectionDesc')

  // Design reference has 3 cards; keep CMS compatible by taking first 3.
  const cards = [1, 2, 3].map((n) => ({
    title: pick(content, `services.${n}.title`),
    desc: pick(content, `services.${n}.desc`),
    Icon: icons[n - 1]!,
  }))

  return (
    <section
      id="sluzby"
      className="scroll-mt-24 border-y border-neutral-200 bg-[#F8FAFC] px-6 py-20 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {sectionTitle}
          </h2>
          <p className="mt-3 text-pretty text-neutral-600">
            {sectionDesc}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map(({ title, desc, Icon }) => (
            <article
              key={title}
              className="rounded-lg border border-neutral-200 bg-white p-10 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-(--brand-secondary-1) text-(--brand-secondary-2)">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
