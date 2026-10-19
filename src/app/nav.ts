import type { IconName } from '../components/Icon'
import { t } from '../lib/i18n'

export const NAV: { to: string; label: string; icon: IconName; group: string }[] = [
  { to: '/', label: t('The Road to the End'), icon: 'omega', group: 'Explore' },
  { to: '/positions', label: t('Positions'), icon: 'crown', group: 'Explore' },
  { to: '/timelines', label: t('Timelines'), icon: 'timeline', group: 'Explore' },
  { to: '/fit', label: t('Which view fits me?'), icon: 'fork', group: 'Explore' },
  { to: '/compare', label: t('Compare'), icon: 'layers', group: 'Think' },
  { to: '/arena', label: t('Argument Arena'), icon: 'scales', group: 'Think' },
  { to: '/revelation', label: t('Revelation Study'), icon: 'seal', group: 'Read' },
  { to: '/spiritual', label: t('Spiritual Understanding'), icon: 'sparkles', group: 'Read' },
  { to: '/olivet', label: t('Matthew 24 & AD 70'), icon: 'compass', group: 'Investigate' },
  { to: '/josephus', label: t('Josephus & AD 70'), icon: 'book', group: 'Investigate' },
  { to: '/israel', label: t('Israel in prophecy'), icon: 'star', group: 'Investigate' },
  { to: '/rapture', label: t('Rapture, millennium & kingdom'), icon: 'trumpet', group: 'Investigate' },
  { to: '/signs', label: t('Signs of the times'), icon: 'hourglass', group: 'Investigate' },
  { to: '/dating', label: t('Dating Revelation'), icon: 'scales', group: 'Investigate' },
  { to: '/passages', label: t('Passage Lab'), icon: 'scroll', group: 'Read' },
  { to: '/library', label: t('Debates & Library'), icon: 'library', group: 'Read' },
  { to: '/glossary', label: t('Glossary'), icon: 'book', group: 'Read' },
  { to: '/study', label: t('Study'), icon: 'cap', group: 'Learn' },
  { to: '/settings', label: t('Settings'), icon: 'settings', group: 'Learn' },
]

/** Display names for the nav groups (the `group` values above are the grouping keys). */
export const NAV_GROUP_LABEL: Record<string, string> = {
  Explore: t('Explore'),
  Think: t('Think'),
  Read: t('Read'),
  Investigate: t('Investigate'),
  Learn: t('Learn'),
}
