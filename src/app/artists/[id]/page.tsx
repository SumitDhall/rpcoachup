'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Music2, Share2, Heart, Upload, FileVideo, CheckCircle2, Instagram, Facebook, MessageSquare } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
// import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/video';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const artist = ARTISTS.find((a) => a.id === id);
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("performance");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artistVideos, setArtistVideos] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newVideoUrl = URL.createObjectURL(selectedFile);
          const newVideo = {
            id: `v-new-${Date.now()}`,
            title: videoTitle || selectedFile.name.split('.')[0],
            url: newVideoUrl,
            category: videoCategory
          };

          setArtistVideos((prev) => [newVideo, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
          setVideoTitle("");
          setIsDialogOpen(false); 
          
          toast({
            title: "Performance Synced!",
            description: "Your masterpiece is now live in the Realm gallery.",
          });
        }, 500);
      }
    }, 100);
  };

  const shareLink = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-background relative pb-20">
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
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-3xl space-y-6 border-white/5">
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {artist.description}
              </p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => setIsLiked(!isLiked)}
                className={`rounded-full h-12 w-12 border-white/10 transition-all ${isLiked ? 'border-primary text-primary bg-primary/10' : 'hover:border-primary hover:text-primary'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-white/10 hover:border-primary hover:text-primary transition-all">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-white/10">
                  <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => window.open(`https://www.instagram.com/reels/`, '_blank')}>
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`, '_blank')}>
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => window.open(`https://wa.me/?text=Check out this artist on Dance Realm: ${shareLink}`, '_blank')}>
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 rounded-full h-12 font-bold uppercase tracking-widest text-xs shadow-lg transition-all ${isFollowing ? 'bg-secondary text-secondary-foreground shadow-secondary/20' : 'shadow-primary/20'}`}
              >
                {isFollowing ? 'Following' : 'Follow Artist'}
              </Button>
            </div>
          </div>
        </div>

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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-title" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Title</Label>
                      <Input 
                        id="video-title" 
                        placeholder="Midnight Samba" 
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
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="rehearsal">Rehearsal</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Video File</Label>
                    <div 
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-black/10 hover:bg-black/20 transition-all cursor-pointer group relative"
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
                            Select Video File
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
                    {isUploading ? "Syncing..." : "Finish Upload"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistVideos.map((video) => (
              <div key={video.id} className="group relative glass-card rounded-2xl overflow-hidden border-white/5 hover:border-primary/40 transition-all">
                <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                  <MediaPlayer src={video.url} className="w-full h-full object-cover">
                    <MediaProvider />
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                  </MediaPlayer>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Music2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm uppercase tracking-wider">{video.title}</span>
                      {video.category && (
                        <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">{video.category}</span>
                      )}
                    </div>
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