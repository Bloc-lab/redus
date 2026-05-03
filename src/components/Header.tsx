import { Link } from 'react-router-dom'
import { pick } from '../lib/defaults'
import { useSite } from '../context/SiteContentContext'
import { LangSwitch } from './LangSwitch'

export function Header({ offsetTop = false }: { offsetTop?: boolean }) {
  const { content, siteLogoFromHost } = useSite()

  const siteName = pick(content, 'admin.siteName')
  const tagline = pick(content, 'admin.tagline')
  const logoUrl =
    pick(content, 'admin.logo', '') || siteLogoFromHost || ''

  return (
    <header
      className={`fixed ${
        offsetTop ? 'top-10' : 'top-0'
      } z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 lg:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
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
          <a href="/#sluzby" className="transition hover:text-(--brand-primary)">
            Služby
          </a>
          <Link to="/o-nas" className="transition hover:text-(--brand-primary)">
            O nás
          </Link>
          <a href="/#cenik" className="transition hover:text-(--brand-primary)">
            Ceník
          </a>
          <a href="/#danove" className="transition hover:text-(--brand-primary)">
            Daňové poradenství
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <a
            href="/#kontakt"
            className="inline-flex shrink-0 rounded-lg bg-(--brand-primary) px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--brand-primary-hover)"
          >
            Kontaktujte nás
          </a>
        </div>
      </div>
    </header>
  )
}
