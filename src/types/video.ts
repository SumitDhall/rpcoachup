/**
 * Domain types for Videos (Tutorials, Blips, Performances)
 */

export interface Video {
  id: string | number;
  title: string;
  url?: string;
  videoUrl?: string;
  type?: string;
  date?: string;
  views?: number | string;
  thumbnail?: string;
  poster?: string;
  progress?: number;
  artist?: string;
  masterMovesUrl?: string;
  difficulty?: string;
  duration?: string;
  dancer?: string;
  location?: string;
  description?: string;
}

export interface VideoPlayerProps {
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
