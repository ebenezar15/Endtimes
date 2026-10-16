import { LANG } from './lang'

/** Bible book names in Tamil (Tamil Bible, BSI Old Version), for displaying references. */
export const BOOKS: [string, string][] = [
  ['Song of Songs', 'உன்னதப்பாட்டு'], ['1 Thessalonians', '1 தெசலோனிக்கேயர்'], ['2 Thessalonians', '2 தெசலோனிக்கேயர்'], ['1 Corinthians', '1 கொரிந்தியர்'],
  ['2 Corinthians', '2 கொரிந்தியர்'], ['1 Chronicles', '1 நாளாகமம்'], ['2 Chronicles', '2 நாளாகமம்'], ['Deuteronomy', 'உபாகமம்'], ['Lamentations', 'புலம்பல்'],
  ['Ecclesiastes', 'பிரசங்கி'], ['Philippians', 'பிலிப்பியர்'], ['Colossians', 'கொலோசெயர்'], ['Revelation', 'வெளிப்படுத்தின விசேஷம்'], ['Zephaniah', 'செப்பனியா'],
  ['Zechariah', 'சகரியா'], ['Leviticus', 'லேவியராகமம்'], ['Ephesians', 'எபேசியர்'], ['Galatians', 'கலாத்தியர்'], ['1 Timothy', '1 தீமோத்தேயு'], ['2 Timothy', '2 தீமோத்தேயு'],
  ['Habakkuk', 'ஆபகூக்'], ['Jeremiah', 'எரேமியா'], ['Nehemiah', 'நெகேமியா'], ['Proverbs', 'நீதிமொழிகள்'], ['Philemon', 'பிலேமோன்'], ['1 Samuel', '1 சாமுவேல்'],
  ['2 Samuel', '2 சாமுவேல்'], ['Obadiah', 'ஒபதியா'], ['Malachi', 'மல்கியா'], ['Matthew', 'மத்தேயு'], ['Genesis', 'ஆதியாகமம்'], ['Ezekiel', 'எசேக்கியேல்'],
  ['Numbers', 'எண்ணாகமம்'], ['Hebrews', 'எபிரெயர்'], ['1 Kings', '1 இராஜாக்கள்'], ['2 Kings', '2 இராஜாக்கள்'], ['1 Peter', '1 பேதுரு'], ['2 Peter', '2 பேதுரு'],
  ['1 John', '1 யோவான்'], ['2 John', '2 யோவான்'], ['3 John', '3 யோவான்'], ['Exodus', 'யாத்திராகமம்'], ['Joshua', 'யோசுவா'], ['Judges', 'நியாயாதிபதிகள்'],
  ['Esther', 'எஸ்தர்'], ['Psalms', 'சங்கீதம்'], ['Psalm', 'சங்கீதம்'], ['Isaiah', 'ஏசாயா'], ['Daniel', 'தானியேல்'], ['Romans', 'ரோமர்'], ['Haggai', 'ஆகாய்'],
  ['Hosea', 'ஓசியா'], ['Jonah', 'யோனா'], ['Micah', 'மீகா'], ['Nahum', 'நாகூம்'], ['James', 'யாக்கோபு'], ['Titus', 'தீத்து'], ['Ruth', 'ரூத்'], ['Ezra', 'எஸ்றா'],
  ['Joel', 'யோவேல்'], ['Amos', 'ஆமோஸ்'], ['Mark', 'மாற்கு'], ['Luke', 'லூக்கா'], ['John', 'யோவான்'], ['Acts', 'அப்போஸ்தலர்'], ['Jude', 'யூதா'], ['Job', 'யோபு'],
]
const RE = new RegExp(`(?<![\\w])(${BOOKS.map(([e]) => e.replace(/ /g, '\\s')).join('|')})(?=\\s*\\d|\\b)`, 'g')
const MAP = new Map(BOOKS.map(([e, t]) => [e, t]))

/** A Bible reference (or list of them) for display: Tamil book names in Tamil mode, unchanged in English. */
export function refLabel(ref: string): string {
  if (LANG !== 'ta' || !ref) return ref
  return ref.replace(RE, (m) => MAP.get(m.replace(/\s+/g, ' ')) ?? m)
}
