import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultServices, defaultSettings } from '../data/cmsDefaults'
import { getCmsServices, getSiteSettings } from '../services/cmsService'

const SiteContentContext = createContext(null)

export function SiteContentProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [services, setServices] = useState(defaultServices)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const [nextSettings, nextServices] = await Promise.all([getSiteSettings(), getCmsServices()])
      setSettings(nextSettings)
      setServices(nextServices)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const value = useMemo(() => ({ settings, services, loading, error, refresh }), [settings, services, loading, error, refresh])
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  const value = useContext(SiteContentContext)
  if (!value) throw new Error('useSiteContent must be used inside SiteContentProvider')
  return value
}

export function getLocalized(item, field, language = 'kg') {
  const locale = language.startsWith('ru') ? 'ru' : 'kg'
  return item?.[`${field}_${locale}`] || item?.[`${field}_kg`] || ''
}
