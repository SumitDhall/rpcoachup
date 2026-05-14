export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative">
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-gradient italic">
          DANCE REALM
        </h1>
        <div className="space-y-2">
          <p className="text-base md:text-xl text-muted-foreground font-medium uppercase tracking-[0.4em]">
            Connecting Dancers Worldwide
          </p>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full shadow-[0_0_20px_rgba(82,168,255,0.6)]" />
        </div>
      </div>
    </main>
  );
}
