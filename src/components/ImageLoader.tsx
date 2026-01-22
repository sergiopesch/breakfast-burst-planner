
import React, { useState, useEffect, useCallback } from 'react';
import { ImageOff, Loader2, UtensilsCrossed } from 'lucide-react';
import { PLACEHOLDER_IMAGE } from '@/utils/recipeGenerator';

interface ImageLoaderProps {
  src: string | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  showPlaceholder?: boolean;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackClassName = "h-full w-full flex items-center justify-center bg-secondary",
  loadingComponent,
  errorComponent,
  showPlaceholder = true
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Handle image URL preparation
  const prepareSrc = useCallback((url: string | undefined): string | undefined => {
    if (!url) return undefined;

    // Don't modify data URLs or blob URLs
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }

    // For Supabase URLs, add cache busting if not present
    if (url.includes('supabase') && !url.includes('v=')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${Date.now()}`;
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
    setRetryCount(0);

    const processedSrc = prepareSrc(src);
    setImageSrc(processedSrc);

    // Preload the image
    const img = new Image();

    const handleLoad = () => {
      setLoading(false);
      setError(false);
    };

    const handleError = () => {
      console.warn(`Failed to load image (attempt ${retryCount + 1}): ${src}`);

      // Retry with different URL format for Unsplash
      if (retryCount < maxRetries && src.includes('unsplash')) {
        setRetryCount(prev => prev + 1);
        // Try without query params or with different format
        const baseUrl = src.split('?')[0];
        setImageSrc(`${baseUrl}?w=480&q=75&fit=crop`);
        return;
      }

      setError(true);
      setLoading(false);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = processedSrc || '';

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, prepareSrc, retryCount]);

  // Show placeholder on error
  if (error) {
    if (showPlaceholder) {
      return (
        <div className={fallbackClassName} role="img" aria-label={`${alt}`}>
          {errorComponent || (
            <div className="flex flex-col items-center justify-center text-muted-foreground/60 p-4">
              <UtensilsCrossed className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs text-center opacity-70">Breakfast</p>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className={fallbackClassName} role="img" aria-label={`${alt} image not available`}>
        {errorComponent || (
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageOff className="h-8 w-8 mb-2" />
            <p className="text-xs">Image unavailable</p>
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
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-xs">Loading...</p>
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
        onError={() => {
          // Fallback if image fails after initial load
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
};

export default ImageLoader;
