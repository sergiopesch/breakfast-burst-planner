
import { createClient } from '@supabase/supabase-js';

// Your Supabase project credentials
// These are the actual credentials from your Supabase dashboard
const projectUrl = 'https://nwnrgctxzqunasquaarl.supabase.co';
const projectAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bnJnY3R4enF1bmFzcXVhYXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzU5MDEsImV4cCI6MjA2MTQ1MTkwMX0.7Ju-S6kWf31BIEHayJh_H85p-TDaSlZ4Hhcb-oMw4lY';

// Create the Supabase client
export const supabase = createClient(projectUrl, projectAnonKey);

// Log connection info
console.log('Supabase client initialized');

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
