
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
  Play,
  Camera,
  Trash2,
  Music2,
  MoreHorizontal,
  MoreVertical
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const ITEMS_PER_PAGE = 10;

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
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("Tutorial Preview");
  
  const [filterType, setFilterType] = useState("Tutorial Preview");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Deletion state
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const masterMovesInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'artist')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Initial mock data load
  useEffect(() => {
    const baseMockData = [
      { id: "u1", title: "Midnight Samba Masterclass", date: "Oct 24, 2024", views: "12.5K", status: "Published", type: "Tutorial Preview", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", masterMovesUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail: "https://picsum.photos/seed/samba/800/450" },
      { id: "u2", title: "Urban Flow Choreography", date: "Oct 20, 2024", views: "45.2K", status: "Published", type: "Performances", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://picsum.photos/seed/urban/800/450" },
      { id: "u3", title: "Ballet Basics: The Plie", date: "Oct 15, 2024", views: "8.9K", status: "Review", type: "Tutorial Preview", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", masterMovesUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail: "https://picsum.photos/seed/ballet/800/450" },
      { id: "u4", title: "Contemporary Expression", date: "Sep 12, 2024", views: "3.2K", status: "Published", type: "Performances", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail: "https://picsum.photos/seed/contemp/800/450" },
      { id: "u5", title: "Rhythm & Pulse Podcast #1", date: "Sep 05, 2024", views: "1.5K", status: "Published", type: "Podcast", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://picsum.photos/seed/podcast/800/450" },
      { id: "u6", title: "Quick Grooves", date: "Oct 28, 2024", views: "2.1K", status: "Published", type: "Blips", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail: "https://picsum.photos/seed/blips/800/450" },
    ];

    const expandedMockData = [...baseMockData];
    for(let i = 1; i <= 20; i++) {
      expandedMockData.push({
        ...baseMockData[i % baseMockData.length],
        id: `extra-${i}`,
        title: `${baseMockData[i % baseMockData.length].title} Vol. ${i}`,
        views: `${Math.floor(Math.random() * 50)}K`,
        date: `Sep ${Math.min(30, i + 1)}, 2024`
      });
    }
    
    setUploads(expandedMockData);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, sortBy]);

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

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverImage(url);
      toast({
        title: "Cover Updated",
        description: "Your studio looks legendary.",
      });
    }
  };

  const deleteCover = () => {
    setCoverImage(null);
    toast({
      title: "Cover Removed",
      description: "Back to original synchronicity.",
    });
  };

  const handleDeleteVideo = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    toast({
      title: "Masterpiece Deleted",
      description: "Successfully removed from your catalog.",
    });
  };

  const initiateDelete = (id: string) => {
    setVideoToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (videoToDelete) {
      handleDeleteVideo(videoToDelete);
      setVideoToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerMasterMovesInput = () => masterMovesInputRef.current?.click();
  const triggerCoverInput = () => coverInputRef.current?.click();

  const isPublishEnabled = useMemo(() => {
    if (videoCategory === "Tutorial Preview") {
      return !!selectedFile && !!masterMovesFile;
    }
    return !!selectedFile;
  }, [videoCategory, selectedFile, masterMovesFile]);

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (videoCategory === "Blips") {
      const duration = await getVideoDuration(selectedFile);
      if (duration > 30) {
        toast({
          variant: "destructive",
          title: "Blip Too Long",
          description: "Blips cannot exceed 30 seconds. This video is " + Math.round(duration) + " seconds long.",
        });
        return;
      }
    }

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newVideoUrl = URL.createObjectURL(selectedFile);
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
            description: "Your " + videoCategory + " is now live in the Artist Studio.",
          });
        }, 500);
      }
    }, 150);
  };

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
    
    if (filterType !== "All") {
      result = result.filter(u => u.type === filterType);
    }

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

  const totalPages = Math.ceil(processedUploads.length / ITEMS_PER_PAGE);
  const paginatedUploads = processedUploads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading || !user || user.role !== 'artist') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-secondary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Accessing Creator Core...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative animate-in fade-in duration-700">
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

      {/* Studio Content */}
      <div className="relative z-20">
        
        {/* Hero Cover Section */}
        <section className="relative h-[65vh] w-full overflow-hidden group">
          {coverImage ? (
            <Image 
              src={coverImage} 
              alt="Studio Cover" 
              fill 
              className="object-cover" 
              priority
            />
          ) : (
            <div className="w-full h-full bg-vibrant-gradient opacity-30" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/40 via-transparent to-transparent" />

          {/* More (3 dots) Dropdown - Fixed position in cover photo bottom right */}
          <div className="absolute bottom-6 right-6 z-30">
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-white/20 text-white shadow-xl border border-white/10">
                  <MoreHorizontal className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-white/10">
                <DropdownMenuItem onClick={triggerCoverInput} className="gap-3 cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <span>Upload Cover</span>
                </DropdownMenuItem>
                {coverImage && (
                  <DropdownMenuItem onClick={deleteCover} className="gap-3 cursor-pointer text-red-400 focus:text-red-400">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Cover</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Branding & Action Header Area (Outside/Bottom of Cover Photo) */}
        <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24 pt-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-12">
            {/* Branding - Left Bottom Outline */}
            <div className="space-y-2 text-left">
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-gradient leading-[0.85] drop-shadow-2xl">
                Artist Studio
              </h1>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-black text-white/60">
                Master: {user.name}
              </p>
            </div>

            {/* Primary CTA - Right Bottom Outline */}
            <div className="shrink-0">
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-14 md:h-16 rounded-full bg-vibrant-gradient text-white font-black uppercase tracking-[0.2em] text-[11px] md:text-xs px-10 md:px-12 hover:scale-105 transition-all shadow-lg shadow-primary/20 border-none">
                    <Upload className="w-5 h-5 mr-3" />
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
                        <input 
                          placeholder="Enter title..." 
                          className="flex h-11 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
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
                            <SelectItem value="Tutorial Preview">Tutorial Preview</SelectItem>
                            <SelectItem value="Performances">Performances</SelectItem>
                            <SelectItem value="Podcast">Podcast</SelectItem>
                            <SelectItem value="Blips">Blips (Max 30s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">
                        {videoCategory === "Blips" ? "Blip Video (Max 30s)" : "Main Video File"}
                      </Label>
                      <div onClick={triggerFileInput} className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-black/10 cursor-pointer hover:border-primary/50 transition-colors">
                        {selectedFile ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-primary truncate max-w-[200px]">{selectedFile.name}</span>
                            <span className="text-[8px] opacity-50 uppercase font-black">Ready to Sync</span>
                          </div>
                        ) : <FileVideo className="h-8 w-8 text-muted-foreground" />}
                      </div>
                    </div>

                    {videoCategory === "Tutorial Preview" && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-secondary/80">Master the Moves Video</Label>
                        <div onClick={triggerMasterMovesInput} className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-black/10 cursor-pointer hover:border-secondary/50 transition-colors">
                          <input type="file" ref={masterMovesInputRef} className="hidden" accept="video/*" onChange={handleMasterMovesChange} />
                          {masterMovesFile ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[9px] font-bold text-secondary truncate max-w-[200px]">{masterMovesFile.name}</span>
                              <span className="text-[8px] opacity-50 uppercase font-black">Linked Loop Ready</span>
                            </div>
                          ) : <FileVideo className="h-8 w-8 text-muted-foreground" />}
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter className="flex flex-col gap-2">
                    <Button onClick={handleUpload} disabled={isUploading || !isPublishEnabled} className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] h-12 rounded-xl">
                      {isUploading ? "Syncing to Realm..." : "Publish to Realm"}
                    </Button>
                    {isUploading && (
                      <div className="w-full space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-primary">
                          <span>Synchronizing</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-1 bg-white/5" />
                      </div>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Studio Sections Grid */}
        <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24 py-16 space-y-16">
          
          {/* Stats Grid */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {STUDIO_STATS.map((stat, idx) => (
              <Card key={idx} className="glass-card border-white/5 shadow-xl hover:scale-[1.02] transition-transform">
                <CardHeader className="pb-2 p-6">
                  <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardDescription>
                  <CardTitle className="text-3xl font-black tracking-tighter text-white">{stat.value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Filter className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Filter by Category</p>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full bg-black/20 border-none h-10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Tutorial Preview">Tutorial Previews</SelectItem>
                    <SelectItem value="Performances">Performances</SelectItem>
                    <SelectItem value="Podcast">Podcasts</SelectItem>
                    <SelectItem value="Blips">Blips</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <ArrowUpDown className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Sort Catalog</p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full bg-black/20 border-none h-10 rounded-xl text-[10px] font-black uppercase tracking-widest">
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
          </div>

          {/* Content Catalog */}
          <section className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <LayoutGrid className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Your Catalog</h2>
            </div>
            
            <div className="flex flex-col gap-10">
              {paginatedUploads.map((upload) => (
                <Card key={upload.id} className="relative glass-card border-white/5 overflow-hidden group shadow-2xl transition-all duration-500 hover:border-primary/30">
                  {/* Absolute positioned 3-dot vertical menu */}
                  <div className="absolute top-4 right-4 z-30">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10 text-white border border-white/5">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-card border-white/10">
                        <DropdownMenuItem 
                          onClick={() => initiateDelete(upload.id)} 
                          className="gap-3 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Masterpiece</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {upload.type === "Tutorial Preview" ? (
                    <div className="p-8 space-y-8">
                      <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <div className="space-y-2">
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{upload.title}</h3>
                          <div className="flex items-center gap-4">
                             <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[9px] font-black px-4 py-1.5 rounded-full">{upload.type}</Badge>
                             <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                               <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> {upload.views}</span>
                               <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-secondary" /> {upload.date}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/80">01. Master Preview</span>
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black px-3 py-1">HD READY</Badge>
                          </div>
                          <div className="aspect-video relative rounded-[2rem] overflow-hidden bg-black ring-1 ring-white/5 shadow-2xl">
                            <StudioVideo url={upload.videoUrl} poster={upload.thumbnail} />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary/80">02. Synchronized Loop</span>
                            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-[8px] font-black px-3 py-1">MASTER THE MOVES</Badge>
                          </div>
                          <div className="aspect-video relative rounded-[2rem] overflow-hidden bg-black ring-1 ring-white/5 shadow-2xl">
                            <StudioVideo url={upload.masterMovesUrl || upload.videoUrl} poster={upload.thumbnail} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row min-h-[280px]">
                      <div className="w-full md:w-[400px] aspect-video md:aspect-auto relative bg-black shrink-0 border-r border-white/5 overflow-hidden">
                        <StudioVideo url={upload.videoUrl} poster={upload.thumbnail} />
                      </div>
                      <div className="flex-1 p-8 space-y-6 flex flex-col justify-between">
                        <div className="space-y-3">
                          <Badge variant="outline" className={cn(
                            "mb-2 uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full",
                            upload.type === 'Blips' ? "text-accent border-accent/30 bg-accent/5" : "text-primary border-primary/30 bg-primary/5"
                          )}>
                            {upload.type}
                          </Badge>
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">{upload.title}</h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-10 pt-6 border-t border-white/5">
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Engagement</span>
                              <span className="text-xl font-black tracking-tighter text-white">{upload.views} <span className="text-[10px] text-primary">VIEWS</span></span>
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Synchronized</span>
                              <span className="text-xl font-black tracking-tighter text-white">{upload.date}</span>
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Realm Status</span>
                              <span className="text-xl font-black tracking-tighter text-emerald-400 uppercase">{upload.status}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {processedUploads.length > 0 && (
              <div className="flex items-center justify-center gap-6 pt-16 pb-24">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="h-14 w-14 rounded-2xl border-white/10 glass-card hover:border-primary hover:text-primary transition-all disabled:opacity-30 shadow-2xl"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <div className="flex items-center gap-4 glass-card px-8 py-3 rounded-2xl border-white/5 shadow-xl">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Page</span>
                  <span className="text-lg font-black tracking-tighter text-primary">{currentPage}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">of</span>
                  <span className="text-lg font-black tracking-tighter text-white">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="h-14 w-14 rounded-2xl border-white/10 glass-card hover:border-primary hover:text-primary transition-all disabled:opacity-30 shadow-2xl"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}

            {processedUploads.length === 0 && (
              <div className="text-center py-40 glass-card rounded-[4rem] border-dashed border-white/10 shadow-inner">
                <Music2 className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                <p className="text-3xl font-black italic uppercase tracking-tighter text-muted-foreground">
                  No masterpieces found in this realm.
                </p>
                <Button 
                  variant="link" 
                  className="text-primary uppercase font-black tracking-[0.4em] text-[11px] mt-8 hover:scale-105 transition-transform"
                  onClick={() => { setFilterType("All"); setSortBy("date-desc"); }}
                >
                  Reset Synchronization
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Confirmation Dialog for Deletion */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="glass-card border-white/10 bg-black/90 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-white/60 leading-relaxed font-medium">
              Are you sure you want to delete this video? This action will permanently remove your masterpiece from the Dance Realm catalog and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-4 mt-6">
            <AlertDialogCancel className="h-12 rounded-xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="h-12 rounded-xl bg-destructive text-destructive-foreground font-black uppercase tracking-widest text-[10px] hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all border-none"
            >
              Continue Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
