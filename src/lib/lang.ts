export type Lang = 'cs' | 'en'

export const DEFAULT_LANG: Lang = 'cs'

export function isLang(v: string | null | undefined): v is Lang {
  return v === 'cs' || v === 'en'
}
