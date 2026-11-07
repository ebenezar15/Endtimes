import type { ReactNode } from 'react'
import { Constellation } from '../ObservatoryHero'

/** The study-page opening in the Observatory style: a glowing panel with a slow constellation behind it. */
export function HeroPanel({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[22px] border border-rule p-6 sm:p-8 ${className}`}
      style={{ background: 'radial-gradient(120% 90% at 85% 0%, color-mix(in srgb, var(--gold) 13%, transparent), transparent 55%), radial-gradient(100% 80% at 0% 100%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 60%), var(--bg-2)' }}
    >
      <Constellation />
      {children}
    </section>
  )
}
