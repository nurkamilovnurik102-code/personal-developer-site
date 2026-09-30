import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import kg from './locales/kg.json'
import ru from './locales/ru.json'

const savedLanguage = localStorage.getItem('site-language') || 'kg'

i18n.use(initReactI18next).init({
  resources: {
    kg: { translation: kg },
    ru: { translation: ru },
  },
  lng: savedLanguage,
  fallbackLng: 'kg',
  interpolation: { escapeValue: false },
})

document.documentElement.lang = savedLanguage === 'ru' ? 'ru' : 'ky'

export default i18n
