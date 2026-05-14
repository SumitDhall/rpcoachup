import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <main className="flex flex-col items-center justify-center p-6">
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
