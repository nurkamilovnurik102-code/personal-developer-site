import { isSupabaseConfigured, supabase } from '../lib/supabase'

const LOCAL_SESSION_KEY = 'nurislam-admin-local-session'

async function verifyAdminSession(session) {
  if (!session) return null
  const { data, error } = await supabase.rpc('is_site_admin')
  if (error || !data) {
    await supabase.auth.signOut()
    return null
  }
  return session
}

export async function getAdminSession() {
  if (!isSupabaseConfigured) return sessionStorage.getItem(LOCAL_SESSION_KEY) === '1' ? { local: true } : null
  const { data } = await supabase.auth.getSession()
  return verifyAdminSession(data.session)
}

export async function signInAdmin(email, password) {
  if (!isSupabaseConfigured) {
    const localPassword = import.meta.env.VITE_LOCAL_ADMIN_PASSWORD
    if (!localPassword || password !== localPassword) throw new Error('INVALID_LOCAL_PASSWORD')
    sessionStorage.setItem(LOCAL_SESSION_KEY, '1')
    return { local: true }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  const session = await verifyAdminSession(data.session)
  if (!session) throw new Error('NOT_SITE_ADMIN')
  return session
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured) {
    sessionStorage.removeItem(LOCAL_SESSION_KEY)
    return
  }
  await supabase.auth.signOut()
}

export async function changeAdminPassword(password) {
  if (!isSupabaseConfigured) throw new Error('SUPABASE_REQUIRED_FOR_PASSWORD_CHANGE')
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}
