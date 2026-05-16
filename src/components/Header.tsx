import { Link } from 'react-router-dom'
import { pick } from '../lib/defaults'
import { isSectionAvailable, sectionHref } from '../lib/sections'
import { useSite } from '../context/SiteContentContext'
import { LangSwitch } from './LangSwitch'

export function Header({ offsetTop = false }: { offsetTop?: boolean }) {
  const { content, siteLogoFromHost, settings, appendPreviewToHref } = useSite()

  const siteName = pick(content, 'admin.siteName')
  const tagline = pick(content, 'admin.tagline')
  const navLabelServices = pick(content, 'nav.services')
  const navLabelAbout = pick(content, 'nav.about')
  const navLabelPricing = pick(content, 'nav.pricing')
  const navLabelTax = pick(content, 'nav.tax')
  const navCtaContact = pick(content, 'nav.ctaContact')
  const logoUrl =
    pick(content, 'admin.logo', '') || siteLogoFromHost || ''

  const navItemsFromSettings = settings?.nav?.items
    ?.filter((item) => {
      if (item.kind === 'route') return item.href.trim().length > 0
      return isSectionAvailable(content, item.section)
    })
    .slice(0, 8)
  const ctaFromSettings = settings?.nav?.cta

  return (
    <header
      className={`fixed ${
        offsetTop ? 'top-10' : 'top-0'
      } z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 lg:px-6">
        <Link to={appendPreviewToHref('/')} className="flex min-w-0 items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="h-10 w-auto object-contain"
            />
          ) : null}
          <div className="min-w-0">
            <div className="text-xl font-bold tracking-tight text-(--brand-primary)">
              {siteName}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-800">
              {tagline}
            </div>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex"
          aria-label="Hlavní navigace"
        >
          {navItemsFromSettings?.length ? (
            navItemsFromSettings.map((item, i) => {
              const label =
                (item.label ?? '').trim() ||
                (item.kind === 'section'
                  ? item.section === 'services'
                    ? navLabelServices
                    : item.section === 'pricing'
                      ? navLabelPricing
                      : item.section === 'tax'
                        ? navLabelTax
                        : navCtaContact
                  : '')

              const href = appendPreviewToHref(
                item.kind === 'route' ? item.href : sectionHref(item.section)
              )

              return (
                <a
                  key={`${item.kind}-${item.kind === 'route' ? item.href : item.section}-${i}`}
                  href={href}
                  className="transition hover:text-(--brand-primary)"
                >
                  {label}
                </a>
              )
            })
          ) : (
            <>
              <a
                href={appendPreviewToHref('/#sluzby')}
                className="transition hover:text-(--brand-primary)"
              >
                {navLabelServices}
              </a>
              <Link
                to={appendPreviewToHref('/o-nas')}
                className="transition hover:text-(--brand-primary)"
              >
                {navLabelAbout}
              </Link>
              <a
                href={appendPreviewToHref('/#cenik')}
                className="transition hover:text-(--brand-primary)"
              >
                {navLabelPricing}
              </a>
              <a
                href={appendPreviewToHref('/#danove')}
                className="transition hover:text-(--brand-primary)"
              >
                {navLabelTax}
              </a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <a
            href={appendPreviewToHref(
              (ctaFromSettings?.href?.trim() || '/#kontakt') as string
            )}
            className="inline-flex shrink-0 rounded-lg bg-(--brand-primary) px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-primary-hover)"
          >
            {(ctaFromSettings?.label?.trim() || navCtaContact) as string}
          </a>
        </div>
      </div>
    </header>
  )
}
