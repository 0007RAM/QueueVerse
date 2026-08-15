import React from 'react'
import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge.jsx'
import { FiUser, FiHash } from 'react-icons/fi'

export default function TokenCard({ token, actions }) {
  const isCalled = token.status === 'CALLED'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`card flex flex-wrap items-center justify-between gap-3 p-4 ${isCalled ? 'border-accent-500/40 shadow-glow' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-500/20 bg-accent-500/10">
          {isCalled && (
            <motion.span
              className="absolute inset-0 rounded-xl bg-accent-400/30"
              animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            />
          )}
          <FiHash className="relative text-accent-400" />
        </div>
        <div>
          <p className="font-mono-num font-bold text-neutral-100">{token.tokenNumber}</p>
          <p className="flex items-center gap-1 text-xs text-neutral-500">
            <FiUser size={11} /> {token.userName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={token.status} />
        {actions}
      </div>
    </motion.div>
  )
}
