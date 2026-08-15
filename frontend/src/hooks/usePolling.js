import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Polls an async function on an interval (default 5s) and exposes the latest
 * data, loading, and error state. Automatically stops when the component
 * unmounts and supports manual refresh.
 *
 * @param {() => Promise<any>} fetchFn - async function returning the data to poll
 * @param {Array} deps - dependency array; polling restarts when these change
 * @param {number} intervalMs - polling interval in milliseconds
 */
export function usePolling(fetchFn, deps = [], intervalMs = 5000) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const savedFetchFn = useRef(fetchFn)
  savedFetchFn.current = fetchFn

  const refresh = useCallback(async () => {
    try {
      const result = await savedFetchFn.current()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const tick = async () => {
      try {
        const result = await savedFetchFn.current()
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    tick()
    const interval = setInterval(tick, intervalMs)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, error, loading, refresh }
}
