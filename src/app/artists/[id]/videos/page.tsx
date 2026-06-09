
'use client';

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Calendar, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ARTISTS } from "@/lib/mock-data";

// Video.js imports
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const ITEMS_PER_PAGE = 10;

function SmallVideoPlayer({ url }: { url: string }) {
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
    <div className="h-28 w-48 rounded-xl overflow-hidden relative bg-black shadow-2xl ring-1 ring-white/5">
      <div 
        ref={containerRef} 
        className="w-full h-full [&_.video-js]:h-full [&_.video-js]:w-full [&_video]:object-cover" 
      />
    </div>
  );
}

export default function ArtistVideosPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const artist = ARTISTS.find((a) => a.id === id);
  
  const initialType = searchParams.get('type') || "All";
  const [filterType, setFilterType] = useState(initialType);
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate some random dates and view counts for the mock videos to make the table look realistic
  const allVideos = useMemo(() => {
    if (!artist) return [];
    
    // We categorize the artist's existing videos into the three types
    const types = ["TUTORIAL PREVIEW", "Performances", "Podcasts"];
    return artist.videos.map((v, idx) => ({
      ...v,
      type: types[idx % types.length],
      date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      views: Math.floor(Math.random() * 50000) + 1000,
      id: `${v.id}-${idx}`
    }));
  }, [artist]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, sortBy]);

  const processedVideos = useMemo(() => {
    let result = [...allVideos];
    
    if (filterType !== "All") {
      result = result.filter(v => v.type === filterType);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "views-desc":
          return b.views - a.views;
        case "views-asc":
          return a.views - b.views;
        default:
          return 0;
      }
    });

    return result;
  }, [allVideos, filterType, sortBy]);

  const totalPages = Math.ceil(processedVideos.length / ITEMS_PER_PAGE);
  const paginatedVideos = processedVideos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-black italic text-gradient">Artist Not Found</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/artists">Back to Artists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-32">
      <style jsx global>{`
        .vjs-tech { object-fit: cover !important; }
        .video-js.vjs-fill { width: 100%; height: 100%; }
      `}</style>

      {/* Background Layers */}
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

      {/* Content */}
      <div className="relative z-20">
        {/* Hero Section */}
        <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover opacity-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute top-8 left-8 z-10">
            <Button asChild variant="ghost" className="rounded-full bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/10">
              <Link href={`/artists/${artist.id}`} className="flex items-center gap-2 px-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back to Profile</span>
              </Link>
            </Button>
          </div>

          <div className="absolute bottom-16 left-8 right-8 space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-primary border-primary/40 bg-primary/10 uppercase tracking-[0.2em] px-3 py-1 text-[10px] font-black">
                FULL CATALOG
              </Badge>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl leading-none">
                {artist.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Catalog Content */}
        <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-30 space-y-12">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center gap-6 glass-card p-6 rounded-3xl border-white/5 shadow-2xl">
             <div className="flex items-center gap-4 flex-1 w-full">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Filter className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Filter by Type</p>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-white/5 border-none h-11 rounded-xl text-[11px] font-black uppercase tracking-widest">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="All">All Videos</SelectItem>
                      <SelectItem value="TUTORIAL PREVIEW">Tutorial Previews</SelectItem>
                      <SelectItem value="Performances">Performances</SelectItem>
                      <SelectItem value="Podcasts">Podcasts</SelectItem>
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
                    <SelectTrigger className="bg-white/5 border-none h-11 rounded-xl text-[11px] font-black uppercase tracking-widest">
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

          {/* Tabular Display */}
          <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[220px] text-[10px] font-black uppercase tracking-widest text-primary">Preview</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary">Title & Master</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary">Category</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary">Published</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary text-right">Views</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVideos.map((video) => (
                  <TableRow key={video.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                    <TableCell className="py-8">
                      <SmallVideoPlayer url={video.url} />
                    </TableCell>
                    <TableCell className="py-8">
                      <div className="space-y-2">
                        <p className="font-black italic text-xl uppercase tracking-tight text-white group-hover:text-primary transition-colors leading-tight">{video.title}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Master of Motion: {artist.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                        {video.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                        <Calendar className="w-3 h-3 text-secondary" />
                        {new Date(video.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2 text-sm font-black tracking-tighter text-white">
                        <Eye className="w-4 h-4 text-primary" />
                        {video.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                        <Play className="h-6 w-6 fill-current" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {processedVideos.length === 0 && (
              <div className="py-32 text-center space-y-4">
                <Music2 className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                <p className="text-2xl font-black italic uppercase tracking-tighter text-muted-foreground">No matches in the Realm</p>
                <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px]" onClick={() => { setFilterType("All"); setSortBy("date-desc"); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 pt-8 pb-24">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border-white/10 glass-card hover:border-primary hover:text-primary transition-all disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Page</span>
                <span className="text-xl font-black italic text-primary">{currentPage}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">of {totalPages}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border-white/10 glass-card hover:border-primary hover:text-primary transition-all disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
