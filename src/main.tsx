
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimize cache busting with a single-time operation on load
const refreshResources = () => {
  const cacheBuster = `?v=${Date.now()}_${Math.random().toString(36).substring(2)}`;

  // Clear browser cache for static assets
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => caches.delete(cacheName));
      console.log('All caches cleared successfully');
    }).catch(err => {
      console.error('Failed to clear caches:', err);
    });
  }

  // Force reload of all style sheets
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute('href')?.split('?')[0] || '';
    link.setAttribute('href', `${href}${cacheBuster}`);
  });

  // Force reload of all scripts (except GPT Engineer script)
  document.querySelectorAll('script[src]').forEach(script => {
    const src = script.getAttribute('src')?.split('?')[0] || '';
    if (!src.includes('gptengineer.js')) {
      script.setAttribute('src', `${src}${cacheBuster}`);
    }
  });

  console.log('Cache busting applied to static resources');
};

// Run cache busting on initial load
refreshResources();

// Unregister service workers to prevent caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
    console.log('Service workers unregistered');
  });
}

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
  if (performance.navigation.type === 1) {
    // This is a refresh, refresh images but don't force reload
    console.log('Page is being refreshed naturally');
  } else {
    // Store last load time in session storage
    const lastLoadTime = sessionStorage.getItem('lastLoadTime');
    const currentTime = Date.now();
    
    sessionStorage.setItem('lastLoadTime', currentTime.toString());
    
    if (lastLoadTime && (currentTime - parseInt(lastLoadTime, 10)) > 300000) { // 5 minutes
      console.log('Session is old, forcing reload for fresh content');
      window.location.reload();
    }
  }
});
