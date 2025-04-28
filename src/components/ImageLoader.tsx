
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

    // Add cache busting
    const cacheBuster = `?v=${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const processedSrc = src.includes('?') 
      ? `${src.split('?')[0]}${cacheBuster}`
      : `${src}${cacheBuster}`;

    setImageSrc(processedSrc);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
    setLoading(false);
  };

  if (error) {
    return (
      <div className={fallbackClassName}>
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
        <div className={fallbackClassName}>
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
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </>
  );
};

export default ImageLoader;
