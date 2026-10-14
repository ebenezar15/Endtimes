import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { hermeneuticViews, millennialViews, positionsSorted } from '../lib/content'
import { DEFAULT_SETTINGS, useApp, type Translation } from '../lib/store'
import { useActiveTheme } from '../lib/theme'
import { AppearanceControls } from '../components/Appearance'

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-rule py-7">
      <h2 className="text-2xl">{title}</h2>
      <div className="ui mt-4 space-y-4">{children}</div>
    </section>
  )
}

export default function Settings() {
  const s = useApp()
  const active = useActiveTheme()
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" lede="Appearance, your My View lens, and colours. Settings are saved on this device." />

      <Section title="Appearance">
        <div className="max-w-md">
          <AppearanceControls />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            Accent colour
            <input type="color" value={s.accent ?? '#2f4fa0'} onChange={(e) => s.set({ accent: e.target.value })} className="h-9 w-14 cursor-pointer rounded border border-rule bg-surface" />
          </label>
          {s.accent && (
            <button type="button" className="btn min-h-8 py-1 text-sm" onClick={() => s.set({ accent: null })}>
              Use the theme’s accent
            </button>
          )}
          {active.contrast && <span className="text-sm text-ink-soft">High contrast uses its own accent.</span>}
        </div>
        <p className="text-sm text-ink-soft">Custom accents are lightened or darkened automatically if needed to stay readable (WCAG AA).</p>
        <label className="block">
          Text size: {Math.round(s.fontScale * 100)}%
          <input type="range" min={0.85} max={1.4} step={0.05} value={s.fontScale} onChange={(e) => s.set({ fontScale: +e.target.value })} className="mt-1 block w-full max-w-sm accent-[var(--accent)]" />
        </label>
        <p className="text-sm text-ink-soft">Your device’s reduced-motion setting is always respected.</p>
      </Section>

      <Section id="lens" title="My View lens">
        <p className="text-ink-soft">
          The lens marks your position with a ✦, makes it the reference column on Compare, and adds a “Compared with my view” panel to each position page. It never
          changes any content.
        </p>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={s.lensOn} onChange={(e) => s.set({ lensOn: e.target.checked })} />
          Use the My View lens
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="text-sm">
            <span className="block text-ink-soft">Millennial view</span>
            <select className="mt-1 rounded-md border border-rule bg-surface px-3 py-2" value={s.lens.millennial} disabled={!s.lensOn} onChange={(e) => s.set({ lens: { ...s.lens, millennial: e.target.value } })}>
              {millennialViews.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-ink-soft">Reading of Revelation</span>
            <select className="mt-1 rounded-md border border-rule bg-surface px-3 py-2" value={s.lens.hermeneutic} disabled={!s.lensOn} onChange={(e) => s.set({ lens: { ...s.lens, hermeneutic: e.target.value } })}>
              {hermeneuticViews.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="button" className="btn min-h-8 py-1 text-sm" onClick={() => s.set({ lens: DEFAULT_SETTINGS.lens })}>
          Reset to Postmillennial + Partial preterist
        </button>
      </Section>

      <Section title="Bible text">
        <label className="text-sm">
          <span className="block text-ink-soft">Default translation in the Passage Lab</span>
          <select className="mt-1 rounded-md border border-rule bg-surface px-3 py-2" value={s.translation} onChange={(e) => s.set({ translation: e.target.value as Translation })}>
            <option value="BSB">Berean Study Bible (BSB)</option>
            <option value="KJV">King James Version (KJV)</option>
            <option value="WEB">World English Bible (WEB)</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={s.nivLink} onChange={(e) => s.set({ nivLink: e.target.checked })} />
          Show “Read in NIV” links (opens BibleGateway)
        </label>
        <p className="text-sm text-ink-soft">
          The NIV is under copyright, so its text can’t be built into the app. The links open the same passage in the NIV on BibleGateway.
        </p>
      </Section>

      <Section title="Position colours">
        <p className="text-sm text-ink-soft">Each position keeps one colour in every chart. Change any of them here.</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {positionsSorted.map((p) => (
            <li key={p.id}>
              <label className="flex items-center gap-3">
                <input
                  type="color"
                  value={s.colorOverrides[p.id] ?? p.color}
                  onChange={(e) => s.set({ colorOverrides: { ...s.colorOverrides, [p.id]: e.target.value } })}
                  className="h-8 w-12 cursor-pointer rounded border border-rule bg-surface"
                />
                {p.name}
              </label>
            </li>
          ))}
        </ul>
        {Object.keys(s.colorOverrides).length > 0 && (
          <button type="button" className="btn min-h-8 py-1 text-sm" onClick={() => s.set({ colorOverrides: {} })}>
            Restore default colours
          </button>
        )}
      </Section>

      <Section title="About this app">
        <p>
          Content lives in plain JSON files with a documented schema, so anyone can correct or extend it. Every position, passage reading and argument cites its
          sources. Sources that couldn’t be verified online are marked. The app works offline once installed.
        </p>
      </Section>
    </div>
  )
}
