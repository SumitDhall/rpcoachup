
'use client';

import React from "react";
import Link from "next/link";
import { LogIn, UserPlus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

      <div className="text-center space-y-12 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div className="space-y-6">
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter text-gradient italic leading-none">
            DANCE REALM
          </h1>
          <div className="space-y-3">
            <p className="text-sm md:text-lg text-muted-foreground font-bold uppercase tracking-[0.5em] opacity-80">
              Connecting Dancers Worldwide
            </p>
            <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full shadow-[0_0_25px_rgba(82,168,255,0.8)]" />
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Button asChild size="lg" className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-primary/20">
            <Link href="/artists" className="flex items-center gap-3">
              <Play className="w-4 h-4 fill-current" />
              Start Exploring
            </Link>
          </Button>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="h-12 px-6 rounded-full border-white/10 glass-card hover:border-primary/50 hover:bg-primary/5 text-xs font-bold uppercase tracking-widest transition-all">
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-12 px-6 rounded-full border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-xs font-bold uppercase tracking-widest transition-all border-2">
              <Link href="/register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
