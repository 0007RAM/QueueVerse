import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Foundational glass card used throughout the component library. Optionally
 * tilts in 3D toward the cursor (perspective tilt) for a "premium hardware"
 * feel - disabled automatically when reduced motion is preferred.
 */
export default function GlassCard({ children, className = '', tilt = false, glow = false, ...rest }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const springRx = useSpring(rx, { stiffness: 200, damping: 20 })
  const springRy = useSpring(ry, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e) => {
    if (!tilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * 8)
    rx.set(-py * 8)
  }

  const handleMouseLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt ? { rotateX: springRx, rotateY: springRy, transformPerspective: 900 } : undefined}
      className={`${glow ? 'card-glow' : 'card'} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
