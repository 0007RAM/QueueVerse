import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import { useToast } from '../context/ToastContext.jsx'

const QUEUE_TYPES = ['TEMPLE', 'BANK', 'HOSPITAL', 'RESTAURANT', 'GOVERNMENT_OFFICE']

export default function EditQueueModal({ open, queue, onClose, onSaved }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', queueType: 'TEMPLE', averageServiceTime: 5 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (queue) {
      setForm({
        name: queue.name,
        queueType: queue.queueType,
        averageServiceTime: queue.averageServiceTime,
      })
    }
  }, [queue])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await queueService.update(queue.id, {
        name: form.name,
        queueType: form.queueType,
        averageServiceTime: Number(form.averageServiceTime),
      })
      showToast(`"${updated.name}" updated successfully`, 'success')
      onSaved?.(updated)
      onClose()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="card-glow relative w-full max-w-md p-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-neutral-500 hover:text-accent-300"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>

            <h2 className="font-display text-lg font-bold text-neutral-100">Edit queue</h2>
            <p className="mt-1 text-sm text-neutral-500">Update details for this queue.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="label">Queue name</label>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Queue type</label>
                <select
                  className="input"
                  value={form.queueType}
                  onChange={(e) => setForm({ ...form, queueType: e.target.value })}
                >
                  {QUEUE_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Average service time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  className="input"
                  required
                  value={form.averageServiceTime}
                  onChange={(e) => setForm({ ...form, averageServiceTime: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-white/10">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
