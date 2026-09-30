import { defaultServices, defaultSettings } from '../data/cmsDefaults'
import { defaultPortfolioProjects } from '../data/cmsProjects'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const SETTINGS_KEY = 'nurislam-site-settings'
const SERVICES_KEY = 'nurislam-site-services'
const PROJECTS_KEY = 'nurislam-site-projects'

const readLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export async function getSiteSettings() {
  if (!isSupabaseConfigured) return readLocal(SETTINGS_KEY, defaultSettings)
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  return data ? { ...defaultSettings, ...data } : defaultSettings
}

export async function saveSiteSettings(settings) {
  const payload = { ...settings, id: 1, updated_at: new Date().toISOString() }
  if (!isSupabaseConfigured) {
    writeLocal(SETTINGS_KEY, payload)
    return payload
  }
  const { data, error } = await supabase.from('site_settings').upsert(payload).select().single()
  if (error) throw error
  return data
}

export async function getCmsServices({ includeInactive = false } = {}) {
  if (!isSupabaseConfigured) {
    const data = readLocal(SERVICES_KEY, defaultServices)
    return includeInactive ? data : data.filter((item) => item.active !== false)
  }
  let query = supabase.from('services').select('*').order('sort_order', { ascending: true })
  if (!includeInactive) query = query.eq('active', true)
  const { data, error } = await query
  if (error) throw error
  return data?.length ? data : defaultServices
}

export async function saveCmsService(service) {
  const normalized = {
    ...service,
    id: service.id || crypto.randomUUID(),
    slug: service.slug || `service-${Date.now()}`,
    sort_order: Number(service.sort_order || 99),
    active: service.active !== false,
    updated_at: new Date().toISOString()
  }

  if (!isSupabaseConfigured) {
    const list = readLocal(SERVICES_KEY, defaultServices)
    const index = list.findIndex((item) => item.id === normalized.id)
    if (index >= 0) list[index] = normalized
    else list.push(normalized)
    writeLocal(SERVICES_KEY, list.sort((a, b) => a.sort_order - b.sort_order))
    return normalized
  }

  const { data, error } = await supabase.from('services').upsert(normalized).select().single()
  if (error) throw error
  return data
}

export async function deleteCmsService(id) {
  if (!isSupabaseConfigured) {
    const list = readLocal(SERVICES_KEY, defaultServices).filter((item) => item.id !== id)
    writeLocal(SERVICES_KEY, list)
    return
  }
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}

export async function uploadSiteMedia(file, folder = 'general') {
  if (!isSupabaseConfigured) throw new Error('SUPABASE_REQUIRED_FOR_UPLOAD')
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${folder}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from('site-media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined
  })
  if (error) throw error
  return supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl
}

export function resetLocalCms() {
  localStorage.removeItem(SETTINGS_KEY)
  localStorage.removeItem(SERVICES_KEY)
  localStorage.removeItem(PROJECTS_KEY)
}

// Portfolio projects ---------------------------------------------------------

export async function getCmsProjects({ includeInactive = false } = {}) {
  if (!isSupabaseConfigured) {
    const data = readLocal(PROJECTS_KEY, defaultPortfolioProjects)
    return includeInactive ? data : data.filter((item) => item.active !== false)
  }
  let query = supabase.from('portfolio_projects').select('*').order('sort_order', { ascending: true })
  if (!includeInactive) query = query.eq('active', true)
  const { data, error } = await query
  if (error) throw error
  return data?.length ? data : defaultPortfolioProjects
}

export async function getCmsProjectById(id) {
  if (!isSupabaseConfigured) {
    const project = readLocal(PROJECTS_KEY, defaultPortfolioProjects).find((item) => item.id === id || item.slug === id)
    if (!project) throw new Error('PROJECT_NOT_FOUND')
    return project
  }
  const { data, error } = await supabase.from('portfolio_projects').select('*').eq('slug', id).eq('active', true).maybeSingle()
  if (error) throw error
  if (!data) throw new Error('PROJECT_NOT_FOUND')
  return data
}

export async function saveCmsProject(project) {
  const normalized = {
    ...project,
    id: project.id || crypto.randomUUID(),
    slug: project.slug || `project-${Date.now()}`,
    sort_order: Number(project.sort_order || 99),
    active: project.active !== false,
    updated_at: new Date().toISOString()
  }
  if (!isSupabaseConfigured) {
    const list = readLocal(PROJECTS_KEY, defaultPortfolioProjects)
    const index = list.findIndex((item) => item.id === normalized.id)
    if (index >= 0) list[index] = normalized
    else list.push(normalized)
    writeLocal(PROJECTS_KEY, list.sort((a, b) => a.sort_order - b.sort_order))
    return normalized
  }
  const { data, error } = await supabase.from('portfolio_projects').upsert(normalized).select().single()
  if (error) throw error
  return data
}

export async function deleteCmsProject(id) {
  if (!isSupabaseConfigured) {
    const list = readLocal(PROJECTS_KEY, defaultPortfolioProjects).filter((item) => item.id !== id)
    writeLocal(PROJECTS_KEY, list)
    return
  }
  const { error } = await supabase.from('portfolio_projects').delete().eq('id', id)
  if (error) throw error
}
