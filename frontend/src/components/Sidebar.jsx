import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGrid, FiBarChart2, FiList, FiPlusCircle } from 'react-icons/fi'

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/queues', label: 'Manage Queues', icon: FiList },
  { to: '/admin/queues/new', label: 'Create Queue', icon: FiPlusCircle },
  { to: '/admin/statistics', label: 'Statistics', icon: FiBarChart2 },
]

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav className="glass-panel flex gap-1 p-2 md:flex-col">
        {ADMIN_LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors md:flex-none ${
                isActive ? 'text-midnight-950' : 'text-neutral-400 hover:text-neutral-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-glow-gradient shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon size={16} /> {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
