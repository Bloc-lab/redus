import { Link } from 'react-router-dom'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'
import { LangSwitch } from './LangSwitch'

export function Header() {
  const { content, siteLogoFromHost } = useSite()

  const siteName = pick(content, 'admin.siteName')
  const tagline = pick(content, 'admin.tagline')
  const logoUrl =
    pick(content, 'admin.logo', '') || siteLogoFromHost || ''

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 lg:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="h-10 w-auto object-contain"
            />
          ) : null}
          <div className="min-w-0">
            <div className="text-xl font-bold tracking-tight text-[var(--brand-primary)]">
              {siteName}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-800">
              {tagline}
            </div>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-4 text-sm font-medium text-neutral-700 md:flex md:gap-6 lg:gap-8"
          aria-label="Hlavní navigace"
        >
          <a href="/#sluzby" className="transition hover:text-[var(--brand-primary)]">
            Služby
          </a>
          <Link to="/o-nas" className="transition hover:text-[var(--brand-primary)]">
            O nás
          </Link>
          <a href="/#cenik" className="transition hover:text-[var(--brand-primary)]">
            Ceník
          </a>
          <a href="/#danove" className="transition hover:text-[var(--brand-primary)]">
            Daňové poradenství
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <a
            href="/#kontakt"
            className="inline-flex shrink-0 rounded-xl bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--brand-primary-hover)] sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <span className="hidden sm:inline">Kontaktujte nás</span>
            <span className="sm:hidden">Kontakt</span>
          </a>
        </div>
      </div>

      <nav
        className="flex gap-4 overflow-x-auto border-t border-neutral-100 px-4 py-2.5 text-xs font-medium text-neutral-700 md:hidden"
        aria-label="Rychlá navigace"
      >
        <a href="/#sluzby" className="shrink-0 hover:text-[var(--brand-primary)]">
          Služby
        </a>
        <Link to="/o-nas" className="shrink-0 hover:text-[var(--brand-primary)]">
          O nás
        </Link>
        <a href="/#cenik" className="shrink-0 hover:text-[var(--brand-primary)]">
          Ceník
        </a>
        <a href="/#danove" className="shrink-0 hover:text-[var(--brand-primary)]">
          Daňové por.
        </a>
      </nav>
    </header>
  )
}
