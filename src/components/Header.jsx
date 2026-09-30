import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { getLocalized, useSiteContent } from '../context/SiteContentContext'

const links = [
  ['/projects', 'nav.projects'],
  ['/about', 'nav.about'],
  ['/contact', 'nav.contact'],
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const { settings, services } = useSiteContent()
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">N</span>
          <span>{settings.brand || 'NURISLAM / DEV'}</span>
        </NavLink>

        <nav className={`main-nav ${open ? 'is-open' : ''}`}>
          <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)} end>
            {t('nav.home')}
          </NavLink>

          <div className="catalog-nav">
            <NavLink to="/services" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active catalog-link' : 'catalog-link')}>
              {t('nav.catalog')} <span aria-hidden="true">⌄</span>
            </NavLink>
            <div className="catalog-menu" aria-label={t('nav.catalog')}>
              {services.slice(0, 6).map((item) => (
                <Link key={item.id} to={`/services#${item.slug}`} onClick={() => setOpen(false)}>
                  <span>{getLocalized(item, 'title', i18n.language)}</span><b aria-hidden="true">→</b>
                </Link>
              ))}
            </div>
          </div>

          {links.map(([path, key]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="header-tools">
          <LanguageSwitcher />
          <button type="button" className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={t('a11y.menu')}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
