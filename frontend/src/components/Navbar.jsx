import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiActivity, FiMenu, FiX } from 'react-icons/fi'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/queues', label: 'Queues' },
  { to: '/register', label: 'Register' },
  { to: '/my-token', label: 'My Token' },
  { to: '/qr', label: 'Generate QR' },
  { to: '/admin', label: 'Admin' },
]

function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="hidden font-mono-num text-xs text-neutral-500 lg:inline">
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-midnight-900/70 px-4 py-3 backdrop-blur-2xl">
        <NavLink to="/" className="flex items-center gap-2 font-display font-extrabold text-neutral-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-glow-gradient text-midnight-950 shadow-glow">
            <FiActivity size={16} />
          </span>
          SmartQueue
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-accent-300' : 'text-neutral-400 hover:text-neutral-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-glow-gradient shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LiveClock />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/5 hover:text-accent-300 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 overflow-hidden rounded-2xl border border-white/10 bg-midnight-900/90 p-2 backdrop-blur-2xl md:hidden"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-accent-500/10 text-accent-300' : 'text-neutral-400'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </motion.nav>
      )}
    </header>
  )
}
