const env = import.meta.env as Record<string, string | undefined>

function str(key: string): string {
  return env[key]?.trim() ?? ''
}

/** Domény tenantu Bloclab (hostname vždy lowercase, bez portu). */
const BLOCLAB_HOSTS = new Set(['bloclab.cz', 'www.bloclab.cz'])

let missingKeyLogged = false

/**
 * Normalizuje `Host` / `X-Forwarded-Host` pro porovnání: lowercase, bez portu, první hodnota při seznamu.
 * Na serveru předejte např. `request.headers.get('x-forwarded-host') ?? request.headers.get('host')`.
 */
export function normalizeCmsHost(hostHeader: string | null | undefined): string {
  if (hostHeader == null || hostHeader === '') return ''
  const first = hostHeader.split(',')[0]?.trim() ?? ''
  if (first.startsWith('[')) {
    const end = first.indexOf(']')
    if (end !== -1) return first.slice(0, end + 1).toLowerCase()
    return first.toLowerCase()
  }
  const idx = first.lastIndexOf(':')
  if (idx !== -1 && /^\d{2,5}$/.test(first.slice(idx + 1))) {
    return first.slice(0, idx).toLowerCase()
  }
  return first.toLowerCase()
}

function resolveHostname(requestHostHeader?: string | null): string {
  if (requestHostHeader != null) {
    return normalizeCmsHost(requestHostHeader)
  }
  if (typeof globalThis !== 'undefined' && 'location' in globalThis) {
    const loc = (globalThis as { location?: { hostname?: string } }).location
    const h = loc?.hostname
    if (h) return h.toLowerCase()
  }
  return ''
}

/**
 * Vrací API klíč pro aktuální tenant podle hostname.
 * - Client: z `window.location.hostname` (kromě předaného hosta).
 * - SSR: předejte host z requestu (`x-forwarded-host` nebo `host`), ne `window`.
 */
export function resolveCmsApiKey(requestHostHeader?: string | null): string {
  const hostname = resolveHostname(requestHostHeader)

  if (
    hostname === '' &&
    requestHostHeader === undefined &&
    typeof globalThis !== 'undefined' &&
    !('location' in globalThis)
  ) {
    console.error(
      '[CMS] resolveCmsApiKey: na serveru je potřeba předat host z requestu (Host / x-forwarded-host).'
    )
  }

  const keyBloclab = str('VITE_CMS_API_KEY_BLOCLAB')
  const keyRedus = str('VITE_CMS_API_KEY_REDUS')
  const keyLegacy = str('VITE_CMS_API_KEY') || str('PUBLIC_CMS_API_KEY')

  const isBloclab = BLOCLAB_HOSTS.has(hostname)
  const resolved = isBloclab ? keyBloclab || keyLegacy : keyRedus || keyLegacy

  if (!resolved && !missingKeyLogged) {
    missingKeyLogged = true
    const expected = isBloclab ? 'VITE_CMS_API_KEY_BLOCLAB' : 'VITE_CMS_API_KEY_REDUS'
    const hostNote =
      hostname !== ''
        ? `host: ${hostname}`
        : typeof globalThis !== 'undefined' && 'location' in globalThis
          ? 'host nebyl určen'
          : 'host prázdný'
    console.error(
      `[CMS] Chybí API klíč — nastavte ${expected} nebo sdílený VITE_CMS_API_KEY (${hostNote}). Klíče se nelogují.`
    )
  }

  return resolved
}

/** Základní URL bez koncového `/`. Prázdné → relativní `/api/...` (Vite proxy). */
export function getApiBaseUrl(): string {
  const raw =
    str('VITE_PUBLIC_CMS_API_URL') ||
    str('VITE_API_URL') ||
    str('PUBLIC_CMS_API_URL') ||
    str('VITE_CMS_API_URL')
  if (!raw) return ''
  return raw.replace(/\/+$/, '')
}

/** Stejné jako resolveCmsApiKey(), typ `null` kvůli volitelné hlavičce. */
export function getApiKey(): string | null {
  const k = resolveCmsApiKey()
  return k || null
}
