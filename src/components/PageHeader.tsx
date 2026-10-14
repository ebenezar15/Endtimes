import type { ReactNode } from 'react'

export function PageHeader({ title, lede, children }: { title: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8 max-w-[70ch] pt-2">
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      {lede && <p className="mt-3 text-lg text-ink-soft">{lede}</p>}
      {children}
      <div className="rubric-rule mt-6 max-w-xs" aria-hidden />
    </header>
  )
}
