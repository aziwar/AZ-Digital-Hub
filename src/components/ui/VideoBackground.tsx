'use client';

import React, { useRef, useEffect, useState } from 'react';

interface VideoBackgroundProps {
  mp4Src: string;
  webmSrc?: string;
  posterSrc: string;
  className?: string;
  overlay?: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  mp4Src,
  webmSrc,
  posterSrc,
  className = '',
  overlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Only show video on desktop (>768px) and if user doesn't prefer reduced motion
    const isDesktop = window.innerWidth > 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isDesktop && !prefersReducedMotion) {
      setShowVideo(true);
    }
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Poster image (always loads - shown on mobile & as fallback) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover ${showVideo ? 'hidden' : 'block'}`}
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
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  mp4Src,
  posterSrc,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Auto-play on desktop
          if (window.innerWidth > 768 && videoRef.current) {
            videoRef.current.play().catch(() => {
              // Autoplay blocked - user will need to tap
            });
            setIsPlaying(true);
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
      aria-label={isPlaying ? 'Pause video' : 'Play video'}
    >
      {/* Poster */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt="Services showcase"
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
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white ms-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
