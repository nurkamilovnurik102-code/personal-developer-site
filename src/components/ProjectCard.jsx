import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getLocalized } from '../context/SiteContentContext'

export default function ProjectCard({ project }) {
  const { t, i18n } = useTranslation()
  const technologies = String(project.technologies || '').split(',').map((x) => x.trim()).filter(Boolean)
  return (
    <article className={`project-card tone-${project.tone || 'navy'}`}>
      <div className="project-visual">
        {project.image_url ? <img className="project-cover" src={project.image_url} alt="" loading="lazy" /> : <><div className="browser-bar"><i /><i /><i /></div><div className="mock-screen"><span className="mock-line long" /><span className="mock-line" /><div className="mock-grid"><span /><span /><span /></div></div></>}
      </div>
      <div className="project-body">
        <p className="project-category">{t(`services.${project.category}.title`, { defaultValue: project.category || 'WEB' })}</p>
        <h3>{getLocalized(project, 'title', i18n.language)}</h3>
        <p>{getLocalized(project, 'summary', i18n.language)}</p>
        <div className="chips">{technologies.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
        <Link className="text-link" to={`/projects/${project.slug || project.id}`}>{t('common.viewProject')} <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  )
}
