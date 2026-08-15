import React from 'react'
import GlassCard from './GlassCard.jsx'
import AnimatedCounter from './AnimatedCounter.jsx'

/**
 * Generic analytics metric card: icon, animated number, label. Used across
 * Home stats, Statistics page, and the Admin dashboard.
 */
export default function StatCard({ icon: Icon, value, label, suffix = '', decimals = 0, delay = 0 }) {
  return (
    <GlassCard
      tilt
      className="p-5"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      {Icon && (
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-500/10 text-accent-300">
          <Icon size={18} />
        </div>
      )}
      <p className="font-mono-num text-2xl font-extrabold text-neutral-100">
        <AnimatedCounter end={value} decimals={decimals} suffix={suffix} />
      </p>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
    </GlassCard>
  )
}
