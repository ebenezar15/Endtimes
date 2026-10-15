import { motion, useScroll, useSpring } from 'framer-motion'

export function ProgressBar() {
  const progress = useSpring(useScroll().scrollYProgress, { stiffness: 120, damping: 24 })
  return <motion.div aria-hidden className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[var(--rubric)] via-[var(--gold-bright)] to-[var(--accent)]" style={{ scaleX: progress }} />
}
