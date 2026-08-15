import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiUsers, FiClock, FiArrowLeft } from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import { usePolling } from '../hooks/usePolling.js'
import Loader from '../components/Loader.jsx'
import StatisticsCards from '../components/StatisticsCards.jsx'
import GlassCard from '../components/GlassCard.jsx'
import GlowBadge from '../components/GlowBadge.jsx'

// User-facing "Queue Status" view - kept on live polling per product requirement.
export default function QueueDetails() {
  const { id } = useParams()
  const { data: queue, loading, error } = usePolling(() => queueService.getById(id), [id], 5000)
  const { data: stats } = usePolling(() => queueService.statistics(id), [id], 5000)

  if (loading) return <Loader label="Loading queue details..." />
  if (error || !queue) return <div className="card p-10 text-center text-rose-400">Could not load this queue.</div>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/queues" className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-accent-300">
        <FiArrowLeft /> Back to queues
      </Link>

      <GlassCard tilt glow className="mb-6 p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-500/80">
              {queue.queueType.replace('_', ' ')}
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold text-neutral-100">{queue.name}</h1>
          </div>
          <GlowBadge tone="success" live>Live</GlowBadge>
        </div>

        {queue.isPaused && (
          <p className="mt-3 text-sm text-neutral-500">This queue is currently paused by an administrator.</p>
        )}

        <div className="mt-4 flex gap-6 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5"><FiUsers /> {queue.waitingCount} people waiting</span>
          <span className="flex items-center gap-1.5"><FiClock /> ~{queue.averageServiceTime} min per person</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/queues/${queue.id}/join`}
            className={`btn-primary ${queue.isPaused ? 'pointer-events-none opacity-40' : ''}`}
          >
            {queue.isPaused ? 'Queue is paused' : 'Join this queue'}
          </Link>
          <Link to={`/queues/${queue.id}/track`} className="btn-secondary">
            View live queue board
          </Link>
        </div>
      </GlassCard>

      {stats && <StatisticsCards stats={stats} />}
    </div>
  )
}
