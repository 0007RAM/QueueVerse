import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

/**
 * QR codes encode the short public URL `/join/{queueId}` (per spec). This
 * component simply forwards that to the existing `/queues/:id/join` route
 * so the real JoinQueue page and its logic stay untouched.
 */
export default function JoinRedirect() {
  const { queueId } = useParams()
  return <Navigate to={`/queues/${queueId}/join`} replace />
}
