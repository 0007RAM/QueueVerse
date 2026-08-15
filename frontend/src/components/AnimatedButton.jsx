import React, { useState } from 'react'
import { motion } from 'framer-motion'

let rippleId = 0

/**
 * A self-contained animated button: gradient sweep on hover, a soft border
 * glow, click-compression, and a real ripple effect that originates from
 * the exact click point. Variants mirror the existing .btn-* utility set
 * so it drops in anywhere a plain button currently sits.
 */
export default function AnimatedButton({ children, variant = 'primary', className = '', onClick, ...rest }) {
  const [ripples, setRipples] = useState([])

  const base =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
      ? 'btn-secondary'
      : variant === 'danger'
      ? 'btn-danger'
      : 'btn-ghost'

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = ++rippleId
    const ripple = { id, x: e.clientX - rect.left, y: e.clientY - rect.top }
    setRipples((prev) => [...prev, ripple])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650)
    onClick?.(e)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={`${base} relative overflow-hidden ${className}`}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 220, height: 220, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </motion.button>
  )
}
