
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
      // Add a small delay to make sure DOM is fully loaded
      const images = document.querySelectorAll('img');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
              // Apply cache busting with more unique timestamp
              const uniqueTimestamp = Date.now() + Math.random().toString(36).substring(2);
              const newSrc = src.includes('?') 
                ? `${src.split('?')[0]}?v=${uniqueTimestamp}`
                : `${src}?v=${uniqueTimestamp}`;
              img.setAttribute('src', newSrc);
            }
          }
        });
      }, {
        rootMargin: '200px' // Start loading before they come into view
      });
      
      images.forEach(img => observer.observe(img));
      
      return () => observer.disconnect();
    };
    
    refreshImages();
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
