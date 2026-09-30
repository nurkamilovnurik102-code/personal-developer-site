import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeading from '../components/SectionHeading'
import { getLocalized, useSiteContent } from '../context/SiteContentContext'

const initialForm = { name: '', contact: '', type: '', message: '' }

export default function ContactPage() {
  const { t, i18n } = useTranslation()
  const { settings } = useSiteContent()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const updateField = (event) => { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: undefined })) }
  const validate = () => { const next = {}; Object.entries(form).forEach(([key, value]) => { if (!value.trim()) next[key] = t('contact.required') }); setErrors(next); return Object.keys(next).length === 0 }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    const phone = String(settings.whatsapp || '').replace(/\D/g, '')
    if (!phone) { setStatus('no-whatsapp'); return }
    const typeLabel = t(`contact.${form.type === 'event' ? 'event' : form.type}`)
    const message = i18n.language.startsWith('ru')
      ? `Здравствуйте, Нурислам!\n\nХочу обсудить сайт.\nИмя: ${form.name}\nКонтакт: ${form.contact}\nТип проекта: ${typeLabel}\nЧто нужно: ${form.message}`
      : `Салам, Нурислам!\n\nСайт боюнча сүйлөшкүм келет.\nАтым: ${form.name}\nБайланыш: ${form.contact}\nПроекттин түрү: ${typeLabel}\nЭмне керек: ${form.message}`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setStatus('success')
  }

  return (
    <section className="page-hero section-pad">
      <div className="container">
        <SectionHeading eyebrow={t('contact.eyebrow')} title={t('contact.title')} subtitle={t('contact.subtitle')} />
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <Field label={t('contact.name')} name="name" value={form.name} error={errors.name} onChange={updateField} />
            <Field label={t('contact.contact')} name="contact" value={form.contact} error={errors.contact} onChange={updateField} />
            <label className="field"><span>{t('contact.type')}</span><select name="type" value={form.type} onChange={updateField} aria-invalid={Boolean(errors.type)}><option value="">{t('contact.choose')}</option><option value="business">{t('contact.business')}</option><option value="event">{t('contact.event')}</option><option value="personal">{t('contact.personal')}</option><option value="interactive">{t('contact.interactive')}</option><option value="other">{t('contact.other')}</option></select>{errors.type && <small className="field-error">{errors.type}</small>}</label>
            <label className="field"><span>{t('contact.message')}</span><textarea name="message" rows="6" value={form.message} onChange={updateField} aria-invalid={Boolean(errors.message)} />{errors.message && <small className="field-error">{errors.message}</small>}</label>
            <button className="button button-primary" type="submit">{t('contact.whatsappSend')}</button>
            {status === 'success' && <p className="form-message success" role="status">{t('contact.whatsappOpened')}</p>}
            {status === 'no-whatsapp' && <p className="form-message error" role="alert">{t('contact.whatsappMissing')}</p>}
          </form>
          <aside className="contact-side">
            {settings.email && <div className="contact-card"><span>{t('contact.emailLabel')}</span><a href={`mailto:${settings.email}`}>{settings.email}</a></div>}
            <div className="contact-card"><span>{t('contact.whatsappLabel')}</span>{settings.whatsapp ? <a href={`https://wa.me/${String(settings.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{settings.phone || settings.whatsapp}</a> : <strong>{t('contact.notConfigured')}</strong>}</div>
            <div className="contact-card"><span>{t('contact.locationLabel')}</span><strong>{getLocalized(settings, 'location', i18n.language)}</strong></div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Field({ label, name, value, error, onChange }) { return <label className="field"><span>{label}</span><input name={name} value={value} onChange={onChange} aria-invalid={Boolean(error)} />{error && <small className="field-error">{error}</small>}</label> }
