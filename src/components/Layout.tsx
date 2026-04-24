import { Outlet } from 'react-router-dom'
import { ApiBanner } from './ApiBanner'
import { Footer } from './Footer'
import { Header } from './Header'
import { useSite } from '../context/SiteContentContext'

export function Layout() {
  const { error, refetch, loading } = useSite()

  return (
    <div className="flex min-h-screen flex-col">
      {loading ? (
        <div
          className="h-1 w-full animate-pulse bg-gradient-to-r from-[var(--brand-primary-30)] via-[var(--brand-primary)] to-[var(--brand-primary-30)]"
          aria-hidden
        />
      ) : null}
      <ApiBanner error={error} onRetry={() => void refetch()} />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
