
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Page() {
  return (
    <div className="flex flex-col h-full relative">
      {/* Desktop Navigation - Visible only on larger screens */}
      <nav className="hidden md:flex absolute top-10 right-10 z-50 items-center gap-8">
        <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
          Artists
        </a>
        <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
          Sorties
        </a>
      </nav>

      {/* Mobile Navigation Trigger - Visible only on mobile */}
      <div className="md:hidden absolute top-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-primary">
              <Menu className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-card border-l border-white/10">
            <SheetHeader>
              <SheetTitle className="text-gradient text-2xl font-bold text-left">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 mt-12">
              <a href="#" className="text-xl font-bold uppercase tracking-wider hover:text-primary transition-colors">
                Artists
              </a>
              <a href="#" className="text-xl font-bold uppercase tracking-wider hover:text-primary transition-colors">
                Sorties
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center p-6">
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
    </div>
  );
}
