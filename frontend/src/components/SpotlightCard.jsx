import React, { useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * A glass card that tracks the cursor with a soft cyan spotlight - used for
 * primary content cards (queues, tokens) where hover feedback should feel
 * tactile rather than flat.
 */
export default function SpotlightCard({ children, className = '', ...rest }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`card spotlight ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
