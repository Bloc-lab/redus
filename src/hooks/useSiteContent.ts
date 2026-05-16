import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CmsApiError,
  fetchContent,
  fetchPublicSiteInfo,
  fetchPublicSiteSettings,
  type SiteSettingsPublic,
} from '../lib/cms'
import type { Lang } from '../lib/lang'
import { DEFAULT_LANG } from '../lib/lang'
import { DEFAULT_CONTENT } from '../lib/defaults'
import { hrefWithPreview } from '../lib/previewQuery'
import { applyThemeFromSettings } from '../lib/theme'

export type { Lang } from '../lib/lang'

type UseSiteContentOptions = {
  previewToken: string | null
  urlLang: Lang | null
  initialLang: Lang
}

export function useSiteContent({
  previewToken,
  urlLang,
  initialLang,
}: UseSiteContentOptions) {
  const [lang, setLang] = useState<Lang>(() => initialLang ?? DEFAULT_LANG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<CmsApiError | null>(null)
  const [raw, setRaw] = useState<Record<string, string>>({})
  const [siteLogoFromHost, setSiteLogoFromHost] = useState<string | null>(null)
  const [settings, setSettings] = useState<SiteSettingsPublic | null>(null)

  useEffect(() => {
    if (urlLang !== null) setLang(urlLang)
  }, [urlLang])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const contentTask = fetchContent(lang, previewToken).then(
      (data) => ({ ok: true as const, data }),
      (e: unknown) => ({ ok: false as const, error: e })
    )
    const siteTask = fetchPublicSiteInfo().catch(() => null)
    const settingsTask = fetchPublicSiteSettings(lang, previewToken).then(
      (data) => ({ ok: true as const, data }),
      (e: unknown) => ({ ok: false as const, error: e })
    )

    const [contentOutcome, siteInfo, settingsOutcome] = await Promise.all([
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

    if (settingsOutcome.ok) {
      setSettings(settingsOutcome.data)
      if (contentOutcome.ok) setError(null)
    } else {
      setSettings(null)
      if (contentOutcome.ok && settingsOutcome.error instanceof CmsApiError) {
        setError(settingsOutcome.error)
      }
    }
    setLoading(false)
  }, [lang, previewToken])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    applyThemeFromSettings(settings?.theme ?? null)
  }, [settings])

  const content = useMemo(() => ({ ...DEFAULT_CONTENT, ...raw }), [raw])

  const appendPreviewToHref = useCallback(
    (href: string) => hrefWithPreview(href, previewToken, lang),
    [previewToken, lang]
  )

  return {
    lang,
    setLang,
    previewToken,
    isPreview: previewToken !== null,
    loading,
    error,
    refetch: load,
    content,
    siteLogoFromHost,
    settings,
    appendPreviewToHref,
  }
}
