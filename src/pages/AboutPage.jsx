import { useTranslation } from 'react-i18next'
import SectionHeading from '../components/SectionHeading'
import { getLocalized, useSiteContent } from '../context/SiteContentContext'

export default function AboutPage() {
  const { t, i18n } = useTranslation()
  const { settings } = useSiteContent()
  return (
    <section className="page-hero about-page section-pad">
      <div className="container">
        <SectionHeading eyebrow={t('about.eyebrow')} title={getLocalized(settings, 'about_title', i18n.language)} subtitle={t('about.pageSubtitle')} />
        <div className="about-page-grid">
          <div className="about-story"><p>{getLocalized(settings, 'about_text', i18n.language)}</p></div>
          <div className="about-side">
            <article className="detail-card about-accent-card"><p className="eyebrow">{t('about.goalTitle')}</p><p>{getLocalized(settings, 'mission', i18n.language)}</p></article>
            <article className="detail-card"><p className="eyebrow">{t('about.educationTitle')}</p><p>{t('about.educationText')}</p></article>
          </div>
        </div>
        <div className="tech-block"><SectionHeading eyebrow={t('tech.eyebrow')} title={t('tech.title')} subtitle={t('tech.subtitle')} /><div className="tech-grid"><article><span>{t('tech.frontend')}</span><strong>React · Vite · JavaScript · HTML · CSS</strong></article><article><span>{t('tech.tools')}</span><strong>Git · GitHub · Vercel · Supabase · i18next</strong></article><article><span>{t('tech.workflow')}</span><strong>Responsive UI · API · QA · AI-assisted development</strong></article></div></div>
      </div>
    </section>
  )
}
