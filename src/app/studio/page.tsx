
'use client';

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Upload, 
  Video, 
  TrendingUp,
  FileVideo,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Clock,
  LayoutGrid,
  Filter,
  ArrowUpDown,
  Sparkles,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STUDIO_STATS } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function StudioVideo({ url, poster }: { url: string; poster?: string }) {
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
      muted: true,
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
  }, [url, poster]);

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
  const { toast } = useToast();

  const [uploads, setUploads] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [masterMovesFile, setMasterMovesFile] = useState<File | null>(null);
  
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("Performances");
  
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const masterMovesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'artist')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Initial mock data load
  useEffect(() => {
    setUploads([
      { id: "u1", title: "Midnight Samba Masterclass", date: "Oct 24, 2024", views: "12.5K", status: "Published", type: "Tutorial Demo", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", masterMovesUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail: "https://picsum.photos/seed/samba/800/450" },
      { id: "u2", title: "Urban Flow Choreography", date: "Oct 20, 2024", views: "45.2K", status: "Published", type: "Performances", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://picsum.photos/seed/urban/800/450" },
      { id: "u3", title: "Ballet Basics: The Plie", date: "Oct 15, 2024", views: "8.9K", status: "Review", type: "Tutorial Demo", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", masterMovesUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail: "https://picsum.photos/seed/ballet/800/450" },
      { id: "u4", title: "Contemporary Expression", date: "Sep 12, 2024", views: "3.2K", status: "Published", type: "Performances", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail: "https://picsum.photos/seed/contemp/800/450" },
      { id: "u5", title: "Rhythm & Pulse Podcast #1", date: "Sep 05, 2024", views: "1.5K", status: "Published", type: "Podcast", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://picsum.photos/seed/podcast/800/450" },
    ]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleMasterMovesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMasterMovesFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerMasterMovesInput = () => masterMovesInputRef.current?.click();

  const isPublishEnabled = useMemo(() => {
    if (videoCategory === "Tutorial Demo") {
      return !!selectedFile && !!masterMovesFile;
    }
    return !!selectedFile;
  }, [videoCategory, selectedFile, masterMovesFile]);

  const handleUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newVideoUrl = selectedFile ? URL.createObjectURL(selectedFile) : "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
          const masterMovesUrl = masterMovesFile ? URL.createObjectURL(masterMovesFile) : undefined;
          
          const newUpload = {
            id: `u-new-${Date.now()}`,
            title: videoTitle || "Untitled Masterpiece",
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            views: "0",
            status: "Published",
            type: videoCategory,
            videoUrl: newVideoUrl,
            masterMovesUrl: masterMovesUrl,
            thumbnail: "https://picsum.photos/seed/new-upload/800/450"
          };

          setUploads((prev) => [newUpload, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
          setMasterMovesFile(null);
          setVideoTitle("");
          setIsDialogOpen(false); 
          setCurrentPage(1);
          
          toast({
            title: "Masterpiece Synchronized!",
            description: "Your content is now live in the Artist Studio.",
          });
        }, 500);
      }
    }, 150);
  };

  // Helper to parse views string like "12.5K" to number
  const parseViews = (views: string) => {
    if (!views) return 0;
    const clean = views.replace(/[^0-9.]/g, '');
    let num = parseFloat(clean);
    if (views.toLowerCase().includes('k')) num *= 1000;
    if (views.toLowerCase().includes('m')) num *= 1000000;
    return num;
  };

  const processedUploads = useMemo(() => {
    let result = [...uploads];
    
    // Filter
    if (filterType !== "All") {
      result = result.filter(u => u.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "views-desc":
          return parseViews(b.views) - parseViews(a.views);
        case "views-asc":
          return parseViews(a.views) - parseViews(b.views);
        default:
          return 0;
      }
    });

    return result;
  }, [uploads, filterType, sortBy]);

  const paginatedUploads = processedUploads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (isLoading || !user || user.role !== 'artist') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-secondary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Accessing Creator Core...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative p-8 animate-in fade-in duration-700">
      <style jsx global>{`
        .vjs-tech { object-fit: cover !important; }
        .video-js.vjs-fill { width: 100%; height: 100%; }
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

      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />

      <div className="relative z-20 max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-12">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gradient">
              Artist Studio
            </h1>
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground">
              Master: {user.name}
            </p>
          </div>
          <div className="flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 rounded-xl bg-vibrant-gradient text-white font-black uppercase tracking-widest text-[10px] px-8 hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Masterpiece
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">New Masterpiece</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Title</Label>
                      <Input 
                        placeholder="Enter title..." 
                        className="bg-black/20 border-white/10 h-11" 
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Type</Label>
                      <Select value={videoCategory} onValueChange={setVideoCategory}>
                        <SelectTrigger className="bg-black/20 border-white/10 h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/10">
                          <SelectItem value="Tutorial Demo">Tutorial Demo</SelectItem>
                          <SelectItem value="Performances">Performances</SelectItem>
                          <SelectItem value="Podcast">Podcast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Tutorial Demo Video</Label>
                    <div onClick={triggerFileInput} className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-black/10 cursor-pointer">
                      <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
                      {selectedFile ? <span className="text-[9px] font-bold text-primary">{selectedFile.name}</span> : <FileVideo className="h-8 w-8 text-muted-foreground" />}
                    </div>
                  </div>

                  {videoCategory === "Tutorial Demo" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-secondary/80">Master the Moves Video</Label>
                      <div onClick={triggerMasterMovesInput} className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-black/10 cursor-pointer">
                        <input type="file" ref={masterMovesInputRef} className="hidden" accept="video/*" onChange={handleMasterMovesChange} />
                        {masterMovesFile ? <span className="text-[9px] font-bold text-secondary">{masterMovesFile.name}</span> : <FileVideo className="h-8 w-8 text-muted-foreground" />}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleUpload} disabled={isUploading || !isPublishEnabled} className="w-full bg-primary text-primary-foreground">
                    {isUploading ? "Syncing..." : "Publish to Realm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {STUDIO_STATS.map((stat, idx) => (
            <Card key={idx} className="glass-card border-white/5">
              <CardHeader className="pb-2 p-4">
                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardDescription>
                <CardTitle className="text-2xl font-black tracking-tighter">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/30 backdrop-blur-md p-4 rounded-[2rem] border border-white/5">
          <div className="flex items-center gap-2 flex-1 w-full">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filter:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-none h-10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Tutorial Demo">Tutorial Demos</SelectItem>
                <SelectItem value="Performances">Performances</SelectItem>
                <SelectItem value="Podcast">Podcasts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-1 w-full justify-end">
            <ArrowUpDown className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-none h-10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="views-desc">Most Viewed</SelectItem>
                <SelectItem value="views-asc">Least Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Content Content */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <LayoutGrid className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Channel Content</h2>
          </div>
          
          <div className="flex flex-col gap-8">
            {paginatedUploads.map((upload) => (
              <Card key={upload.id} className="glass-card border-white/5 overflow-hidden group">
                {upload.type === "Tutorial Demo" ? (
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{upload.title}</h3>
                        <div className="flex items-center gap-3">
                           <Badge variant="outline" className="text-primary border-primary/20">{upload.type}</Badge>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                             <Eye className="w-3 h-3" /> {upload.views} Views
                           </span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                             <Calendar className="w-3 h-3" /> {upload.date}
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-widest text-primary/80">01. Demo Preview</span>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black">HD</Badge>
                        </div>
                        <div className="aspect-video relative rounded-2xl overflow-hidden bg-black ring-1 ring-white/5 shadow-2xl">
                          <StudioVideo url={upload.videoUrl} poster={upload.thumbnail} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-widest text-secondary/80">02. Master the Moves</span>
                          <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[8px] font-black">LOOPABLE</Badge>
                        </div>
                        <div className="aspect-video relative rounded-2xl overflow-hidden bg-black ring-1 ring-white/5 shadow-2xl">
                          <StudioVideo url={upload.masterMovesUrl || upload.videoUrl} poster={upload.thumbnail} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-80 aspect-video relative bg-black shrink-0 border-r border-white/5">
                      <StudioVideo url={upload.videoUrl} poster={upload.thumbnail} />
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-primary border-primary/20 mb-2">{upload.type}</Badge>
                        <h3 className="text-xl font-black uppercase italic tracking-tight">{upload.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                         <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Views</span>
                            <span className="text-sm font-black tracking-tighter">{upload.views}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Published</span>
                            <span className="text-sm font-black tracking-tighter">{upload.date}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Status</span>
                            <span className="text-sm font-black tracking-tighter text-emerald-400">{upload.status}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {processedUploads.length === 0 && (
            <div className="text-center py-32 glass-card rounded-[3rem] border-dashed border-white/20">
              <p className="text-2xl font-black italic uppercase tracking-tighter text-muted-foreground">
                No masterpieces found in this realm.
              </p>
              <Button 
                variant="link" 
                className="text-primary uppercase font-black tracking-widest text-[10px] mt-4"
                onClick={() => { setFilterType("All"); setSortBy("date-desc"); }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
