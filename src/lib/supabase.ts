
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to direct values if environment variables are not set
// You'll need to replace these with your actual Supabase project values
const fallbackUrl = 'https://your-supabase-project-url.supabase.co';
const fallbackKey = 'your-supabase-anon-key';

// Use environment variables if available, otherwise use fallbacks
const url = supabaseUrl || fallbackUrl;
const key = supabaseAnonKey || fallbackKey;

export const supabase = createClient(url, key);

// Helper function for handling errors in Supabase operations
export const handleSupabaseError = (error: any, toast?: any) => {
  console.error('Supabase error:', error);
  if (toast) {
    toast({
      title: "Error",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
  }
  return error;
};
