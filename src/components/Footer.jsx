import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getLocalized, useSiteContent } from '../context/SiteContentContext'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const { settings } = useSiteContent()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">N</span><span>{settings.developer_name || 'Нурислам'}</span></div>
          <p>{getLocalized(settings, 'footer_note', i18n.language) || t('footer.text')}</p>
          <p className="muted">{getLocalized(settings, 'location', i18n.language)}</p>
        </div>
        <div className="footer-links">
          <Link to="/services">{t('nav.services')}</Link>
          <Link to="/projects">{t('nav.projects')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {year} {settings.developer_name || 'Нурислам'}</span><span>{t('footer.rights')}</span></div>
    </footer>
  )
}
