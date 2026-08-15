import React, { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Consolidated floating-label input used by Register, Create Queue, and
 * Edit Queue forms. Supports a `status` prop ('error' | 'success') that
 * morphs the focus ring and shakes briefly on error.
 */
export default function GlassInput({ id, label, status, as = 'input', className = '', ...rest }) {
  const [shake, setShake] = useState(false)

  const ringClass =
    status === 'error'
      ? 'border-danger/60 focus:ring-danger/25'
      : status === 'success'
      ? 'border-success/60 focus:ring-success/25'
      : 'focus:border-accent-400/60 focus:ring-accent-400/20'

  const Field = as === 'textarea' ? 'textarea' : 'input'

  return (
    <motion.div
      className="relative"
      animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      onAnimationComplete={() => setShake(false)}
    >
      <Field
        id={id}
        placeholder=" "
        className={`input peer ${ringClass} ${className}`}
        {...rest}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-3 text-sm text-neutral-500 transition-all
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-500
          peer-focus:-top-2.5 peer-focus:left-3 peer-focus:bg-midnight-900 peer-focus:px-1 peer-focus:text-xs peer-focus:text-accent-300
          -top-2.5 left-3 bg-midnight-900 px-1 text-xs"
      >
        {label}
      </label>
    </motion.div>
  )
}
