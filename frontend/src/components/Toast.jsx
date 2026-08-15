import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi'

const STYLES = {
  success: { icon: FiCheckCircle, ring: 'border-accent-500/30', iconColor: 'text-accent-400', bar: 'bg-glow-gradient' },
  error: { icon: FiXCircle, ring: 'border-rose-500/30', iconColor: 'text-rose-400', bar: 'bg-rose-500' },
  info: { icon: FiInfo, ring: 'border-white/10', iconColor: 'text-neutral-300', bar: 'bg-neutral-400' },
}

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const { icon: Icon, ring, iconColor, bar } = STYLES[type] || STYLES.info
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration - 250)
    return () => clearTimeout(t)
  }, [duration])

  return (
    <AnimatePresence onExitComplete={onClose}>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`relative overflow-hidden rounded-xl border ${ring} bg-midnight-800/80 px-4 py-3.5 shadow-glow backdrop-blur-xl`}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <Icon className={`mt-0.5 shrink-0 ${iconColor}`} size={18} />
            <p className="flex-1 text-sm font-medium text-neutral-100">{message}</p>
            <button
              onClick={() => setVisible(false)}
              className="shrink-0 text-neutral-500 hover:text-accent-300"
              aria-label="Dismiss"
            >
              <FiX size={16} />
            </button>
          </div>
          <motion.div
            className={`absolute bottom-0 left-0 h-0.5 ${bar}`}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
