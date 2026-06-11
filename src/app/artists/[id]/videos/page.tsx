
'use client';

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Calendar, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ARTISTS } from "@/lib/mock-data";
import { VideoPlayer } from "@/features/video/components/VideoPlayer";

const ITEMS_PER_PAGE = 5;

function VideoCatalogItem({ video, artistName }: { video: any, artistName: string }) {
  return (
    <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden group transition-all duration-500 hover:border-primary/30 flex flex-col lg:flex-row shadow-2xl">
      <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 aspect-video lg:aspect-auto lg:h-[350px] relative bg-black">
        <VideoPlayer url={video.url} muted={false} controls className="w-full h-full" />
      </div>
      <div className="p-8 md:p-10 flex-1 flex flex-col justify-between gap-8">
        <div className="space-y-6">
          <Badge variant="outline" className="text-primary uppercase tracking-[0.3em] font-black">{video.type}</Badge>
          <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{video.title}</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Master: {artistName}</p>
        </div>
        <div className="flex items-center gap-4">
          {video.type === "TUTORIAL PREVIEW" && (
            <Button className="h-14 px-10 rounded-2xl bg-vibrant-gradient text-white font-black uppercase tracking-widest text-[11px]">
              <Play className="w-4 h-4 mr-3 fill-current" /> Master The Moves
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArtistVideosPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const artist = ARTISTS.find((a) => a.id === id);
  const catalogTopRef = useRef<HTMLDivElement>(null);
  
  const initialType = searchParams.get('type') || "All";
  const [filterType, setFilterType] = useState(initialType);
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const allVideos = useMemo(() => {
    if (!artist) return [];
    const types = ["TUTORIAL PREVIEW", "Performances", "Podcasts"];
    return artist.videos.map((v, idx) => ({
      ...v,
      type: types[idx % types.length],
      date: `2024-10-${idx + 1}`,
      views: 1000 + idx * 500,
      id: `${v.id}-${idx}`
    }));
  }, [artist]);

  const processedVideos = useMemo(() => {
    let result = [...allVideos];
    if (filterType !== "All") result = result.filter(v => v.type === filterType);
    return result;
  }, [allVideos, filterType]);

  const totalPages = Math.ceil(processedVideos.length / ITEMS_PER_PAGE);
  const paginatedVideos = processedVideos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (!artist) return <div className="min-h-screen flex items-center justify-center"><h1>Artist Not Found</h1></div>;

  return (
    <div className="min-h-screen relative pb-32">
      <div className="fixed inset-0 z-0">
        <Image src="/images/dance-realm_background_image_without_dancers.png" alt="BG" fill className="object-cover brightness-110 contrast-110" />
      </div>
      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />

      <div className="relative z-20">
        <div className="relative h-[45vh] w-full overflow-hidden">
          <Image src={artist.image} alt={artist.name} fill className="object-cover" priority />
          <div className="absolute top-8 left-8 z-10">
            <Button asChild variant="ghost" className="rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Link href={`/artists/${artist.id}`}><ArrowLeft className="w-4 h-4 mr-2" />Profile</Link>
            </Button>
          </div>
          <div className="absolute bottom-16 left-8">
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">{artist.name} Catalog</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-30 space-y-12" ref={catalogTopRef}>
          <div className="flex gap-6 glass-card p-6 rounded-[2.5rem] border-white/5">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="TUTORIAL PREVIEW">Tutorials</SelectItem>
                <SelectItem value="Performances">Performances</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-12">
            {paginatedVideos.map((video) => (
              <VideoCatalogItem key={video.id} video={video} artistName={artist.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
