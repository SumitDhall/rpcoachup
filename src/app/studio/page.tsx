'use client';

import React, { useEffect, useRef, useState } from "react";
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
  Lock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STUDIO_STATS, STUDIO_UPLOADS } from "@/lib/mock-data";
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
  const { toast } = useToast();

  const [uploads, setUploads] = useState(STUDIO_UPLOADS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("Performance");
  const [isDragging, setIsDragging] = useState(false);
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
            videoUrl: newVideoUrl
          };

          setUploads((prev) => [newUpload, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
          setVideoTitle("");
          setIsDialogOpen(false); 
          
          toast({
            title: "Masterpiece Synchronized!",
            description: "Your content is now live in the Artist Studio.",
          });
        }, 500);
      }
    }, 150);
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
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gradient" style={{ fontFamily: 'Cinzel, serif' }}>
            Artist Studio
          </h1>
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground">
            Master: {user.name}
          </p>
        </div>
        <div className="flex gap-4">
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
                  Synchronize your creation with the global realm
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
                    {uploads.map((upload) => (
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
              <div 
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                  isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/40 hover:bg-white/5"
                )}
              >
                <FileVideo className="w-10 h-10 text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Drop Video Here</span>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="w-full h-12 rounded-xl border border-primary/40 bg-transparent text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-[10px]"
              >
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
