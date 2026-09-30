import { useCallback, useEffect, useState } from 'react'
import { getCmsProjects } from '../services/cmsService'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function useProjects() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [requestKey, setRequestKey] = useState(0)
  const retry = useCallback(() => setRequestKey((value) => value + 1), [])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true); setError(null)
        const [result] = await Promise.all([getCmsProjects(), delay(260)])
        if (active) setData(result)
      } catch (err) { if (active) setError(err) }
      finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [requestKey])

  return { data, loading, error, retry }
}
