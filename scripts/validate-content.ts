/**
 * Validate everything in /content and regenerate src/generated/*.json.
 *   npm run validate                 full check (used by `npm run build`)
 *   npm run validate -- --partial    schema + cross-references only (skip completeness)
 */
import { generateContent } from './content-files'

const partial = process.argv.includes('--partial')
const { bundle, errors } = generateContent({ partial })

const counts = Object.entries(bundle)
  .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : v ? 'ok' : '—'}`)
  .join(', ')
console.log(`Content: ${counts}`)
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`)
  errors.slice(0, 200).forEach((e) => console.error('  - ' + e))
  process.exit(1)
}
console.log('✓ Content is valid')
