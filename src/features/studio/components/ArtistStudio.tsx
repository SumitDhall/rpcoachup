'use client';

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { 
  Upload, 
  Eye,
  Calendar,
  Camera,
  Music
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STUDIO_STATS } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/providers/AuthProvider";
import { VideoPlayer } from "@/features/video/components/VideoPlayer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ArtistStudio() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [uploads, setUploads] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [masterMovesFile, setMasterMovesFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  const [videoTitle, setVideoTitle] = useState("");
  const [songName, setSongName] = useState("");
  const [videoCategory, setVideoCategory] = useState("Tutorial");
  const [difficultyLevel, setDifficultyLevel] = useState("Intermediate");
  
  const [filterType, setFilterType] = useState("All");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const masterMovesInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const baseMockData = [
      { id: "u1", title: "Midnight Samba Masterclass", date: "Oct 24, 2024", views: "12.5K", status: "Published", type: "Tutorial", difficulty: "Advanced", videoUrl: "/videos/v1.mp4", masterMovesUrl: "/videos/v2.mp4", thumbnail: "https://picsum.photos/seed/samba/800/450" },
      { id: "u2", title: "Urban Flow Choreography", date: "Oct 20, 2024", views: "45.2K", status: "Published", type: "Performances", videoUrl: "/videos/v3.mp4", thumbnail: "https://picsum.photos/seed/urban/800/450" },
      { id: "u3", title: "Ballet Basics: The Plie", date: "Oct 15, 2024", views: "8.9K", status: "Review", type: "Tutorial", difficulty: "Beginner", videoUrl: "/videos/v4.mp4", masterMovesUrl: "/videos/v1.mp4", thumbnail: "https://picsum.photos/seed/ballet/800/450" },
    ];
    setUploads(baseMockData);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };
  const handleMasterMovesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setMasterMovesFile(e.target.files[0]);
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setThumbnailFile(e.target.files[0]);
  };
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCoverImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newUpload = {
            id: `u-${Date.now()}`,
            title: videoTitle || "Untitled Masterpiece",
            song: songName,
            difficulty: videoCategory === "Tutorial" ? difficultyLevel : undefined,
            date: "Just Now",
            views: "0",
            status: "Published",
            type: videoCategory,
            videoUrl: URL.createObjectURL(selectedFile!),
            masterMovesUrl: masterMovesFile ? URL.createObjectURL(masterMovesFile) : undefined,
            thumbnail: thumbnailFile ? URL.createObjectURL(thumbnailFile) : "https://picsum.photos/seed/new/800/450"
          };
          setUploads(prev => [newUpload, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
          setIsDialogOpen(false);
          toast({ title: "Masterpiece Synchronized!" });
        }, 500);
      }
    }, 150);
  };

  const processedUploads = useMemo(() => {
    let result = [...uploads];
    if (filterType !== "All") result = result.filter(u => u.type === filterType);
    return result;
  }, [uploads, filterType]);

  if (!user) return null;

  return (
    <div className="min-h-screen relative animate-in fade-in duration-700">
      <div className="fixed inset-0 z-0">
        <Image src="/images/dance-realm_background_image_without_dancers.png" alt="BG" fill className="object-cover brightness-110 contrast-110" />
      </div>
      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />

      <div className="relative z-20">
        <section className="relative h-[65vh] w-full overflow-hidden group">
          {coverImage ? <Image src={coverImage} alt="Cover" fill className="object-cover" /> : <div className="w-full h-full bg-vibrant-gradient opacity-30" />}
          <div className="absolute bottom-6 right-6 z-30">
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
            <Button onClick={() => coverInputRef.current?.click()} variant="ghost" className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white">
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-8 md:px-12 pt-8">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-12">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-gradient leading-[0.85]">Artist Studio</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 md:h-16 rounded-full bg-vibrant-gradient text-white font-black uppercase tracking-[0.2em] px-10">
                  <Upload className="w-5 h-5 mr-3" /> Upload Masterpiece
                </Button>
              </DialogTrigger>
              <DialogContent className="p-[2px] bg-vibrant-gradient border-none max-w-xl rounded-[2.5rem] overflow-hidden">
                <div className="bg-[#050816]/95 text-white p-8 rounded-[calc(2.5rem-2px)] space-y-6 max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">New Masterpiece</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/80">Title</Label>
                      <Input placeholder="Title" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} className="bg-white/5" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/80">Category</Label>
                      <Select value={videoCategory} onValueChange={setVideoCategory}>
                        <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tutorial">Tutorial</SelectItem>
                          <SelectItem value="Performances">Performances</SelectItem>
                          <SelectItem value="Choreography">Choreography</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/80">Song Name</Label>
                      <Input placeholder="Song Name" value={songName} onChange={e => setSongName(e.target.value)} className="bg-white/5" />
                    </div>

                    {videoCategory === "Tutorial" && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/80">Difficulty</Label>
                        <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                          <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/80">{videoCategory === "Tutorial" ? "Preview Video" : "Primary Video"}</Label>
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-6 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
                          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                          <p className="text-center text-xs opacity-50 truncate">{selectedFile ? selectedFile.name : "Select Video"}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/80">Thumbnail Image</Label>
                        <div onClick={() => thumbnailInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-6 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
                          <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                          <p className="text-center text-xs opacity-50 truncate">{thumbnailFile ? thumbnailFile.name : "Select Image"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpload} disabled={isUploading || !selectedFile} className="w-full bg-primary h-12 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                      {isUploading ? "Syncing..." : "Publish Masterpiece"}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 space-y-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STUDIO_STATS.map((stat, idx) => (
              <Card key={idx} className="glass-card p-6">
                <p className="text-[10px] uppercase font-black opacity-50">{stat.label}</p>
                <h4 className="text-3xl font-black">{stat.value}</h4>
              </Card>
            ))}
          </div>

          <div className="space-y-10">
            {processedUploads.map((upload) => (
              <Card key={upload.id} className="glass-card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-[400px] aspect-video relative bg-black shrink-0">
                    <VideoPlayer url={upload.videoUrl} poster={upload.thumbnail} muted className="w-full h-full" />
                  </div>
                  <div className="p-8 space-y-4 flex-1">
                    <Badge className="bg-primary/20 text-primary">{upload.type}</Badge>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">{upload.title}</h3>
                    <div className="flex gap-6 text-[10px] font-black opacity-40">
                      <span className="flex items-center gap-2"><Eye className="w-3 h-3" /> {upload.views}</span>
                      <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {upload.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
