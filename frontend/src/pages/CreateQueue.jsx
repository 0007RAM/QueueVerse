import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlusCircle, FiCheckCircle } from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import { useToast } from '../context/ToastContext.jsx'
import QRCodeModal from '../components/QRCodeModal.jsx'
import Sidebar from '../components/Sidebar.jsx'
import GlassInput from '../components/GlassInput.jsx'

const QUEUE_TYPES = ['TEMPLE', 'BANK', 'HOSPITAL', 'RESTAURANT', 'GOVERNMENT_OFFICE']

export default function CreateQueue() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', queueType: 'TEMPLE', averageServiceTime: 5, description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(null)
  const [showQR, setShowQR] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Note: `description` is collected for future use but is not sent to the
      // backend - the existing QueueRequest DTO does not have a description
      // field, and per project constraints the backend is not being modified.
      const queue = await queueService.create({
        name: form.name,
        queueType: form.queueType,
        averageServiceTime: Number(form.averageServiceTime),
      })
      setCreated(queue)
      showToast(`Queue "${queue.name}" created successfully`, 'success')
      setShowQR(true)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Sidebar />

      <div className="mx-auto w-full max-w-lg flex-1">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-400">
            <FiPlusCircle size={22} />
          </div>
          <h1 className="font-display text-2xl font-bold text-neutral-100">Create a new queue</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Set it up once, then generate a QR code for the counter.
          </p>
        </div>

        {created ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glow flex flex-col items-center gap-3 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-glow-gradient text-midnight-950"
            >
              <FiCheckCircle size={28} />
            </motion.div>
            <h2 className="font-display text-xl font-bold text-neutral-100">"{created.name}" is live</h2>
            <p className="text-sm text-neutral-500">Your queue has been created and is ready to accept tokens.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button onClick={() => setShowQR(true)} className="btn-primary">View QR code</button>
              <Link to="/admin/queues" className="btn-secondary">Go to queue management</Link>
              <button
                onClick={() => { setCreated(null); setForm({ name: '', queueType: 'TEMPLE', averageServiceTime: 5, description: '' }) }}
                className="btn-ghost border border-white/10"
              >
                Create another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-5 p-6"
          >
            <div>
              <GlassInput
                id="name"
                name="name"
                required
                label="Queue name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Queue type</label>
              <select name="queueType" className="input" value={form.queueType} onChange={handleChange}>
                {QUEUE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <GlassInput
                id="averageServiceTime"
                name="averageServiceTime"
                type="number"
                min="1"
                required
                label="Average service time (minutes)"
                value={form.averageServiceTime}
                onChange={handleChange}
              />
            </div>

            <div>
              <GlassInput
                id="description"
                name="description"
                as="textarea"
                rows={3}
                label="Description (optional)"
                className="resize-none"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/admin')} className="btn-ghost flex-1 border border-white/10">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Creating...' : 'Create queue'}
              </button>
            </div>
          </motion.form>
        )}
      </div>

      <QRCodeModal
        open={showQR}
        onClose={() => setShowQR(false)}
        queueId={created?.id}
        queueName={created?.name}
      />
    </div>
  )
}
