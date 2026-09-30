import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getCmsProjectById } from '../services/cmsService'
import LoadingState from '../components/LoadingState'
import { getLocalized } from '../context/SiteContentContext'

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const { t, i18n } = useTranslation()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true); setError(false)
    getCmsProjectById(projectId)
      .then((result) => active && setProject(result))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [projectId])

  if (loading) return <section className="page-hero section-pad"><div className="container"><LoadingState /></div></section>
  if (error || !project) return <section className="page-hero section-pad"><div className="container narrow"><h1>{t('projects.notFound')}</h1><Link className="button button-primary" to="/projects">{t('common.back')}</Link></div></section>

  const technologies = String(project.technologies || '').split(',').map((x) => x.trim()).filter(Boolean)
  const features = getLocalized(project, 'features', i18n.language).split(/\n|,/).map((x) => x.trim()).filter(Boolean)
  const title = getLocalized(project, 'title', i18n.language)

  return (
    <section className="project-detail section-pad">
      <div className="container">
        <Link className="text-link" to="/projects">← {t('common.back')}</Link>
        <div className="project-detail-hero">
          <div><p className="eyebrow">{t(`services.${project.category}.title`, { defaultValue: project.category || 'WEB' })}</p><h1>{title}</h1><p className="hero-subtitle dark-text">{getLocalized(project, 'summary', i18n.language)}</p></div>
          <div className={`project-visual project-visual-large tone-${project.tone || 'navy'}`}>
            {project.image_url ? <img className="project-cover project-cover-large" src={project.image_url} alt={title} /> : <><div className="browser-bar"><i /><i /><i /></div><div className="mock-screen"><span className="mock-line long" /><span className="mock-line" /><div className="mock-grid"><span /><span /><span /></div></div></>}
          </div>
        </div>
        <div className="detail-grid"><article className="detail-card"><p className="eyebrow">{t('projects.problem')}</p><p>{getLocalized(project, 'problem', i18n.language)}</p></article><article className="detail-card"><p className="eyebrow">{t('projects.solution')}</p><p>{getLocalized(project, 'solution', i18n.language)}</p></article></div>
        <div className="detail-grid"><article className="detail-card"><h2>{t('projects.features')}</h2><ul className="clean-list">{features.map((item) => <li key={item}>✓ {item}</li>)}</ul></article><article className="detail-card"><h2>{t('projects.stack')}</h2><div className="chips large-chips">{technologies.map((item) => <span key={item}>{item}</span>)}</div></article></div>
        <ProjectLink label={t('common.viewProject')} url={project.demo_url} empty={t('common.demoComing')} primary />
        <ProjectLink label={t('common.watchVideo')} url={project.video_url} empty={t('common.videoComing')} />
      </div>
    </section>
  )
}

function ProjectLink({ label, url, empty, primary }) {
  return <div className="project-links-card"><div><strong>{label}</strong><p>{url || empty}</p></div>{url ? <a className={`button ${primary ? 'button-primary' : 'button-secondary'}`} href={url} target="_blank" rel="noopener noreferrer">{label}</a> : <span className="button button-disabled">{empty}</span>}</div>
}
