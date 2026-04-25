import { Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

export function Footer() {
  const { content } = useSite()
  const siteName = pick(content, 'admin.siteName')
  const blurb = pick(content, 'footer.blurb')
  const address = pick(content, 'contact.address')
  const phone = pick(content, 'contact.phone')
  const email = pick(content, 'contact.email')
  const billing = pick(content, 'footer.billing')
  const copyright = pick(content, 'footer.copyright')

  const telHref = phone.replace(/\s/g, '')

  const serviceLinks = [
    pick(content, 'services.1.title'),
    pick(content, 'services.2.title'),
    pick(content, 'services.3.title'),
    pick(content, 'services.4.title'),
  ]

  return (
    <footer className="border-t border-neutral-200 bg-white px-4 py-14 lg:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-(--brand-primary)">{siteName}</div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {blurb}
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.linkedin.com/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:border-(--brand-primary) hover:text-(--brand-primary)"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
            Naše služby
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600">
            {serviceLinks.map((s) => (
              <li key={s}>
                <a href="/#sluzby" className="hover:text-(--brand-primary)">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
            Kontaktní údaje
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-primary)" />
              {address}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-primary)" />
              <a href={`tel:${telHref}`} className="hover:text-(--brand-primary)">
                {phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-primary)" />
              <a href={`mailto:${email}`} className="hover:text-(--brand-primary)">
                {email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900">
            Fakturační údaje
          </h3>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-600">
            {billing}
          </pre>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-8 text-xs text-neutral-500 sm:flex-row sm:items-center">
        <p>{copyright}</p>
        <div className="flex gap-6">
          <Link to="/o-nas" className="hover:text-(--brand-primary)">
            Ochrana soukromí
          </Link>
          <span className="text-neutral-300">|</span>
          <Link to="/o-nas" className="hover:text-(--brand-primary)">
            Obchodní podmínky
          </Link>
        </div>
      </div>
    </footer>
  )
}
