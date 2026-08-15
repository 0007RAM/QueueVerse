import React from 'react'
import { motion } from 'framer-motion'

/**
 * Futuristic loading indicator: two counter-rotating cyan energy rings with a
 * pulsing core. Replaces the old basic spinner across the app.
 */
export default function Loader({ label = 'Synchronizing queue...', size = 'md' }) {
  const dims = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-20 w-20' : 'h-14 w-14'

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-14">
      <div className={`relative ${dims}`}>
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-400 border-r-accent-500"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-accent-300/80 border-l-accent-600/60"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-[35%] rounded-full bg-glow-gradient"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ boxShadow: '0 0 16px 2px rgba(255,215,0,0.6)' }}
        />
      </div>
      {label && (
        <p className="font-mono-num text-xs uppercase tracking-[0.2em] text-accent-400/80">{label}</p>
      )}
    </div>
  )
}
