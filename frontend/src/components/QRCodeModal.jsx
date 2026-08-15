import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import { FiX, FiDownload, FiPrinter, FiCopy, FiShare2, FiCheckCircle } from 'react-icons/fi'
import { useToast } from '../context/ToastContext.jsx'

/**
 * Premium QR modal shown right after a queue is created, or on-demand from
 * the Queue Management page. Generates a QR that encodes the public join
 * link for a queue: `${origin}/join/{queueId}`.
 */
export default function QRCodeModal({ open, onClose, queueId, queueName }) {
  const { showToast } = useToast()
  const canvasWrapRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const joinUrl = queueId ? `${window.location.origin}/join/${queueId}` : ''

  const getCanvas = () => canvasWrapRef.current?.querySelector('canvas')

  const handleDownload = () => {
    const canvas = getCanvas()
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `smartqueue-${queueId}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('QR code saved as PNG', 'success')
  }

  const handlePrint = () => {
    const canvas = getCanvas()
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const win = window.open('', '_blank', 'width=420,height=560')
    if (!win) return
    win.document.write(`
      <html>
        <head><title>${queueName || 'SmartQueue'} - QR Code</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          <h2>${queueName || 'Join Queue'}</h2>
          <img src="${dataUrl}" style="width:280px;height:280px;" />
          <p style="color:#555;font-size:12px;">${joinUrl}</p>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    win.print()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
      showToast('Join link copied to clipboard', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy link', 'error')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: queueName || 'Join queue', text: 'Join the queue on SmartQueue', url: joinUrl })
      } catch {
        // user cancelled share sheet - no-op
      }
    } else {
      handleCopy()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm"
          >
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-midnight-800 text-neutral-400 hover:text-accent-300"
              aria-label="Close QR modal"
            >
              <FiX size={16} />
            </button>

            <div className="card-glow p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-500/80">Queue created</p>
              <h2 className="mt-1 font-display text-xl font-bold text-neutral-100">{queueName}</h2>
              <p className="mt-1 text-sm text-neutral-500">Scan to join instantly</p>

              <div className="relative mx-auto mt-6 inline-block">
                <div className="glow-ring relative rounded-[1.75rem] border border-accent-500/30 bg-midnight-900/80 p-6 shadow-glow-lg">
                  <motion.div
                    className="pointer-events-none absolute inset-x-6 h-0.5 bg-glow-gradient shadow-[0_0_12px_rgba(255,215,0,0.8)]"
                    animate={{ top: ['8%', '92%', '8%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  />
                  <div ref={canvasWrapRef} className="rounded-xl bg-white p-3">
                    <QRCodeCanvas value={joinUrl || 'https://smartqueue.app'} size={180} fgColor="#0B0B0B" bgColor="#ffffff" />
                  </div>
                </div>
              </div>

              <p className="mx-auto mt-4 max-w-[240px] break-all font-mono-num text-[11px] text-neutral-600">{joinUrl}</p>

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button onClick={handleDownload} className="btn-secondary !py-2 text-xs">
                  <FiDownload size={14} /> Download PNG
                </button>
                <button onClick={handlePrint} className="btn-secondary !py-2 text-xs">
                  <FiPrinter size={14} /> Print
                </button>
                <button onClick={handleCopy} className="btn-secondary !py-2 text-xs">
                  {copied ? <FiCheckCircle size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy link'}
                </button>
                <button onClick={handleShare} className="btn-secondary !py-2 text-xs">
                  <FiShare2 size={14} /> Share
                </button>
              </div>

              <button onClick={onClose} className="btn-ghost mt-4 w-full">
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
