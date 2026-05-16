import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'
import {
  persistPreviewSession,
  readUrlPreviewState,
  resolveInitialLang,
  resolvePreviewToken,
} from '../lib/previewQuery'

type SiteContentValue = ReturnType<typeof useSiteContent>

const SiteContentContext = createContext<SiteContentValue | null>(null)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { search } = useLocation()

  const urlState = useMemo(() => readUrlPreviewState(search), [search])
  const effectiveToken = useMemo(() => resolvePreviewToken(search), [search])
  const initialLang = useMemo(
    () => resolveInitialLang(search, effectiveToken),
    [search, effectiveToken]
  )

  useEffect(() => {
    persistPreviewSession(urlState.previewToken, urlState.lang)
  }, [urlState.previewToken, urlState.lang])

  const value = useSiteContent({
    previewToken: effectiveToken,
    urlLang: urlState.lang,
    initialLang,
  })

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

export type { Lang } from '../lib/lang'
export type { CmsApiError } from '../lib/cms'
