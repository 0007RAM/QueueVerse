import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import JoinRedirect from '../components/JoinRedirect.jsx'
import Loader from '../components/Loader.jsx'

// Route-level code splitting: each page loads on demand.
const Home = lazy(() => import('../pages/Home.jsx'))
const RegisterUser = lazy(() => import('../pages/RegisterUser.jsx'))
const QueueList = lazy(() => import('../pages/QueueList.jsx'))
const QueueDetails = lazy(() => import('../pages/QueueDetails.jsx'))
const JoinQueue = lazy(() => import('../pages/JoinQueue.jsx'))
const MyToken = lazy(() => import('../pages/MyToken.jsx'))
const TrackQueue = lazy(() => import('../pages/TrackQueue.jsx'))
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'))
const QueueManagement = lazy(() => import('../pages/QueueManagement.jsx'))
const CreateQueue = lazy(() => import('../pages/CreateQueue.jsx'))
const Statistics = lazy(() => import('../pages/Statistics.jsx'))
const GenerateQR = lazy(() => import('../pages/GenerateQR.jsx'))
const NotFound = lazy(() => import('../pages/NotFound.jsx'))

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
}

function Page({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>
}

export default function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<Loader label="Loading..." />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/register" element={<Page><RegisterUser /></Page>} />
          <Route path="/queues" element={<Page><QueueList /></Page>} />
          <Route path="/queues/:id" element={<Page><QueueDetails /></Page>} />
          <Route path="/queues/:id/join" element={<Page><JoinQueue /></Page>} />
          <Route path="/queues/:id/track" element={<Page><TrackQueue /></Page>} />
          <Route path="/join/:queueId" element={<JoinRedirect />} />
          <Route path="/my-token" element={<Page><MyToken /></Page>} />
          <Route path="/qr" element={<Page><GenerateQR /></Page>} />
          <Route path="/admin" element={<Page><AdminDashboard /></Page>} />
          <Route path="/admin/queues" element={<Page><QueueManagement /></Page>} />
          <Route path="/admin/queues/new" element={<Page><CreateQueue /></Page>} />
          <Route path="/admin/statistics" element={<Page><Statistics /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}
