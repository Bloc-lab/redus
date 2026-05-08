function Bar({ className }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-md ${className ?? ''}`} aria-hidden />
  )
}

export function HeaderSkeleton({ offsetTop = false }: { offsetTop?: boolean }) {
  return (
    <header
      className={`fixed ${
        offsetTop ? 'top-10' : 'top-0'
      } z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur`}
      aria-busy="true"
      aria-label="Načítání navigace"
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Bar className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="min-w-0 space-y-2">
            <Bar className="h-6 w-28 sm:w-36" />
            <Bar className="h-3 w-24 sm:w-32" />
          </div>
        </div>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-hidden
        >
          <Bar className="h-4 w-14" />
          <Bar className="h-4 w-12" />
          <Bar className="h-4 w-11" />
          <Bar className="h-4 w-28" />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Bar className="h-8 w-17 rounded-lg" />
          <Bar className="h-10 w-28 shrink-0 rounded-lg sm:w-36" />
        </div>
      </div>
    </header>
  )
}
