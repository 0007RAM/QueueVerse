import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiRadio } from 'react-icons/fi'
import { adminService } from '../services/adminService.js'
import { usePolling } from '../hooks/usePolling.js'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import TokenNode from '../components/TokenNode.jsx'
import GlowBadge from '../components/GlowBadge.jsx'

// User-facing live board - kept on 5s polling per product requirement.
export default function TrackQueue() {
  const { id } = useParams()
  const { data: dashboard, loading, error } = usePolling(() => adminService.dashboard(id), [id], 5000)

  if (loading) return <Loader label="Loading live queue..." />
  if (error || !dashboard) return <div className="card p-10 text-center text-rose-400">Could not load this queue's live board.</div>

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/queues/${id}`} className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-accent-300">
        <FiArrowLeft /> Back to queue
      </Link>

      <div className="card-glow mb-8 p-6 text-center">
        <GlowBadge tone="success" live className="mx-auto mb-2 w-fit">Live</GlowBadge>
        <p className="text-sm text-neutral-500">{dashboard.queueName} - Now serving</p>
        <div className="my-2 font-mono-num text-5xl font-extrabold text-glow-gradient">
          {dashboard.activeTokens[0]?.tokenNumber ?? '—'}
        </div>
        <p className="text-xs text-neutral-600">{dashboard.totalWaiting} people currently waiting</p>
      </div>

      {/* Live network visualization: every member is a glowing node in a
          single continuous flow. The `layout` prop on each TokenNode (and
          this shared list) is what makes tokens glide to their new slot
          instead of jumping when the queue advances. */}
      <div className="card mb-8 p-6">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-500">Live queue network</h2>
        <motion.div layout className="flex flex-wrap gap-5">
          <AnimatePresence>
            {dashboard.activeTokens.map((t) => (
              <TokenNode key={t.id} label={t.tokenNumber.split('-')[1] ?? t.tokenNumber} status={t.status} pulse size={52} sublabel={t.userName} />
            ))}
            {dashboard.waitingTokens.map((t) => (
              <TokenNode key={t.id} label={t.tokenNumber.split('-')[1] ?? t.tokenNumber} status="WAITING" sublabel={t.userName} />
            ))}
          </AnimatePresence>
          {dashboard.activeTokens.length === 0 && dashboard.waitingTokens.length === 0 && (
            <p className="text-sm text-neutral-500">The network is quiet - no one is in the queue right now.</p>
          )}
        </motion.div>
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Currently active</h2>
      <div className="mb-8 space-y-3">
        <AnimatePresence>
          {dashboard.activeTokens.length === 0 ? (
            <EmptyState title="No one is being served" message="The next token will appear here once called." />
          ) : (
            dashboard.activeTokens.map((t) => (
              <motion.div layout key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="card-glow flex items-center gap-3 p-3">
                <TokenNode label={t.tokenNumber.split('-')[1] ?? t.tokenNumber} status={t.status} pulse />
                <div className="flex-1">
                  <p className="font-mono-num text-sm font-bold text-neutral-100">{t.tokenNumber}</p>
                  <p className="text-xs text-neutral-500">{t.userName}</p>
                </div>
                <GlowBadge tone="accent">{t.status}</GlowBadge>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Waiting list</h2>
      <div className="space-y-3">
        <AnimatePresence>
          {dashboard.waitingTokens.length === 0 ? (
            <EmptyState title="The queue is empty" message="Anyone who joins will appear here in order." />
          ) : (
            dashboard.waitingTokens.map((t, i) => (
              <motion.div
                layout
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="card flex items-center gap-3 p-3"
              >
                <TokenNode label={t.tokenNumber.split('-')[1] ?? t.tokenNumber} status="WAITING" />
                <div className="flex-1">
                  <p className="font-mono-num text-sm font-bold text-neutral-100">{t.tokenNumber}</p>
                  <p className="text-xs text-neutral-500">{t.userName}</p>
                </div>
                <span className="font-mono-num text-xs text-neutral-600">#{i + 1}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
