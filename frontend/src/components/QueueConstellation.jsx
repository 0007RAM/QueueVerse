import React, { useEffect, useRef } from 'react'

/**
 * Signature ambient background - a layered "command center" atmosphere:
 *   1. Animated aurora gradient blobs (slow, continuous drift)
 *   2. A faint digital grid for depth
 *   3. A canvas neural network of drifting cyan nodes - a visual metaphor
 *      for the live network of queues/tokens flowing through the platform
 *   4. An interactive radial glow that follows the cursor for a sense of
 *      presence and depth (desktop only; ignored on touch devices)
 *
 * Purely decorative and respects prefers-reduced-motion.
 */
export default function QueueConstellation({ density = 46 }) {
  const canvasRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let width = 0
    let height = 0
    let nodes = []

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    const init = () => {
      resize()
      nodes = Array.from({ length: density }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.6 + 0.6,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const step = () => {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.012
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      // connective lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.14 * (1 - dist / 150)})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // glowing nodes
      for (const n of nodes) {
        const glow = 0.5 + Math.sin(n.pulse) * 0.5
        ctx.beginPath()
        ctx.fillStyle = `rgba(0, 229, 255, ${0.35 + glow * 0.4})`
        ctx.shadowColor = 'rgba(56, 189, 248, 0.9)'
        ctx.shadowBlur = 6 + glow * 6
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(step)
      }
    }

    init()
    step()

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [density])

  useEffect(() => {
    const isTouch = window.matchMedia?.('(pointer: coarse)').matches
    if (isTouch) return

    let raf
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.setProperty('--mx', `${e.clientX}px`)
          glowRef.current.style.setProperty('--my', `${e.clientY}px`)
        }
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-midnight-950">
      {/* Aurora gradient blobs - slow continuous drift */}
      <div className="absolute -left-1/4 top-[-10%] h-[60vh] w-[60vh] animate-aurora rounded-full bg-aurora-1 blur-3xl" />
      <div className="absolute right-[-15%] top-[20%] h-[50vh] w-[50vh] animate-aurora rounded-full bg-aurora-2 blur-3xl [animation-delay:6s]" />
      <div className="absolute bottom-[-15%] left-[20%] h-[55vh] w-[55vh] animate-aurora rounded-full bg-aurora-3 blur-3xl [animation-delay:12s]" />

      {/* Faint digital grid for depth */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="absolute inset-0 bg-radial-glow" />

      {/* Neural network of live nodes */}
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />

      {/* Interactive cursor glow (desktop only) */}
      <div
        ref={glowRef}
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(0,229,255,0.06), transparent 70%)',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-midnight-950" />
    </div>
  )
}
