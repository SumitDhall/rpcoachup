
'use client';

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Upload, 
  Video, 
  Users, 
  Play, 
  Settings, 
  MoreVertical, 
  Eye, 
  MessageCircle,
  TrendingUp,
  FileVideo,
  Music2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STUDIO_STATS, STUDIO_UPLOADS } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function StudioVideo({ url }: { url: string }) {
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
      muted: true, // Muted by default for studio previews
      preload: 'none',
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

export default function ArtistStudioPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'artist')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'artist') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-secondary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Accessing Creator Core...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
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

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gradient">
            Artist Studio
          </h1>
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground">
            Master: {user.name}
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="h-12 rounded-xl bg-vibrant-gradient text-white font-black uppercase tracking-widest text-[10px] px-8 hover:scale-105 transition-transform shadow-xl shadow-primary/20">
            <Upload className="w-4 h-4 mr-2" />
            Upload Masterpiece
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STUDIO_STATS.map((stat, idx) => (
          <Card key={idx} className="glass-card border-white/5 hover:border-primary/20 transition-all overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </CardDescription>
              <CardTitle className="text-3xl font-black tracking-tighter">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                {stat.change} <span className="text-muted-foreground/60">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Uploads Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Channel Content</h2>
            <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px]">
              See All
            </Button>
          </div>
          
          <Card className="glass-card border-white/5">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Video</th>
                      <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                      <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                      <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Views</th>
                      <th className="text-left p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {STUDIO_UPLOADS.map((upload) => (
                      <tr key={upload.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-20 rounded-lg bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                              {upload.videoUrl ? (
                                <StudioVideo url={upload.videoUrl} />
                              ) : (
                                <Video className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wide truncate max-w-[150px]">
                              {upload.title}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5">
                            {upload.type}
                          </Badge>
                        </td>
                        <td className="p-6 text-xs text-muted-foreground">{upload.date}</td>
                        <td className="p-6 text-xs font-bold">{upload.views}</td>
                        <td className="p-6">
                          <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400">
                            {upload.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <Card className="glass-card border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Sync your Next Blip</CardTitle>
              <CardDescription className="text-xs font-medium leading-relaxed">
                Connect with the Realm through 60-second vertical rhythms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-white/5 transition-all cursor-pointer">
                <FileVideo className="w-10 h-10 text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Drop Video Here</span>
              </div>
              <Button className="w-full h-12 rounded-xl border border-primary/40 bg-transparent text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-[10px]">
                Open Blip Creator
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Creator Goal</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-primary">Realm Pro Level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">Watch Hours</span>
                  <span>45.2K / 50K</span>
                </div>
                <Progress value={90} className="h-1.5 bg-white/5" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">Total Dancers</span>
                  <span>85.4K / 100K</span>
                </div>
                <Progress value={85} className="h-1.5 bg-white/5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
