/**
 * Placeholder UI while CMS content & settings load (skeleton / shimmer pattern).
 */

function Bar({ className }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-md ${className ?? ''}`} aria-hidden />
  )
}

export function SiteContentSkeleton({
  variant,
}: {
  variant: 'home' | 'about'
}) {
  if (variant === 'about') {
    return (
      <main
        className="bg-white px-4 py-16 lg:px-6 lg:py-24"
        aria-busy="true"
        role="status"
      >
        <span className="sr-only">Načítání obsahu stránky…</span>
        <article className="mx-auto max-w-3xl space-y-4">
          <Bar className="h-10 max-w-[12rem]" />
          <div className="space-y-3 pt-8">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-[92%]" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-[78%]" />
          </div>
        </article>
      </main>
    )
  }

  return (
    <div aria-busy="true" role="status">
      <span className="sr-only">Načítání obsahu webu…</span>

      {/* Hero */}
      <section className="bg-[#F8FAFC] px-6 py-20 lg:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <Bar className="h-7 max-w-[14rem] rounded-full" />
            <Bar className="h-10 w-full max-w-xl" />
            <Bar className="h-10 w-[88%] max-w-lg" />
            <div className="space-y-2.5 pt-2">
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-[90%]" />
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <Bar className="h-11 w-44 rounded-lg" />
              <Bar className="h-11 w-36 rounded-lg" />
            </div>
          </div>
          <Bar className="aspect-[4/3] min-h-[14rem] w-full rounded-2xl lg:aspect-auto lg:min-h-[320px]" />
        </div>
      </section>

      {/* Services-like grid */}
      <section className="border-t border-neutral-200/80 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Bar className="mx-auto h-8 w-[min(100%,20rem)]" />
            <Bar className="mx-auto mt-4 h-4 w-[min(100%,28rem)]" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-6"
              >
                <Bar className="h-5 w-3/4" />
                <div className="mt-4 space-y-2">
                  <Bar className="h-3 w-full" />
                  <Bar className="h-3 w-full" />
                  <Bar className="h-3 w-[85%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wide strip */}
      <section className="bg-neutral-100/80 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <Bar className="h-8 max-w-xs" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-[92%]" />
            <div className="space-y-2 pt-2">
              <Bar className="h-3 max-w-[12rem]" />
              <Bar className="h-3 max-w-[14rem]" />
              <Bar className="h-3 max-w-[11rem]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Bar className="aspect-square rounded-xl" />
            <Bar className="aspect-square rounded-xl" />
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section className="border-t border-neutral-200/80 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-2xl border border-neutral-200/60 bg-linear-to-br from-neutral-50 to-white p-8 lg:p-12">
          <div className="mx-auto max-w-xl text-center">
            <Bar className="mx-auto h-9 w-[min(100%,22rem)]" />
            <Bar className="mx-auto mt-4 h-4 w-[min(100%,26rem)]" />
            <Bar className="mx-auto mt-10 h-12 w-full max-w-sm rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
