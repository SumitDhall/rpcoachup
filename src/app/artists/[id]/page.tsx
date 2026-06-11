
'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Music2, Share2, Heart, Instagram, Facebook, MessageSquare, ChevronRight, PlayCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARTISTS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { VideoPlayer } from "@/features/video/components/VideoPlayer";
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

      <div className="relative px-2 md:px-4">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-4">
            {videos.map((video, idx) => (
              <CarouselItem key={`${video.id}-${idx}`} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="group relative glass-card rounded-2xl overflow-hidden border-white/5 hover:border-primary/40 transition-all h-full flex flex-col">
                  <div className="aspect-video relative bg-black">
                    <VideoPlayer url={video.url} muted={false} controls className="w-full h-full" />
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
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 mt-8 md:mt-0">
            <CarouselPrevious className="static md:absolute md:-left-12 md:top-1/2 md:-translate-y-1/2 bg-black/60 backdrop-blur-md border-white/10 hover:bg-primary hover:text-white h-10 w-10 z-30" />
            <CarouselNext className="static md:absolute md:-right-12 md:top-1/2 md:-translate-y-1/2 bg-black/60 backdrop-blur-md border-white/10 hover:bg-primary hover:text-white h-10 w-10 z-30" />
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

  if (!artist) return <div className="min-h-screen flex items-center justify-center"><h1>Artist Not Found</h1></div>;

  const categories = {
    TutorialPreview: artist.videos,
    Performances: [...artist.videos].reverse(),
    Podcasts: [...artist.videos].reverse(),
  };

  return (
    <div className="min-h-screen relative pb-32">
      <div className="fixed inset-0 z-0">
        <Image src="/images/dance-realm_background_image_without_dancers.png" alt="BG" fill className="object-cover brightness-110 contrast-110" />
      </div>
      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />
      
      <div className="relative z-20">
        <div className="relative h-[50vh] w-full overflow-hidden">
          <Image src={artist.image} alt={artist.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute top-8 left-8 z-10">
            <Button asChild variant="ghost" className="rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Link href="/artists"><ArrowLeft className="w-4 h-4 mr-2" />Back</Link>
            </Button>
          </div>
          <div className="absolute bottom-16 left-8 right-8">
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">{artist.name}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 space-y-24 -mt-8 relative z-10">
          <div className="glass-card p-12 rounded-[2.5rem] border-white/5 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="text-white/80 text-xl font-medium italic max-w-3xl">"{artist.description}"</p>
              <div className="flex gap-4">
                <Button onClick={() => setIsLiked(!isLiked)} variant="outline" className={`h-14 w-14 rounded-full ${isLiked ? 'text-primary' : ''}`}>
                  <Heart className={isLiked ? 'fill-current' : ''} />
                </Button>
                <Button onClick={() => setIsFollowing(!isFollowing)} size="lg" className="h-14 px-8 rounded-full bg-primary font-black uppercase tracking-widest">
                  {isFollowing ? 'Following' : 'Follow Master'}
                </Button>
              </div>
            </div>
          </div>
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
