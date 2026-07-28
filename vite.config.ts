import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const vendorChunks = {
  "react-vendor": ["react", "react-dom", "react-router-dom"],
  "ui-vendor": [
    "framer-motion",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
  ],
  "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
  "date-vendor": ["date-fns"],
  supabase: ["@supabase/supabase-js"],
} as const;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll("\\", "/");

          for (const [chunkName, dependencies] of Object.entries(vendorChunks)) {
            if (
              dependencies.some((dependency) =>
                normalizedId.includes(`/node_modules/${dependency}/`),
              )
            ) {
              return chunkName;
            }
          }

          return undefined;
        },
      },
    },
    // Increase chunk size warning limit slightly
    chunkSizeWarningLimit: 600,
  },
}));
