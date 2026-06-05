'use client';

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Play, 
  Plus, 
  Bookmark, 
  Star, 
  TrendingUp, 
  Clock, 
  Music2, 
  User, 
  ChevronRight,
  Flame,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DANCER_CONTENT, ARTISTS } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function DashboardVideo({ url, thumbnail }: { url: string; thumbnail?: string }) {
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
      preload: 'none',
      poster: thumbnail,
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
  }, [url, thumbnail]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full [&_.video-js]:h-full [&_.video-js]:w-full [&_video]:object-cover" 
    />
  );
}

export default function DancerDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'dancer')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'dancer') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-primary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Synchronizing Realm...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 space-y-12 animate-in fade-in duration-700">
      <style jsx global>{`
        .vjs-tech {
          object-fit: cover !important;
        }
        .video-js.vjs-fill {
           width: 100%;
           height: 100%;
        }
      `}</style>

      {/* Hero / Welcome Section */}
      <section className="relative min-h-[60vh] w-full flex items-end p-8 md:p-16 pt-32 md:pt-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/hero/1200/800"
            alt="Hero background"
            fill
            className="object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
            data-ai-hint="modern dance"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
            <Flame className="w-3 h-3 text-primary fill-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Level 12 Rhythm Master</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-[#F4F7FF]/60 mb-2">Welcome Back, {user.name}</h2>
            <h1 className="text-gradient text-7xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] py-4">
              DΛNCE<br />ЯEΛLM
            </h1>
          </div>
          
          <p className="text-sm text-muted-foreground font-medium max-w-md leading-relaxed">
            Ready to synchronize? You have 2 tutorials in progress and 5 new artists trending in your style.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="h-12 px-8 rounded-xl bg-vibrant-gradient font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
              <Play className="w-4 h-4 mr-2 fill-current" />
              Resume Journey
            </Button>
            <Button variant="outline" className="h-12 px-8 rounded-xl border-white/10 glass-card font-black uppercase tracking-widest text-[10px]">
              Discover Styles
            </Button>
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <div className="px-8 md:px-16 space-y-16 relative z-20">
        
        {/* Continue Watching */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Continue Synchronizing</h2>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
              View History <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DANCER_CONTENT.continueWatching.map((item) => (
              <Card key={item.id} className="glass-card border-white/5 hover:border-primary/20 transition-all overflow-hidden group">
                <div className="aspect-video relative overflow-hidden bg-black">
                  <DashboardVideo url={item.videoUrl} thumbnail={item.thumbnail} />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-wide truncate">{item.title}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Master: {item.artist}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-primary">
                      <span>Sync Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-1 bg-white/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Saved & Recommended Grid */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Saved Collections */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Your Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DANCER_CONTENT.saved.map((item) => (
                <div key={item.id} className="group relative glass-card rounded-2xl overflow-hidden border-white/5 h-48 bg-black">
                  <DashboardVideo url={item.videoUrl} thumbnail={item.thumbnail} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                    <Badge className="bg-primary/20 text-primary border-primary/30 mb-2 uppercase tracking-widest text-[8px] font-black">Saved</Badge>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">{item.title}</h3>
                    <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{item.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Artists */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">New Masters</h2>
            <div className="space-y-4">
              {ARTISTS.slice(0, 4).map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.id}`} className="flex items-center gap-4 p-4 glass-card border-white/5 rounded-2xl hover:border-primary/40 transition-all group">
                  <div className="relative h-12 w-12 shrink-0">
                    <Image src={artist.image} alt={artist.name} fill className="object-cover rounded-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black uppercase tracking-wide truncate group-hover:text-primary transition-colors">{artist.name}</h4>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{artist.style}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full border border-white/10">
                    <Plus className="w-3 h-3" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <section className="space-y-6 pb-20">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Platform Pulse</h2>
          <Card className="glass-card border-white/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex gap-12">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Rhythm Points</p>
                    <p className="text-3xl font-black tracking-tighter text-gradient">2,450</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Syncs</p>
                    <p className="text-3xl font-black tracking-tighter">142</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Realm Rank</p>
                    <p className="text-3xl font-black tracking-tighter">#842</p>
                  </div>
                </div>
                <div className="h-20 w-px bg-white/5 hidden md:block" />
                <div className="flex flex-col items-center md:items-end gap-2 text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Next Rank: Vanguard</p>
                  <div className="w-64">
                    <Progress value={60} className="h-2 bg-white/5" />
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">500 pts until level up</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
