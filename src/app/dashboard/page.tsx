
'use client';

import React, { useEffect, useRef, useState, useMemo } from "react";
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
  Lock,
  MoreHorizontal,
  MoreVertical,
  Camera,
  Trash2,
  Upload,
  FileVideo,
  ChevronLeft,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DANCER_CONTENT, ARTISTS } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const BLIPS_PER_PAGE = 10;

function DashboardVideo({ url, poster, muted = false }: { url: string; poster?: string; muted?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !url) return;

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
      muted: muted,
      preload: 'metadata',
      poster: poster,
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
  }, [url, poster, muted]);

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
  const { toast } = useToast();

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [blips, setBlips] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [blipTitle, setBlipTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blipToDelete, setBlipToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const blipInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'dancer')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Initial mock blips
  useEffect(() => {
    const mockBlips = Array.from({ length: 15 }).map((_, i) => ({
      id: `blip-${i}`,
      title: `Rhythm Session #${i + 1}`,
      date: "Oct 24, 2024",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: `https://picsum.photos/seed/blip${i}/400/225`
    }));
    setBlips(mockBlips);
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverImage(url);
      toast({ title: "Cover Updated", description: "Your dashboard look is now synchronized." });
    }
  };

  const deleteCover = () => {
    setCoverImage(null);
    toast({ title: "Cover Removed", description: "Back to original sync." });
  };

  const triggerCoverInput = () => {
    setTimeout(() => coverInputRef.current?.click(), 100);
  };

  const triggerBlipInput = () => blipInputRef.current?.click();

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleUploadBlip = async () => {
    if (!selectedFile) return;

    const duration = await getVideoDuration(selectedFile);
    if (duration > 30) {
      toast({
        variant: "destructive",
        title: "Blip Too Long",
        description: "Blips cannot exceed 30 seconds. Yours is " + Math.round(duration) + "s.",
      });
      return;
    }

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newBlip = {
            id: `blip-new-${Date.now()}`,
            title: blipTitle || "My New Rhythm",
            date: "Just Now",
            url: URL.createObjectURL(selectedFile),
            thumbnail: "https://picsum.photos/seed/newblip/400/225"
          };
          setBlips(prev => [newBlip, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
          setBlipTitle("");
          setIsDialogOpen(false);
          toast({ title: "Blip Synchronized!", description: "Your new blip is live in your catalog." });
        }, 500);
      }
    }, 100);
  };

  const initiateDelete = (id: string) => {
    setBlipToDelete(id);
    setTimeout(() => setIsConfirmOpen(true), 100);
  };

  const confirmDelete = () => {
    if (blipToDelete) {
      setBlips(prev => prev.filter(b => b.id !== blipToDelete));
      setBlipToDelete(null);
      setIsConfirmOpen(false);
      toast({ title: "Blip Deleted", description: "Successfully removed from your catalog." });
    }
  };

  const paginatedBlips = useMemo(() => {
    const start = (currentPage - 1) * BLIPS_PER_PAGE;
    return blips.slice(start, start + BLIPS_PER_PAGE);
  }, [blips, currentPage]);

  const totalPages = Math.ceil(blips.length / BLIPS_PER_PAGE);

  if (isLoading || !user || user.role !== 'dancer') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-primary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Synchronizing Realm...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20 animate-in fade-in duration-700">
      <style jsx global>{`
        .vjs-tech { object-fit: cover !important; }
        .video-js.vjs-fill { width: 100%; height: 100%; }
      `}</style>

      {/* Persistent Background */}
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
      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />

      {/* Page Content */}
      <div className="relative z-20">
        {/* Cover Photo Section */}
        <section className="relative h-[55vh] w-full overflow-hidden group">
          {coverImage ? (
            <Image src={coverImage} alt="Dashboard Cover" fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full relative overflow-hidden bg-black">
              <Image 
                src="https://picsum.photos/seed/hero/1200/800"
                alt="Hero background"
                fill
                className="object-cover opacity-40 grayscale"
                data-ai-hint="modern dance"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent" />
            </div>
          )}
          
          <div className="absolute bottom-6 right-6 z-30">
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-white/20 text-white shadow-xl border border-white/10">
                  <MoreHorizontal className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-white/10">
                <DropdownMenuItem onSelect={triggerCoverInput} className="gap-3 cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <span>Upload Cover</span>
                </DropdownMenuItem>
                {coverImage && (
                  <DropdownMenuItem onSelect={deleteCover} className="gap-3 cursor-pointer text-red-400 focus:text-red-400">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Cover</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Identity & Add Blips Header Area */}
        <div className="max-w-7xl mx-auto px-8 md:px-12 pt-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-12">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
                <Flame className="w-3 h-3 text-primary fill-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Level 12 Rhythm Master</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-gradient leading-[0.85] py-2">
                DANCE ЯEALM
              </h1>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-black text-white/60">
                Welcome Back, {user.name}
              </p>
            </div>

            <div className="shrink-0">
              <input type="file" ref={blipInputRef} className="hidden" accept="video/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-14 md:h-16 rounded-full bg-vibrant-gradient text-white font-black uppercase tracking-[0.2em] text-[11px] px-10 hover:scale-105 transition-all shadow-lg shadow-primary/20 border-none">
                    <Plus className="w-5 h-5 mr-3" />
                    ADD BLIPS
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/10 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Synchronize New Blip</DialogTitle>
                    <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground">Keep it under 30 seconds for maximum impact</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Title</Label>
                      <Input 
                        placeholder="My Rhythm..." 
                        className="bg-black/20 border-white/10"
                        value={blipTitle}
                        onChange={(e) => setBlipTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Blip Video</Label>
                      <div onClick={triggerBlipInput} className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-black/10 cursor-pointer hover:border-primary/50 transition-colors">
                        {selectedFile ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-primary truncate max-w-[200px]">{selectedFile.name}</span>
                          </div>
                        ) : <FileVideo className="h-8 w-8 text-muted-foreground" />}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col gap-3">
                    <Button onClick={handleUploadBlip} disabled={isUploading || !selectedFile} className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest h-12 rounded-xl">
                      {isUploading ? "Syncing..." : "Publish Blip"}
                    </Button>
                    {isUploading && <Progress value={uploadProgress} className="h-1 bg-white/5" />}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 space-y-24">
          
          {/* Continue Watching */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Continue Synchronizing</h2>
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                View History <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {DANCER_CONTENT.continueWatching.map((item) => (
                <Card key={item.id} className="glass-card border-white/5 hover:border-primary/20 transition-all overflow-hidden group">
                  <div className="aspect-video relative overflow-hidden bg-black">
                    <DashboardVideo url={item.videoUrl} poster={item.thumbnail} muted />
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

          {/* YOUR BLIPS Section */}
          <section className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <LayoutGrid className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Your Blips</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {paginatedBlips.map((blip) => (
                <div key={blip.id} className="relative group glass-card rounded-2xl overflow-hidden border-white/5 hover:border-primary/30 transition-all">
                  <div className="absolute top-2 right-2 z-30">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-card border-white/10">
                        <DropdownMenuItem onSelect={() => initiateDelete(blip.id)} className="gap-3 cursor-pointer text-red-400">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Blip</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="aspect-[9/16] relative bg-black">
                    <DashboardVideo url={blip.url} poster={blip.thumbnail} muted />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                      <h4 className="text-[10px] font-black uppercase italic tracking-tighter text-white truncate">{blip.title}</h4>
                      <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">{blip.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 pt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-12 w-12 rounded-xl border-white/10 glass-card hover:border-primary"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/40">
                  <span>Page <span className="text-primary">{currentPage}</span> of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-12 w-12 rounded-xl border-white/10 glass-card hover:border-primary"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </section>

          {/* Activity Section */}
          <section className="space-y-8 pb-20">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Platform Pulse</h2>
            <Card className="glass-card border-white/5">
              <CardContent className="p-10">
                <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
                  <div className="flex flex-wrap justify-center gap-12">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Rhythm Points</p>
                      <p className="text-4xl font-black tracking-tighter text-gradient">2,450</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Syncs</p>
                      <p className="text-4xl font-black tracking-tighter">142</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Realm Rank</p>
                      <p className="text-4xl font-black tracking-tighter">#842</p>
                    </div>
                  </div>
                  <div className="h-20 w-px bg-white/5 hidden lg:block" />
                  <div className="flex flex-col items-center lg:items-end gap-3 text-right">
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

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="glass-card border-white/10 bg-black/90 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-white/60 leading-relaxed font-medium">
              Are you sure you want to delete this blip? This action will permanently remove it from your catalog and the Dance Realm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="h-12 rounded-xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="h-12 rounded-xl bg-destructive text-destructive-foreground font-black uppercase tracking-widest text-[10px] hover:bg-destructive/90 border-none"
            >
              Continue Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
