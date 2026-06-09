
'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Music2, Share2, Heart, Instagram, Facebook, MessageSquare, ChevronRight, PlayCircle, Play } from "lucide-react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Gallery Video Component using Video.js for consistent playback experience
function GalleryVideo({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    // Reset container if re-initializing
    containerRef.current.innerHTML = '';
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
      preload: 'metadata',
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

interface VideoSectionProps {
  title: string;
  videos: any[];
  artistId: string;
}

function VideoCarouselSection({ title, videos, artistId }: VideoSectionProps) {
  if (videos.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{title}</h3>
        <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px] group" asChild>
          <Link href={`/artists/${artistId}/videos?type=${encodeURIComponent(title)}`}>
            View All <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="relative px-4">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {videos.map((video, idx) => (
              <CarouselItem key={`${video.id}-${idx}`} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="group relative glass-card rounded-2xl overflow-hidden border-white/5 hover:border-primary/40 transition-all h-full flex flex-col">
                  <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                    <GalleryVideo url={video.url} />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Music2 className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm uppercase tracking-wider truncate">{video.title}</span>
                        <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">HD Quality</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                         <Badge variant="secondary" className="bg-white/5 text-[10px] font-bold">4K READY</Badge>
                         <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary">
                            <PlayCircle className="w-4 h-4" />
                         </Button>
                      </div>
                      
                      {title === "TUTORIAL PREVIEW" && (
                        <div className="pt-3 border-t border-white/5 mt-1">
                          <Button 
                            className="w-full bg-vibrant-gradient hover:scale-[1.02] transition-all rounded-full h-9 text-[10px] font-black uppercase tracking-widest text-white border-none shadow-lg shadow-primary/20"
                            asChild
                          >
                            <Link href="#">
                              <Play className="w-3 h-3 mr-1.5 fill-current" />
                              Master the Moves
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 bg-black/60 backdrop-blur-md border-white/10 hover:bg-primary hover:text-white transition-all shadow-xl" />
            <CarouselNext className="-right-6 bg-black/60 backdrop-blur-md border-white/10 hover:bg-primary hover:text-white transition-all shadow-xl" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default function ArtistDetailPage() {
  const { id } = useParams();
  const artist = ARTISTS.find((a) => a.id === id);
  const { toast } = useToast();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const categories = {
    TutorialPreview: artist.videos,
    Performances: [...artist.videos].reverse(),
    Podcasts: [...artist.videos].reverse(),
  };

  return (
    <div className="min-h-screen relative pb-32">
      <style jsx global>{`
        .vjs-tech {
          object-fit: cover !important;
        }
        .video-js.vjs-fill {
           width: 100%;
           height: 100%;
        }
      `}</style>

      {/* Background Layer 1: Image */}
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
        {/* Hero Section */}
        <div className="relative h-[65vh] min-h-[550px] md:h-[50vh] w-full overflow-hidden">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover transition-all duration-1000 opacity-100"
            priority
            data-ai-hint="professional dancer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute top-8 left-8 z-10">
            <Button asChild variant="ghost" className="rounded-full bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/10">
              <Link href="/artists" className="flex items-center gap-2 px-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
              </Link>
            </Button>
          </div>

          <div className="absolute bottom-24 md:bottom-16 left-8 right-8 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-2">
              <Badge variant="outline" className="text-primary border-primary/40 bg-primary/10 uppercase tracking-[0.2em] px-3 py-1 text-[10px] font-black">
                {artist.style}
              </Badge>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl leading-none">
                {artist.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-8 space-y-24 -mt-12 md:-mt-8 relative z-10">
          
          {/* About Section - Full Width */}
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-3xl">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">About the Master</h2>
                  <p className="text-white/80 leading-relaxed text-lg md:text-xl font-medium italic">
                    "{artist.description}"
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 shrink-0">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`rounded-full h-14 w-14 border-white/10 transition-all ${isLiked ? 'border-primary text-primary bg-primary/10' : 'hover:border-primary hover:text-primary'}`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="rounded-full h-14 w-14 border-white/10 hover:border-primary hover:text-primary transition-all">
                        <Share2 className="w-6 h-6" />
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
                    size="lg"
                    className={`rounded-full h-14 px-8 font-black uppercase tracking-widest text-[11px] shadow-lg transition-all ${isFollowing ? 'bg-secondary text-secondary-foreground shadow-secondary/20' : 'bg-primary text-primary-foreground shadow-primary/20'}`}
                  >
                    {isFollowing ? 'Following Artist' : 'Follow Master'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Categories Sections */}
          <div className="space-y-24">
            <VideoCarouselSection title="TUTORIAL PREVIEW" videos={categories.TutorialPreview} artistId={id as string} />
            <VideoCarouselSection title="Performances" videos={categories.Performances} artistId={id as string} />
            <VideoCarouselSection title="Podcasts" videos={categories.Podcasts} artistId={id as string} />
          </div>
        </div>
      </div>
    </div>
  );
}
