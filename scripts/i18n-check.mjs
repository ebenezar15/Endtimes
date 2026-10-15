// Checks a translated batch against its source: node scripts/i18n-check.mjs i18n/source/001.json i18n/ta/c-001.json
// Every source string must be present with a non-empty value in Tamil script, and placeholders and digits must survive.
import { readFileSync } from 'node:fs'

const [src, out] = process.argv.slice(2)
const source = JSON.parse(readFileSync(src, 'utf8'))
let ta
try {
  ta = JSON.parse(readFileSync(out, 'utf8'))
} catch (e) {
  console.error(`INVALID JSON: ${e.message}`)
  process.exit(1)
}
const problems = []
for (const en of source) {
  const v = ta[en]
  if (typeof v !== 'string' || !v.trim()) {
    problems.push(`missing: ${en.slice(0, 70)}`)
    continue
  }
  if (!/[஀-௿]/.test(v) && /[a-z]{4,}/.test(en)) problems.push(`not Tamil: ${en.slice(0, 70)}`)
  for (const ph of en.match(/\{\w+\}/g) ?? []) if (!v.includes(ph)) problems.push(`placeholder ${ph} lost: ${en.slice(0, 60)}`)
  for (const d of en.match(/\d+/g) ?? []) if (!v.includes(d)) problems.push(`number ${d} lost: ${en.slice(0, 60)}`)
}
const extra = Object.keys(ta).filter((k) => !source.includes(k))
if (extra.length) problems.push(`${extra.length} keys not in the source batch (keys must be copied exactly), e.g. ${extra[0].slice(0, 60)}`)
console.log(problems.length ? `${problems.length} problem(s):\n` + problems.slice(0, 40).join('\n') : `OK: ${source.length} strings`)
process.exit(problems.length ? 1 : 0)
