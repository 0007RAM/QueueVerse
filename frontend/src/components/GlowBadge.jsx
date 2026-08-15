import React from 'react'
import { motion } from 'framer-motion'

const TONES = {
  neutral: 'border-neutral-500/30 text-neutral-300 bg-white/[0.03]',
  accent: 'border-accent-400/50 text-accent-200 bg-accent-500/10',
  info: 'border-sky-400/40 text-sky-300 bg-sky-500/10',
  success: 'border-success/40 text-emerald-300 bg-success/10',
  muted: 'border-neutral-700 text-neutral-500 bg-white/[0.02]',
  danger: 'border-danger/40 text-rose-300 bg-danger/10',
}

/**
 * Generic glass pill badge. StatusBadge is a thin, domain-specific wrapper
 * around this for token statuses.
 */
export default function GlowBadge({ children, tone = 'neutral', live = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur-md ${TONES[tone] || TONES.neutral} ${className}`}>
      {live && (
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-glow-500"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
      )}
      {children}
    </span>
  )
}
