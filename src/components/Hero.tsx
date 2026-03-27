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
      <span className="text-[#2c4ab1]">{title.slice(i, i + accent.length)}</span>
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
  const cardTitle = pick(content, 'hero.cardTitle')
  const ctaPrimary = pick(content, 'hero.ctaPrimary')
  const ctaSecondary = pick(content, 'hero.ctaSecondary')

  return (
    <section className="relative overflow-hidden bg-white px-4 pb-16 pt-10 lg:px-6 lg:pb-24 lg:pt-14">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2c4ab1]/20 bg-[#2c4ab1]/5 px-3 py-1 text-xs font-semibold text-[#2c4ab1]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            {badge}
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            <HighlightedTitle title={title} accent={accent} />
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-600">
            {lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/#kontakt"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2c4ab1] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#243f96]"
            >
              {ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="/#sluzby"
              className="inline-flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
            >
              {ctaSecondary}
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
            <img
              src={image}
              alt=""
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-4 left-4 max-w-[240px] rounded-2xl border border-neutral-100 bg-white p-4 shadow-lg sm:left-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2c4ab1]/10 text-[#2c4ab1]">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-sm font-semibold leading-snug text-neutral-900">
                {cardTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
