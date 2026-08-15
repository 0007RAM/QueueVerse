import React from 'react'
import { motion } from 'framer-motion'

/**
 * A glass panel with a slow, continuous vertical float - used for elements
 * that should feel like they're "hovering" in the interface (hero panels,
 * floating dock-style toolbars).
 */
export default function FloatingPanel({ children, className = '', float = true, delay = 0 }) {
  return (
    <motion.div
      className={`glass-panel ${className}`}
      animate={float ? { y: [0, -10, 0] } : undefined}
      transition={float ? { repeat: Infinity, duration: 6, ease: 'easeInOut', delay } : undefined}
    >
      {children}
    </motion.div>
  )
}
