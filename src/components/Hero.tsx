import { ArrowRight, ShieldCheck } from 'lucide-react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

function HighlightedTitle({
  title,
  accent,
}: {
  title: string
  accent: string
}) {
  if (!accent.trim()) return <>{title}</>
  const lower = title.toLowerCase()
  const a = accent.toLowerCase()
  const i = lower.indexOf(a)
  if (i < 0) return <>{title}</>
  return (
    <>
      {title.slice(0, i)}
      <span className="text-(--brand-primary)">
        {title.slice(i, i + accent.length)}
      </span>
      {title.slice(i + accent.length)}
    </>
  )
}

export function Hero() {
  const { content } = useSite()
  const badge = pick(content, 'hero.badge')
  const title = pick(content, 'hero.title')
  const accent = pick(content, 'hero.titleAccent')
  const lead = pick(content, 'hero.lead')
  const image = pick(content, 'hero.image')
  const ctaPrimary = pick(content, 'hero.ctaPrimary')
  const ctaSecondary = pick(content, 'hero.ctaSecondary')

  return (
    <section className="bg-[#F8FAFC] px-6 py-20 lg:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--brand-primary-border) bg-(--brand-primary-soft-2) px-3 py-1 text-xs font-semibold text-(--brand-primary)">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            {badge}
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            <HighlightedTitle title={title} accent={accent} />
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-neutral-600">
            {lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/#kontakt"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-(--brand-primary) px-8 text-sm font-semibold text-white transition hover:bg-(--brand-primary-hover)"
            >
              {ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="/#sluzby"
              className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-200 bg-(--brand-secondary-1) px-8 text-sm font-semibold text-(--brand-secondary-2) transition hover:brightness-95"
            >
              {ctaSecondary}
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg lg:max-w-none">
          <div className="aspect-4/3 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
