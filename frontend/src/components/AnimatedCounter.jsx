import React from 'react'
import CountUp from 'react-countup'

/**
 * Consistent animated-number primitive used anywhere a metric counts up
 * into view (stats, dashboard cards, completion rates).
 */
export default function AnimatedCounter({ end, duration = 1.4, decimals = 0, prefix = '', suffix = '', separator = '', className = '' }) {
  return (
    <span className={`font-mono-num ${className}`}>
      <CountUp end={Number(end) || 0} duration={duration} decimals={decimals} prefix={prefix} suffix={suffix} separator={separator} preserveValue />
    </span>
  )
}
