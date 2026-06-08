'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus, Play, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">

{/* Desktop + Tablet Background */}
{/* <Image
  src="/images/dance-realm_dash1_desktop.png"
  alt="Dance Realm Desktop Background"
  fill
  priority
  sizes="100vw"
  className="
    hidden md:block
    object-cover
    object-[65%_center]
    lg:object-center
    brightness-110
    contrast-110
  "
/> */}

{/* Desktop + Tablet Background */}
<div className="fixed inset-0 z-0 hidden md:block">
  <Image
    src="/images/dance-realm_dash2_desktop.png"
    alt="Dance Realm Desktop Background"
    fill
    priority
    sizes="100vw"
    className="
      object-cover
      md:object-[58%_center]
      lg:object-[55%_center]
      xl:object-center
      brightness-110
      contrast-110
    "
  />
</div>

{/* Mobile Background */}
<div className="fixed inset-0 z-0 block md:hidden">
  <Image
    src="/images/dance-realm_dash2_mobile.png"
    alt="Dance Realm Mobile Background"
    fill
    priority
    sizes="100vw"
    className="
      object-cover
      object-center
      brightness-110
      contrast-110
    "
  />
</div>
      {/* Layer 2 - Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 z-10 pointer-events-none" />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-[#050816]/90" /> */}
      
      {/* Layer 3 - Existing Content */}
      <div className="text-center space-y-12 relative z-30">

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Flame className="w-4 h-4 text-[#FF4FD8] fill-[#FF4FD8]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4F7FF]/80">
              Rhythm is Alive
            </span>
          </div>

          {/* <h1 className="text-gradient text-9xl font-black italic uppercase tracking-tighter"> */}
          <h1 className="text-gradient text-5xl sm:text-7xl md:text-9xl font-black italic uppercase tracking-tighter">
            DANCE ЯEALM
          </h1>

          <div className="space-y-3">
            <p className="text-xs sm:text-sm md:text-xl text-[#F4F7FF]/70 font-black uppercase tracking-[0.8em] max-w-3xl mx-auto leading-relaxed">
              Connecting Dancers Worldwide
            </p>

            <div className="h-1 w-64 bg-vibrant-gradient mx-auto rounded-full shadow-[0_0_30px_rgba(255,79,216,0.4)]" />
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 relative z-40">

          <Button
            asChild
            size="lg"
            className="h-16 px-10 rounded-full bg-vibrant-gradient text-white font-black uppercase tracking-[0.2em] hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(255,79,216,0.3)] border-none cursor-pointer"
          >
            <Link href="/artists" className="flex items-center gap-3">
              <Play className="w-5 h-5 fill-current" />
              Enter the Realm
            </Link>
          </Button>

          <div className="flex items-center gap-4">

            <Button
              asChild
              variant="outline"
              className="h-14 px-8 rounded-full border-white/20 glass-card hover:border-primary hover:bg-primary/10 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-primary" />
                Sign In
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-14 px-8 rounded-full border-secondary/40 glass-card hover:bg-secondary/10 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              <Link href="/register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-secondary" />
                Register
              </Link>
            </Button>

          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050816] to-transparent z-20 pointer-events-none" />

    </div>
  );
}