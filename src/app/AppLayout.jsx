import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MusicPlayer from '../components/MusicPlayer'
import { useSiteContent } from '../context/SiteContentContext'

export default function AppLayout() {
  const { t, i18n } = useTranslation()
  const { settings } = useSiteContent()
  const location = useLocation()

  useEffect(() => {
    document.title = `${settings.developer_name || 'Нурислам'} — Frontend Developer`
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', t('meta.description'))
  }, [i18n.language, t, settings.developer_name])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.hash])

  return (
    <>
      <a className="skip-link" href="#main-content">{t('a11y.skip')}</a>
      <Header />
      <main id="main-content"><Outlet /></main>
      <Footer />
      <MusicPlayer />
      <ScrollRestoration />
    </>
  )
}
