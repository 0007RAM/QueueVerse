import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiSmartphone, FiHash, FiBell, FiGrid, FiCompass } from 'react-icons/fi'
import MotionContainer from '../components/MotionContainer.jsx'
import MagneticButton from '../components/MagneticButton.jsx'
import StatCard from '../components/StatCard.jsx'
import GlassCard from '../components/GlassCard.jsx'
import GlowBadge from '../components/GlowBadge.jsx'

const STEPS = [
  {
    icon: FiSmartphone,
    title: 'Scan the QR code',
    text: 'Find the SmartQueue QR code at the counter and scan it with your phone camera - no app install required.',
  },
  {
    icon: FiHash,
    title: 'Join and get a token',
    text: 'Enter your details once and receive a unique token number instantly, following strict first-come-first-served order.',
  },
  {
    icon: FiBell,
    title: 'Track and get notified',
    text: 'Watch your live position update automatically, and get notified the moment you are called.',
  },
]

const STATS = [
  { end: 10000, suffix: '+', label: 'Daily Visitors', icon: FiSmartphone },
  { end: 2, suffix: 'M+', label: 'Tokens Processed', icon: FiHash },
  { end: 98, suffix: '%', label: 'Customer Satisfaction', icon: FiBell },
  { end: 500, suffix: '+', label: 'Organizations', icon: FiGrid },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="space-y-24">
      <section className="grid items-center gap-12 py-6 md:grid-cols-2 md:py-14">
        <div>
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlowBadge tone="accent">Real-Time Queue Intelligence, powered by AI</GlowBadge>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-neutral-50 sm:text-6xl"
          >
            SMART<span className="text-glow-gradient">QUEUE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-md text-lg text-neutral-400"
          >
            Next-generation intelligent queue management. Skip the line, not your turn.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton onClick={() => navigate('/queues')} className="btn-primary">
              Join Queue <FiArrowRight />
            </MagneticButton>
            <Link to="/admin" className="btn-secondary">
              <FiGrid /> Admin Portal
            </Link>
            <Link to="/qr" className="btn-ghost border border-white/10">
              Generate QR
            </Link>
            <a href="#how-it-works" className="btn-ghost border border-white/10">
              <FiCompass /> Explore Features
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlassCard tilt glow className="relative flex flex-col items-center justify-center gap-4 overflow-hidden p-12 text-center">
            <motion.div
              className="absolute inset-0 bg-glow-gradient-soft"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <p className="relative text-xs font-semibold uppercase tracking-widest text-accent-300/80">Live token</p>
            <div className="relative font-mono-num text-6xl font-extrabold text-glow-gradient">TMP-014</div>
            <p className="relative text-sm text-neutral-500">Updated in real time - no page refresh</p>
            <div className="relative flex gap-2">
              <GlowBadge tone="accent">WAITING</GlowBadge>
              <GlowBadge tone="muted">Position #4</GlowBadge>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} icon={s.icon} value={s.end} suffix={s.suffix} label={s.label} delay={i * 0.08} />
        ))}
      </section>

      <section id="how-it-works">
        <MotionContainer as={motion.h2} className="text-center font-display text-2xl font-bold text-neutral-100">
          How it works
        </MotionContainer>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <MotionContainer key={title} delay={i * 0.12}>
              <GlassCard tilt className="h-full p-6 transition-shadow hover:shadow-glow">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-500/10 text-accent-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-bold text-neutral-100">
                  {i + 1}. {title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500">{text}</p>
              </GlassCard>
            </MotionContainer>
          ))}
        </div>
      </section>
    </div>
  )
}
