/** České výchozí texty, pokud CMS klíče chybí */
export const DEFAULT_CONTENT: Record<string, string> = {
  'admin.siteName': 'REDUS',
  'admin.tagline': 'ÚČETNÍ A DAŇOVÁ KANCELÁŘ',

  'hero.badge': 'Vaše finance v bezpečných rukou od roku 2003',
  'hero.title': 'Profesionální účetnictví a daňová řešení pro váš růst',
  'hero.titleAccent': 'účetnictví',
  'hero.lead':
    'Jsme tým zkušených účetních a daňových specialistů. Spolehlivost, transparentnost a osobní přístup jsou u nás na prvním místě.',
  'hero.image':
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'hero.cardTitle': '18+ let zkušeností na trhu',
  'hero.ctaPrimary': 'Nezávazná konzultace zdarma',
  'hero.ctaSecondary': 'Naše služby',

  'services.sectionTitle': 'Komplexní služby pro vaše podnikání',
  'services.sectionDesc':
    'Od vedení účetnictví přes daňová přiznání až po strategické poradenství — vše pod jednou střechou.',
  'services.1.title': 'Podvojné účetnictví',
  'services.1.desc':
    'Kompletní vedení účetnictví přizpůsobené typu vašeho podnikání a legislativním požadavkům.',
  'services.2.title': 'Daňová přiznání',
  'services.2.desc':
    'Přehledná příprava a podání přiznání včas, s důrazem na optimalizaci vaší daňové pozice.',
  'services.3.title': 'Mzdy a personalistika',
  'services.3.desc':
    'Zpracování mezd, komunikace s úřady a podpora při HR agendě pro menší i větší týmy.',
  'services.4.title': 'Právní a daňové poradenství',
  'services.4.desc':
    'Strategické konzultace při změnách ve firmě, investicích nebo restrukturalizacích.',

  'why.title': 'Proč si vybrat REDUS?',
  'why.text':
    'Působíme na trhu dlouhodobě a kombinujeme odborné know-how s lidským přístupem ke každému klientovi.',
  'why.bullet1': 'Individuální přístup',
  'why.bullet2': 'Pojištění odpovědnosti',
  'why.bullet3': 'Odbornost',
  'why.quote':
    '„Nabízíme víc než jen účetnictví — společně hledáme řešení, která podporují růst vašeho podnikání.“',
  'why.quoteAuthor': 'Martin Rada, vedoucí kanceláře',
  'why.image1':
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'why.image2':
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',

  'cta.title': 'Připraveni optimalizovat své účetnictví?',
  'cta.desc': 'Domluvte si nezávaznou úvodní konzultaci — rádi vám ukážeme, jak můžeme pomoci.',

  'pricing.title': 'Ceník',
  'pricing.teaser':
    'Transparentní ceny podle rozsahu spolupráce. Konkrétní nabídku připravíme po krátké konzultaci.',
  'tax.title': 'Daňové poradenství',
  'tax.teaser':
    'Strategické daňové plánování, optimalizace a podpora při jednání s finanční správou.',

  'contact.phone': '+420 123 456 789',
  'contact.email': 'info@redus.cz',
  'contact.address': 'Praha 1, Česká republika',

  'footer.blurb':
    'Spolehlivý partner pro účetnictví, daně a řízení podnikových financí.',
  'footer.billing':
    'Martin Rada\nIČO: 12345678\nDIČ: CZ12345678\nDatová schránka: abcdefg',
  'footer.copyright': '© 2025 REDUS. Všechna práva vyhrazena.',

  'about.text':
    'REDUS je účetní a daňová kancelář s dlouholetou tradicí. Pomáháme firmám i podnikatelům s řádným vedením účetnictví, daněmi a strategickým poradenstvím.',
}

export function pick(
  c: Record<string, string>,
  key: string,
  fallback = ''
): string {
  const v = c[key]?.trim()
  if (v) return v
  return DEFAULT_CONTENT[key] ?? fallback
}
