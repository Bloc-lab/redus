import { getApiBaseUrl, getApiKey } from './env'

export type ApiErrorKind = 'config' | 'network' | '401' | '403' | 'server' | 'unknown'

export class CmsApiError extends Error {
  constructor(
    message: string,
    public readonly kind: ApiErrorKind,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'CmsApiError'
  }
}

function buildUrl(pathWithQuery: string): string {
  const base = getApiBaseUrl()
  const path = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`
  if (base === '') return path
  return `${base}${path}`
}

export async function fetchContent(
  lang: 'cs' | 'en'
): Promise<Record<string, string>> {
  const key = getApiKey()
  if (!key) {
    throw new CmsApiError(
      'Chybí VITE_CMS_API_KEY v prostředí.',
      'config'
    )
  }

  const url = buildUrl(
    `/api/v1/content?lang=${encodeURIComponent(lang)}`
  )
  const headers = new Headers()
  headers.set('X-API-KEY', key)
  headers.set('Accept', 'application/json')

  let res: Response
  try {
    res = await fetch(url, { headers })
  } catch {
    throw new CmsApiError(
      'Nelze se připojit k CMS API. Zkontrolujte síť a Vite proxy.',
      'network'
    )
  }

  if (res.status === 401 || res.status === 403) {
    throw new CmsApiError(
      'Neplatný nebo chybějící API klíč.',
      res.status === 401 ? '401' : '403',
      res.status
    )
  }
  if (res.status >= 500) {
    throw new CmsApiError(
      'Server CMS je dočasně nedostupný. Zkuste to prosím později.',
      'server',
      res.status
    )
  }
  if (!res.ok) {
    throw new CmsApiError(
      `Neočekávaná odpověď API (${res.status}).`,
      'unknown',
      res.status
    )
  }

  const data = (await res.json()) as unknown
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new CmsApiError('Neplatný formát odpovědi z CMS.', 'unknown')
  }

  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string') out[k] = v
  }
  return out
}

export type SiteInfo = { siteName: string; logoUrl: string | null }

export async function fetchPublicSiteInfo(): Promise<SiteInfo | null> {
  const url = buildUrl('/api/v1/public/site-info')
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = (await res.json()) as {
      siteName?: string
      logoUrl?: string | null
    }
    if (!data?.siteName) return null
    return {
      siteName: data.siteName,
      logoUrl: typeof data.logoUrl === 'string' ? data.logoUrl : null,
    }
  } catch {
    return null
  }
}
