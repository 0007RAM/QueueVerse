import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import { FiCheckCircle, FiDownload, FiPrinter, FiCopy, FiShare2 } from 'react-icons/fi'
import { queueService } from '../services/queueService.js'
import { useToast } from '../context/ToastContext.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function GenerateQR() {
  const { showToast } = useToast()
  const [queues, setQueues] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const canvasWrapRef = useRef(null)

  useEffect(() => {
    queueService
      .list()
      .then((list) => {
        setQueues(list)
        if (list.length > 0) setSelectedId(String(list[0].id))
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedQueue = queues.find((q) => String(q.id) === selectedId)
  const joinUrl = selectedQueue ? `${window.location.origin}/join/${selectedQueue.id}` : ''

  const getCanvas = () => canvasWrapRef.current?.querySelector('canvas')

  const handleDownload = () => {
    const canvas = getCanvas()
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `smartqueue-${selectedId}-qr.png`
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
    win.document.write(`<html><head><title>${selectedQueue?.name || 'SmartQueue'} QR</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
        <h2>${selectedQueue?.name || ''}</h2>
        <img src="${dataUrl}" style="width:280px;height:280px;" />
        <p style="color:#555;font-size:12px;">${joinUrl}</p>
      </body></html>`)
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
        await navigator.share({ title: selectedQueue?.name || 'Join queue', url: joinUrl })
      } catch {
        // cancelled
      }
    } else {
      handleCopy()
    }
  }

  if (loading) return <Loader label="Preparing scanner..." />

  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="font-display text-2xl font-bold text-neutral-100">Generate Queue QR</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Print or display this code at the counter. Anyone can scan it to join instantly.
      </p>

      {queues.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No queues available" message="Create a queue first from the admin portal." />
        </div>
      ) : (
        <>
          <select className="input mt-6" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {queues.map((q) => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>

          <motion.div
            key={selectedId}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative mt-8 inline-block"
          >
            <div className="glow-ring relative rounded-[2rem] border border-accent-500/30 bg-midnight-900/80 p-8 shadow-glow-lg">
              <motion.div
                className="pointer-events-none absolute inset-x-8 h-0.5 bg-glow-gradient shadow-[0_0_12px_rgba(255,215,0,0.8)]"
                animate={{ top: ['8%', '92%', '8%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
              <div ref={canvasWrapRef} className="rounded-2xl bg-white p-4">
                <QRCodeCanvas value={joinUrl || 'https://smartqueue.app'} size={200} fgColor="#0B0B0B" bgColor="#ffffff" />
              </div>
            </div>

            <motion.div
              className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FiCheckCircle /> Ready for scan
            </motion.div>
          </motion.div>

          <p className="mx-auto mt-4 max-w-xs break-all font-mono-num text-xs text-neutral-600">{joinUrl}</p>

          <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-2.5">
            <button onClick={handleDownload} className="btn-secondary !py-2 text-xs"><FiDownload size={14} /> Download</button>
            <button onClick={handlePrint} className="btn-secondary !py-2 text-xs"><FiPrinter size={14} /> Print</button>
            <button onClick={handleCopy} className="btn-secondary !py-2 text-xs"><FiCopy size={14} /> {copied ? 'Copied' : 'Copy link'}</button>
            <button onClick={handleShare} className="btn-secondary !py-2 text-xs"><FiShare2 size={14} /> Share</button>
          </div>
        </>
      )}
    </div>
  )
}
