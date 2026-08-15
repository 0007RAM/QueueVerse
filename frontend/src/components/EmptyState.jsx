import React from 'react'
import { motion } from 'framer-motion'
import { FiInbox } from 'react-icons/fi'

/**
 * Shared empty-state illustration used across list/table pages
 * (no queues, no tokens, no results, etc).
 */
export default function EmptyState({ icon: Icon = FiInbox, title, message, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col items-center gap-3 p-12 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-500/20 bg-accent-500/5">
        <motion.span
          className="absolute inset-0 rounded-2xl bg-accent-500/10"
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <Icon className="relative text-accent-400" size={26} />
      </div>
      <h3 className="font-display text-lg font-bold text-neutral-100">{title}</h3>
      {message && <p className="max-w-xs text-sm text-neutral-500">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  )
}
