
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Perform one-time cache busting and optimization
const optimizeImages = () => {
  // Clear browser cache for image resources only
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        if (cacheName.includes('image')) {
          caches.delete(cacheName);
        }
      });
      console.log('Image caches cleared');
    }).catch(err => {
      console.error('Failed to clear caches:', err);
    });
  }

  // Unregister service workers to prevent caching issues
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }

  // Add listener for image errors that will reload with cache busting
  document.addEventListener('error', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      const src = img.getAttribute('src');
      
      if (src && src.includes('supabase') && !src.includes('v=')) {
        const baseUrl = src.includes('?') ? src.split('?')[0] : src;
        const cacheBuster = `?v=${Date.now()}`;
        img.setAttribute('src', `${baseUrl}${cacheBuster}`);
      }
    }
  }, true);
};

// Run optimizations once
optimizeImages();

// Create the React root and render the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element not found");
}
