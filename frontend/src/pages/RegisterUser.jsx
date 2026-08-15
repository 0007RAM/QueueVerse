import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUserPlus } from 'react-icons/fi'
import { userService } from '../services/userService.js'
import { useToast } from '../context/ToastContext.jsx'
import { useSession } from '../context/SessionContext.jsx'
import GlassInput from '../components/GlassInput.jsx'

export default function RegisterUser() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { setUserId } = useSession()
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const user = await userService.register(form)
      setUserId(String(user.id))
      showToast(`Welcome, ${user.name}! Your account is ready.`, 'success')
      navigate('/queues')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-500/10 text-accent-300">
          <FiUserPlus size={22} />
        </div>
        <h1 className="font-display text-2xl font-bold text-neutral-100">Register</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Create your SmartQueue profile once, then join any queue instantly.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card space-y-5 p-6"
      >
        <GlassInput id="name" name="name" label="Full name" required value={form.name} onChange={handleChange} />
        <GlassInput id="email" name="email" type="email" label="Email address" required value={form.email} onChange={handleChange} />
        <GlassInput id="phone" name="phone" label="Phone number" required value={form.phone} onChange={handleChange} />

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </motion.button>

        <p className="text-center text-xs text-neutral-600">
          Already registered? Head straight to <Link to="/queues" className="text-accent-300 hover:underline">the queue list</Link>.
        </p>
      </motion.form>
    </div>
  )
}
