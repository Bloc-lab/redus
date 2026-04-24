import { Building2, FileText, Gavel, Moon, Users } from 'lucide-react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'
import { useThemeToggle } from './useThemeToggle'

const icons = [Building2, FileText, Users, Gavel]

export function Services() {
  const { content } = useSite()
  const { dark, toggle } = useThemeToggle()

  const sectionTitle = pick(content, 'services.sectionTitle')
  const sectionDesc = pick(content, 'services.sectionDesc')

  const cards = [1, 2, 3, 4].map((n) => ({
    title: pick(content, `services.${n}.title`),
    desc: pick(content, `services.${n}.desc`),
    Icon: icons[n - 1]!,
  }))

  return (
    <section
      id="sluzby"
      className="relative scroll-mt-24 bg-neutral-50 px-4 py-16 dark:bg-neutral-950 lg:px-6 lg:py-24"
    >
      <button
        type="button"
        onClick={toggle}
        className="absolute right-2 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-100 lg:right-4"
        aria-label={dark ? 'Světlý režim' : 'Tmavý režim'}
      >
        <Moon className="h-5 w-5" />
      </button>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
            {sectionTitle}
          </h2>
          <p className="mt-3 text-pretty text-neutral-600 dark:text-neutral-300">
            {sectionDesc}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, desc, Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
