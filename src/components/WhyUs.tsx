import { Check } from 'lucide-react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

export function WhyUs() {
  const { content } = useSite()
  const title = pick(content, 'why.title')
  const text = pick(content, 'why.text')
  const bullets = [
    pick(content, 'why.bullet1'),
    pick(content, 'why.bullet2'),
    pick(content, 'why.bullet3'),
  ]
  const quote = pick(content, 'why.quote')
  const author = pick(content, 'why.quoteAuthor')
  const img1 = pick(content, 'why.image1')
  const img2 = pick(content, 'why.image2')

  return (
    <section className="bg-white px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] max-h-[420px]">
            <img
              src={img1}
              alt=""
              className="absolute left-0 top-0 h-[78%] w-[70%] rounded-3xl object-cover shadow-lg ring-1 ring-black/5"
            />
            <img
              src={img2}
              alt=""
              className="absolute bottom-0 right-0 h-[55%] w-[62%] rounded-3xl object-cover shadow-lg ring-1 ring-black/5"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-neutral-600">
            {text}
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-neutral-800">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mt-8 border-l-4 border-[var(--brand-primary-border)] pl-5 italic text-neutral-700">
            <p>{quote}</p>
            <footer className="mt-3 text-sm font-semibold not-italic text-neutral-900">
              — {author}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
