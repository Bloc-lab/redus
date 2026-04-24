import type { SiteThemeSettings } from './cms'

const ROOT = document.documentElement

function setVar(name: string, value: string | undefined) {
  if (!value) return
  const v = value.trim()
  if (!v) return
  ROOT.style.setProperty(name, v)
}

export function applyThemeFromSettings(theme?: Partial<SiteThemeSettings> | null) {
  if (!theme) return
  setVar('--brand-primary', theme.primary)
  setVar('--brand-secondary-1', theme.secondary1)
  setVar('--brand-secondary-2', theme.secondary2)
}

