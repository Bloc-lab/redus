import type { Lang } from './lang'
import { DEFAULT_LANG, isLang } from './lang'

const SESSION_PREVIEW = 'cmsPublicPreviewToken'
const SESSION_LANG = 'cmsPublicPreviewLang'

export function parseLangParam(raw: string | null): Lang | null {
  return isLang(raw) ? raw : null
}

export function readUrlPreviewState(search: string): {
  previewToken: string | null
  lang: Lang | null
} {
  const q = search.startsWith('?') ? search.slice(1) : search
  const p = new URLSearchParams(q)
  const token = p.get('previewToken')?.trim() ?? ''
  return {
    previewToken: token || null,
    lang: parseLangParam(p.get('lang')),
  }
}

function sessionGet(key: string): string | null {
  try {
    if (typeof sessionStorage === 'undefined') return null
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function sessionSet(key: string, value: string): void {
  try {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.setItem(key, value)
  } catch {
    /* ignore quota / private mode */
  }
}

/** Uloží token (a volitelně jazyk) při každém hitu s tokenem v URL. */
export function persistPreviewSession(
  previewToken: string | null,
  lang: Lang | null
): void {
  if (previewToken) {
    sessionSet(SESSION_PREVIEW, previewToken)
    if (lang) sessionSet(SESSION_LANG, lang)
  }
}

export function persistPreviewLang(lang: Lang): void {
  sessionSet(SESSION_LANG, lang)
}

export function clearPreviewSession(): void {
  try {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.removeItem(SESSION_PREVIEW)
    sessionStorage.removeItem(SESSION_LANG)
  } catch {
    /* ignore */
  }
}

/** Token z URL má přednost; jinak poslední uložený z relace (SPA bez query). */
export function resolvePreviewToken(search: string): string | null {
  const { previewToken: urlToken } = readUrlPreviewState(search)
  if (urlToken) return urlToken
  const stored = sessionGet(SESSION_PREVIEW)?.trim()
  return stored || null
}

export function resolveInitialLang(search: string, tokenEffective: string | null): Lang {
  const { lang: urlLang } = readUrlPreviewState(search)
  if (urlLang) return urlLang
  if (tokenEffective) {
    const parsed = parseLangParam(sessionGet(SESSION_LANG))
    if (parsed) return parsed
  }
  return DEFAULT_LANG
}

/**
 * Přidá `previewToken` a `lang` do interních odkazů během náhledu.
 * Podporuje hash (`/#sekce`) a existující query na cestě.
 */
export function hrefWithPreview(
  href: string,
  previewToken: string | null,
  lang: Lang
): string {
  const t = previewToken?.trim()
  if (!t) return href
  if (/^(https?:|mailto:|tel:)/i.test(href.trim())) return href

  const hashIdx = href.indexOf('#')
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : ''
  const pathAndQuery = hashIdx >= 0 ? href.slice(0, hashIdx) : href
  const qIdx = pathAndQuery.indexOf('?')
  const path = qIdx >= 0 ? pathAndQuery.slice(0, qIdx) : pathAndQuery
  const existing = qIdx >= 0 ? pathAndQuery.slice(qIdx + 1) : ''
  const params = new URLSearchParams(existing)
  params.set('previewToken', t)
  params.set('lang', lang)
  return `${path}?${params.toString()}${hash}`
}
