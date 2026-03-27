import { AlertCircle, RefreshCw } from 'lucide-react'
import type { CmsApiError } from '../lib/cms'

export function ApiBanner({
  error,
  onRetry,
}: {
  error: CmsApiError | null
  onRetry: () => void
}) {
  if (!error) return null

  return (
    <div
      role="alert"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-700" aria-hidden />
        <p className="min-w-0 flex-1">
          <strong className="font-semibold">Obsah z CMS:</strong>{' '}
          <span className="text-amber-900/90">{error.message}</span>
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-medium text-amber-950 shadow-sm hover:bg-amber-100"
        >
          <RefreshCw className="h-4 w-4" />
          Znovu načíst
        </button>
      </div>
    </div>
  )
}
