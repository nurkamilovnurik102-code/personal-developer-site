import { useTranslation } from 'react-i18next'

export default function LoadingState() {
  const { t } = useTranslation()
  return (
    <div className="state-card" role="status" aria-live="polite">
      <span className="loader" aria-hidden="true" />
      <span>{t('common.loading')}</span>
    </div>
  )
}
