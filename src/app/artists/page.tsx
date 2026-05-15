'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Search, User, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ARTISTS } from "@/lib/mock-data";

export default function ArtistsPage() {
  const [search, setSearch] = useState("");

  const filteredArtists = ARTISTS.filter(artist =>
    artist.name.toLowerCase().includes(search.toLowerCase()) ||
    artist.style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">
      <div className="blob top-0 left-0 opacity-10" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-accent fill-accent" />
            <h1 className="text-7xl md:text-9xl font-black text-gradient italic uppercase tracking-tighter leading-none">
              ARTISTS
            </h1>
          </div>
          <p className="text-white/50 uppercase tracking-[0.5em] text-xs font-black">
            Meet the Masters of Motion
          </p>
        </div>
      </div>
      
      <div className="relative max-w-2xl group z-10">
        <div className="absolute -inset-1 bg-vibrant-gradient rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
          <Input
            placeholder="Search rhythms, styles, names..."
            className="pl-16 h-16 text-lg glass-card border-none rounded-2xl focus-visible:ring-primary shadow-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {filteredArtists.map(artist => (
          <Link key={artist.id} href={`/artists/${artist.id}`}>
            <Card className="glass-card border-white/10 hover:border-primary/50 hover:scale-[1.05] transition-all duration-500 group cursor-pointer h-full rounded-3xl overflow-hidden">
              <div className="h-64 w-full relative overflow-hidden">
                <img src={artist.image} alt={artist.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 rounded-full bg-vibrant-gradient text-[10px] font-black uppercase tracking-widest">
                    {artist.style}
                  </span>
                </div>
              </div>
              <CardContent className="p-8 space-y-2">
                <h3 className="font-black text-3xl italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                  {artist.name}
                </h3>
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {artist.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filteredArtists.length === 0 && (
          <div className="text-center col-span-full py-32 glass-card rounded-[3rem] border-dashed border-white/20">
            <p className="text-white/40 text-2xl font-black italic uppercase tracking-tighter">
              No rhythms match <span className="text-gradient">"{search}"</span>
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
    </div>
  );
}
