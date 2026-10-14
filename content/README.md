# Content guide

All of the app's content lives in this folder as JSON. You can edit or add content
without touching any component. The schemas live in
[`src/content/schema.ts`](../src/content/schema.ts). Run `npm run validate` after editing.
It checks every file's shape, every cross-reference (ids of positions, topics, scholars,
sources) and completeness rules (e.g. every claim has an objection). `npm run build` runs
validation first and refuses to build broken content.

## Files

| Path | Holds | Schema |
| --- | --- | --- |
| `positions/*.json` | Array of positions (both axes + frameworks) | `Position` |
| `combinations.json` | Array of millennial × hermeneutic pairings | `Combination` |
| `topics/*.json` | Array of topics, each with its list of possible stances | `Topic` |
| `matrix/*.json` | Array of matrix cells (position × topic) | `MatrixCell` |
| `passages/*.json` | Array of Passage Lab entries | `Passage` |
| `arguments/*.json` | Array of argument trees (Argument Arena) | `ArgumentTree` |
| `timelines.json` | Array of per-position timelines | `Timeline` |
| `flowchart.json` | The "Which view fits me?" decision tree | `Flowchart` |
| `scholars.json` | Array of scholar profiles | `Scholar` |
| `library.json` | Debates, multi-view books and key books | `Exchange` |
| `glossary.json` | Array of glossary terms | `GlossaryEntry` |
| `study/quizzes.json` | Array of quiz sets | `QuizSet` |
| `study/flashcards.json` | Array of flashcard decks | `FlashDeck` |
| `sources/*.json` | The sources registry (array of `Source`, merged across files) | `Source` |
| `tour.json` | The 60-second guided intro on the home page | `TourStep` |
| `bible.json` | **Generated** by `npm run bible`. Do not edit by hand | `Bible` |

Files in folders are merged. Split them however you like.

## Fixed ids

**Positions**: millennial axis: `postmil`, `amil`, `histpremil`, `disppremil`.
Hermeneutic axis: `partial-preterism`, `full-preterism`, `historicism`, `futurism`, `idealism`, `eclectic`.
Frameworks: `covenant-theology`, `dispensationalism`, `progressive-covenantalism`.

The comparison matrix and timelines cover the ten non-framework positions.

**Topics**: `millennium`, `satan-binding`, `first-resurrection`, `second-coming`, `rapture`,
`great-tribulation`, `antichrist`, `olivet-generation`, `seventy-weeks`, `revelation-date`,
`israel`, `optimism`, `kingdom`, `final-judgment`, `church-history`.

**Scholars**: see `scholars.json`. Add new ones there before referencing them.

## Writing rules

1. **Steelman every view.** Write each position as its best-informed proponents would
   present it, in their own vocabulary. Neutral, scholarly, charitable voice.
2. **Every critique gets its best response; every argument its best counter.**
3. **Paraphrase.** Never copy paragraphs. Direct quotes must be short (under ~15 words) and attributed.
4. **Bible text**: only public-domain or openly licensed text (BSB, KJV, WEB) is embedded,
   generated into `bible.json`. Never paste NIV/ESV/NASB wording; cite them by reference only.
5. **Disputed facts** (e.g. the date of Revelation) present both sides and say "disputed".
6. **Orthodoxy**: where a view sits outside the historic creeds (e.g. full preterism),
   say so factually, with the reasons critics give and the response proponents give.
7. **Cite**: every position, cell, reading, argument node and timeline carries `sources`.
   Mark a source `"verified": false` if you could not confirm it online.
