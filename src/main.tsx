
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add more aggressive cache busting timestamp with random component
const cacheBuster = `?v=${Date.now()}_${Math.random().toString(36).substring(2)}`;

// Apply cache busting to any dynamic resources
if ('serviceWorker' in navigator) {
  // Unregister all service workers to prevent caching
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// Force reload of all style sheets by adding timestamp
const refreshStyles = () => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    const href = link.getAttribute('href')?.split('?')[0] || '';
    link.setAttribute('href', `${href}${cacheBuster}`);
  });
};

// Force reload of all scripts by adding timestamp
const refreshScripts = () => {
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    const src = script.getAttribute('src')?.split('?')[0] || '';
    if (!src.includes('gptengineer.js')) { // Don't modify the GPT Engineer script
      script.setAttribute('src', `${src}${cacheBuster}`);
    }
  });
};

// Force reload of all images by adding timestamp
const refreshImages = () => {
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    const src = img.getAttribute('src')?.split('?')[0] || '';
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      // Use unique timestamp for each image
      const uniqueTimestamp = `?v=${Date.now()}_${Math.random().toString(36).substring(2)}`;
      img.setAttribute('src', `${src}${uniqueTimestamp}`);
    }
  });
};

// Clear browser cache for static assets
const clearCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
      console.log('All caches cleared successfully');
    } catch (err) {
      console.error('Failed to clear caches:', err);
    }
  }
};

// Call cache clearing and refresh functions
clearCache().then(() => {
  refreshStyles();
  refreshScripts();
  refreshImages();
  
  console.log('Aggressive cache busting applied to all resources');
});

// Create the React root and render the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element not found");
}

// Add event listener to reload the page if it's been loaded from cache
window.addEventListener('load', () => {
  if (performance.navigation.type === 1) {
    // This is a refresh, no need to force reload
    console.log('Page is being refreshed naturally');
    // Still refresh images to ensure they're up to date
    setTimeout(refreshImages, 500);
  } else {
    // Check if the page might be loaded from cache
    const lastLoadTime = sessionStorage.getItem('lastLoadTime');
    const currentTime = Date.now();
    
    if (lastLoadTime) {
      // Force image refresh regardless
      setTimeout(refreshImages, 300);
      
      if ((currentTime - parseInt(lastLoadTime, 10)) > 60000) { // 1 minute
        console.log('Forcing a hard reload to clear cache');
        sessionStorage.setItem('lastLoadTime', currentTime.toString());
        window.location.reload();
      } else {
        sessionStorage.setItem('lastLoadTime', currentTime.toString());
      }
    } else {
      sessionStorage.setItem('lastLoadTime', currentTime.toString());
    }
  }
});
