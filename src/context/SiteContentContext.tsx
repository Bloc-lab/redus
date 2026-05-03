import { createContext, useContext, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'
import type { Lang } from '../hooks/useSiteContent'

type SiteContentValue = ReturnType<typeof useSiteContent>

const SiteContentContext = createContext<SiteContentValue | null>(null)

function readPreviewToken(search: string): string | null {
  const token = new URLSearchParams(search).get('previewToken')?.trim() ?? ''
  return token || null
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const value = useSiteContent(readPreviewToken(location.search))
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSite must be used within SiteContentProvider')
  return ctx
}

export type { Lang }
export type { CmsApiError } from '../lib/cms'
