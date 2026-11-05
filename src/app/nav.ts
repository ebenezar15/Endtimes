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
  { to: '/olivet', label: t('Matthew 24 & AD 70'), icon: 'compass', group: 'AD70' },
  { to: '/fulfilled', label: t('Matthew 24 verse by verse'), icon: 'scroll', group: 'AD70' },
  { to: '/new-creation', label: t('New heavens & new earth'), icon: 'sparkles', group: 'Questions' },
  { to: '/questions', label: t('Prophecy questions answered'), icon: 'question', group: 'Questions' },
  { to: '/kingdom-hope', label: t('Early church, Israel and a world getting worse?'), icon: 'compass', group: 'Questions' },
  { to: '/seventy-weeks', label: t('Daniel’s seventy weeks and the end-time timeline'), icon: 'timeline', group: 'AD70' },
  { to: '/judgments', label: t('Seals, trumpets and bowls'), icon: 'seal', group: 'AD70' },
  { to: '/warnings', label: t('Warnings misread'), icon: 'quote', group: 'AD70' },
  { to: '/objections', label: t('Objections answered'), icon: 'scales', group: 'Questions' },
  { to: '/deep-dives', label: t('Deep dives'), icon: 'layers', group: 'Questions' },
  { to: '/josephus', label: t('Josephus & AD 70'), icon: 'book', group: 'AD70' },
  { to: '/israel', label: t('Israel in prophecy'), icon: 'star', group: 'Questions' },
  { to: '/israel-history', label: t('The history of Israel'), icon: 'timeline', group: 'Questions' },
  { to: '/rapture', label: t('Rapture, millennium & kingdom'), icon: 'trumpet', group: 'Questions' },
  { to: '/signs', label: t('Signs of the times'), icon: 'hourglass', group: 'AD70' },
  { to: '/dating', label: t('Dating Revelation'), icon: 'scales', group: 'AD70' },
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
  AD70: t('AD 70: the evidence'),
  Questions: t('Big questions'),
  Learn: t('Learn'),
}

/** A suggested order for working through the studies, from the views to the evidence to the questions. */
export const LEARNING_PATH: string[] = [
  '/positions',
  '/timelines',
  '/israel-history',
  '/olivet',
  '/fulfilled',
  '/josephus',
  '/signs',
  '/dating',
  '/seventy-weeks',
  '/revelation',
  '/judgments',
  '/warnings',
  '/israel',
  '/kingdom-hope',
  '/rapture',
  '/new-creation',
  '/objections',
  '/questions',
]

/** The key under which a page visit is stored. */
export const pageKey = (to: string) => `page:${to}`
