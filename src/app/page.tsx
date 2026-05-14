
'use client';

import React from "react";
import { Menu, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DanceLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
  >
    <circle cx="12" cy="5" r="2.5" />
    <path d="M12 7.5c-2.5 0-5.5 1.5-6.5 4s1.5 4.5 4.5 4.5 4.5-1.5 5.5-4-1.5-4.5-4.5-4.5z" />
    <path d="M10 16v5M14 16v5" />
    <path d="M5.5 11.5C3.5 13 2 16 2 16M18.5 11.5C20.5 13 22 16 22 16" />
  </svg>
);

export default function Page() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Navigation Trigger - Visible only on mobile */}
      <div className="md:hidden absolute top-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-primary border border-primary/20 bg-card/50 backdrop-blur-sm">
              <Menu className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-card border-l border-white/10 w-80">
            <SheetHeader className="mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <DanceLogo />
                </div>
                <SheetTitle className="text-gradient text-2xl font-bold">DanceVerse</SheetTitle>
              </div>
            </SheetHeader>
            <nav className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold uppercase tracking-wider transition-colors">
                <Users className="h-5 w-5" />
                Artists
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground font-bold uppercase tracking-wider transition-colors">
                <Calendar className="h-5 w-5" />
                Sorties
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gradient italic">
            DANCEVERSE
          </h1>
          <div className="space-y-2">
            <p className="text-base md:text-xl text-muted-foreground font-medium uppercase tracking-[0.4em]">
              Universal Rhythm Dash
            </p>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full shadow-[0_0_20px_rgba(82,168,255,0.6)]" />
          </div>
        </div>
      </main>

      {/* Desktop Persistent Right Sidebar */}
      <aside className="hidden md:flex w-72 flex-col glass-card border-l border-white/5 p-6 space-y-8 z-40">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-xl text-primary shadow-[0_0_15px_rgba(82,168,255,0.2)]">
            <DanceLogo />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient leading-none">DanceVerse</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold px-4 mb-2">
            Navigation
          </div>
          <a 
            href="#" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.02]"
          >
            <Users className="h-4 w-4" />
            Artists
          </a>
          <a 
            href="#" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 font-bold uppercase tracking-widest text-xs transition-all"
          >
            <Calendar className="h-4 w-4" />
            Sorties
          </a>
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent p-4 border border-white/5">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">System Status</p>
            <p className="text-[10px] text-muted-foreground">All rhythms synchronized.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
