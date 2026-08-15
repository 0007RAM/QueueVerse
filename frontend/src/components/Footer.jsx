import React from 'react'
import { FiActivity } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-10 text-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-glow-gradient text-midnight-950">
          <FiActivity size={15} />
        </span>
        <p className="text-sm text-neutral-500">
          SmartQueue &copy; {new Date().getFullYear()} &middot; No physical queues, ever again.
        </p>
      </div>
    </footer>
  )
}
