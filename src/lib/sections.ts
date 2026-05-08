export type SectionKey = 'services' | 'pricing' | 'tax' | 'contact'

export type SectionDef = {
  key: SectionKey
  id: string
  enabledKey: string
}

export const HOME_SECTIONS: Record<SectionKey, SectionDef> = {
  services: { key: 'services', id: 'sluzby', enabledKey: 'services.enabled' },
  pricing: { key: 'pricing', id: 'cenik', enabledKey: 'pricing.enabled' },
  tax: { key: 'tax', id: 'danove', enabledKey: 'tax.enabled' },
  contact: { key: 'contact', id: 'kontakt', enabledKey: 'cta.enabled' },
}

export function isEnabled(content: Record<string, string>, key: string): boolean {
  const v = (content[key] ?? '').trim().toLowerCase()
  return !(v === 'hide' || v === '0' || v === 'false' || v === 'off')
}

export function sectionHref(section: SectionKey): string {
  return `/#${HOME_SECTIONS[section].id}`
}

export function isSectionAvailable(
  content: Record<string, string>,
  section: SectionKey
): boolean {
  return isEnabled(content, HOME_SECTIONS[section].enabledKey)
}

