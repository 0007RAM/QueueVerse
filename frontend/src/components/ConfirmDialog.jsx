import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

/**
 * Generic confirmation dialog with a glassmorphic backdrop. Used anywhere a
 * destructive or important action needs an explicit confirm step (e.g.
 * deleting a queue).
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onCancel}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="card-glow w-full max-w-sm p-6 text-center"
          >
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${
              danger ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : 'border-accent-500/30 bg-accent-500/10 text-accent-400'
            }`}>
              <FiAlertTriangle size={22} />
            </div>
            <h2 id="confirm-dialog-title" className="font-display text-lg font-bold text-neutral-100">{title}</h2>
            {message && <p className="mt-2 text-sm text-neutral-500">{message}</p>}

            <div className="mt-6 flex gap-3">
              <button onClick={onCancel} className="btn-ghost flex-1 border border-white/10">
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={loading ? 'btn flex-1 bg-rose-600/60 text-white' : danger ? 'btn-danger flex-1' : 'btn-primary flex-1'}
              >
                {loading ? 'Working...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
