
import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { useEffect, useRef } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Apply cache busting only once when the layout first loads
  useEffect(() => {
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create a more efficient intersection observer to load images properly
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('src');
          
          // Only add cache busting for Supabase URLs that don't already have it
          if (src && src.includes('supabase') && !src.includes('v=')) {
            const baseUrl = src.includes('?') ? src.split('?')[0] : src;
            const cacheBuster = `?v=${Date.now()}`;
            img.setAttribute('src', `${baseUrl}${cacheBuster}`);
          }
          
          // Stop observing after handling the image
          observerRef.current?.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px',
      threshold: 0.1
    });
    
    // Start observing all images
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        observerRef.current?.observe(img);
      }
    });
    
    // Disconnect the observer when the component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
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
