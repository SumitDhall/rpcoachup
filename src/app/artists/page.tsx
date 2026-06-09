
'use client';

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ARTISTS } from "@/lib/mock-data";

const ITEMS_PER_PAGE = 9;

export default function ArtistsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // Filter artists based on search input
  const filteredArtists = useMemo(() => {
    return ARTISTS.filter(
      (artist) =>
        artist.name.toLowerCase().includes(search.toLowerCase()) ||
        artist.style.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Handle scroll to top when page changes
  useEffect(() => {
    if (topRef.current && currentPage > 1) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredArtists.length / ITEMS_PER_PAGE);
  const paginatedArtists = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArtists.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArtists, currentPage]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Desktop Background */}
      <div className="fixed inset-0 z-0 hidden md:block">
        <Image
          src="/images/dance-realm_background_image_without_dancers.png"
          alt="Dance Realm Background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-110 contrast-110"
        />
      </div>

      {/* Mobile Background */}
      <div className="fixed inset-0 z-0 block md:hidden">
        <Image
          src="/images/dance-realm_background_image_without_dancers.png"
          alt="Dance Realm Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-110 contrast-110"
        />
      </div>

      {/* Dark Overlay */}
      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />

      {/* Page Content */}
      <div className="relative z-20 max-w-6xl mx-auto p-8 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="blob top-0 left-0 opacity-10" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8" ref={topRef}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary fill-primary" />
              <h1 className="text-7xl md:text-9xl font-black text-gradient italic uppercase tracking-tighter leading-none">
                ARTISTS
              </h1>
            </div>

            <p className="text-[#F4F7FF]/50 uppercase tracking-[0.5em] text-xs font-black">
              Meet the Masters of Motion
            </p>
          </div>
        </div>

        <div className="relative max-w-2xl group">
          <div className="absolute -inset-1 bg-vibrant-gradient rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />

            <Input
              placeholder="Search rhythms, styles, names..."
              className="pl-16 h-16 text-lg glass-card border-none rounded-2xl focus-visible:ring-primary shadow-2xl bg-[#050816]/60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedArtists.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.id}`}>
              <Card className="glass-card border-white/10 hover:border-primary/50 hover:scale-[1.05] transition-all duration-500 group cursor-pointer h-full rounded-3xl overflow-hidden">
                <div className="h-64 w-full relative overflow-hidden">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-1000 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 rounded-full bg-vibrant-gradient text-[10px] font-black uppercase tracking-widest text-[#050816]">
                      {artist.style}
                    </span>
                  </div>
                </div>

                <CardContent className="p-8 space-y-2">
                  <h3 className="font-black text-3xl italic uppercase tracking-tighter text-[#F4F7FF] group-hover:text-primary transition-colors">
                    {artist.name}
                  </h3>

                  <p className="text-xs text-[#F4F7FF]/40 line-clamp-2 leading-relaxed">
                    {artist.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {filteredArtists.length === 0 && (
            <div className="text-center col-span-full py-32 glass-card rounded-[3rem] border-dashed border-white/20">
              <p className="text-[#F4F7FF]/40 text-2xl font-black italic uppercase tracking-tighter">
                No rhythms match{" "}
                <span className="text-gradient">"{search}"</span>
              </p>

              <Button
                variant="link"
                className="mt-4 text-primary font-black uppercase tracking-[0.3em] text-sm"
                onClick={() => setSearch("")}
              >
                Reset Search
              </Button>
            </div>
          )}
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-12 pb-24">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-12 w-12 rounded-xl border-white/10 glass-card hover:border-primary hover:text-primary transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Page</span>
              <span className="text-sm font-black tracking-tighter text-primary">{currentPage}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">of</span>
              <span className="text-sm font-black tracking-tighter">{totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-12 w-12 rounded-xl border-white/10 glass-card hover:border-primary hover:text-primary transition-all disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
