import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHash } from 'react-icons/fi'
import { tokenService } from '../services/tokenService.js'
import { useSession } from '../context/SessionContext.jsx'
import { usePolling } from '../hooks/usePolling.js'
import { useToast } from '../context/ToastContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import PositionIndicator from '../components/PositionIndicator.jsx'
import Loader from '../components/Loader.jsx'
import GlassCard from '../components/GlassCard.jsx'
import ProgressRing from '../components/ProgressRing.jsx'

/** Live mm:ss countdown toward a token's `expiresAt` timestamp, purely derived from data already returned by the API. */
function useCountdown(expiresAt) {
  const [remainingMs, setRemainingMs] = useState(0)

  useEffect(() => {
    if (!expiresAt) return undefined
    const tick = () => setRemainingMs(Math.max(0, new Date(expiresAt).getTime() - Date.now()))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return remainingMs
}

// User-facing live page - stays on 5s polling per product requirement.
export default function MyToken() {
  const { tokenId, setTokenId } = useSession()
  const { showToast } = useToast()
  const [inputTokenId, setInputTokenId] = useState(tokenId || '')
  const [acting, setActing] = useState(false)

  const { data: token, loading, error, refresh } = usePolling(
    () => (tokenId ? tokenService.getById(tokenId) : Promise.resolve(null)),
    [tokenId],
    5000,
  )

  const remainingMs = useCountdown(token?.status === 'CALLED' ? token.expiresAt : null)
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  const countdownProgress = Math.max(0, Math.min(1, remainingMs / (2 * 60 * 1000)))

  const handleLookup = (e) => {
    e.preventDefault()
    if (inputTokenId) setTokenId(inputTokenId)
  }

  const handleConfirm = async () => {
    setActing(true)
    try {
      await tokenService.confirm(tokenId)
      showToast('Presence confirmed - thank you!', 'success')
      refresh()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActing(false)
    }
  }

  const handleCancel = async () => {
    setActing(true)
    try {
      await tokenService.cancel(tokenId)
      showToast('Your token has been cancelled.', 'info')
      refresh()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setActing(false)
    }
  }

  if (!tokenId) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="mb-4 font-display text-xl font-bold text-neutral-100">Find your token</h1>
        <form onSubmit={handleLookup} className="card space-y-4 p-6">
          <div>
            <label className="label">Token ID</label>
            <input
              type="number"
              min="1"
              className="input"
              placeholder="e.g. 4"
              value={inputTokenId}
              onChange={(e) => setInputTokenId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full">Look up token</button>
        </form>
      </div>
    )
  }

  if (loading) return <Loader label="Loading your token..." />
  if (error || !token) return <div className="card p-10 text-center text-rose-400">Could not find that token.</div>

  const canConfirm = token.status === 'CALLED'
  const canCancel = token.status === 'WAITING' || token.status === 'CALLED'

  return (
    <div className="mx-auto max-w-md space-y-5">
      <GlassCard tilt className="p-6 text-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/20 bg-accent-500/10 text-accent-400">
          <FiHash size={20} />
        </div>
        <p className="font-mono-num text-3xl font-extrabold text-neutral-100">{token.tokenNumber}</p>
        <p className="mt-1 text-sm text-neutral-500">{token.queueName}</p>
        <div className="mt-3 flex justify-center">
          <StatusBadge status={token.status} />
        </div>
      </GlassCard>

      {token.status === 'WAITING' && (
        <PositionIndicator position={token.position} estimatedWaitMinutes={token.estimatedWaitMinutes} />
      )}

      {token.status === 'CALLED' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-glow flex flex-col items-center gap-3 p-6 text-center"
        >
          <p className="font-display font-semibold text-accent-300">It's your turn!</p>
          <ProgressRing progress={countdownProgress} size={104} stroke={7} gradientId="confirmCountdownGradient">
            <span className="font-mono-num text-xl font-bold text-neutral-100">
              {String(Math.floor(remainingSeconds / 60)).padStart(1, '0')}:{String(remainingSeconds % 60).padStart(2, '0')}
            </span>
          </ProgressRing>
          <p className="text-sm text-neutral-500">
            Please confirm your presence before the timer runs out, or your token will expire automatically.
          </p>
        </motion.div>
      )}

      {token.status === 'COMPLETED' && (
        <div className="card p-6 text-center text-emerald-400">
          Service completed. Thank you for using SmartQueue!
        </div>
      )}

      {(canConfirm || canCancel) && (
        <div className="flex gap-3">
          {canConfirm && (
            <button onClick={handleConfirm} disabled={acting} className="btn-primary flex-1">
              Confirm presence
            </button>
          )}
          {canCancel && (
            <button onClick={handleCancel} disabled={acting} className="btn-danger flex-1">
              Cancel token
            </button>
          )}
        </div>
      )}

      <button onClick={() => setTokenId('')} className="btn-ghost w-full border border-white/10">
        Look up a different token
      </button>
    </div>
  )
}
