import type { IconName } from '../components/Icon'

export const NAV: { to: string; label: string; icon: IconName; group: string }[] = [
  { to: '/', label: 'The Road to the End', icon: 'omega', group: 'Explore' },
  { to: '/positions', label: 'Positions', icon: 'crown', group: 'Explore' },
  { to: '/timelines', label: 'Timelines', icon: 'timeline', group: 'Explore' },
  { to: '/fit', label: 'Which view fits me?', icon: 'fork', group: 'Explore' },
  { to: '/compare', label: 'Compare', icon: 'layers', group: 'Think' },
  { to: '/arena', label: 'Argument Arena', icon: 'scales', group: 'Think' },
  { to: '/revelation', label: 'Revelation Study', icon: 'seal', group: 'Read' },
  { to: '/passages', label: 'Passage Lab', icon: 'scroll', group: 'Read' },
  { to: '/library', label: 'Debates & Library', icon: 'library', group: 'Read' },
  { to: '/glossary', label: 'Glossary', icon: 'book', group: 'Read' },
  { to: '/study', label: 'Study', icon: 'cap', group: 'Learn' },
  { to: '/settings', label: 'Settings', icon: 'settings', group: 'Learn' },
]
