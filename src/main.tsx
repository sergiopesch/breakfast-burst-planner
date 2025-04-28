
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add cache busting timestamp to prevent stale cache issues
const cacheBuster = `?v=${Date.now()}`;

// Apply cache busting to any dynamic resources if needed
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// Force reload of styles by adding a timestamp
const refreshStyles = () => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    const href = link.getAttribute('href')?.split('?')[0] || '';
    link.setAttribute('href', `${href}${cacheBuster}`);
  });
};

// Call the refresh function
refreshStyles();

// Create the React root and render the app
createRoot(document.getElementById("root")!).render(<App />);
