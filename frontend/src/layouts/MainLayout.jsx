import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import QueueConstellation from '../components/QueueConstellation.jsx'

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <QueueConstellation />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      <Footer />
    </div>
  )
}
