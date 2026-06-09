'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Calendar, Users, DollarSign, PlusCircle, ShieldCheck, Instagram, Twitter, Youtube, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const brandLogo = PlaceHolderImages.find(img => img.id === 'brand-logo');
  const [hasDownloaded, setHasDownloaded] = useState(false);

  return (
    <footer className="relative border-t border-white/10 pt-16 pb-24 px-6 md:px-12 mt-auto z-10 overflow-hidden min-h-[400px]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/dance-realm_background_footer.png"
          alt="Footer Background"
          fill
          className="object-cover opacity-45 brightness-50 contrast-110"
          priority
        />
        {/* Darker Overlay to ensure depth and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-[#050816]/50 to-[#050816]/90 backdrop-blur-[2px]" />
      </div>

      {/* Background Glows */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-60 z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full pointer-events-none opacity-60 z-10" />

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
            <p className="text-[#F4F7FF] text-sm leading-relaxed max-w-sm font-medium drop-shadow-md">
            World's stage for dancers and artists. Learn from renowned creators anywhere. Share your Blips and be part of a global community, creativity, and expression.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full border border-white/30 bg-black/20 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-[#F4F7FF] hover:text-primary backdrop-blur-sm">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border border-white/30 bg-black/20 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-[#F4F7FF] hover:text-primary backdrop-blur-sm">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full border border-white/30 bg-black/20 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-[#F4F7FF] hover:text-primary backdrop-blur-sm">
                <span className="sr-only">Youtube</span>
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
            <Badge variant="outline" className="border-white/20 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 text-white bg-white/[0.1] backdrop-blur-md">
              Synchronized 2026
            </Badge>
          </div>

          {/* Navigation Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Discover Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary drop-shadow-[0_0_10px_rgba(255,79,216,0.5)]">Discover</h4>
              <nav className="flex flex-col gap-4">
                <Link href="#" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors group drop-shadow-sm">
                  <Calendar className="h-4 w-4 group-hover:text-primary transition-colors" /> Events
                </Link>
                <Link href="/artists" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors group drop-shadow-sm">
                  <Users className="h-4 w-4 group-hover:text-primary transition-colors" /> Artists
                </Link>
                <Link href="#" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors group drop-shadow-sm">
                  <DollarSign className="h-4 w-4 group-hover:text-primary transition-colors" /> Pricing
                </Link>
              </nav>
            </div>

            {/* Support Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent drop-shadow-[0_0_10px_rgba(255,230,0,0.5)]">Support</h4>
              <nav className="flex flex-col gap-4">
                <Link href="/contact" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors group drop-shadow-sm">
                  <Mail className="h-4 w-4 group-hover:text-accent transition-colors" /> Contact
                </Link>

                <AlertDialog onOpenChange={(open) => { if (!open) setHasDownloaded(false); }}>
                  <AlertDialogTrigger asChild>
                    <button className="text-left text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors drop-shadow-sm">
                      Privacy Policy
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-none shadow-2xl rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-black">
                        Privacy Policy
                      </AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="text-sm text-gray-600 leading-relaxed space-y-4 font-medium">
                          <p>Welcome to the Dance Realm. Your privacy is paramount to our global community.</p>
                          <p>1. Data Collection: We synchronize minimal profile data to enhance your rhythmic journey and provide personalized artist recommendations.</p>
                          <p>2. Video Privacy: Content uploaded to the Artist Studio remains your intellectual property. We only host it to facilitate your connection with the audience.</p>
                          <p>3. Security: We use industry-standard encryption to protect your account details and payment data.</p>
                          <p>4. No Third-Party Sales: Your dance history and personal information are never sold to external entities for marketing purposes.</p>
                          
                          <div className="pt-4 border-t border-gray-100">
                            <Link 
                              href="/policy/privacy_policy.pdf" 
                              target="_blank"
                              onClick={() => setHasDownloaded(true)}
                              className="flex items-center gap-2 text-primary font-bold hover:underline"
                            >
                              <Download className="w-4 h-4" />
                              Download Full Policy (PDF)
                            </Link>
                            <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">
                              * You must download the document to proceed.
                            </p>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                      <AlertDialogAction 
                        disabled={!hasDownloaded}
                        className="h-12 w-full rounded-xl bg-vibrant-gradient text-white font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all border-none disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        Got it
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors drop-shadow-sm">Terms of Use</Link>
                <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/90 hover:text-white transition-colors drop-shadow-sm">Transparency</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 text-center md:text-left drop-shadow-sm">
            © 2026 Dance Realm. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
            <span>Built by <span className="text-primary hover:text-primary/80 cursor-pointer">sk group</span></span>
            <span className="hidden md:inline h-1.5 w-1.5 bg-white/20 rounded-full" />
            <span>Secure by <span className="text-white/80">Stripe</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}