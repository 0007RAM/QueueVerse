import React from 'react'

/**
 * Wraps content in a slowly-animating cyan gradient border. Formalizes the
 * `.glow-ring` CSS trick as a reusable component for hero panels, QR frames,
 * and feature callouts.
 */
export default function GradientBorder({ children, className = '', rounded = 'rounded-2xl' }) {
  return (
    <div className={`glow-ring ${rounded} ${className}`}>
      {children}
    </div>
  )
}
