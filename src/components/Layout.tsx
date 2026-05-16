import { Link, Outlet, useLocation } from 'react-router-dom'
import { ApiBanner } from './ApiBanner'
import { Footer } from './Footer'
import { Header } from './Header'
import { HeaderSkeleton } from './HeaderSkeleton'
import { SiteContentSkeleton } from './SiteContentSkeleton'
import { useSite } from '../context/SiteContentContext'
import { clearPreviewSession } from '../lib/previewQuery'

function closePreviewTo(location: ReturnType<typeof useLocation>): string {
  clearPreviewSession()
  const params = new URLSearchParams(location.search)
  params.delete('previewToken')
  params.delete('lang')
  const query = params.toString()
  return `${location.pathname}${query ? `?${query}` : ''}${location.hash}`
}

export function Layout() {
  const { error, refetch, loading, isPreview } = useSite()
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      {isPreview ? (
        <div className="fixed top-0 z-50 flex h-10 w-full items-center border-b border-sky-200 bg-sky-50 px-4 text-sm text-sky-950">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <strong className="font-semibold">
              Náhled - nepublikované změny
            </strong>
            <Link
              to={closePreviewTo(location)}
              className="shrink-0 rounded-md border border-sky-200 bg-white px-3 py-1 font-medium text-sky-950 shadow-sm hover:bg-sky-100"
            >
              Zavřít náhled
            </Link>
          </div>
        </div>
      ) : null}
      {loading ? (
        <div
          className={`h-1 w-full animate-pulse bg-linear-to-r from-(--brand-primary-30) via-(--brand-primary) to-(--brand-primary-30) ${
            isPreview ? 'mt-10' : ''
          }`}
          aria-hidden
        />
      ) : null}
      <ApiBanner error={error} onRetry={() => void refetch()} />
      {loading ? (
        <HeaderSkeleton offsetTop={isPreview} />
      ) : (
        <Header offsetTop={isPreview} />
      )}
      <div className="flex-1 pt-20" style={isPreview ? { paddingTop: '7.5rem' } : undefined}>
        {loading ? (
          <SiteContentSkeleton
            variant={location.pathname.startsWith('/o-nas') ? 'about' : 'home'}
          />
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </div>
  )
}
