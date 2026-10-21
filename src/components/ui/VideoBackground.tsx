'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';

interface VideoBackgroundProps {
  mp4Src: string;
  webmSrc?: string;
  posterSrc: string;
  className?: string;
  overlay?: boolean;
}

const noopSubscribe = () => () => {};

// Only show video on desktop (>768px) and if user doesn't prefer reduced motion
const shouldShowVideo = () =>
  window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  mp4Src,
  webmSrc,
  posterSrc,
  className = '',
  overlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Decided once after hydration (server snapshot is false), like the previous mount effect
  const showVideo = useSyncExternalStore(noopSubscribe, shouldShowVideo, () => false);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Poster image (always loads - shown on mobile & as fallback). It is the LCP element,
          so it is server-rendered with high fetch priority and a viewport-sized variant. */}
      <Image
        src={posterSrc}
        alt=""
        aria-hidden="true"
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
        quality={70}
        className={`object-cover ${showVideo ? 'hidden' : 'block'}`}
      />

      {/* Video (desktop only, respects reduced-motion) */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={posterSrc}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for text readability */}
      {overlay && (
        <div className="absolute inset-0 bg-slate-900/60" />
      )}
    </div>
  );
};

interface LazyVideoProps {
  mp4Src: string;
  posterSrc: string;
  className?: string;
  labels: { playVideo: string; pauseVideo: string; videoPoster: string };
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  mp4Src,
  posterSrc,
  className = '',
  labels,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const t = (key: keyof LazyVideoProps['labels']) => labels[key];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Auto-play on desktop
          if (window.innerWidth > 768 && videoRef.current) {
            videoRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              // Autoplay blocked - user will need to tap
              setIsPlaying(false);
            });
          }
        } else if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTapToPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden cursor-pointer group ${className}`}
      onClick={handleTapToPlay}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTapToPlay(); }}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? t('pauseVideo') : t('playVideo')}
    >
      {/* Poster: a responsive variant instead of the 1920x1080 original (the container is at most
          max-w-4xl = 896px wide, minus the section's 16px side padding on small screens) */}
      <Image
        src={posterSrc}
        alt={t('videoPoster')}
        width={1920}
        height={1080}
        loading="lazy"
        sizes="(min-width: 928px) 896px, calc(100vw - 32px)"
        className={`w-full aspect-video object-cover ${isVisible && isPlaying ? 'hidden' : 'block'}`}
      />

      {/* Video (lazy-loaded) */}
      {isVisible && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          className={`w-full aspect-video object-cover ${isPlaying ? 'block' : 'hidden'}`}
          poster={posterSrc}
        >
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}

      {/* Play button overlay (mobile) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white ms-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
