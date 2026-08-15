import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Wraps any button/link content with a magnetic-cursor effect: the element
 * subtly shifts toward the pointer while hovered, then springs back.
 * Use for primary hero CTAs where the extra tactility matters most.
 */
export default function MagneticButton({ children, className = '', strength = 18, as: As = 'button', ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 250, damping: 18 })
  const springY = useSpring(y, { stiffness: 250, damping: 18 })

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = e.clientX - (rect.left + rect.width / 2)
    const py = e.clientY - (rect.top + rect.height / 2)
    x.set((px / rect.width) * strength)
    y.set((py / rect.height) * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const MotionTag = motion[As] || motion.button

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
