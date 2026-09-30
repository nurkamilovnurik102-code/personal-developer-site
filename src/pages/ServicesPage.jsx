import { useTranslation } from 'react-i18next'
import SectionHeading from '../components/SectionHeading'
import { getLocalized, useSiteContent } from '../context/SiteContentContext'

export default function ServicesPage() {
  const { t, i18n } = useTranslation()
  const { services } = useSiteContent()
  return (
    <section className="page-hero services-page section-pad">
      <div className="container">
        <SectionHeading eyebrow={t('services.eyebrow')} title={t('services.catalogTitle')} subtitle={t('services.catalogSubtitle')} />
        <div className="service-catalog-list">
          {services.map((item, index) => <ServiceCatalogItem key={item.id} item={item} index={index} language={i18n.language} t={t} />)}
        </div>
      </div>
    </section>
  )
}

function ServiceCatalogItem({ item, index, language, t }) {
  const embed = getVideoEmbed(item.video_url)
  return (
    <article id={item.slug} className="service-catalog-item">
      <div className="service-catalog-copy">
        <span className="service-number">0{index + 1}</span>
        <h2>{getLocalized(item, 'title', language)}</h2>
        <p>{getLocalized(item, 'short', language)}</p>
        {getLocalized(item, 'details', language) && <p className="service-details">{getLocalized(item, 'details', language)}</p>}
        <div className="service-links">
          {item.demo_url && <a className="button button-primary" href={item.demo_url} target="_blank" rel="noreferrer">{t('common.viewProject')} ↗</a>}
          {item.video_url && !embed && <a className="button button-secondary" href={item.video_url} target="_blank" rel="noreferrer">{t('common.watchVideo')} ↗</a>}
        </div>
      </div>
      <div className="service-catalog-media">
        {embed ? <div className="responsive-video"><iframe src={embed} title={getLocalized(item, 'title', language)} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
          : item.video_url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(item.video_url) ? <video controls preload="metadata" src={item.video_url} />
          : item.image_url ? <img src={item.image_url} alt={getLocalized(item, 'title', language)} loading="lazy" />
          : <div className={`service-placeholder service-placeholder-${(index % 4) + 1}`}><span>{getLocalized(item, 'title', language).slice(0, 1)}</span><small>Demo / Video</small></div>}
      </div>
    </article>
  )
}

function getVideoEmbed(url = '') {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed/${parsed.pathname.split('/')[2]}`
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
  } catch { return '' }
  return ''
}
