import React, { createContext, useContext, useState, useEffect } from 'react'

const SessionContext = createContext(null)

const USER_KEY = 'smartqueue_user_id'
const TOKEN_KEY = 'smartqueue_token_id'

export function SessionProvider({ children }) {
  const [userId, setUserIdState] = useState(() => localStorage.getItem(USER_KEY) || '')
  const [tokenId, setTokenIdState] = useState(() => localStorage.getItem(TOKEN_KEY) || '')

  useEffect(() => {
    if (userId) localStorage.setItem(USER_KEY, userId)
    else localStorage.removeItem(USER_KEY)
  }, [userId])

  useEffect(() => {
    if (tokenId) localStorage.setItem(TOKEN_KEY, tokenId)
    else localStorage.removeItem(TOKEN_KEY)
  }, [tokenId])

  return (
    <SessionContext.Provider value={{ userId, setUserId: setUserIdState, tokenId, setTokenId: setTokenIdState }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}
