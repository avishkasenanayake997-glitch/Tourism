// ==============================================================================
// Lankora: Supabase Client Configuration
// ==============================================================================

import { safeStorage } from './storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lankora-tourism-demo.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key_for_lankora';

export const isSupabaseConfigured = () => {
  return (
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.EXPO_PUBLIC_SUPABASE_URL?.includes('dummy') &&
    !process.env.EXPO_PUBLIC_SUPABASE_URL?.includes('your-project-ref')
  );
};

const isServer = typeof window === 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: !isServer && Platform.OS === 'web',
  },
});
