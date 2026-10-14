import { Link } from 'react-router-dom'
import { Illum } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { frameworkViews, hermeneuticViews, millennialViews } from '../lib/content'
import { useApp } from '../lib/store'
import type { Position } from '../content/schema'

function Group({ title, intro, items }: { title: string; intro: string; items: Position[] }) {
  const { lensOn, lens } = useApp()
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-3xl">{title}</h2>
      <p className="mt-1 max-w-[65ch] text-ink-soft">{intro}</p>
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((p) => {
          const mine = lensOn && (lens.millennial === p.id || lens.hermeneutic === p.id)
          return (
            <li key={p.id}>
              <Link to={`/positions/${p.id}`} className="leaf flex h-full gap-4 p-4 text-ink no-underline transition-colors hover:border-accent">
                <Illum id={p.id} size={52} />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-2xl">{p.name}</span>
                    {mine && <span className="ui text-sm text-gold">✦ my view</span>}
                  </span>
                  <span className="mt-0.5 block italic text-ink-soft">{p.tagline}</span>
                  <span className="mt-2 line-clamp-3 block text-[0.97rem]">{p.summary}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function Positions() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Positions" lede="Two independent questions and the frameworks beneath them. Each page shows the view as its proponents would present it, then its critics, then the reply." />
      <Group title="When is the millennium?" intro="The millennial views answer how Christ’s return relates to the “thousand years” of Revelation 20." items={millennialViews} />
      <Group title="How should Revelation be read?" intro="The interpretive approaches answer when the visions of Revelation (and related prophecy) are fulfilled." items={hermeneuticViews} />
      <Group title="Frameworks" intro="Whole-Bible systems that shape expectations about Israel, the church and the kingdom." items={frameworkViews} />
    </div>
  )
}
