/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // Google AI (Gemini) API Key
  readonly VITE_GOOGLE_AI_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;

  // Unsplash API Key
  readonly VITE_UNSPLASH_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
