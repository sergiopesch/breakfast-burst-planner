
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Your Supabase project credentials
// Replace these with your actual Supabase project URL and anon key from your Supabase dashboard
const projectUrl = 'https://your-actual-project-url.supabase.co';
const projectAnonKey = 'your-actual-anon-key';

// Use environment variables if available, otherwise use direct project credentials
const url = supabaseUrl || projectUrl;
const key = supabaseAnonKey || projectAnonKey;

console.log('Supabase URL:', url);
console.log('Using environment variables:', !!supabaseUrl);

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
