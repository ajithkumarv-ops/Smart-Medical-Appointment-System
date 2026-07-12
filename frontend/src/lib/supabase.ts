import { createClient } from '@supabase/supabase-js';

// ─── Supabase Client ────────────────────────────────────────────────────────
// Reads credentials from environment variables.
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️  Supabase credentials not found. ' +
    'Copy .env.example to .env and fill in your project URL and anon key.'
  );
}

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseKey  || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession:   true,
      detectSessionInUrl: true,
    },
  }
);

export default supabase;
