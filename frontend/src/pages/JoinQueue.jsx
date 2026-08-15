import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiCheckCircle, FiHash } from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import { tokenService } from '../services/tokenService.js'
import { useToast } from '../context/ToastContext.jsx'
import { useSession } from '../context/SessionContext.jsx'
import Loader from '../components/Loader.jsx'

export default function JoinQueue() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { userId, setUserId, setTokenId } = useSession()

  const [queue, setQueue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inputUserId, setInputUserId] = useState(userId || '')
  const [joining, setJoining] = useState(false)
  const [joinedToken, setJoinedToken] = useState(null)

  useEffect(() => {
    queueService
      .getById(id)
      .then(setQueue)
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!inputUserId) {
      showToast('Please enter your user ID, or register first.', 'error')
      return
    }
    setJoining(true)
    try {
      const token = await tokenService.join(id, Number(inputUserId))
      setUserId(inputUserId)
      setTokenId(String(token.id))
      setJoinedToken(token)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setJoining(false)
    }
  }

  if (loading) return <Loader label="Loading queue..." />

  return (
    <div className="mx-auto max-w-md">
      <AnimatePresence mode="wait">
        {joinedToken ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="card-glow flex flex-col items-center gap-4 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-glow-gradient text-midnight-950 shadow-glow-lg"
            >
              <FiCheckCircle size={32} />
            </motion.div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-500/80">You're in the queue</p>
              <div className="mt-2 flex items-center justify-center gap-2 font-mono-num text-4xl font-extrabold text-glow-gradient">
                <FiHash size={24} className="text-accent-500" /> {joinedToken.tokenNumber}
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <p className="font-mono-num text-xl font-bold text-neutral-100">{Math.max(joinedToken.position - 1, 0)}</p>
                <p className="text-[11px] uppercase tracking-wide text-neutral-500">people ahead</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <p className="font-mono-num text-xl font-bold text-neutral-100">~{joinedToken.estimatedWaitMinutes}</p>
                <p className="text-[11px] uppercase tracking-wide text-neutral-500">min estimated</p>
              </div>
            </div>

            <button onClick={() => navigate('/my-token')} className="btn-primary w-full">
              Track my token
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Link to={`/queues/${id}`} className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-accent-300">
              <FiArrowLeft /> Back
            </Link>

            <div className="card p-6">
              <h1 className="font-display text-xl font-bold text-neutral-100">Join {queue?.name}</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Enter your registered user ID to receive your token. Don't have one yet?{' '}
                <Link to="/register" className="font-semibold text-accent-400 hover:underline">Register here</Link>.
              </p>

              <form onSubmit={handleJoin} className="mt-6 space-y-4">
                <div>
                  <label className="label">Your user ID</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="input"
                    placeholder="e.g. 1"
                    value={inputUserId}
                    onChange={(e) => setInputUserId(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={joining} className="btn-primary w-full">
                  {joining ? 'Joining...' : 'Join queue and get token'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
