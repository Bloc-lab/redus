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

  return (
    <section className="bg-[#F8FAFC] px-6 py-20 lg:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="grid aspect-4/3 grid-cols-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <img
              src={img1}
              alt=""
              className="h-full w-full object-cover"
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
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--brand-secondary-1) text-(--brand-secondary-2)">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mt-8 rounded-r-md border-l-4 border-(--brand-primary) bg-white p-6 pl-5 italic text-neutral-700 shadow-sm">
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
