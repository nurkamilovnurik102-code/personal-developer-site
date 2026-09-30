import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <section className="page-hero section-pad">
      <div className="container narrow empty-page">
        <span className="error-code">404</span>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.text')}</p>
        <Link className="button button-primary" to="/">{t('notFound.button')}</Link>
      </div>
    </section>
  )
}
