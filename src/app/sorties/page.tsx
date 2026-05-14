'use client';

import React from "react";
import { Play, Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_SORTIES = [
  {
    id: 1,
    title: "Urban Flow Night",
    description: "Highlights from our latest street dance battle in downtown Los Angeles.",
    location: "Los Angeles, CA",
    date: "Oct 24, 2024",
    duration: "0:45",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    title: "Salsa Social Highlights",
    description: "The energy was electric at the Summer Salsa Social. Best moments captured.",
    location: "Miami, FL",
    date: "Sep 12, 2024",
    duration: "0:58",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 3,
    title: "Contemporary Showcase",
    description: "A beautiful expression of movement from the annual Contemporary Arts festival.",
    location: "New York, NY",
    date: "Aug 05, 2024",
    duration: "0:32",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 4,
    title: "Ballet Rehearsal Sessions",
    description: "Behind the scenes look at the precision and grace of our lead principal dancers.",
    location: "London, UK",
    date: "Jul 20, 2024",
    duration: "0:55",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  }
];

export default function SortiesPage() {
  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black text-gradient italic uppercase tracking-tighter">
            SORTIES
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-bold">
            Recent rhythmic captures & event highlights
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {MOCK_SORTIES.map((sortie) => (
          <Card key={sortie.id} className="glass-card overflow-hidden border-white/5 group hover:border-primary/30 transition-all">
            <div className="aspect-video relative bg-black/40">
              <video 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                controls
                preload="none"
                poster={`https://picsum.photos/seed/sortie${sortie.id}/800/450`}
                data-ai-hint="dance performance"
              >
                <source src={sortie.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-primary font-bold">
                  <Clock className="w-3 h-3 mr-1" />
                  {sortie.duration}
                </Badge>
              </div>
            </div>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-black italic tracking-tight uppercase group-hover:text-primary transition-colors">
                  {sortie.title}
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {sortie.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-primary/60" />
                  {sortie.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-primary/60" />
                  {sortie.date}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
