'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Music2, Share2, Heart, Instagram, Facebook, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARTISTS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Gallery Video Component using Video.js for consistent playback experience
function GalleryVideo({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add('vjs-fill', 'vjs-big-play-centered');
    containerRef.current.appendChild(videoElement);

    const player = playerRef.current = videojs(videoElement, {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: false, 
      loop: false,
      muted: false,
      preload: 'auto',
      sources: [{
        src: url,
        type: 'video/mp4'
      }]
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [url]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full [&_.video-js]:h-full [&_.video-js]:w-full [&_video]:object-cover" 
    />
  );
}

export default function ArtistDetailPage() {
  const { id } = useParams();
  const artist = ARTISTS.find((a) => a.id === id);
  const { toast } = useToast();
  
  const [artistVideos, setArtistVideos] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (artist) {
      setArtistVideos(artist.videos);
    }
  }, [artist]);

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4">
        <h1 className="text-4xl font-black italic text-gradient">Artist Not Found</h1>
        <Button asChild variant="outline">
          <Link href="/artists">Back to Artists</Link>
        </Button>
      </div>
    );
  }

  const shareLink = typeof window !== 'undefined' ? window.location.href : '';

  const handleSocialShare = (platform: string) => {
    const text = `Check out ${artist.name} on Dance Realm: ${shareLink}`;
    
    switch (platform) {
      case 'instagram':
        window.open(`https://www.instagram.com/reels/`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <style jsx global>{`
        /* Ensure Video.js tech (actual video) stretches to fill its container */
        .vjs-tech {
          object-fit: cover !important;
        }
        .video-js.vjs-fill {
           width: 100%;
           height: 100%;
        }
      `}</style>

      {/* Background Layer 1: Images */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/dance-realm_background_image_without_dancers.png"
          alt="Dance Realm Background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-110 contrast-110"
        />
      </div>

      {/* Background Layer 2: Dark Overlay */}
      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />
      
      {/* Page Content Layer 3 */}
      <div className="relative z-20">
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
            priority
            data-ai-hint="professional dancer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute top-8 left-8 z-10">
            <Button asChild variant="ghost" className="rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10">
              <Link href="/artists" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Back</span>
              </Link>
            </Button>
          </div>

          <div className="absolute bottom-12 left-8 right-8 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-1">
              <Badge variant="outline" className="text-primary border-primary/40 bg-primary/10 uppercase tracking-[0.2em] px-3 py-1 text-[10px] font-black">
                {artist.style}
              </Badge>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">
                {artist.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-8 relative z-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 rounded-3xl space-y-6 border-white/5">
              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {artist.description}
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`rounded-full h-12 w-12 border-white/10 transition-all ${isLiked ? 'border-primary text-primary bg-primary/10' : 'hover:border-primary hover:text-primary'}`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-white/10 hover:border-primary hover:text-primary transition-all">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-card border-white/10">
                    <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => handleSocialShare('instagram')}>
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => handleSocialShare('facebook')}>
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => handleSocialShare('whatsapp')}>
                      <MessageSquare className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 rounded-full h-12 font-bold uppercase tracking-widest text-xs shadow-lg transition-all ${isFollowing ? 'bg-secondary text-secondary-foreground shadow-secondary/20' : 'shadow-primary/20'}`}
                >
                  {isFollowing ? 'Following' : 'Follow Artist'}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Performances</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artistVideos.map((video) => (
                <div key={video.id} className="group relative glass-card rounded-2xl overflow-hidden border-white/5 hover:border-primary/40 transition-all">
                  <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                    <GalleryVideo url={video.url} />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Music2 className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm uppercase tracking-wider">{video.title}</span>
                        {video.category && (
                          <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">{video.category}</span>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/5 text-[10px] font-bold">HD</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}