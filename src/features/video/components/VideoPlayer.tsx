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
  isPlaying?: boolean;
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
  isPlaying = false,
  className,
  onReady,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Wait for the container element to be available
    if (!videoRef.current) return;

    // Create a video element dynamically to ensure clean state
    const videoElement = document.createElement('video');
    videoElement.className = 'video-js vjs-big-play-centered vjs-theme-city w-full h-full';
    videoElement.setAttribute('playsinline', 'true');
    videoRef.current.appendChild(videoElement);

    // Initialize Video.js
    const player = playerRef.current = videojs(videoElement, {
      autoplay: autoplay || isPlaying,
      controls,
      loop,
      muted,
      poster,
      responsive: true,
      fluid: false,
      preload: 'auto',
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

  // Handle URL changes
  useEffect(() => {
    const player = playerRef.current;
    if (player && url) {
      player.src({ src: url, type: 'video/mp4' });
    }
  }, [url]);

  // Handle Muted state
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.muted(muted);
    }
  }, [muted]);

  // Handle Play/Pause state
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      if (isPlaying) {
        // Use a promise-based play call to handle potential browser blocks
        const playPromise = player.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay was prevented, usually requires user interaction or mute
            player.muted(true);
            player.play();
          });
        }
      } else {
        player.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className={className} data-vjs-player>
      <div ref={videoRef} className="w-full h-full" />
      <style jsx global>{`
        .video-js.vjs-fill {
          width: 100%;
          height: 100%;
        }
        .vjs-tech {
          object-fit: cover !important;
        }
        .video-js .vjs-big-play-button {
          display: none;
        }
      `}</style>
    </div>
  );
}
