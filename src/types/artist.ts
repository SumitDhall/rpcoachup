import { Video } from './video';

/**
 * Domain types for Artists
 */
export interface Artist {
  id: string;
  name: string;
  style: string;
  description: string;
  image: string;
  videos: Video[];
}
