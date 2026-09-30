import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import SectionHeading from '../components/SectionHeading'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import ProjectCard from '../components/ProjectCard'
import useProjects from '../hooks/useProjects'
import { getLocalized, useSiteContent } from '../context/SiteContentContext'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const { data, loading, error, retry } = useProjects()
  const { settings, services } = useSiteContent()
  const processSteps = ['s1', 's2', 's4', 's6']
  const faqs = ['1', '2', '3', '5']

  return (
    <>
      <section className="hero section-pad">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="container hero-grid">
          <div className="hero-copy hero-enter">
            <p className="eyebrow">{settings.developer_name || 'Нурислам'} • Frontend Developer</p>
            <h1>{getLocalized(settings, 'hero_title', i18n.language)}</h1>
            <p className="hero-subtitle">{getLocalized(settings, 'hero_subtitle', i18n.language)}</p>
            <div className="hero-actions">
              <a href="#catalog" className="button button-primary">{t('common.exploreSite')}</a>
              <Link to="/projects" className="button button-ghost">{t('common.viewProjects')}</Link>
            </div>
            <p className="hero-note">React • Vite • Responsive • KG / RU</p>
          </div>
          <div className="hero-panel hero-enter hero-enter-delay" aria-hidden="true">
            <div className="site-map-card">
              <div className="site-map-top"><span className="site-map-avatar">N</span><div><strong>{t('hero.cardTitle')}</strong><small>{t('hero.cardSubtitle')}</small></div></div>
              <div className="site-map-list">
                <span><b>01</b>{t('nav.catalog')}</span><span><b>02</b>{t('nav.projects')}</span><span><b>03</b>{t('nav.about')}</span><span><b>04</b>{t('nav.contact')}</span>
              </div>
            </div>
            <div className="floating-card floating-card-one">KG / RU</div><div className="floating-card floating-card-two">React + Vite</div><div className="floating-card floating-card-three">Mobile First</div>
          </div>
        </div>
      </section>

      <section className="section-pad catalog-section" id="catalog">
        <div className="container">
          <SectionHeading eyebrow={t('services.eyebrow')} title={t('services.title')} subtitle={t('services.subtitle')} />
          <div className="service-grid">
            {services.slice(0, 4).map((item, index) => (
              <Link className={`service-card service-dynamic service-accent-${(index % 4) + 1}`} key={item.id} to={`/services#${item.slug}`}>
                <div className="service-topline"><span className="service-index">0{index + 1}</span><span className="service-badge">WEB</span></div>
                <h3>{getLocalized(item, 'title', i18n.language)}</h3>
                <p>{getLocalized(item, 'short', i18n.language)}</p>
                <span className="service-open">{t('common.openCatalog')} →</span>
              </Link>
            ))}
          </div>
          <div className="catalog-more"><Link className="text-link" to="/services">{t('services.catalogTitle')} →</Link></div>
        </div>
      </section>

      <section className="section-pad section-projects">
        <div className="container">
          <div className="section-row"><SectionHeading eyebrow={t('projects.eyebrow')} title={t('projects.title')} subtitle={t('projects.subtitle')} /><Link to="/projects" className="text-link desktop-link">{t('projects.all')} →</Link></div>
          {loading && <LoadingState />}{error && <ErrorState onRetry={retry} />}
          {!loading && !error && <div className="project-grid">{data.slice(0, 3).map((project) => <ProjectCard project={project} key={project.id} />)}</div>}
        </div>
      </section>

      <section className="section-pad process-section">
        <div className="container">
          <SectionHeading eyebrow={t('process.eyebrow')} title={t('process.title')} subtitle={t('process.subtitle')} />
          <div className="process-grid process-grid-four">
            {processSteps.map((key, index) => <article className="process-card" key={key}><span>{String(index + 1).padStart(2, '0')}</span><h3>{t(`process.${key}.title`)}</h3><p>{t(`process.${key}.text`)}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section-pad about-home" id="about-preview">
        <div className="container about-preview">
          <div><p className="eyebrow">{t('about.eyebrow')}</p><h2>{getLocalized(settings, 'about_title', i18n.language)}</h2></div>
          <div className="about-preview-copy"><p>{getLocalized(settings, 'about_text', i18n.language)}</p><p className="about-mission">{getLocalized(settings, 'mission', i18n.language)}</p><Link className="text-link text-link-light" to="/about">{t('common.learnMore')} →</Link></div>
        </div>
      </section>

      <section className="section-pad faq-section">
        <div className="container">
          <SectionHeading eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
          <div className="faq-list">{faqs.map((number) => <details className="faq-item" key={number}><summary>{t(`faq.q${number}`)} <span>+</span></summary><p>{t(`faq.a${number}`)}</p></details>)}</div>
        </div>
      </section>

      <section className="section-pad cta-section">
        <div className="container cta-card"><div><p className="eyebrow">{t('contact.eyebrow')}</p><h2>{t('contact.ctaTitle')}</h2><p>{t('contact.ctaSubtitle')}</p></div><Link to="/contact" className="button button-light">{t('common.startProject')}</Link></div>
      </section>
    </>
  )
}
