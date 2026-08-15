import React from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiClock, FiPauseCircle, FiPlayCircle, FiArrowUpRight } from 'react-icons/fi'
import SpotlightCard from './SpotlightCard.jsx'

const TYPE_LABELS = {
  TEMPLE: 'Temple',
  BANK: 'Bank',
  HOSPITAL: 'Hospital',
  RESTAURANT: 'Restaurant',
  GOVERNMENT_OFFICE: 'Government Office',
}

export default function QueueCard({ queue }) {
  const typeLabel = TYPE_LABELS[queue.queueType] || queue.queueType

  return (
    <SpotlightCard className="group overflow-hidden p-0 transition-colors duration-300 hover:border-accent-400/40 hover:shadow-glow">
      <Link to={`/queues/${queue.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-300/80">{typeLabel}</span>
            <h3 className="mt-1 font-display text-lg font-bold text-neutral-100 transition-colors group-hover:text-accent-200">
              {queue.name}
            </h3>
          </div>
          {queue.isPaused ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
              <FiPauseCircle /> Paused
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              <FiPlayCircle /> Active
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <FiUsers size={13} /> {queue.waitingCount} waiting
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock size={13} /> ~{queue.averageServiceTime} min
            </span>
          </div>
          <FiArrowUpRight className="text-neutral-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-300" />
        </div>
      </Link>
    </SpotlightCard>
  )
}
