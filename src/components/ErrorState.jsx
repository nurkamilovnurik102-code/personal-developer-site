import { useTranslation } from 'react-i18next'

export default function ErrorState({ onRetry }) {
  const { t } = useTranslation()
  return (
    <div className="state-card error-card" role="alert">
      <strong>{t('projects.loadError')}</strong>
      {onRetry && (
        <button type="button" className="button button-secondary" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}
