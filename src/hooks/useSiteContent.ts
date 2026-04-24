import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CmsApiError,
  fetchContent,
  fetchPublicSiteInfo,
  fetchPublicSiteSettings,
  type SiteSettingsPublic,
} from '../lib/cms'
import { DEFAULT_CONTENT } from '../lib/defaults'
import { applyThemeFromSettings } from '../lib/theme'

export type Lang = 'cs' | 'en'

export function useSiteContent() {
  const [lang, setLang] = useState<Lang>('cs')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<CmsApiError | null>(null)
  const [raw, setRaw] = useState<Record<string, string>>({})
  const [siteLogoFromHost, setSiteLogoFromHost] = useState<string | null>(null)
  const [settings, setSettings] = useState<SiteSettingsPublic | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const contentTask = fetchContent(lang).then(
      (data) => ({ ok: true as const, data }),
      (e: unknown) => ({ ok: false as const, error: e })
    )
    const siteTask = fetchPublicSiteInfo().catch(() => null)
    const settingsTask = fetchPublicSiteSettings().catch(() => null)

    const [contentOutcome, siteInfo, publicSettings] = await Promise.all([
      contentTask,
      siteTask,
      settingsTask,
    ])

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

    setSettings(publicSettings)
    setLoading(false)
  }, [lang])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    applyThemeFromSettings(settings?.theme ?? null)
  }, [settings])

  const content = useMemo(() => ({ ...DEFAULT_CONTENT, ...raw }), [raw])

  return {
    lang,
    setLang,
    loading,
    error,
    refetch: load,
    content,
    siteLogoFromHost,
    settings,
  }
}
