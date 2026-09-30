import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { isSupabaseConfigured } from '../../lib/supabase'
import { changeAdminPassword, getAdminSession, signInAdmin, signOutAdmin } from '../../services/adminAuth'
import {
  deleteCmsService,
  deleteCmsProject,
  getCmsServices,
  getCmsProjects,
  getSiteSettings,
  resetLocalCms,
  saveCmsService,
  saveCmsProject,
  saveSiteSettings,
  uploadSiteMedia
} from '../../services/cmsService'
import { defaultServices, defaultSettings } from '../../data/cmsDefaults'
import { defaultPortfolioProjects } from '../../data/cmsProjects'

const emptyProject = {
  id: '', slug: '', sort_order: 99, category: 'business',
  title_kg: '', title_ru: '', summary_kg: '', summary_ru: '', problem_kg: '', problem_ru: '',
  solution_kg: '', solution_ru: '', features_kg: '', features_ru: '', technologies: 'React, Vite, Responsive UI',
  demo_url: '', video_url: '', image_url: '', tone: 'navy', active: true
}

const emptyService = {
  id: '', slug: '', sort_order: 99,
  title_kg: '', title_ru: '', short_kg: '', short_ru: '', details_kg: '', details_ru: '',
  demo_url: '', video_url: '', image_url: '', active: true
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined)
  const [tab, setTab] = useState('dashboard')
  const [settings, setSettings] = useState(defaultSettings)
  const [services, setServices] = useState(defaultServices)
  const [projects, setProjects] = useState(defaultPortfolioProjects)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const [nextSettings, nextServices, nextProjects] = await Promise.all([
      getSiteSettings(),
      getCmsServices({ includeInactive: true }),
      getCmsProjects({ includeInactive: true })
    ])
    setSettings(nextSettings)
    setServices(nextServices)
    setProjects(nextProjects)
  }

  useEffect(() => {
    getAdminSession().then((value) => {
      setSession(value)
      if (value) load().catch(console.error)
    })
  }, [])

  if (session === undefined) return <AdminShell><div className="admin-loader">Жүктөлүүдө...</div></AdminShell>
  if (!session) return <AdminLogin onSuccess={async (value) => { setSession(value); await load() }} />

  const flash = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  const logout = async () => {
    await signOutAdmin()
    setSession(null)
  }

  return (
    <AdminShell>
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>N</span><div><b>Нурислам</b><small>Site Admin</small></div></div>
        <nav>
          <AdminNav active={tab === 'dashboard'} onClick={() => setTab('dashboard')}>Обзор</AdminNav>
          <AdminNav active={tab === 'services'} onClick={() => setTab('services')}>Кызматтар</AdminNav>
          <AdminNav active={tab === 'projects'} onClick={() => setTab('projects')}>Проекттер</AdminNav>
          <AdminNav active={tab === 'content'} onClick={() => setTab('content')}>Сайт маалыматы</AdminNav>
          <AdminNav active={tab === 'media'} onClick={() => setTab('media')}>Музыка жана медиа</AdminNav>
          <AdminNav active={tab === 'security'} onClick={() => setTab('security')}>Коопсуздук</AdminNav>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" target="_blank">Сайтты ачуу ↗</Link>
          <button onClick={logout}>Чыгуу</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="admin-kicker">Башкаруу панели</p>
            <h1>{adminTitle(tab)}</h1>
          </div>
          <span className={`admin-mode ${isSupabaseConfigured ? 'live' : 'local'}`}>
            {isSupabaseConfigured ? '● Live CMS' : '● Local demo'}
          </span>
        </div>

        {!isSupabaseConfigured && (
          <div className="admin-alert">
            <strong>Local demo режим.</strong> Өзгөртүүлөр азыр ушул браузерде гана сакталат. Vercel'де бардык адамга көрүнүшү үчүн Supabase кошуу керек.
          </div>
        )}
        {notice && <div className="admin-toast">{notice}</div>}

        {tab === 'dashboard' && <Dashboard settings={settings} services={services} projects={projects} setTab={setTab} />}
        {tab === 'services' && <ServicesManager services={services} setServices={setServices} flash={flash} />}
        {tab === 'projects' && <ProjectsManager projects={projects} setProjects={setProjects} flash={flash} />}
        {tab === 'content' && (
          <ContentManager
            settings={settings}
            setSettings={setSettings}
            busy={busy}
            onSave={async () => {
              setBusy(true)
              try { setSettings(await saveSiteSettings(settings)); flash('Маалымат сакталды.') }
              catch (error) { console.error(error); flash('Сактоодо ката чыкты.') }
              finally { setBusy(false) }
            }}
          />
        )}
        {tab === 'media' && <MediaManager settings={settings} setSettings={setSettings} flash={flash} />}
        {tab === 'security' && <SecurityManager flash={flash} onReset={async () => { resetLocalCms(); await load(); flash('Local demo маалыматтары тазаланды.') }} />}
      </main>
    </AdminShell>
  )
}

function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError('')
    try { await onSuccess(await signInAdmin(email, password)) }
    catch { setError(isSupabaseConfigured ? 'Email же пароль туура эмес.' : 'Local admin пароль туура эмес же .env файлында коюлган эмес.') }
    finally { setBusy(false) }
  }

  return (
    <AdminShell>
      <div className="admin-login-wrap">
        <form className="admin-login" onSubmit={submit}>
          <div className="admin-login-logo">N</div>
          <p>Нурислам / Site Admin</p>
          <h1>Админ панель</h1>
          {isSupabaseConfigured && <AdminField label="Email"><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></AdminField>}
          <AdminField label="Пароль"><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></AdminField>
          {error && <div className="admin-error">{error}</div>}
          <button className="admin-primary" disabled={busy}>{busy ? 'Кирүүдө...' : 'Кирүү'}</button>
          <Link to="/" className="admin-back">← Сайтка кайтуу</Link>
        </form>
      </div>
    </AdminShell>
  )
}

function Dashboard({ settings, services, projects, setTab }) {
  const active = services.filter((item) => item.active !== false).length
  return (
    <>
      <div className="admin-stat-grid">
        <Stat label="Активдүү кызмат" value={active} />
        <Stat label="Портфолио" value={projects.filter((item) => item.active !== false).length} />
        <Stat label="WhatsApp" value={settings.whatsapp ? 'Кошулган' : 'Кошула элек'} />
        <Stat label="Музыка" value={settings.music_enabled && settings.music_url ? 'Иштейт' : 'Өчүк'} />
      </div>
      <section className="admin-card">
        <div className="admin-card-head"><div><h2>Тез өзгөртүү</h2><p>Код ачпай эле негизги бөлүктөрдү башкар.</p></div></div>
        <div className="admin-quick-grid">
          <button onClick={() => setTab('services')}>＋ Кызмат кошуу же өзгөртүү</button>
          <button onClick={() => setTab('projects')}>▣ Портфолио проекттери</button>
          <button onClick={() => setTab('content')}>✎ Башкы текст жана контакт</button>
          <button onClick={() => setTab('media')}>♫ Музыка жана медиа</button>
          <button onClick={() => setTab('security')}>⌁ Пароль жана коопсуздук</button>
        </div>
      </section>
    </>
  )
}

function ServicesManager({ services, setServices, flash }) {
  const [editing, setEditing] = useState(null)
  const ordered = useMemo(() => [...services].sort((a, b) => a.sort_order - b.sort_order), [services])

  const remove = async (item) => {
    if (!window.confirm(`“${item.title_kg}” кызматын өчүрөсүзбү?`)) return
    try {
      await deleteCmsService(item.id)
      setServices((current) => current.filter((service) => service.id !== item.id))
      flash('Кызмат өчүрүлдү.')
    } catch (error) { console.error(error); flash('Өчүрүүдө ката чыкты.') }
  }

  if (editing) {
    return <ServiceEditor initial={editing === 'new' ? emptyService : editing} onCancel={() => setEditing(null)} onSaved={(saved) => {
      setServices((current) => {
        const exists = current.some((item) => item.id === saved.id)
        return (exists ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]).sort((a, b) => a.sort_order - b.sort_order)
      })
      setEditing(null); flash('Кызмат сакталды.')
    }} />
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <div><h2>Кызматтар каталогу</h2><p>Кызматты кош, өчүр, жашыр же demo/video шилтемесин жаңырт.</p></div>
        <button className="admin-primary" onClick={() => setEditing('new')}>＋ Жаңы кызмат</button>
      </div>
      <div className="admin-service-list">
        {ordered.map((item) => (
          <article key={item.id}>
            <div className="admin-service-media">
              {item.image_url ? <img src={item.image_url} alt="" /> : <span>{item.title_kg?.slice(0, 1) || 'S'}</span>}
            </div>
            <div className="admin-service-copy">
              <div><h3>{item.title_kg}</h3><span className={item.active === false ? 'status-off' : 'status-on'}>{item.active === false ? 'Жашырылган' : 'Активдүү'}</span></div>
              <p>{item.short_kg}</p>
              <small>{item.demo_url ? 'Demo ✓' : 'Demo —'} · {item.video_url ? 'Video ✓' : 'Video —'}</small>
            </div>
            <div className="admin-row-actions">
              <button onClick={() => setEditing(item)}>Өзгөртүү</button>
              <button className="danger" onClick={() => remove(item)}>Өчүрүү</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ServiceEditor({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  const uploadCover = async (file) => {
    if (!file) return
    setUploading(true)
    try { update('image_url', await uploadSiteMedia(file, 'services')) }
    catch (error) { console.error(error); alert('Файл upload үчүн Supabase туташкан болушу керек.') }
    finally { setUploading(false) }
  }

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    try { onSaved(await saveCmsService(form)) }
    catch (error) { console.error(error); alert('Сактоодо ката чыкты.') }
    finally { setBusy(false) }
  }

  return (
    <form className="admin-card" onSubmit={submit}>
      <div className="admin-card-head"><div><h2>{initial.id ? 'Кызматты өзгөртүү' : 'Жаңы кызмат'}</h2><p>KG/RU текст, сүрөт, demo жана видео кошууга болот.</p></div><button type="button" className="admin-secondary" onClick={onCancel}>Артка</button></div>
      <div className="admin-form-grid">
        <AdminField label="Аталышы KG"><input required value={form.title_kg} onChange={(e) => update('title_kg', e.target.value)} /></AdminField>
        <AdminField label="Название RU"><input required value={form.title_ru} onChange={(e) => update('title_ru', e.target.value)} /></AdminField>
        <AdminField label="Кыскача KG" wide><textarea rows="3" required value={form.short_kg} onChange={(e) => update('short_kg', e.target.value)} /></AdminField>
        <AdminField label="Кратко RU" wide><textarea rows="3" required value={form.short_ru} onChange={(e) => update('short_ru', e.target.value)} /></AdminField>
        <AdminField label="Толугураак KG" wide><textarea rows="3" value={form.details_kg} onChange={(e) => update('details_kg', e.target.value)} /></AdminField>
        <AdminField label="Подробнее RU" wide><textarea rows="3" value={form.details_ru} onChange={(e) => update('details_ru', e.target.value)} /></AdminField>
        <AdminField label="Slug"><input value={form.slug} placeholder="business-site" onChange={(e) => update('slug', e.target.value.replace(/\s+/g, '-').toLowerCase())} /></AdminField>
        <AdminField label="Ирети"><input type="number" min="1" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} /></AdminField>
        <AdminField label="Demo сайт шилтемеси"><input type="url" value={form.demo_url || ''} placeholder="https://..." onChange={(e) => update('demo_url', e.target.value)} /></AdminField>
        <AdminField label="Обзор видео шилтемеси"><input type="url" value={form.video_url || ''} placeholder="https://youtube.com/..." onChange={(e) => update('video_url', e.target.value)} /></AdminField>
        <AdminField label="Cover сүрөт URL"><input type="url" value={form.image_url || ''} placeholder="https://..." onChange={(e) => update('image_url', e.target.value)} /></AdminField>
        <AdminField label="Же сүрөт файл"><input type="file" accept="image/*" disabled={uploading} onChange={(e) => uploadCover(e.target.files?.[0])} /><small>{uploading ? 'Жүктөлүүдө...' : 'Supabase Storage колдонулат.'}</small></AdminField>
        <label className="admin-check wide"><input type="checkbox" checked={form.active !== false} onChange={(e) => update('active', e.target.checked)} /> Сайтта көрсөтүү</label>
      </div>
      {form.image_url && <div className="admin-media-preview"><img src={form.image_url} alt="Preview" /></div>}
      <div className="admin-form-actions"><button type="button" className="admin-secondary" onClick={onCancel}>Жокко чыгаруу</button><button className="admin-primary" disabled={busy}>{busy ? 'Сакталууда...' : 'Сактоо'}</button></div>
    </form>
  )
}

function ProjectsManager({ projects, setProjects, flash }) {
  const [editing, setEditing] = useState(null)
  const ordered = useMemo(() => [...projects].sort((a, b) => a.sort_order - b.sort_order), [projects])

  const remove = async (item) => {
    if (!window.confirm(`“${item.title_kg}” проектин өчүрөсүзбү?`)) return
    try {
      await deleteCmsProject(item.id)
      setProjects((current) => current.filter((project) => project.id !== item.id))
      flash('Проект өчүрүлдү.')
    } catch (error) { console.error(error); flash('Өчүрүүдө ката чыкты.') }
  }

  if (editing) {
    return <ProjectEditor initial={editing === 'new' ? emptyProject : editing} onCancel={() => setEditing(null)} onSaved={(saved) => {
      setProjects((current) => {
        const exists = current.some((item) => item.id === saved.id)
        return (exists ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]).sort((a, b) => a.sort_order - b.sort_order)
      })
      setEditing(null); flash('Проект сакталды.')
    }} />
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head"><div><h2>Портфолио</h2><p>Жаңы ишти код ачпай кош: сүрөт, demo, видео, текст жана технологиялар.</p></div><button className="admin-primary" onClick={() => setEditing('new')}>＋ Жаңы проект</button></div>
      <div className="admin-service-list">
        {ordered.map((item) => <article key={item.id}>
          <div className="admin-service-media">{item.image_url ? <img src={item.image_url} alt="" /> : <span>P</span>}</div>
          <div className="admin-service-copy"><div><h3>{item.title_kg}</h3><span className={item.active === false ? 'status-off' : 'status-on'}>{item.active === false ? 'Жашырылган' : 'Активдүү'}</span></div><p>{item.summary_kg}</p><small>{item.demo_url ? 'Demo ✓' : 'Demo —'} · {item.video_url ? 'Video ✓' : 'Video —'}</small></div>
          <div className="admin-row-actions"><button onClick={() => setEditing(item)}>Өзгөртүү</button><button className="danger" onClick={() => remove(item)}>Өчүрүү</button></div>
        </article>)}
      </div>
    </section>
  )
}

function ProjectEditor({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const uploadCover = async (file) => {
    if (!file) return
    setUploading(true)
    try { update('image_url', await uploadSiteMedia(file, 'projects')) }
    catch (error) { console.error(error); alert('Файл upload үчүн Supabase туташкан болушу керек.') }
    finally { setUploading(false) }
  }
  const submit = async (event) => {
    event.preventDefault(); setBusy(true)
    try { onSaved(await saveCmsProject(form)) }
    catch (error) { console.error(error); alert('Сактоодо ката чыкты.') }
    finally { setBusy(false) }
  }
  return (
    <form className="admin-card" onSubmit={submit}>
      <div className="admin-card-head"><div><h2>{initial.id ? 'Проектти өзгөртүү' : 'Жаңы проект'}</h2><p>Портфолиодо көрүнгөн маалымат.</p></div><button type="button" className="admin-secondary" onClick={onCancel}>Артка</button></div>
      <div className="admin-form-grid">
        <AdminField label="Аталышы KG"><input required value={form.title_kg} onChange={(e) => update('title_kg', e.target.value)} /></AdminField>
        <AdminField label="Название RU"><input required value={form.title_ru} onChange={(e) => update('title_ru', e.target.value)} /></AdminField>
        <AdminField label="Кыскача KG" wide><textarea rows="3" value={form.summary_kg} onChange={(e) => update('summary_kg', e.target.value)} /></AdminField>
        <AdminField label="Кратко RU" wide><textarea rows="3" value={form.summary_ru} onChange={(e) => update('summary_ru', e.target.value)} /></AdminField>
        <AdminField label="Проблема KG"><textarea rows="3" value={form.problem_kg} onChange={(e) => update('problem_kg', e.target.value)} /></AdminField>
        <AdminField label="Проблема RU"><textarea rows="3" value={form.problem_ru} onChange={(e) => update('problem_ru', e.target.value)} /></AdminField>
        <AdminField label="Чечим KG"><textarea rows="3" value={form.solution_kg} onChange={(e) => update('solution_kg', e.target.value)} /></AdminField>
        <AdminField label="Решение RU"><textarea rows="3" value={form.solution_ru} onChange={(e) => update('solution_ru', e.target.value)} /></AdminField>
        <AdminField label="Функциялар KG"><textarea rows="4" value={form.features_kg} placeholder="Ар бир функцияны жаңы сапка" onChange={(e) => update('features_kg', e.target.value)} /></AdminField>
        <AdminField label="Функции RU"><textarea rows="4" value={form.features_ru} placeholder="Каждая функция с новой строки" onChange={(e) => update('features_ru', e.target.value)} /></AdminField>
        <AdminField label="Технологиялар"><input value={form.technologies} placeholder="React, Vite, Supabase" onChange={(e) => update('technologies', e.target.value)} /></AdminField>
        <AdminField label="Категория"><select value={form.category} onChange={(e) => update('category', e.target.value)}><option value="business">Business</option><option value="events">Events</option><option value="personal">Personal</option><option value="interactive">Interactive</option></select></AdminField>
        <AdminField label="Slug"><input value={form.slug} onChange={(e) => update('slug', e.target.value.replace(/\s+/g, '-').toLowerCase())} /></AdminField>
        <AdminField label="Ирети"><input type="number" min="1" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} /></AdminField>
        <AdminField label="Demo шилтеме"><input type="url" value={form.demo_url || ''} onChange={(e) => update('demo_url', e.target.value)} /></AdminField>
        <AdminField label="Обзор видео"><input type="url" value={form.video_url || ''} onChange={(e) => update('video_url', e.target.value)} /></AdminField>
        <AdminField label="Cover URL"><input type="url" value={form.image_url || ''} onChange={(e) => update('image_url', e.target.value)} /></AdminField>
        <AdminField label="Же cover файл"><input type="file" accept="image/*" disabled={uploading} onChange={(e) => uploadCover(e.target.files?.[0])} /><small>{uploading ? 'Жүктөлүүдө...' : 'Supabase Storage колдонулат.'}</small></AdminField>
        <label className="admin-check wide"><input type="checkbox" checked={form.active !== false} onChange={(e) => update('active', e.target.checked)} /> Сайтта көрсөтүү</label>
      </div>
      {form.image_url && <div className="admin-media-preview"><img src={form.image_url} alt="Preview" /></div>}
      <div className="admin-form-actions"><button type="button" className="admin-secondary" onClick={onCancel}>Жокко чыгаруу</button><button className="admin-primary" disabled={busy}>{busy ? 'Сакталууда...' : 'Сактоо'}</button></div>
    </form>
  )
}

function ContentManager({ settings, setSettings, onSave, busy }) {
  const update = (name, value) => setSettings((current) => ({ ...current, [name]: value }))
  return (
    <section className="admin-card">
      <div className="admin-card-head"><div><h2>Сайттагы негизги маалымат</h2><p>Hero, өзүң жөнүндө жана байланыштарды ушул жерден өзгөрт.</p></div><button className="admin-primary" onClick={onSave} disabled={busy}>{busy ? 'Сакталууда...' : 'Сактоо'}</button></div>
      <div className="admin-section-label">Профиль жана байланыш</div>
      <div className="admin-form-grid">
        <AdminField label="Атың"><input value={settings.developer_name || ''} onChange={(e) => update('developer_name', e.target.value)} /></AdminField>
        <AdminField label="Бренд"><input value={settings.brand || ''} onChange={(e) => update('brand', e.target.value)} /></AdminField>
        <AdminField label="Телефон"><input value={settings.phone || ''} onChange={(e) => update('phone', e.target.value)} /></AdminField>
        <AdminField label="WhatsApp номер"><input value={settings.whatsapp || ''} placeholder="996555123456" onChange={(e) => update('whatsapp', e.target.value)} /><small>+ жана боштук болбосо жакшы.</small></AdminField>
        <AdminField label="Email"><input type="email" value={settings.email || ''} onChange={(e) => update('email', e.target.value)} /></AdminField>
        <AdminField label="Жайгашкан жер KG"><input value={settings.location_kg || ''} onChange={(e) => update('location_kg', e.target.value)} /></AdminField>
        <AdminField label="Местоположение RU"><input value={settings.location_ru || ''} onChange={(e) => update('location_ru', e.target.value)} /></AdminField>
      </div>
      <div className="admin-section-label">Биринчи экран</div>
      <div className="admin-form-grid">
        <AdminField label="Башкы заголовок KG" wide><textarea rows="3" value={settings.hero_title_kg || ''} onChange={(e) => update('hero_title_kg', e.target.value)} /></AdminField>
        <AdminField label="Главный заголовок RU" wide><textarea rows="3" value={settings.hero_title_ru || ''} onChange={(e) => update('hero_title_ru', e.target.value)} /></AdminField>
        <AdminField label="Түшүндүрмө KG" wide><textarea rows="3" value={settings.hero_subtitle_kg || ''} onChange={(e) => update('hero_subtitle_kg', e.target.value)} /></AdminField>
        <AdminField label="Описание RU" wide><textarea rows="3" value={settings.hero_subtitle_ru || ''} onChange={(e) => update('hero_subtitle_ru', e.target.value)} /></AdminField>
      </div>
      <div className="admin-section-label">Мен жөнүндө</div>
      <div className="admin-form-grid">
        <AdminField label="Заголовок KG" wide><input value={settings.about_title_kg || ''} onChange={(e) => update('about_title_kg', e.target.value)} /></AdminField>
        <AdminField label="Заголовок RU" wide><input value={settings.about_title_ru || ''} onChange={(e) => update('about_title_ru', e.target.value)} /></AdminField>
        <AdminField label="Текст KG" wide><textarea rows="5" value={settings.about_text_kg || ''} onChange={(e) => update('about_text_kg', e.target.value)} /></AdminField>
        <AdminField label="Текст RU" wide><textarea rows="5" value={settings.about_text_ru || ''} onChange={(e) => update('about_text_ru', e.target.value)} /></AdminField>
        <AdminField label="Максат KG" wide><textarea rows="3" value={settings.mission_kg || ''} onChange={(e) => update('mission_kg', e.target.value)} /></AdminField>
        <AdminField label="Цель RU" wide><textarea rows="3" value={settings.mission_ru || ''} onChange={(e) => update('mission_ru', e.target.value)} /></AdminField>
      </div>
    </section>
  )
}

function MediaManager({ settings, setSettings, flash }) {
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const update = (name, value) => setSettings((current) => ({ ...current, [name]: value }))
  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    try { update('music_url', await uploadSiteMedia(file, 'music')); flash('Музыка жүктөлдү. Эми “Сактоо” басыңыз.') }
    catch (error) { console.error(error); flash('Файл upload үчүн Supabase туташтыруу керек.') }
    finally { setUploading(false) }
  }
  const save = async () => {
    setBusy(true)
    try { setSettings(await saveSiteSettings(settings)); flash('Музыка настройкасы сакталды.') }
    catch (error) { console.error(error); flash('Сактоодо ката чыкты.') }
    finally { setBusy(false) }
  }
  return (
    <section className="admin-card">
      <div className="admin-card-head"><div><h2>Сайт музыкасы</h2><p>Кааласаң фон музыка кош. Browser эрежесинен улам музыка автоматтык башталбайт — посетитель Play басат.</p></div></div>
      <div className="admin-form-grid">
        <AdminField label="Музыка URL" wide><input type="url" value={settings.music_url || ''} placeholder="https://...mp3" onChange={(e) => update('music_url', e.target.value)} /></AdminField>
        <AdminField label="Же аудио файл" wide><input type="file" accept="audio/*" disabled={uploading} onChange={(e) => upload(e.target.files?.[0])} /><small>{uploading ? 'Жүктөлүүдө...' : 'MP3/M4A сыяктуу файл. Supabase Storage керек.'}</small></AdminField>
        <label className="admin-check wide"><input type="checkbox" checked={Boolean(settings.music_enabled)} onChange={(e) => update('music_enabled', e.target.checked)} /> Музыка баскычын сайтта көрсөтүү</label>
      </div>
      {settings.music_url && <audio className="admin-audio" controls src={settings.music_url} />}
      <div className="admin-form-actions"><button className="admin-primary" onClick={save} disabled={busy}>{busy ? 'Сакталууда...' : 'Сактоо'}</button></div>
    </section>
  )
}

function SecurityManager({ flash, onReset }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const change = async (event) => {
    event.preventDefault()
    if (password.length < 10) return flash('Пароль минимум 10 символ болсун.')
    if (password !== confirm) return flash('Паролдор дал келбейт.')
    setBusy(true)
    try { await changeAdminPassword(password); setPassword(''); setConfirm(''); flash('Пароль жаңыртылды.') }
    catch (error) { console.error(error); flash('Пароль өзгөртүү Supabase режиминде иштейт.') }
    finally { setBusy(false) }
  }
  return (
    <>
      <form className="admin-card" onSubmit={change}>
        <div className="admin-card-head"><div><h2>Админ пароль</h2><p>Пароль коддун ичинде сакталбайт. Live режимде Supabase Auth аркылуу жаңыланат.</p></div></div>
        <div className="admin-form-grid">
          <AdminField label="Жаңы пароль"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></AdminField>
          <AdminField label="Кайра жазыңыз"><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></AdminField>
        </div>
        <div className="admin-form-actions"><button className="admin-primary" disabled={busy}>{busy ? 'Жаңыланууда...' : 'Парольду жаңылоо'}</button></div>
      </form>
      {!isSupabaseConfigured && <section className="admin-card danger-zone"><h2>Local demo тазалоо</h2><p>Ушул браузердеги тесттик өзгөртүүлөрдү баштапкы абалга кайтарат.</p><button className="admin-danger-button" onClick={onReset}>Local маалыматты тазалоо</button></section>}
    </>
  )
}

function AdminShell({ children }) { return <div className="admin-shell">{children}</div> }
function AdminNav({ active, onClick, children }) { return <button className={active ? 'active' : ''} onClick={onClick}>{children}</button> }
function Stat({ label, value }) { return <article className="admin-stat"><span>{label}</span><strong>{value}</strong></article> }
function AdminField({ label, wide, children }) { return <label className={`admin-field ${wide ? 'wide' : ''}`}><span>{label}</span>{children}</label> }
function adminTitle(tab) { return ({ dashboard: 'Обзор', services: 'Кызматтар', projects: 'Проекттер', content: 'Сайт маалыматы', media: 'Музыка жана медиа', security: 'Коопсуздук' })[tab] }
