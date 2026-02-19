import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null = url && anonKey
  ? createClient(url, anonKey)
  : null

if (!supabase) {
  // App is configured to use the backend (Render Postgres). Supabase client is optional.
  console.warn('Supabase client not created — VITE_SUPABASE_* not set. Frontend will use backend API.')
}
