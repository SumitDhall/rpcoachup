
'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Search, User, Upload, FileVideo, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";

export default function ArtistsPage() {
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const filteredArtists = ARTISTS.filter(artist =>
    artist.name.toLowerCase().includes(search.toLowerCase()) ||
    artist.style.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          toast({
            title: "Success!",
            description: "Your dance video has been uploaded to the Realm.",
          });
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black text-gradient italic uppercase tracking-tighter">
            ARTISTS
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-bold">
            Discover the legends of the floor
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Upload Performance</DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-widest font-bold opacity-70">
                Share your rhythm with the world (Any file size supported)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="video-title" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Performance Title</Label>
                <Input id="video-title" placeholder="e.g. Midnight Samba Flow" className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-primary/80">Video File</Label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-black/10 hover:bg-black/20 transition-colors cursor-pointer group">
                  <FileVideo className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Video File</span>
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
                disabled={isUploading}
                className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isUploading ? "Syncing to Realm..." : "Finish Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
        <Input
          placeholder="Search by name or style..."
          className="pl-12 h-14 text-lg glass-card border-primary border-2 focus:border-primary focus-visible:ring-primary shadow-2xl shadow-primary/5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArtists.map(artist => (
          <Link key={artist.id} href={`/artists/${artist.id}`}>
            <Card className="glass-card border-white/5 hover:border-primary/40 hover:scale-[1.02] transition-all group cursor-pointer h-full">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform overflow-hidden relative shadow-lg">
                  <User className="h-10 w-10 text-primary" />
                  <img src={artist.image} alt={artist.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight">{artist.name}</h3>
                  <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-1">{artist.style}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filteredArtists.length === 0 && (
          <div className="text-center col-span-full py-24 glass-card rounded-3xl border-dashed border-white/10">
            <p className="text-muted-foreground text-lg">
              No rhythms found for <span className="text-primary font-bold italic">"{search}"</span>
            </p>
            <Button 
              variant="link" 
              className="mt-2 text-primary uppercase tracking-widest text-xs"
              onClick={() => setSearch("")}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
