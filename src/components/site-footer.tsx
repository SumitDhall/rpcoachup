'use client';

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Calendar, Users, DollarSign, PlusCircle, ShieldCheck, Instagram, Twitter, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function SiteFooter() {
  const brandLogo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  return (
    <footer className="relative bg-black/80 backdrop-blur-md border-t border-white/10 pt-16 pb-24 px-6 md:px-12 mt-auto z-10 overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/dance-realm_background_footer.png"
          alt="Footer Background"
          fill
          className="object-cover opacity-40 brightness-75 contrast-125"
          priority
        />
        {/* Darkening and Blur Overlay to ensure legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#050816]/80 to-[#050816]/95" />
      </div>

      {/* Background Glows */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-10" />

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-16 mb-16">
          {/* Brand Section */}
          <div className="space-y-6 flex flex-col items-start lg:col-span-1">
            <Link href="/" className="group block">
              <div className="relative h-24 w-60 md:h-36 md:w-96 group-hover:scale-105 transition-transform duration-500">
                {brandLogo && (
                  <Image
                    src={brandLogo.imageUrl}
                    alt="Dance Realm Logo"
                    fill
                    className="object-contain object-left"
                    data-ai-hint="dance logo"
                    priority
                  />
                )}
              </div>
            </Link>
            <p className="text-[#F4F7FF]/70 text-sm leading-relaxed max-w-sm">
            World's stage for dancers and artists. Learn from renowned creators anywhere. Share your Blips and be part of a global community, creativity, and expression.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-[#F4F7FF]/60 hover:text-primary">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-[#F4F7FF]/60 hover:text-primary">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-[#F4F7FF]/60 hover:text-primary">
                <span className="sr-only">Youtube</span>
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
            <Badge variant="outline" className="border-white/10 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 text-[#F4F7FF]/60 bg-white/[0.05]">
              Synchronized 2026
            </Badge>
          </div>

          {/* Navigation Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Discover Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Discover</h4>
              <nav className="flex flex-col gap-4">
                <Link href="#" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/70 hover:text-white transition-colors group">
                  <Calendar className="h-4 w-4 group-hover:text-primary transition-colors" /> Events
                </Link>
                <Link href="/artists" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/70 hover:text-white transition-colors group">
                  <Users className="h-4 w-4 group-hover:text-primary transition-colors" /> Artists
                </Link>
                <Link href="#" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/70 hover:text-white transition-colors group">
                  <DollarSign className="h-4 w-4 group-hover:text-primary transition-colors" /> Pricing
                </Link>
              </nav>
            </div>

            {/* Support Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Support</h4>
              <nav className="flex flex-col gap-4">
                <Link href="#" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/70 hover:text-white transition-colors group">
                  <Mail className="h-4 w-4 group-hover:text-accent transition-colors" /> Contact
                </Link>
                <Link href="#" className="text-xs font-black uppercase tracking-widest text-[#F4F7FF]/70 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-xs font-black uppercase tracking-widest text-[#F4F7FF]/70 hover:text-white transition-colors">Terms of Use</Link>
                <Link href="#" className="text-xs font-black uppercase tracking-widest text-[#F4F7FF]/70 hover:text-white transition-colors">Transparency</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4F7FF]/40 text-center md:text-left">
            © 2026 Dance Realm. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#F4F7FF]/40">
            <span>Built by <span className="text-primary hover:text-primary/80 cursor-pointer">sk group</span></span>
            <span className="hidden md:inline h-1.5 w-1.5 bg-white/10 rounded-full" />
            <span>Secure by <span className="text-[#F4F7FF]/80">Stripe</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}