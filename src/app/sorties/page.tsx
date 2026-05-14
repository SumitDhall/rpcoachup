'use client';

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Clock, Music2, Share2, Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

function ReelItem({ sortie }: { sortie: typeof MOCK_SORTIES[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isIntersecting) {
        videoRef.current.play().catch(err => console.log("Autoplay prevented", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isIntersecting]);

  return (
    <div className="h-screen w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={sortie.videoUrl}
        className="h-full w-full object-cover opacity-90"
        loop
        muted
        playsInline
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      
      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center pointer-events-auto">
        <div className="flex flex-col items-center gap-1 group">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:text-primary transition-all">
            <Heart className="h-6 w-6" />
          </Button>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Like</span>
        </div>
        <div className="flex flex-col items-center gap-1 group">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:text-primary transition-all">
            <MessageCircle className="h-6 w-6" />
          </Button>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Chat</span>
        </div>
        <div className="flex flex-col items-center gap-1 group">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:text-primary transition-all">
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Share</span>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-10 left-6 right-20 space-y-4 pointer-events-none">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">
            {sortie.title}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md">
              <Clock className="w-3 h-3 mr-1" />
              {sortie.duration}
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/70 uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-primary" />
              {sortie.location}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-white/80 line-clamp-2 leading-relaxed max-w-md drop-shadow-md">
          {sortie.description}
        </p>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-spin-slow">
            <Music2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="overflow-hidden whitespace-nowrap w-40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary animate-marquee inline-block">
              Original Audio • {sortie.title} Rhythms • Dance Realm exclusive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SortiesPage() {
  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      
      {MOCK_SORTIES.map((sortie) => (
        <ReelItem key={sortie.id} sortie={sortie} />
      ))}
    </div>
  );
}
