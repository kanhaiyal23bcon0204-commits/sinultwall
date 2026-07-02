// src/lib/supabase.ts
/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// .env file se keys le rahe hain
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase keys missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);