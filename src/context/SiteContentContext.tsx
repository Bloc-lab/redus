import { createContext, useContext, type ReactNode } from 'react'
import { useSiteContent } from '../hooks/useSiteContent'
import type { Lang } from '../hooks/useSiteContent'

type SiteContentValue = ReturnType<typeof useSiteContent>

const SiteContentContext = createContext<SiteContentValue | null>(null)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const value = useSiteContent()
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
