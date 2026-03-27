import { useCallback, useEffect, useMemo, useState } from 'react'
import { CmsApiError, fetchContent, fetchPublicSiteInfo } from '../lib/cms'
import { DEFAULT_CONTENT } from '../lib/defaults'

export type Lang = 'cs' | 'en'

export function useSiteContent() {
  const [lang, setLang] = useState<Lang>('cs')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<CmsApiError | null>(null)
  const [raw, setRaw] = useState<Record<string, string>>({})
  const [siteLogoFromHost, setSiteLogoFromHost] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const contentTask = fetchContent(lang).then(
      (data) => ({ ok: true as const, data }),
      (e: unknown) => ({ ok: false as const, error: e })
    )
    const siteTask = fetchPublicSiteInfo().catch(() => null)

    const [contentOutcome, siteInfo] = await Promise.all([contentTask, siteTask])

    if (contentOutcome.ok) {
      setRaw(contentOutcome.data)
      setError(null)
    } else {
      setRaw({})
      const e = contentOutcome.error
      if (e instanceof CmsApiError) {
        setError(e)
      } else {
        setError(
          new CmsApiError(
            'Neočekávaná chyba při načítání obsahu.',
            'unknown'
          )
        )
      }
    }

    if (siteInfo?.logoUrl) setSiteLogoFromHost(siteInfo.logoUrl)
    else setSiteLogoFromHost(null)

    setLoading(false)
  }, [lang])

  useEffect(() => {
    void load()
  }, [load])

  const content = useMemo(() => ({ ...DEFAULT_CONTENT, ...raw }), [raw])

  return {
    lang,
    setLang,
    loading,
    error,
    refetch: load,
    content,
    siteLogoFromHost,
  }
}
