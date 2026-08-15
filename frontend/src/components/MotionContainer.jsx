import React from 'react'
import { motion } from 'framer-motion'

/**
 * Shared scroll-reveal wrapper. Wrap any block of content to have it fade
 * and rise into place the first time it enters the viewport.
 */
export default function MotionContainer({
  children,
  delay = 0,
  y = 24,
  once = true,
  className = '',
  as: Component = motion.div,
  ...rest
}) {
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  )
}
