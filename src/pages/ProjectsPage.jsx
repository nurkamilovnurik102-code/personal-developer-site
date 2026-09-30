import { useTranslation } from 'react-i18next'
import SectionHeading from '../components/SectionHeading'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import ProjectCard from '../components/ProjectCard'
import useProjects from '../hooks/useProjects'

export default function ProjectsPage() {
  const { t } = useTranslation()
  const { data, loading, error, retry } = useProjects()

  return (
    <section className="page-hero section-pad">
      <div className="container">
        <SectionHeading eyebrow={t('projects.eyebrow')} title={t('projects.title')} subtitle={t('projects.subtitle')} />
        {loading && <LoadingState />}
        {error && <ErrorState onRetry={retry} />}
        {!loading && !error && (
          <div className="project-grid project-grid-page">
            {data.map((project) => <ProjectCard project={project} key={project.id} />)}
          </div>
        )}
      </div>
    </section>
  )
}
