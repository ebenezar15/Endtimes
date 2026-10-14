# Last Things

An interactive, even-handed study app for the major Christian views of the end times.
It covers what each view believes, how the views differ and agree, the Scriptures each relies on,
the arguments and counter-arguments, and the debates and scholars behind them.

The design shares a family resemblance with its sister project, **Ecclesia Atlas** (church history).
It uses Avenir Next type, switchable colour schemes with light and dark modes, an icon sidebar, and a
scroll-driven opening scene.

- **The Road to the End** (home): scroll to move a playhead from the Cross to the new creation. Ten
  lanes, one per view, draw themselves and light up their events as you pass, so you watch the
  views diverge.
- **The map of the debate**: a medieval-style *rota* (wheel). Its inner ring holds the four millennial
  views, its outer ring the six ways of reading Revelation, and gold cords mark the common pairings.

## Features

| Area | What it does |
| --- | --- |
| **Overview** | The rota map of every position and both axes, a 60-second guided tour, and a table alternative for screen readers. |
| **Positions** | A page per position: summary, the view in its proponents' own terms, core beliefs, varieties, history, key texts, scholars, strengths, critiques with responses, stances on all 15 topics, and a *Compared with my view* panel. |
| **Which view fits me?** | A branching decision tree that explains the texts behind each fork, plus a zoomable master flowchart (React Flow) with a text outline. |
| **Compare** | Choose 2–4 views and compare them across 15 topics. Marks show agree / partly agree / differ (the shape carries the meaning, not just colour), with a "differences only" filter. |
| **Timelines** | Animated timelines from the Cross to the new creation. Overlay two views to outline and list exactly where they diverge. |
| **Passage Lab** | 35 key passages in public-domain text (BSB, KJV, WEB), with each position's reading, its strongest support and the main objection. "Read in NIV" opens BibleGateway. |
| **Argument Arena** | 16 debates mapped as claim → objection → rebuttal → counter-rebuttal, shown as an expandable tree or a node graph, with filters by position and topic. |
| **Debates & Library** | Multi-view books, public debates and key works; 74 scholar profiles; the full sources registry. |
| **Glossary** | 90 terms. Every term in the app's prose has a hover, focus or tap definition. |
| **Study** | Quizzes (14 sets), spaced-repetition flashcards (14 decks), progress tracking, bookmarks, pinned notes, a Markdown export of notes, and fuzzy search (Ctrl K or /). |
| **Themes** | Six colour schemes named from Revelation's imagery: Sea of Glass, Throne Room, Morning Star, Tree of Life, Sealed Scroll (sepia) and Lampstands. Each has a light and a dark mode (or follows the system), and the switch animates as a circular reveal. There is also a High contrast mode, a custom accent (auto-corrected to WCAG AA), text size, reduced motion and configurable position colours. Type: Avenir Next where installed (macOS, iOS), with Nunito Sans as the open fallback. |
| **Compare tray** | Add positions to a floating tray from any position card or page, then compare them in one tap. |
| **My View lens** | Defaults to Postmillennial + Partial Preterist and can be set to any pair. It highlights your view and changes no content. |

The app is an installable, offline-capable PWA. All settings, notes and progress stay on the device
(localStorage, with every access wrapped in try/catch).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (generates Bible text and content, then watches /content)
npm test           # unit tests: content validation, decision-tree logic
npm run build      # validates content, type-checks, builds to dist/
npm run preview    # serve the production build
```

Requires Node 20+.

## Deploy

`.github/workflows/deploy.yml` runs the build and tests on every pull request. It deploys to
**GitHub Pages** on every push to `main`. One-time setup: in the repository go to **Settings → Pages**
and set **Source** to **GitHub Actions**. The site is then served at
`https://<owner>.github.io/<repo>/`.

For any other static host, run `BASE=/ npm run build` and upload `dist/`. Routing uses URL
hashes, so no server rewrites are needed.

## Edit the content

Everything the app says lives in [`/content`](content) as JSON. No component needs to change to edit
or add content. [`content/README.md`](content/README.md) lists every file and the writing rules.
The schemas are in [`src/content/schema.ts`](src/content/schema.ts) (zod).

- `npm run validate` checks shape, cross-references (position, topic, scholar and source ids) and
  completeness (every matrix cell filled; every claim has an objection; every objection a rebuttal;
  the decision tree has no cycles and no unreachable nodes). `npm run build` refuses to build broken content.
- While `npm run dev` is running, saving a content file regenerates the app's data straight away.
- Bible text is **generated** (`npm run bible`) from npm packages for the verses each passage's
  `ranges` names. Add a passage with new `ranges` and its text appears.

### How the data reaches the app

`scripts/content-files.ts` validates `/content` and writes code-split bundles to `src/generated/`
(git-ignored). The home page loads a slim `core.json`. Positions, the matrix, the glossary and the
sources load with the first deeper page. Passages, arguments, the library, study sets, timelines and
Bible text each load only on the pages that use them.

## Bible text and copyright

Only public-domain or openly licensed text is embedded:

- **BSB**: the Berean Study Bible (2016/2020 text from the `@bible-help/get-bible-verses` package),
  released by Bible Hub under free licensing. Its successor, the Berean Standard Bible, was dedicated
  to the public domain in 2023.
- **KJV**: the 1769 King James text (`kjv` package).
- **WEB**: the World English Bible (`world-english-bible` package), public domain.

The NIV, ESV and NASB are under copyright and are never embedded. Wherever a reference appears, the
app offers a "Read in NIV" link to BibleGateway (this can be turned off in Settings).

## Fairness

Every position is written as its best-informed proponents would state it, using their own terms. Every
critique carries a response, and every argument a rebuttal. An independent fairness audit
([`docs/FAIRNESS-AUDIT.md`](docs/FAIRNESS-AUDIT.md)) reviewed all content for any lean toward the
default lens view, for strawmen and for loaded labels, and lists every correction it made.

## Sources and what is unverified

The registry holds 235 sources, 92 of them confirmed online during research. The other 143 (mostly
standard books) are marked **unverified** in the app. Their details come from the researchers'
knowledge and should be checked against a library catalogue. During research, direct page fetching
was blocked, so "verified" means confirmed through search results, not by opening the page. Disputed
facts (for example, the date of Revelation) are marked as disputed wherever they occur.

## Project layout

```
content/            all app content (JSON) + content/README.md
docs/               fairness audit
scripts/            Bible text generator, content validator/bundler
src/app/            shell, routes, navigation
src/components/     rota, glossary hovers, citations, graphs, marks…
src/content/        zod schema, validation, shared ids
src/lib/            store (zustand), theme, colour contrast, search, flowchart logic, data modules
src/pages/          one file per screen
tests/              vitest unit tests
```
