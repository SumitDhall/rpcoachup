'use client';

import React from "react";
import Link from "next/link";
import { LogIn, UserPlus, Play, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden dance-pattern bg-[#050816]">
      {/* Dynamic Animated Blobs */}
      <div className="blob top-0 -left-20" />
      <div className="blob blob-reverse bottom-0 -right-20" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050816]/40 to-[#050816] pointer-events-none" />

      <div className="text-center space-y-12 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 animate-bounce">
            <Flame className="w-4 h-4 text-primary fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4F7FF]/80">Rhythm is Alive</span>
          </div>
          
          <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter text-gradient italic leading-none drop-shadow-[0_0_30px_rgba(61,220,255,0.3)]">
            DANCE REALM
          </h1>
          
          <div className="space-y-3">
            <p className="text-sm md:text-xl text-[#F4F7FF]/70 font-black uppercase tracking-[0.6em] max-w-2xl mx-auto leading-relaxed">
              Connecting Dancers Worldwide
            </p>
            <div className="h-2 w-48 bg-vibrant-gradient mx-auto rounded-full shadow-[0_0_30px_rgba(61,220,255,0.6)] animate-pulse" />
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
          <Button asChild size="lg" className="h-16 px-10 rounded-full bg-vibrant-gradient text-[#050816] font-black uppercase tracking-[0.2em] hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(61,220,255,0.4)] border-none">
            <Link href="/artists" className="flex items-center gap-3">
              <Play className="w-5 h-5 fill-current" />
              Enter the Realm
            </Link>
          </Button>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="h-14 px-8 rounded-full border-white/20 glass-card hover:border-primary hover:bg-primary/10 text-xs font-black uppercase tracking-widest transition-all">
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-primary" />
                Sign In
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-14 px-8 rounded-full border-secondary/40 glass-card hover:bg-secondary hover:text-white text-xs font-black uppercase tracking-widest transition-all">
              <Link href="/register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-secondary" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050816] to-transparent z-20" />
    </main>
  );
}