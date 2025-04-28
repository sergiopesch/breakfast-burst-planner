
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Your Supabase project credentials
// Replace these with your actual Supabase project URL and anon key from your Supabase dashboard
const projectUrl = 'https://nwnrgctxzqunasquaarl.supabase.co';
const projectAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bnJnY3R4enF1bmFzcXVhYXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzU5MDEsImV4cCI6MjA2MTQ1MTkwMX0.7Ju-S6kWf31BIEHayJh_H85p-TDaSlZ4Hhcb-oMw4lY';

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
