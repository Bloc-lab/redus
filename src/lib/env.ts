const env = import.meta.env as Record<string, string | undefined>

function str(key: string): string {
  return env[key]?.trim() ?? ''
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

export function getApiKey(): string | null {
  const raw = str('VITE_CMS_API_KEY') || str('PUBLIC_CMS_API_KEY')
  return raw || null
}
