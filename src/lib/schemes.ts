/** Colour schemes (CSS lives in styles/index.css). Surfaces are mirrored here for contrast maths. */
export const SCHEMES = [
  { id: 'sea', name: 'Sea of Glass', blurb: 'Teal and fire-bronze (Revelation 15:2)', swatch: ['#edf4f5', '#0e6673', '#9c3d1b'], surface: { light: '#fbfefe', dark: '#0e242a' }, bg: { light: '#edf4f5', dark: '#061317' } },
  { id: 'throne', name: 'Throne Room', blurb: 'Amethyst with an emerald rainbow (4:3)', swatch: ['#f2f0f9', '#4a2ea0', '#0d6e4c'], surface: { light: '#fdfcff', dark: '#181432' }, bg: { light: '#f2f0f9', dark: '#0c0a1b' } },
  { id: 'dawn', name: 'Morning Star', blurb: 'Dawn red against the last of night (22:16)', swatch: ['#fbf1ec', '#a83a24', '#34489a'], surface: { light: '#fffaf7', dark: '#231523' }, bg: { light: '#fbf1ec', dark: '#130b13' } },
  { id: 'tree', name: 'Tree of Life', blurb: 'Leaf green and fruit (22:2)', swatch: ['#eef3ea', '#2b6638', '#8c2f55'], surface: { light: '#fbfdf8', dark: '#11241a' }, bg: { light: '#eef3ea', dark: '#08130c' } },
  { id: 'scroll', name: 'Sealed Scroll', blurb: 'Sepia parchment and sealing wax (5:1)', swatch: ['#efe4cc', '#7a2c18', '#2a4868'], surface: { light: '#f8efda', dark: '#261c11' }, bg: { light: '#efe4cc', dark: '#16100a' } },
  { id: 'lampstand', name: 'Lampstands', blurb: 'Brass on stone (1:12)', swatch: ['#f3f1ec', '#7c5100', '#1f4e78'], surface: { light: '#fdfcf9', dark: '#1b1915' }, bg: { light: '#f3f1ec', dark: '#0d0c0a' } },
] as const
export type SchemeId = (typeof SCHEMES)[number]['id']
export type Mode = 'light' | 'dark' | 'system'
export const schemeById = (id: string) => SCHEMES.find((s) => s.id === id) ?? SCHEMES[0]
