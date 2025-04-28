
import React, { useEffect } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Force refresh images on first load to prevent stale images
  useEffect(() => {
    // Add a small delay to make sure DOM is fully loaded
    const refreshTimer = setTimeout(() => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Only refresh if the image has a src and it's not a data URI or blob
        const src = img.getAttribute('src');
        if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
          // Apply cache busting with more unique timestamp
          const uniqueTimestamp = Date.now() + Math.random().toString(36).substring(2);
          const newSrc = src.includes('?') 
            ? `${src.split('?')[0]}?v=${uniqueTimestamp}`
            : `${src}?v=${uniqueTimestamp}`;
          img.setAttribute('src', newSrc);
        }
      });
    }, 100); // Reduced delay for faster loading
    
    return () => clearTimeout(refreshTimer);
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
