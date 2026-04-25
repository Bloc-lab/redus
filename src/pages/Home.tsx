import { Cta } from '../components/Cta'
import { ExtraSections } from '../components/ExtraSections'
import { Hero } from '../components/Hero'
import { Services } from '../components/Services'
import { WhyUs } from '../components/WhyUs'
import { useSite } from '../context/SiteContentContext'

function isSectionEnabled(content: Record<string, string>, key: string): boolean {
  const v = (content[key] ?? '').trim().toLowerCase()
  if (v === 'hide' || v === '0' || v === 'false' || v === 'off') return false
  return true
}

export function Home() {
  const { content } = useSite()
  return (
    <main>
      {isSectionEnabled(content, 'hero.enabled') ? <Hero /> : null}
      {isSectionEnabled(content, 'services.enabled') ? <Services /> : null}
      {isSectionEnabled(content, 'why.enabled') ? <WhyUs /> : null}
      <ExtraSections />
      {isSectionEnabled(content, 'cta.enabled') ? <Cta /> : null}
    </main>
  )
}
