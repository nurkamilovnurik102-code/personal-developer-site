import { Link, useRouteError } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function RouteErrorPage() {
  const { t } = useTranslation()
  const error = useRouteError()

  return (
    <main className="page-hero section-pad">
      <div className="container narrow empty-page">
        <span className="error-code">!</span>
        <h1>{t('routeError.title')}</h1>
        <p>{t('routeError.text')}</p>
        {import.meta.env.DEV && error?.message && <pre className="dev-error">{error.message}</pre>}
        <Link className="button button-primary" to="/">{t('notFound.button')}</Link>
      </div>
    </main>
  )
}
