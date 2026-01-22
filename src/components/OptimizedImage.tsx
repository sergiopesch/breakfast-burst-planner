
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Generate a tiny blur placeholder
const generateBlurPlaceholder = (color: string = '#e5e5e5') => {
  return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><filter id="b" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="20"/></filter><rect width="100%" height="100%" fill="${encodeURIComponent(color)}"/><rect width="100%" height="100%" filter="url(%23b)" fill="${encodeURIComponent(color)}"/></svg>`;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  fill = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const prepareSrc = useCallback((url: string | undefined): string | undefined => {
    if (!url) return undefined;

    // Add cache busting for Supabase URLs
    const needsCacheBuster = url.includes('supabase') &&
                           !url.startsWith('blob:') &&
                           !url.startsWith('data:') &&
                           !url.includes('v=');

    if (needsCacheBuster) {
      const baseUrl = url.includes('?') ? url.split('?')[0] : url;
      return `${baseUrl}?v=${Date.now()}`;
    }

    return url;
  }, []);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    setIsLoaded(false);
    setHasError(false);

    const processedSrc = prepareSrc(src);

    // Priority images load immediately
    if (priority) {
      setImageSrc(processedSrc);
      return;
    }

    // Use Intersection Observer for lazy loading
    if (imgRef.current && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(processedSrc);
              observerRef.current?.disconnect();
            }
          });
        },
        { rootMargin: '200px', threshold: 0.01 }
      );

      observerRef.current.observe(imgRef.current);
    } else {
      setImageSrc(processedSrc);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority, prepareSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const placeholderSrc = blurDataURL || generateBlurPlaceholder('#f5f0eb');

  if (hasError) {
    return (
      <div
        className={`${containerClassName || className} flex items-center justify-center bg-secondary`}
        role="img"
        aria-label={`${alt} - image not available`}
      >
        <div className="flex flex-col items-center text-muted-foreground/40">
          <ImageOff className="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`${containerClassName} relative overflow-hidden ${fill ? 'absolute inset-0' : ''}`}
    >
      {/* Blur placeholder */}
      <AnimatePresence>
        {placeholder === 'blur' && !isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={placeholderSrc}
              alt=""
              className={`${className} blur-xl scale-110`}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main image */}
      {imageSrc && (
        <motion.img
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoaded ? '' : 'opacity-0'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Loading shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 shimmer" />
      )}
    </div>
  );
};

export default OptimizedImage;

// Also export as ImageLoader for backwards compatibility
export { OptimizedImage as ImageLoader };
