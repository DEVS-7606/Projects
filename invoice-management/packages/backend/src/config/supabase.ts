import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const supabaseUrl = env.supabaseUrl || 'https://placeholder.supabase.co';
const supabaseKey = env.supabaseServiceRoleKey || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured =
  env.supabaseUrl !== '' &&
  env.supabaseServiceRoleKey !== '' &&
  env.supabaseUrl !== 'https://placeholder.supabase.co';
