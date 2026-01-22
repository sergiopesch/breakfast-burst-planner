
import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoHeroProps {
  videoSrc?: string;
  posterSrc?: string;
  fallbackImageSrc?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
  parallax?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  className?: string;
  height?: string;
}

// High-quality breakfast video from a CDN (using a royalty-free video)
const DEFAULT_VIDEO = 'https://videos.pexels.com/video-files/5718691/5718691-hd_1920_1080_30fps.mp4';
const DEFAULT_POSTER = 'https://images.pexels.com/videos/5718691/pexels-photo-5718691.jpeg?auto=compress&cs=tinysrgb&w=1260';

const VideoHero: React.FC<VideoHeroProps> = ({
  videoSrc = DEFAULT_VIDEO,
  posterSrc = DEFAULT_POSTER,
  fallbackImageSrc,
  children,
  overlay = true,
  overlayOpacity = 0.4,
  parallax = true,
  autoPlay = true,
  loop = true,
  muted: initialMuted = true,
  showControls = false,
  className = '',
  height = 'h-[90vh]',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, parallax ? 150 : 0]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${height} w-full overflow-hidden ${className}`}
    >
      {/* Video/Image Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        {!hasError ? (
          <>
            {/* Poster image while video loads */}
            {!isLoaded && posterSrc && (
              <img
                src={posterSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Video */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay={autoPlay}
              loop={loop}
              muted={isMuted}
              playsInline
              poster={posterSrc}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </>
        ) : (
          /* Fallback image on error */
          <img
            src={fallbackImageSrc || posterSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Overlay */}
        {overlay && (
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background"
            style={{ opacity: overlayOpacity }}
          />
        )}

        {/* Additional gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>

      {/* Video Controls */}
      {showControls && !hasError && (
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm text-white hover:bg-background/40 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm text-white hover:bg-background/40 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 rounded-full bg-foreground/50"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default VideoHero;
