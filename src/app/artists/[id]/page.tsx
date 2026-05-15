
'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Play, Music2, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARTISTS } from "@/lib/mock-data";

export default function ArtistDetailPage() {
  const { id } = useParams();
  const artist = ARTISTS.find((a) => a.id === id);

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

  return (
    <div className="min-h-screen bg-background relative pb-20">
      {/* Header / Hero Section */}
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
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-3xl space-y-6 border-white/5">
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {artist.description}
              </p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-white/10 hover:border-primary hover:text-primary transition-all">
                <Heart className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-white/10 hover:border-primary hover:text-primary transition-all">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button className="flex-1 rounded-full h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                Follow Artist
              </Button>
            </div>
          </div>
        </div>

        {/* Video Gallery */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Performances</h2>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artist.videos.map((video) => (
              <div key={video.id} className="group relative glass-card rounded-2xl overflow-hidden border-white/5 hover:border-primary/40 transition-all">
                <div className="aspect-video relative bg-black flex items-center justify-center">
                  <video
                    src={video.url}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/40 group-hover:bg-primary transition-colors">
                      <Play className="w-6 h-6 text-white fill-white group-hover:scale-90 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Music2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider">{video.title}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/5 text-[10px] font-bold">HD</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
