import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiUserPlus, FiPhoneCall, FiCheckCircle } from 'react-icons/fi'

const EVENT_META = {
  joined: { icon: FiUserPlus, color: 'text-accent-300 border-accent-400/30 bg-accent-500/10', label: 'joined the queue' },
  called: { icon: FiPhoneCall, color: 'text-glow-300 border-glow-500/40 bg-glow-500/10', label: 'was called' },
  confirmed: { icon: FiCheckCircle, color: 'text-success border-success/40 bg-success/10', label: 'confirmed presence' },
}

/**
 * Synthesizes a chronological activity feed directly from the tokens
 * already present in a dashboard payload (joinedAt / calledAt timestamps) -
 * no dedicated activity-log endpoint required.
 */
export default function QueueTimeline({ waitingTokens = [], activeTokens = [] }) {
  const events = useMemo(() => {
    const all = [...waitingTokens, ...activeTokens]
    const list = []
    for (const t of all) {
      if (t.joinedAt) list.push({ id: `${t.id}-joined`, type: 'joined', token: t, at: t.joinedAt })
      if (t.calledAt) list.push({ id: `${t.id}-called`, type: 'called', token: t, at: t.calledAt })
      if (t.status === 'CONFIRMED') list.push({ id: `${t.id}-confirmed`, type: 'confirmed', token: t, at: t.calledAt })
    }
    return list
      .filter((e) => e.at)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 8)
  }, [waitingTokens, activeTokens])

  if (events.length === 0) {
    return <p className="text-sm text-neutral-500">No recent activity yet.</p>
  }

  return (
    <div className="space-y-4">
      {events.map((e, i) => {
        const meta = EVENT_META[e.type]
        const Icon = meta.icon
        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${meta.color}`}>
              <Icon size={13} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-300">
                <span className="font-mono-num font-semibold text-neutral-100">{e.token.tokenNumber}</span>{' '}
                {meta.label}
              </p>
              <p className="text-[11px] text-neutral-600">{new Date(e.at).toLocaleTimeString()}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
