import React from 'react'
import { FiUsers, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi'
import StatCard from './StatCard.jsx'

export default function StatisticsCards({ stats }) {
  const items = [
    { label: 'Total Issued', value: stats.totalTokensIssued, icon: FiUsers, suffix: '' },
    { label: 'Completed', value: stats.totalCompleted, icon: FiCheckCircle, suffix: '' },
    { label: 'Waiting Now', value: stats.totalWaiting, icon: FiClock, suffix: '' },
    { label: 'Completion Rate', value: stats.completionRate, icon: FiTrendingUp, suffix: '%', decimals: 1 },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item, i) => (
        <StatCard key={item.label} {...item} delay={i * 0.08} />
      ))}
    </div>
  )
}
