import { Cta } from '../components/Cta'
import { ExtraSections } from '../components/ExtraSections'
import { Hero } from '../components/Hero'
import { Services } from '../components/Services'
import { WhyUs } from '../components/WhyUs'

export function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <WhyUs />
      <ExtraSections />
      <Cta />
    </main>
  )
}
