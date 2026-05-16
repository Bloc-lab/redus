import { Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'

export function Footer() {
  const { content, appendPreviewToHref } = useSite()
  const siteName = pick(content, 'admin.siteName')
  const blurb = pick(content, 'footer.blurb')
  const address = pick(content, 'contact.address')
  const phone = pick(content, 'contact.phone')
  const email = pick(content, 'contact.email')
  const billing = pick(content, 'footer.billing')
  const copyright = pick(content, 'footer.copyright')
  const headingContact = pick(content, 'footer.headingContact')
  const headingBilling = pick(content, 'footer.headingBilling')
  const linkedinHref = pick(content, 'footer.linkedinHref', 'https://www.linkedin.com/')
  const linkPrivacyLabel = pick(content, 'footer.linkPrivacyLabel')
  const linkPrivacyHref = pick(content, 'footer.linkPrivacyHref', '/o-nas')
  const linkTermsLabel = pick(content, 'footer.linkTermsLabel')
  const linkTermsHref = pick(content, 'footer.linkTermsHref', '/o-nas')

  const telHref = phone.replace(/\s/g, '')

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 px-4 py-14 text-neutral-200 lg:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="text-lg font-bold text-white">{siteName}</div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            {blurb}
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href={linkedinHref}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 text-neutral-300 transition hover:border-(--brand-primary) hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {headingContact}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-300">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-primary)" />
              {address}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-primary)" />
              <a href={`tel:${telHref}`} className="hover:text-white">
                {phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-(--brand-primary)" />
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {headingBilling}
          </h3>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-300">
            {billing}
          </pre>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-4 border-t border-neutral-800 pt-8 text-xs text-neutral-400 sm:flex-row sm:items-center">
        <p>{copyright}</p>
        <div className="flex gap-6">
          <Link to={appendPreviewToHref(linkPrivacyHref)} className="hover:text-white">
            {linkPrivacyLabel}
          </Link>
          <span className="text-neutral-700">|</span>
          <Link to={appendPreviewToHref(linkTermsHref)} className="hover:text-white">
            {linkTermsLabel}
          </Link>
        </div>
      </div>
    </footer>
  )
}
