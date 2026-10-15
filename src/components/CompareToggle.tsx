import { motion } from 'framer-motion'
import { Icon } from './Icon'
import { useApp } from '../lib/store'
import { positionName } from '../lib/core'
import { t } from '../lib/i18n'

/** Adds or removes a position from the floating compare tray. */
export function CompareToggle({ id, className = '' }: { id: string; className?: string }) {
  const on = useApp((s) => s.compareTray.includes(id))
  const toggle = useApp((s) => s.toggleCompare)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      className={`btn min-h-8 px-2.5 py-1 text-xs ${className}`}
      aria-pressed={on}
      aria-label={on ? t('Remove {name} from comparison', { name: positionName(id) }) : t('Add {name} to comparison', { name: positionName(id) })}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
    >
      <Icon name={on ? 'check' : 'plus'} size={13} /> {t('Compare')}
    </motion.button>
  )
}
