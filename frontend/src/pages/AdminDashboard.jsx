import React, { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import {
  FiPlay, FiSkipForward, FiPauseCircle, FiPlayCircle, FiRefreshCw,
  FiUsers, FiActivity, FiCheckCircle, FiClock, FiPlusCircle, FiGrid,
} from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import { adminService } from '../services/adminService.js'
import { useToast } from '../context/ToastContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import TokenCard from '../components/TokenCard.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import StatCard from '../components/StatCard.jsx'
import QueueTimeline from '../components/QueueTimeline.jsx'

/**
 * Admin Dashboard is intentionally NOT continuously polled - per the product
 * requirement, live/real-time updates are reserved for user-facing pages
 * (Track Queue, My Token). The dashboard here fetches once on load/queue
 * switch, and re-fetches only after an explicit admin action (call next,
 * skip, pause/resume) or a manual "Refresh" click.
 */
export default function AdminDashboard() {
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()

  const [queues, setQueues] = useState([])
  const [selectedQueueId, setSelectedQueueId] = useState(searchParams.get('queue') || '')
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    queueService.list().then((list) => {
      setQueues(list)
      const fromUrl = searchParams.get('queue')
      if (fromUrl && list.some((q) => String(q.id) === fromUrl)) {
        setSelectedQueueId(fromUrl)
      } else if (list.length > 0 && !selectedQueueId) {
        setSelectedQueueId(String(list[0].id))
      }
    }).catch((err) => showToast(err.message, 'error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDashboard = useCallback(async () => {
    if (!selectedQueueId) return
    setLoading(true)
    try {
      const data = await adminService.dashboard(selectedQueueId)
      setDashboard(data)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQueueId])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const pausedQueueCount = queues.filter((q) => q.isPaused).length
  const selectedQueueMeta = queues.find((q) => String(q.id) === selectedQueueId)

  const handleCallNext = async () => {
    setActing(true)
    try {
      const token = await adminService.callNext(selectedQueueId)
      showToast(`Called token ${token.tokenNumber}`, 'success')
      await loadDashboard()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActing(false)
    }
  }

  const handleSkip = async (tokenId) => {
    setActing(true)
    try {
      await adminService.skipToken(tokenId)
      showToast('Token skipped', 'info')
      await loadDashboard()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActing(false)
    }
  }

  const handleTogglePause = async () => {
    setActing(true)
    try {
      if (dashboard.isPaused) {
        await queueService.resume(selectedQueueId)
        showToast('Queue resumed', 'success')
      } else {
        await queueService.pause(selectedQueueId)
        showToast('Queue paused', 'info')
      }
      await loadDashboard()
      const list = await queueService.list()
      setQueues(list)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActing(false)
    }
  }

  const metrics = dashboard ? [
    { label: 'Waiting', value: dashboard.totalWaiting, icon: FiUsers },
    { label: 'Active', value: dashboard.activeTokens.length, icon: FiActivity },
    { label: 'Completed Today', value: dashboard.totalCompletedToday, icon: FiCheckCircle },
    { label: 'Avg Service (min)', value: selectedQueueMeta?.averageServiceTime ?? 0, icon: FiClock },
    { label: 'Paused Queues', value: pausedQueueCount, icon: FiPauseCircle },
  ] : []

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-bold text-neutral-100">Command Center</h1>
          <div className="flex flex-wrap gap-2">
            <select
              className="input sm:w-56"
              value={selectedQueueId}
              onChange={(e) => setSelectedQueueId(e.target.value)}
            >
              {queues.map((q) => (
                <option key={q.id} value={q.id}>{q.name}</option>
              ))}
            </select>
            <button onClick={loadDashboard} className="btn-ghost border border-white/10" aria-label="Refresh dashboard">
              <FiRefreshCw size={14} />
            </button>
            <Link to="/admin/queues/new" className="btn-secondary">
              <FiPlusCircle size={14} /> New
            </Link>
            <Link to="/admin/queues" className="btn-secondary">
              <FiGrid size={14} /> Manage
            </Link>
          </div>
        </div>

        {loading || !dashboard ? (
          <Loader label="Loading command center..." />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {metrics.map((m, i) => (
                <StatCard key={m.label} icon={m.icon} value={m.value} label={m.label} delay={i * 0.06} />
              ))}
            </div>

            <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-display font-bold text-neutral-100">{dashboard.queueName}</p>
                <p className="text-xs text-neutral-500">
                  Now serving: <span className="font-mono-num text-accent-300">{dashboard.activeTokens[0]?.tokenNumber ?? '—'}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleTogglePause} disabled={acting} className="btn-secondary">
                  {dashboard.isPaused ? <FiPlayCircle /> : <FiPauseCircle />}
                  {dashboard.isPaused ? 'Resume' : 'Pause'}
                </button>
                <button onClick={handleCallNext} disabled={acting || dashboard.isPaused} className="btn-primary">
                  <FiPlay /> Call next
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Active tokens</h2>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {dashboard.activeTokens.length === 0 ? (
                        <EmptyState icon={FiActivity} title="No active tokens" message="Call the next token to begin serving." />
                  ) : (
                    dashboard.activeTokens.map((t) => (
                      <TokenCard key={t.id} token={t} actions={
                        <button onClick={() => handleSkip(t.id)} disabled={acting} className="btn-ghost !px-2 !py-1 text-xs">
                          <FiSkipForward /> Skip
                        </button>
                      } />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

                <div>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    Waiting tokens ({dashboard.waitingTokens.length})
                  </h2>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {dashboard.waitingTokens.length === 0 ? (
                        <EmptyState icon={FiUsers} title="No one waiting" message="The queue is currently empty." />
                      ) : (
                        dashboard.waitingTokens.map((t) => (
                          <TokenCard key={t.id} token={t} actions={
                            <button onClick={() => handleSkip(t.id)} disabled={acting} className="btn-ghost !px-2 !py-1 text-xs">
                              <FiSkipForward /> Skip
                            </button>
                          } />
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Activity timeline</h2>
                <QueueTimeline waitingTokens={dashboard.waitingTokens} activeTokens={dashboard.activeTokens} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
