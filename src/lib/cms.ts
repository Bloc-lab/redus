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

export type SiteThemeSettings = {
  primary: string
  secondary1: string
  secondary2?: string
}

export type CtaSettings =
  | {
      variant: 'buttons'
      buttons?: {
        phoneLabel?: string
        emailLabel?: string
      }
    }
  | {
      variant: 'form'
      form?: {
        layout?: 'center' | 'split'
        submitLabel?: string
        successMessage?: string
      }
    }

export type SiteSettingsPublic = {
  templateId?: string
  theme?: Partial<SiteThemeSettings>
  cta?: CtaSettings
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

export async function fetchPublicSiteSettings(): Promise<SiteSettingsPublic | null> {
  const url = buildUrl('/api/v1/public/site-settings')
  try {
    const headers = new Headers()
    const key = getApiKey()
    if (key) headers.set('X-API-KEY', key)
    const res = await fetch(url, { headers })
    if (!res.ok) return null
    const data = (await res.json()) as unknown
    if (!isPlainObject(data)) return null

    const out: SiteSettingsPublic = {}

    if (typeof data.templateId === 'string') out.templateId = data.templateId

    if (isPlainObject(data.theme)) {
      out.theme = {}
      if (typeof data.theme.primary === 'string') out.theme.primary = data.theme.primary
      if (typeof data.theme.secondary1 === 'string')
        out.theme.secondary1 = data.theme.secondary1
      if (typeof data.theme.secondary2 === 'string')
        out.theme.secondary2 = data.theme.secondary2
    }

    if (isPlainObject(data.cta) && typeof data.cta.variant === 'string') {
      const variant = data.cta.variant
      if (variant === 'buttons') {
        const buttons = isPlainObject(data.cta.buttons) ? data.cta.buttons : null
        out.cta = {
          variant: 'buttons',
          buttons: {
            phoneLabel: typeof buttons?.phoneLabel === 'string' ? buttons.phoneLabel : undefined,
            emailLabel: typeof buttons?.emailLabel === 'string' ? buttons.emailLabel : undefined,
          },
        }
      } else if (variant === 'form') {
        const form = isPlainObject(data.cta.form) ? data.cta.form : null
        const layoutRaw = typeof form?.layout === 'string' ? form.layout : undefined
        const layout: 'center' | 'split' | undefined =
          layoutRaw === 'center' || layoutRaw === 'split' ? layoutRaw : undefined
        out.cta = {
          variant: 'form',
          form: {
            layout,
            submitLabel: typeof form?.submitLabel === 'string' ? form.submitLabel : undefined,
            successMessage:
              typeof form?.successMessage === 'string' ? form.successMessage : undefined,
          },
        }
      }
    }

    return out
  } catch {
    return null
  }
}
