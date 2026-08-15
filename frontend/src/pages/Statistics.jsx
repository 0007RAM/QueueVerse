import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiBarChart2 } from 'react-icons/fi'
import CountUp from 'react-countup'
import { adminService } from '../services/adminService.js'
import { useToast } from '../context/ToastContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'

/**
 * Analytics is an admin-only page and, like the dashboard, is fetched on
 * demand rather than continuously polled - refresh manually to pull the
 * latest numbers.
 */
export default function Statistics() {
  const { showToast } = useToast()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminService.statistics()
      setStats(data)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-neutral-100">Statistics</h1>
          <button onClick={load} className="btn-ghost border border-white/10">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <Loader label="Crunching the numbers..." />
        ) : !stats || stats.length === 0 ? (
          <EmptyState icon={FiBarChart2} title="No data yet" message="Statistics will appear once queues start processing tokens." />
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3">Queue</th>
                  <th className="px-5 py-3">Issued</th>
                  <th className="px-5 py-3">Completed</th>
                  <th className="px-5 py-3">Expired</th>
                  <th className="px-5 py-3">Skipped</th>
                  <th className="px-5 py-3">Waiting</th>
                  <th className="px-5 py-3">Completion</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s, i) => (
                  <motion.tr
                    key={s.queueId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.03] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-semibold text-neutral-200">{s.queueName}</td>
                    <td className="px-5 py-3 font-mono-num">{s.totalTokensIssued}</td>
                    <td className="px-5 py-3 font-mono-num text-emerald-400">{s.totalCompleted}</td>
                    <td className="px-5 py-3 font-mono-num text-neutral-500">{s.totalExpired}</td>
                    <td className="px-5 py-3 font-mono-num text-rose-400">{s.totalSkipped}</td>
                    <td className="px-5 py-3 font-mono-num text-accent-300">{s.totalWaiting}</td>
                    <td className="px-5 py-3 font-mono-num font-semibold text-glow-gradient">
                      <CountUp end={s.completionRate} decimals={1} duration={1.2} preserveValue />%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  )
}
