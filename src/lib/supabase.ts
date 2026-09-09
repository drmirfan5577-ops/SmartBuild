import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Template fetching from backend
export async function fetchTemplatesFromDB() {
  const { data, error } = await supabase
    .from('esw_templates')
    .select('*')
    .order('downloads', { ascending: false })
  
  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }
  return data || []
}

// Save deploy history to backend
export async function saveDeployHistory(entry: {
  project_name: string
  platform: string
  repo_url?: string
  live_url?: string
  status: string
  logs?: string[]
}) {
  const { error } = await supabase
    .from('esw_deploy_history')
    .insert([entry])
  
  if (error) console.error('Error saving deploy history:', error)
}

// Save user custom template
export async function saveUserTemplate(template: {
  name: string
  category: string
  description?: string
  code_content: string
  tags?: string[]
}) {
  const { data, error } = await supabase
    .from('esw_user_templates')
    .insert([template])
    .select()
    .single()
  
  if (error) console.error('Error saving template:', error)
  return data
}
