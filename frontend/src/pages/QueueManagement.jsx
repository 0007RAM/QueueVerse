import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiEdit2, FiTrash2, FiPauseCircle, FiPlayCircle, FiPlusCircle,
  FiUsers, FiClock, FiHash, FiCalendar, FiRefreshCw,
} from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import { useToast } from '../context/ToastContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import EditQueueModal from '../components/EditQueueModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import QRCodeModal from '../components/QRCodeModal.jsx'

const TYPE_LABELS = {
  TEMPLE: 'Temple',
  BANK: 'Bank',
  HOSPITAL: 'Hospital',
  RESTAURANT: 'Restaurant',
  GOVERNMENT_OFFICE: 'Government Office',
}

export default function QueueManagement() {
  const { showToast } = useToast()
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [qrTarget, setQrTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await queueService.list()
      setQueues(list)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleTogglePause = async (queue) => {
    setBusyId(queue.id)
    try {
      const updated = queue.isPaused ? await queueService.resume(queue.id) : await queueService.pause(queue.id)
      setQueues((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
      showToast(updated.isPaused ? 'Queue paused' : 'Queue resumed', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await queueService.remove(deleteTarget.id)
      setQueues((prev) => prev.filter((q) => q.id !== deleteTarget.id))
      showToast(`"${deleteTarget.name}" deleted`, 'info')
      setDeleteTarget(null)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-neutral-100">Queue Management</h1>
          <div className="flex gap-2">
            <button onClick={load} className="btn-ghost border border-white/10">
              <FiRefreshCw size={14} /> Refresh
            </button>
            <Link to="/admin/queues/new" className="btn-primary">
              <FiPlusCircle /> New queue
            </Link>
          </div>
        </div>

        {loading ? (
          <Loader label="Loading queues..." />
        ) : queues.length === 0 ? (
          <EmptyState
            icon={FiGrid}
            title="No queues yet"
            message="Create your first queue to start accepting tokens."
            action={<Link to="/admin/queues/new" className="btn-primary">Create a queue</Link>}
          />
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {queues.map((q) => (
                <motion.div
                  key={q.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-500/80">
                        {TYPE_LABELS[q.queueType] || q.queueType}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-bold text-neutral-100">{q.name}</h3>
                    </div>
                    {q.isPaused ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase text-neutral-400">
                        Paused
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald-300">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5"><FiHash size={12} /> Token #{q.currentTokenNumber}</span>
                    <span className="flex items-center gap-1.5"><FiUsers size={12} /> {q.waitingCount} waiting</span>
                    <span className="flex items-center gap-1.5"><FiClock size={12} /> ~{q.averageServiceTime} min</span>
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={12} /> {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link to={`/admin?queue=${q.id}`} className="btn-secondary !py-1.5 text-xs">
                      <FiGrid size={13} /> Dashboard
                    </Link>
                    <button onClick={() => setQrTarget(q)} className="btn-secondary !py-1.5 text-xs">
                      Generate QR
                    </button>
                    <button onClick={() => setEditTarget(q)} className="btn-ghost !py-1.5 border border-white/10 text-xs">
                      <FiEdit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleTogglePause(q)}
                      disabled={busyId === q.id}
                      className="btn-ghost !py-1.5 border border-white/10 text-xs"
                    >
                      {q.isPaused ? <FiPlayCircle size={13} /> : <FiPauseCircle size={13} />}
                      {q.isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(q)}
                      className="btn-ghost !py-1.5 col-span-2 border border-rose-500/20 text-xs text-rose-400 hover:bg-rose-500/10"
                    >
                      <FiTrash2 size={13} /> Delete queue
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <EditQueueModal
        open={!!editTarget}
        queue={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={(updated) => setQueues((prev) => prev.map((q) => (q.id === updated.id ? { ...q, ...updated } : q)))}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This permanently removes the queue and all of its tokens. This cannot be undone."
        confirmLabel="Delete queue"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <QRCodeModal
        open={!!qrTarget}
        onClose={() => setQrTarget(null)}
        queueId={qrTarget?.id}
        queueName={qrTarget?.name}
      />
    </div>
  )
}
