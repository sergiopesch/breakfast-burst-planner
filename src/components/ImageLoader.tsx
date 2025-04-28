
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    // Reset states when src changes
    setLoading(true);
    setError(false);

    // Only add cache busting for Supabase URLs that don't already have it
    const needsCacheBuster = src.includes('supabase') && 
                            !src.startsWith('blob:') && 
                            !src.startsWith('data:') && 
                            !src.includes('v=');
    
    if (needsCacheBuster) {
      const baseUrl = src.includes('?') ? src.split('?')[0] : src;
      const cacheBuster = `?v=${Date.now()}`;
      setImageSrc(`${baseUrl}${cacheBuster}`);
    } else {
      setImageSrc(src);
    }

    // Preload the image
    const img = new Image();
    img.src = needsCacheBuster ? `${src.includes('?') ? src.split('?')[0] : src}?v=${Date.now()}` : src;
    img.onload = () => setLoading(false);
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setError(true);
      setLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

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
