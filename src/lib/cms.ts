import { getApiBaseUrl, getApiKey } from './env'
import type { Lang } from './lang'

export type ApiErrorKind =
  | 'config'
  | 'network'
  | '401'
  | '403'
  | 'preview_expired'
  | 'server'
  | 'unknown'
type ContentLang = Lang
type PreviewToken = string | null | undefined

const PREVIEW_EXPIRED_HINT =
  'Platnost náhledového odkazu vypršela (cca 1 hodina). V administraci vygenerujte nový odkaz náhledu.'

function looksLikePreviewTokenExpired(message: string | null | undefined): boolean {
  const m = (message ?? '').trim()
  if (!m) return false
  return m === 'Preview token expired' || /preview token expired/i.test(m)
}

async function readJsonErrorMessage(res: Response): Promise<string | null> {
  const raw = await res.text()
  const t = raw.trim()
  if (!t) return null
  try {
    const j = JSON.parse(t) as {
      message?: unknown
      error?: unknown
    }
    const m =
      (typeof j.message === 'string' ? j.message : null) ??
      (typeof j.error === 'string' ? j.error : null)
    return m?.trim() || null
  } catch {
    return t
  }
}

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

function cleanPreviewToken(previewToken: PreviewToken): string {
  return previewToken?.trim() ?? ''
}

function appendPreviewToken(params: URLSearchParams, previewToken: PreviewToken) {
  const token = cleanPreviewToken(previewToken)
  if (token) params.set('previewToken', token)
}

export function buildContentUrl(lang: ContentLang, previewToken?: PreviewToken): string {
  const params = new URLSearchParams()
  params.set('lang', lang)
  appendPreviewToken(params, previewToken)
  return buildUrl(`/api/v1/content?${params.toString()}`)
}

export function buildSiteSettingsUrl(
  lang: ContentLang,
  previewToken?: PreviewToken
): string {
  const params = new URLSearchParams()
  params.set('lang', lang)
  appendPreviewToken(params, previewToken)
  return buildUrl(`/api/v1/public/site-settings?${params.toString()}`)
}

export async function fetchContent(
  lang: ContentLang,
  previewToken?: PreviewToken
): Promise<Record<string, string>> {
  const key = getApiKey()
  if (!key) {
    throw new CmsApiError(
      'Chybí CMS API klíč pro tento hostname (VITE_CMS_API_KEY_BLOCLAB / VITE_CMS_API_KEY_REDUS / VITE_CMS_API_KEY).',
      'config'
    )
  }

  const token = cleanPreviewToken(previewToken)
  const url = buildContentUrl(lang, token)
  const headers = new Headers()
  headers.set('X-API-KEY', key)
  headers.set('Accept', 'application/json')
  const init: RequestInit = { headers }
  if (token) init.cache = 'no-store'

  let res: Response
  try {
    res = await fetch(url, init)
  } catch {
    throw new CmsApiError(
      'Nelze se připojit k CMS API. Zkontrolujte síť a Vite proxy.',
      'network'
    )
  }

  if (res.status === 401 || res.status === 403) {
    const detail = await readJsonErrorMessage(res)
    const expired = Boolean(token && res.status === 403 && looksLikePreviewTokenExpired(detail))
    if (expired) {
      throw new CmsApiError(PREVIEW_EXPIRED_HINT, 'preview_expired', res.status)
    }
    throw new CmsApiError(
      token && res.status === 403
        ? 'Náhled vypršel nebo odkaz není platný.'
        : 'Neplatný nebo chybějící API klíč.',
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

export type NavItem =
  | {
      kind: 'section'
      section: 'services' | 'pricing' | 'tax' | 'contact'
      label?: string
    }
  | {
      kind: 'route'
      href: string
      label?: string
    }

export type NavSettings = {
  items?: NavItem[]
  cta?: { href?: string; label?: string }
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
  nav?: NavSettings
  cta?: CtaSettings
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

export async function fetchPublicSiteSettings(
  lang: ContentLang,
  previewToken?: PreviewToken
): Promise<SiteSettingsPublic | null> {
  const token = cleanPreviewToken(previewToken)
  const url = buildSiteSettingsUrl(lang, token)
  try {
    const headers = new Headers()
    const key = getApiKey()
    if (key) headers.set('X-API-KEY', key)
    const init: RequestInit = { headers }
    if (token) init.cache = 'no-store'
    const res = await fetch(url, init)
    if (token && res.status === 403) {
      const detail = await readJsonErrorMessage(res)
      if (looksLikePreviewTokenExpired(detail)) {
        throw new CmsApiError(PREVIEW_EXPIRED_HINT, 'preview_expired', res.status)
      }
      throw new CmsApiError(
        'Náhled vypršel nebo odkaz není platný.',
        '403',
        res.status
      )
    }
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

    if (isPlainObject(data.nav)) {
      const nav: NavSettings = {}

      if (Array.isArray(data.nav.items)) {
        const items: NavItem[] = []
        for (const raw of data.nav.items) {
          if (!isPlainObject(raw)) continue
          const kind = typeof raw.kind === 'string' ? raw.kind : ''
          const label = typeof raw.label === 'string' ? raw.label : undefined

          if (kind === 'section') {
            const section =
              typeof raw.section === 'string' ? raw.section : ''
            if (
              section === 'services' ||
              section === 'pricing' ||
              section === 'tax' ||
              section === 'contact'
            ) {
              items.push({ kind: 'section', section, label })
            }
          } else if (kind === 'route') {
            const href = typeof raw.href === 'string' ? raw.href : ''
            if (href.trim()) items.push({ kind: 'route', href, label })
          }
        }
        if (items.length) nav.items = items
      }

      if (isPlainObject(data.nav.cta)) {
        const href = typeof data.nav.cta.href === 'string' ? data.nav.cta.href : undefined
        const label = typeof data.nav.cta.label === 'string' ? data.nav.cta.label : undefined
        if ((href?.trim() ?? '') || (label?.trim() ?? '')) nav.cta = { href, label }
      }

      if (nav.items || nav.cta) out.nav = nav
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
  } catch (e) {
    if (e instanceof CmsApiError) throw e
    return null
  }
}
