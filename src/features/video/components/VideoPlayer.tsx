
'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onReady?: (player: any) => void;
}

/**
 * A centralized, robust VideoPlayer component for the Dance Realm.
 * Handles initialization, disposal, and source changes to prevent playback errors.
 */
export function VideoPlayer({
  url,
  poster,
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  className,
  onReady,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Wait for the video element to be available
    if (!videoRef.current) return;

    // Initialize Video.js
    const videoElement = videoRef.current;
    const player = playerRef.current = videojs(videoElement, {
      autoplay,
      controls,
      loop,
      muted,
      poster,
      responsive: true,
      fluid: false, // We control sizing via CSS classes
      preload: 'metadata',
      sources: [{
        src: url,
        type: 'video/mp4'
      }]
    }, () => {
      if (onReady) {
        onReady(player);
      }
    });

    // Cleanup on unmount
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Handle URL or Muted changes without re-initializing the whole player
  useEffect(() => {
    const player = playerRef.current;
    if (player && url) {
      player.src({ src: url, type: 'video/mp4' });
    }
  }, [url]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.muted(muted);
    }
  }, [muted]);

  return (
    <div className={className} data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-city w-full h-full"
        playsInline
      />
      <style jsx global>{`
        .video-js.vjs-fill {
          width: 100%;
          height: 100%;
        }
        .vjs-tech {
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
}
