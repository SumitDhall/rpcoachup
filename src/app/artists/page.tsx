'use client';

import React, { useState } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_ARTISTS = [
  { id: 1, name: "Julianne Hough", style: "Ballroom" },
  { id: 2, name: "Derek Hough", style: "Contemporary" },
  { id: 3, name: "Misty Copeland", style: "Ballet" },
  { id: 4, name: "Les Twins", style: "Hip Hop" },
  { id: 5, name: "Travis Wall", style: "Jazz" },
  { id: 6, name: "Parris Goebel", style: "Urban" },
  { id: 7, name: "Mikhail Baryshnikov", style: "Ballet" },
  { id: 8, name: "Sofia Boutella", style: "Street" },
];

export default function ArtistsPage() {
  const [search, setSearch] = useState("");

  const filteredArtists = MOCK_ARTISTS.filter(artist =>
    artist.name.toLowerCase().includes(search.toLowerCase()) ||
    artist.style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black text-gradient italic uppercase tracking-tighter">
            ARTISTS
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-bold">
            Discover the legends of the floor
          </p>
        </div>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/60" />
          <Input
            placeholder="Search by name or style..."
            className="pl-12 h-14 text-lg glass-card border-primary/30 focus:border-primary/60 hover:border-primary/50 transition-colors focus-visible:ring-primary shadow-2xl shadow-primary/5"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArtists.map(artist => (
          <Card key={artist.id} className="glass-card border-white/5 hover:border-primary/40 hover:scale-[1.02] transition-all group cursor-pointer">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl tracking-tight">{artist.name}</h3>
                <p className="text-xs text-primary font-black uppercase tracking-[0.2em] mt-1">{artist.style}</p>
              </div>
            </CardContent>
          </Card>
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
