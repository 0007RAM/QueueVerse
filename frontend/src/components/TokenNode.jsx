import React from 'react'
import { motion } from 'framer-motion'

const STATUS_GLOW = {
  WAITING: { ring: 'border-accent-400/30', fill: 'from-accent-500/30 to-accent-400/10', text: 'text-accent-200' },
  CALLED: { ring: 'border-glow-500/60', fill: 'from-glow-500/50 to-accent-400/20', text: 'text-glow-300' },
  CONFIRMED: { ring: 'border-sky-400/40', fill: 'from-sky-400/40 to-sky-300/10', text: 'text-sky-200' },
  COMPLETED: { ring: 'border-success/40', fill: 'from-success/40 to-success/10', text: 'text-emerald-200' },
}

/**
 * A single glowing "orb" node representing one member of the live queue -
 * the core visual metaphor of the platform. Wrap a list of these in a
 * `layout`-enabled parent (see TrackQueue) so nodes glide to their new
 * position instead of jumping when the queue advances.
 */
export default function TokenNode({ label, status = 'WAITING', size = 44, pulse = false, sublabel }) {
  const palette = STATUS_GLOW[status] || STATUS_GLOW.WAITING

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-md ${palette.ring} ${palette.fill}`}
        style={{ width: size, height: size }}
      >
        {pulse && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-glow-500/30"
              animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-glow-500/20"
              animate={{ opacity: [0.5, 0, 0.5], scale: [1, 2.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
            />
          </>
        )}
        <span className={`relative font-display text-xs font-bold ${palette.text}`}>{label}</span>
      </div>
      {sublabel && <span className="max-w-[64px] truncate text-[10px] text-neutral-500">{sublabel}</span>}
    </motion.div>
  )
}
