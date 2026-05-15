import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are placeholders or missing
export const isSupabaseConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseAnonKey) && 
  supabaseUrl !== 'your-project-url.supabase.co' &&
  !supabaseUrl.includes('placeholder');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
