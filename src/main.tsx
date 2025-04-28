
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimize cache busting with a single-time operation on load
const refreshResources = () => {
  const cacheBuster = `?v=${Date.now()}_${Math.random().toString(36).substring(2)}`;

  // Clear browser cache for static assets
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        // Only clear image caches
        if (cacheName.includes('image') || cacheName.includes('recipe')) {
          caches.delete(cacheName);
        }
      });
      console.log('Image caches cleared successfully');
    }).catch(err => {
      console.error('Failed to clear caches:', err);
    });
  }

  // Force reload of all style sheets
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute('href')?.split('?')[0] || '';
    link.setAttribute('href', `${href}${cacheBuster}`);
  });

  console.log('Cache busting applied to static resources');
};

// Run cache busting on initial load
refreshResources();

// Unregister service workers to prevent caching issues with images
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
    console.log('Service workers unregistered');
  });
}

// Add a cache-busting header to fetch requests for Supabase image URLs
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
  // Only add cache busting for Supabase image URLs
  if (typeof input === 'string' && 
      input.includes('supabase') && 
      input.includes('recipe-images') && 
      !input.includes('?v=')) {
    const cacheBuster = `v=${Date.now()}_${Math.random().toString(36).substring(7)}`;
    input = input.includes('?') 
      ? `${input}&${cacheBuster}` 
      : `${input}?${cacheBuster}`;
  }
  
  return originalFetch(input, init);
};

// Create the React root and render the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element not found");
}

// Check if page is loaded from cache and force reload if needed
window.addEventListener('load', () => {
  // Add a listener for image errors that will attempt to reload the image with cache busting
  document.addEventListener('error', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      const src = img.getAttribute('src');
      
      if (src && src.includes('supabase') && !src.includes('v=')) {
        console.log('Image failed to load, applying cache busting:', src);
        const cacheBuster = `v=${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const newSrc = src.includes('?') 
          ? `${src.split('?')[0]}?${cacheBuster}` 
          : `${src}?${cacheBuster}`;
          
        img.setAttribute('src', newSrc);
      }
    }
  }, true);
});
