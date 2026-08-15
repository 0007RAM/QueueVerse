import React from 'react'
import GlowBadge from './GlowBadge.jsx'

const STATUS_TONE = {
  WAITING: 'neutral',
  CALLED: 'accent',
  CONFIRMED: 'info',
  COMPLETED: 'success',
  EXPIRED: 'muted',
  SKIPPED: 'danger',
}

export default function StatusBadge({ status }) {
  return (
    <GlowBadge tone={STATUS_TONE[status] || 'neutral'} live={status === 'CALLED'}>
      {status}
    </GlowBadge>
  )
}
