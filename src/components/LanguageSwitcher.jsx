import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language.startsWith('ru') ? 'ru' : 'kg'

  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language)
    localStorage.setItem('site-language', language)
    document.documentElement.lang = language === 'ru' ? 'ru' : 'ky'
  }

  return (
    <div className="language-switcher" aria-label={t('a11y.language')}>
      <button
        className={current === 'kg' ? 'is-active' : ''}
        onClick={() => changeLanguage('kg')}
        type="button"
      >
        KG
      </button>
      <span>/</span>
      <button
        className={current === 'ru' ? 'is-active' : ''}
        onClick={() => changeLanguage('ru')}
        type="button"
      >
        RU
      </button>
    </div>
  )
}
