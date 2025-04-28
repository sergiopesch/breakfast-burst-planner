
import React, { useState, useEffect, useCallback } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface ImageLoaderProps {
  src: string | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackClassName = "h-full w-full flex items-center justify-center bg-gray-100",
  loadingComponent,
  errorComponent
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  // Handle image cache busting in a memoized function
  const prepareSrc = useCallback((url: string | undefined): string | undefined => {
    if (!url) return undefined;
    
    // Only add cache busting for Supabase URLs that don't already have it
    const needsCacheBuster = url.includes('supabase') && 
                           !url.startsWith('blob:') && 
                           !url.startsWith('data:') && 
                           !url.includes('v=');
    
    if (needsCacheBuster) {
      const baseUrl = url.includes('?') ? url.split('?')[0] : url;
      const cacheBuster = `?v=${Date.now()}`;
      return `${baseUrl}${cacheBuster}`;
    }
    
    return url;
  }, []);

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    // Reset states when src changes
    setLoading(true);
    setError(false);
    
    const processedSrc = prepareSrc(src);
    setImageSrc(processedSrc);

    // Preload the image
    const img = new Image();
    img.src = processedSrc || '';
    
    const handleLoad = () => setLoading(false);
    const handleError = () => {
      console.error(`Failed to load image: ${src}`);
      setError(true);
      setLoading(false);
    };
    
    img.onload = handleLoad;
    img.onerror = handleError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, prepareSrc]);

  if (error) {
    return (
      <div className={fallbackClassName} role="img" aria-label={`${alt} image not available`}>
        {errorComponent || (
          <div className="flex flex-col items-center text-gray-400">
            <ImageOff className="h-10 w-10 mb-2" />
            <p className="text-sm">Image not available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={fallbackClassName} role="presentation">
          {loadingComponent || (
            <div className="flex flex-col items-center text-gray-400">
              <Loader2 className="h-10 w-10 animate-spin mb-2" />
              <p className="text-sm">Loading...</p>
            </div>
          )}
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : ''}`}
        loading="lazy"
        decoding="async"
        crossOrigin="anonymous"
      />
    </>
  );
};

export default ImageLoader;
