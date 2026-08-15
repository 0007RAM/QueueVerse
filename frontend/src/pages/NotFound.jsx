import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-7xl font-extrabold text-glow-gradient"
      >
        404
      </motion.p>
      <h1 className="mt-4 font-display text-xl font-bold text-neutral-100">This queue doesn't exist</h1>
      <p className="mt-2 text-sm text-neutral-500">
        The page you're looking for may have moved, or the link is out of date.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <FiArrowLeft /> Back to home
      </Link>
    </div>
  )
}
