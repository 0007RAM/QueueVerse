import React from 'react'
import CountUp from 'react-countup'
import ProgressRing from './ProgressRing.jsx'

export default function PositionIndicator({ position, estimatedWaitMinutes }) {
  const isYourTurn = position === 0 || position === 1
  const peopleAhead = Math.max(position - 1, 0)
  // Visual progress ring: fills as the queue gets closer to this position (capped for display).
  const progress = isYourTurn ? 1 : Math.max(0, 1 - Math.min(peopleAhead, 10) / 10)

  return (
    <div className="card-glow flex flex-col items-center gap-4 p-8 text-center">
      <p className="label !mb-0 text-accent-300/80">Your position in line</p>

      <ProgressRing progress={progress} size={144} stroke={8} gradientId="posGradient">
        <div className="font-mono-num text-4xl font-extrabold text-glow-gradient">
          {isYourTurn ? '—' : <CountUp end={position} duration={0.8} preserveValue prefix="#" />}
        </div>
      </ProgressRing>

      {isYourTurn ? (
        <p className="text-sm font-semibold text-emerald-400">You're up next - stay ready!</p>
      ) : (
        <p className="text-sm text-neutral-400">
          <CountUp end={peopleAhead} duration={0.8} preserveValue /> {peopleAhead === 1 ? 'person' : 'people'} ahead of you
        </p>
      )}
      {typeof estimatedWaitMinutes === 'number' && !isYourTurn && (
        <p className="text-xs text-neutral-600">
          Estimated wait: ~<CountUp end={estimatedWaitMinutes} duration={0.8} preserveValue /> min
        </p>
      )}
    </div>
  )
}
