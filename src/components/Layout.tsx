
import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Force refresh images on first load to prevent stale images
  useEffect(() => {
    const refreshImages = () => {
      const images = document.querySelectorAll('img');
      
      // Create a more efficient intersection observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
              // Only refresh Supabase URLs to avoid unnecessary refreshes
              if (src.includes('supabase') && !src.includes('v=')) {
                const timestamp = Date.now();
                const uniqueId = Math.random().toString(36).substring(7);
                const cacheBuster = `v=${timestamp}_${uniqueId}`;
                
                const newSrc = src.includes('?') 
                  ? `${src.split('?')[0]}?${cacheBuster}`
                  : `${src}?${cacheBuster}`;
                
                img.setAttribute('src', newSrc);
              }
            }
          }
        });
      }, {
        rootMargin: '200px', // Start loading before they come into view
        threshold: 0.1
      });
      
      images.forEach(img => observer.observe(img));
      
      return () => observer.disconnect();
    };
    
    // Run immediately and then after a delay to catch any late-loaded images
    refreshImages();
    const timeoutId = setTimeout(refreshImages, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
