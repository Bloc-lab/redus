import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

export function About() {
  const { content } = useSite()
  const text = pick(content, 'about.text')

  const paragraphs = text.split(/\n\n+/).filter(Boolean)

  return (
    <main className="bg-white px-4 py-16 lg:px-6 lg:py-24">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          O nás
        </h1>
        <div className="prose prose-neutral mt-8 max-w-none">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-pretty leading-relaxed text-neutral-700"
            >
              {p}
            </p>
          ))}
        </div>
      </article>
    </main>
  )
}
