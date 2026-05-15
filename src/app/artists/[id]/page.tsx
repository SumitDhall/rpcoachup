'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Play, Music2, Share2, Heart, Upload, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARTISTS } from "@/lib/mock-data";
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
import { useToast } from "@/hooks/use-toast";

export default function ArtistDetailPage() {
  const { id } = useParams();
  const artist = ARTISTS.find((a) => a.id === id);
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artistVideos, setArtistVideos] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (artist) {
      setArtistVideos(artist.videos);
    }
  }, [artist]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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
        description: "Please choose a video file to upload.",
      });
      return;
    }

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Create a temporary URL for the uploaded video to display it
          const newVideoUrl = URL.createObjectURL(selectedFile);
          const newVideo = {
            id: `v-new-${Date.now()}`,
            title: videoTitle || selectedFile.name.split('.')[0],
            url: newVideoUrl,
          };

          setArtistVideos((prev) => [newVideo, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
          setVideoTitle("");
          setIsDialogOpen(false); 
          
          toast({
            title: "Performance Synced!",
            description: "Your video has been successfully added to the Dance Realm gallery.",
          });
        }, 300);
      }
    }, 150);
  };

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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-10 px-4 rounded-full border-primary/40 text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-[10px]">
                  <Upload className="w-3.5 h-3.5 mr-2" />
                  Add New Video
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Upload for Dance Realm</DialogTitle>
                  <DialogDescription className="text-xs uppercase tracking-widest font-bold opacity-70">
                    Sync a new masterpiece to the global stage
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-title" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Performance Title</Label>
                    <Input 
                      id="video-title" 
                      placeholder="e.g. Midnight Samba Flow" 
                      className="bg-black/20 border-white/10" 
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Video File</Label>
                    <div 
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-black/10 hover:bg-black/20 transition-colors cursor-pointer group"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="video/*" 
                        onChange={handleFileChange}
                      />
                      <FileVideo className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center px-4">
                        {selectedFile ? selectedFile.name : "Select Video File"}
                      </span>
                    </div>
                  </div>
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Uploading...</span>
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
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isUploading ? "Syncing to Realm..." : "Finish Upload"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistVideos.map((video) => (
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
