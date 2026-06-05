'use client';

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  ArrowUpDown
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

// Expanded Mock Data for Pagination Demo
const INITIAL_UPLOADS = [
  { id: "u1", title: "Midnight Samba Masterclass", date: "Oct 24, 2024", views: "12.5K", status: "Published", type: "Tutorial", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://picsum.photos/seed/samba/800/450" },
  { id: "u2", title: "Urban Flow Choreography", date: "Oct 20, 2024", views: "45.2K", status: "Published", type: "Performance", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", thumbnail: "https://picsum.photos/seed/urban/800/450" },
  { id: "u3", title: "Ballet Basics: The Plie", date: "Oct 15, 2024", views: "8.9K", status: "Review", type: "Tutorial", videoUrl: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://picsum.photos/seed/ballet/800/450" },
  { id: "u4", title: "Contemporary Expression", date: "Sep 12, 2024", views: "3.2K", status: "Published", type: "Performance", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", thumbnail: "https://picsum.photos/seed/contemp/800/450" },
  { id: "u5", title: "Hip Hop Foundations", date: "Aug 05, 2024", views: "21.1K", status: "Published", type: "Tutorial", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://picsum.photos/seed/hiphop/800/450" },
  { id: "u6", title: "Latin Heat Rehearsal", date: "Jul 20, 2024", views: "1.5K", status: "Draft", type: "Rehearsal", videoUrl: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://picsum.photos/seed/latin/800/450" },
  { id: "u7", title: "Jazz Fusion Routine", date: "Jun 15, 2024", views: "15.7K", status: "Published", type: "Performance", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", thumbnail: "https://picsum.photos/seed/jazz/800/450" },
  { id: "u8", title: "Breaking Level 1", date: "May 22, 2024", views: "5.4K", status: "Published", type: "Tutorial", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://picsum.photos/seed/break/800/450" },
  { id: "u9", title: "Popping Controls", date: "Apr 10, 2024", views: "10.2K", status: "Published", type: "Tutorial", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", thumbnail: "https://picsum.photos/seed/pop/800/450" },
  { id: "u10", title: "World of Dance Prep", date: "Mar 30, 2024", views: "30.5K", status: "Published", type: "Performance", videoUrl: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://picsum.photos/seed/prep/800/450" },
  { id: "u11", title: "Locking & Loading", date: "Feb 14, 2024", views: "2.8K", status: "Published", type: "Tutorial", videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", thumbnail: "https://picsum.photos/seed/lock/800/450" },
  { id: "u12", title: "Vogue Intro", date: "Jan 02, 2024", views: "7.1K", status: "Published", type: "Tutorial", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://picsum.photos/seed/vogue/800/450" },
];

function StudioVideo({ url, poster }: { url: string; poster?: string }) {
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
      muted: true,
      preload: 'none',
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
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
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

  const [uploads, setUploads] = useState(INITIAL_UPLOADS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("Performance");
  const [isDragging, setIsDragging] = useState(false);
  
  // Sorting and Filtering State
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'artist')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a video file.",
        });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please choose a masterpiece to upload.",
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
          const newVideoUrl = URL.createObjectURL(selectedFile);
          const newUpload = {
            id: `u-new-${Date.now()}`,
            title: videoTitle || selectedFile.name.split('.')[0],
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            views: "0",
            status: "Published",
            type: videoCategory,
            videoUrl: newVideoUrl,
            thumbnail: "https://picsum.photos/seed/new-upload/800/450"
          };

          setUploads((prev) => [newUpload, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
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

  const parseViews = (viewStr: string) => {
    if (viewStr.endsWith('K')) {
      return parseFloat(viewStr.replace('K', '')) * 1000;
    }
    if (viewStr.endsWith('M')) {
      return parseFloat(viewStr.replace('M', '')) * 1000000;
    }
    return parseFloat(viewStr);
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };


  if (isLoading || !user || user.role !== 'artist') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-secondary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Accessing Creator Core...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <style jsx global>{`
        .vjs-tech { object-fit: cover !important; }
        .video-js.vjs-fill { width: 100%; height: 100%; }
      `}</style>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gradient" style={{ fontFamily: 'Cinzel, serif' }}>
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
            <DialogContent className="glass-card border-white/10 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">New Masterpiece</DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-widest font-bold opacity-70">
                  Upload your creation with the dance realm
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-title" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Title</Label>
                    <Input 
                      id="video-title" 
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
                        <SelectItem value="Performance">Performance</SelectItem>
                        <SelectItem value="Tutorial">Tutorial</SelectItem>
                        <SelectItem value="Rehearsal">Rehearsal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Video File</Label>
                  <div 
                    onClick={triggerFileInput}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-black/10 transition-all cursor-pointer group relative",
                      isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:bg-black/20"
                    )}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="video/*" 
                      onChange={handleFileChange}
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-300">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Selected</span>
                        <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[200px]">
                          {selectedFile.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <FileVideo className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center px-4">
                          Select or Drag Masterpiece
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>Syncing to Realm...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading || !selectedFile}
                  className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
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
          <Card key={idx} className="glass-card border-white/5 hover:border-primary/20 transition-all overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12 text-primary" />
            </div>
            <CardHeader className="pb-2 p-4">
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </CardDescription>
              <CardTitle className="text-2xl font-black tracking-tighter">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Channel Content Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Channel Content</h2>
            <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] ml-2">
              {processedUploads.length} videos
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[130px] h-9 bg-black/20 border-white/5 text-[10px] font-black uppercase tracking-widest">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Rehearsal">Rehearsal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px] h-9 bg-black/20 border-white/5 text-[10px] font-black uppercase tracking-widest">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="views-desc">Most Views</SelectItem>
                  <SelectItem value="views-asc">Least Views</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Stable Content Area */}
        <div className="flex flex-col gap-6 min-h-[1000px] transition-all duration-300">
          {paginatedUploads.map((upload) => (
            <Card key={upload.id} className="glass-card border-white/5 hover:border-primary/20 transition-all overflow-hidden group animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-80 aspect-video relative bg-black shrink-0 border-b md:border-b-0 md:border-r border-white/5">
                  <StudioVideo url={upload.videoUrl} poster={upload.thumbnail} />
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5">
                        {upload.type}
                      </Badge>
                      <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border-none">
                        {upload.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">
                      {upload.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date Uploaded</p>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Calendar className="w-3 h-3 text-primary" />
                        {upload.date}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Views</p>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Eye className="w-3 h-3 text-primary" />
                        {upload.views}
                      </div>
                    </div>
                    <div className="space-y-1 hidden sm:block">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Avg. Retention</p>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Clock className="w-3 h-3 text-primary" />
                        84%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {paginatedUploads.length === 0 && (
            <div className="py-20 text-center glass-card border-dashed border-white/10 rounded-3xl">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs italic">
                No masterpieces found matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Stable Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <Button 
              variant="outline" 
              size="icon" 
              type="button"
              className="rounded-xl border-white/10 hover:border-primary/50" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button 
                  key={i}
                  size="sm" 
                  type="button"
                  variant={currentPage === i + 1 ? "default" : "ghost"}
                  className={cn(
                    "w-10 h-10 rounded-xl font-black transition-all",
                    currentPage === i + 1 ? "bg-primary text-primary-foreground scale-110" : "hover:bg-white/5"
                  )}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              type="button"
              className="rounded-xl border-white/10 hover:border-primary/50" 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </section>

      {/* Creator Goal */}
      <section className="space-y-6 pt-12 border-t border-white/5">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Creator Goal</h2>
        </div>
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-primary">Realm Pro Level Advancement</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">Watch Hours Accumulation</span>
                <span className="text-primary">45.2K / 50K</span>
              </div>
              <Progress value={90} className="h-2 bg-white/5" />
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">4.8K hours remaining for monetization unlock</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">Global Dancer Network</span>
                <span className="text-primary">85.4K / 100K</span>
              </div>
              <Progress value={85} className="h-2 bg-white/5" />
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">14.6K new followers until Elite Creator status</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
