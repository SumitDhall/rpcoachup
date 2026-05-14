import React from 'react';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(187,133,255,0.1),transparent_70%)]">
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-gradient italic">
          DANCEVERSE
        </h1>
        <div className="space-y-2">
          <p className="text-lg md:text-xl text-muted-foreground font-medium uppercase tracking-[0.3em]">
            Universal Rhythm Dash
          </p>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(230,140,255,0.5)]" />
        </div>
      </div>
    </main>
  );
}
