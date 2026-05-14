
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center border-b border-white/5 px-6 shrink-0">
        <SidebarTrigger />
        <div className="ml-4 h-4 w-px bg-white/10" />
        <h2 className="ml-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Home
        </h2>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gradient italic">
            DANCEVERSE
          </h1>
          <div className="space-y-2">
            <p className="text-base md:text-lg text-muted-foreground font-medium uppercase tracking-[0.3em]">
              Universal Rhythm Dash
            </p>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(230,140,255,0.5)]" />
          </div>
        </div>
      </main>
    </div>
  );
}
