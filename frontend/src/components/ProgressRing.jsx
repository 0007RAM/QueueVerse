import React from 'react'
import { motion } from 'framer-motion'

/**
 * Generic circular progress ring with a cyan gradient stroke. `progress`
 * is a 0-1 value. Used for position tracking, completion rates, and any
 * other "ring" metric across the app.
 */
export default function ProgressRing({ progress = 0, size = 120, stroke = 8, gradientId = 'progressRingGradient', children }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
        <circle cx={center} cy={center} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={center} cy={center} r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - Math.max(0, Math.min(1, progress))) }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}
