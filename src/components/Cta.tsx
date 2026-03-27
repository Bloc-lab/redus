import { Mail, Phone } from 'lucide-react'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

export function Cta() {
  const { content } = useSite()
  const title = pick(content, 'cta.title')
  const desc = pick(content, 'cta.desc')
  const phone = pick(content, 'contact.phone')
  const email = pick(content, 'contact.email')

  const telHref = phone.replace(/\s/g, '')

  return (
    <section className="px-4 py-12 lg:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#2c4ab1] px-6 py-12 text-center shadow-xl sm:px-10 lg:px-16">
        <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/90">
          {desc}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${telHref}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#2c4ab1] shadow-md transition hover:bg-neutral-100"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Napište nám e-mail
          </a>
        </div>
      </div>
    </section>
  )
}
