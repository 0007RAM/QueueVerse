import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import QueueCard from '../components/QueueCard.jsx'
import Loader from '../components/Loader.jsx'
import { useToast } from '../context/ToastContext.jsx'

const TYPE_FILTERS = ['ALL', 'TEMPLE', 'BANK', 'HOSPITAL', 'RESTAURANT', 'GOVERNMENT_OFFICE']

export default function QueueList() {
  const { showToast } = useToast()
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    queueService
      .list()
      .then(setQueues)
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = queues.filter((q) => {
    const matchesType = filter === 'ALL' || q.queueType === filter
    const matchesSearch = q.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-100">Available Queues</h1>
        <div className="relative w-full sm:w-64">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input
            className="input pl-9"
            placeholder="Search queues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === t
                ? 'bg-glow-gradient text-midnight-950'
                : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-neutral-100'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading queues..." />
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-neutral-500">No queues match your filters.</div>
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((q) => (
              <QueueCard key={q.id} queue={q} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
