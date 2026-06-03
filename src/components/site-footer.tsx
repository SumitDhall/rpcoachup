
'use client';

import Link from "next/link";
import { Zap, Mail, MapPin, Calendar, Users, DollarSign, PlusCircle, ShieldCheck, Instagram, Twitter, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SiteFooter() {
  return (
    <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10 px-8 md:px-12 mt-auto relative z-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-2xl bg-vibrant-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 shadow-primary/20">
                <Zap className="h-6 w-6 text-[#050816] fill-current" />
              </div>
              <span className="text-3xl font-black italic uppercase tracking-tighter text-gradient">Dance Realm</span>
            </Link>
            <p className="text-[#F4F7FF]/60 text-sm leading-relaxed max-w-sm">
              The global home of rhythm and movement. Discover artists, sessions, and festivals - and connect with the dancers shaping the realm.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-all text-[#F4F7FF]/40 hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-all text-[#F4F7FF]/40 hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-all text-[#F4F7FF]/40 hover:text-primary">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
            <Badge variant="outline" className="border-white/5 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 text-[#F4F7FF]/40 bg-white/[0.02]">
              Crafted in the Realm
            </Badge>
          </div>

          {/* Discover Section */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Discover</h4>
            <nav className="flex flex-col gap-5">
              <Link href="#" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors group">
                <Calendar className="h-4 w-4 group-hover:text-primary transition-colors" /> Events
              </Link>
              <Link href="/artists" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors group">
                <Users className="h-4 w-4 group-hover:text-primary transition-colors" /> Artists
              </Link>
              <Link href="#" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors group">
                <MapPin className="h-4 w-4 group-hover:text-primary transition-colors" /> Maps
              </Link>
              <Link href="#" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors group">
                <DollarSign className="h-4 w-4 group-hover:text-primary transition-colors" /> Pricing
              </Link>
            </nav>
          </div>

          {/* For Organizers Section */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">For Organizers</h4>
            <nav className="flex flex-col gap-5">
              <Link href="#" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors group">
                <PlusCircle className="h-4 w-4 group-hover:text-secondary transition-colors" /> Create Event
              </Link>
              <Link href="#" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors group">
                <ShieldCheck className="h-4 w-4 group-hover:text-secondary transition-colors" /> Plans
              </Link>
            </nav>
          </div>

          {/* Support Section */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Support</h4>
            <nav className="flex flex-col gap-5">
              <Link href="#" className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors group">
                <Mail className="h-4 w-4 group-hover:text-accent transition-colors" /> Contact
              </Link>
              <Link href="#" className="text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors">Terms of Use</Link>
              <Link href="#" className="text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors">Cookie Settings</Link>
              <Link href="#" className="text-xs font-black uppercase tracking-widest text-[#F4F7FF]/60 hover:text-white transition-colors">Transparency Report</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F4F7FF]/30">
            © 2024 Dance Realm. All rhythms reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#F4F7FF]/30">
            <span>Built by <span className="text-primary hover:text-primary/80 cursor-pointer">Inteleforge</span></span>
            <span className="hidden md:inline h-1 w-1 bg-white/20 rounded-full" />
            <span>Secure payments by <span className="text-[#F4F7FF]/60">Stripe</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
