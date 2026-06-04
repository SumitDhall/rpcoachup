'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Users, Calendar, ChevronLeft, ChevronRight, Zap, LogIn, UserPlus, LayoutDashboard, Palette, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/context/auth-context";

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const publicLinks = [
    { name: "Artists", href: "/artists", icon: Users },
    { name: "Blips", href: "/blips", icon: Calendar },
  ];

  const dancerLinks = [
    ...publicLinks,
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const artistLinks = [
    ...publicLinks,
    { name: "Studio", href: "/studio", icon: Palette },
  ];

  const authLinks = [
    { name: "Sign In", href: "/login", icon: LogIn },
    { name: "Register", href: "/register", icon: UserPlus },
  ];

  const activeLinks = user?.role === 'artist' ? artistLinks : user?.role === 'dancer' ? dancerLinks : publicLinks;

  const handleLinkClick = () => {
    setOpen(false);
  };

  const showFooter = mounted && !['/blips', '/studio', '/dashboard'].includes(pathname);
  const collapsedLogo = PlaceHolderImages.find(img => img.id === 'brand-logo-collapsed');

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050816]">
      {/* Mobile Navigation Trigger */}
      <div className="md:hidden absolute top-6 right-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="icon" className="h-12 w-12 rounded-2xl bg-vibrant-gradient shadow-lg shadow-primary/40">
              <Menu className="h-6 w-6 text-[#050816]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-card border-l border-white/10 w-80 bg-[#050816]/95">
            <SheetHeader className="mb-12">
              <SheetTitle className="text-center flex flex-col items-center">
                <Link 
                  href="/" 
                  className="text-gradient text-3xl font-black italic uppercase tracking-tighter block w-full mb-2"
                  onClick={handleLinkClick}
                >
                  DANCE REALM
                </Link>

                <div className="space-y-4 mt-2 flex flex-col items-center w-full">
                  <p className="text-[10px] text-[#F4F7FF]/70 font-black uppercase tracking-[0.4em] leading-relaxed text-center">
                    Connecting Dancers Worldwide
                  </p>
                  <div className="h-0.5 w-full bg-vibrant-gradient rounded-full shadow-[0_0_20px_rgba(255,79,216,0.3)] animate-pulse" />
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.5em] text-[#F4F7FF]/20 font-black px-4 mb-4">
                  Explore
                </div>
                <div className="flex flex-col gap-3">
                  {activeLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all",
                        pathname === link.href 
                          ? "bg-vibrant-gradient text-[#050816] shadow-xl shadow-primary/30" 
                          : "hover:bg-white/5 text-[#F4F7FF]/50 hover:text-white"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.5em] text-[#F4F7FF]/20 font-black px-4 mb-4">
                  Account
                </div>
                <div className="flex flex-col gap-3">
                  {!user ? authLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all",
                        pathname === link.href 
                          ? "bg-vibrant-gradient text-[#050816] shadow-xl shadow-primary/30" 
                          : "hover:bg-white/5 text-[#F4F7FF]/50 hover:text-white"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  )) : (
                    <Button 
                      onClick={() => { logout(); handleLinkClick(); }}
                      variant="ghost" 
                      className="flex items-center justify-start gap-4 px-6 py-4 h-auto rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-auto flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        {showFooter && <SiteFooter />}
      </main>

      {/* Desktop Persistent Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col glass-card border-l border-white/10 p-6 transition-all duration-500 relative z-40 h-full",
          isCollapsed ? "w-24" : "w-80"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-5 top-12 h-10 w-10 rounded-full bg-card border border-white/20 text-primary shadow-2xl hover:bg-primary hover:text-background transition-all z-50"
        >
          {isCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>

        <div className={cn("flex flex-col mb-12", isCollapsed ? "items-center" : "items-start")}>
          <Link href="/" className={cn("font-black text-gradient italic leading-none transition-all uppercase tracking-tighter", isCollapsed ? "text-2xl" : "text-4xl")}>
            {isCollapsed ? (
              collapsedLogo ? (
                <div className="relative h-12 w-12">
                  <Image 
                    src={collapsedLogo.imageUrl} 
                    alt="DR Logo" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <>DR</>
              )
            ) : (
              <>Dance Realm</>
            )}
          </Link>
          {!isCollapsed && (
            <div className="flex items-center gap-2 mt-3 animate-in fade-in slide-in-from-left-4 duration-700">
              <Zap className="h-3 w-3 text-secondary fill-secondary" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#F4F7FF]/40 whitespace-nowrap">
                Connecting Dancers Worldwide
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-3">
          {!isCollapsed && (
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#F4F7FF]/20 font-black px-4 mb-4">
              Explore
            </div>
          )}
          {activeLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center transition-all font-black uppercase tracking-[0.2em] text-[11px]",
                isCollapsed ? "justify-center p-4 rounded-2xl" : "gap-5 px-6 py-4 rounded-2xl",
                pathname === link.href 
                  ? "bg-vibrant-gradient text-[#050816] shadow-2xl shadow-primary/40 scale-[1.05]" 
                  : "text-[#F4F7FF]/50 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
              {!isCollapsed && (
                <span className="animate-in slide-in-from-left-4 duration-500">{link.name}</span>
              )}
            </Link>
          ))}

          <div className="mt-8 space-y-2">
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-[0.5em] text-[#F4F7FF]/20 font-black px-4 mb-2">
                Account
              </div>
            )}
            
            {!user ? authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center transition-all font-black uppercase tracking-[0.2em] text-[11px]",
                  isCollapsed ? "justify-center p-4 rounded-2xl" : "gap-5 px-6 py-4 rounded-2xl",
                  pathname === link.href 
                    ? "bg-vibrant-gradient text-[#050816] shadow-2xl shadow-primary/40 scale-[1.05]" 
                    : "text-[#F4F7FF]/50 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
                {!isCollapsed && (
                  <span className="animate-in slide-in-from-left-4 duration-500">{link.name}</span>
                )}
              </Link>
            )) : (
              <Button
                variant="ghost"
                onClick={() => logout()}
                className={cn(
                  "flex items-center transition-all font-black uppercase tracking-[0.2em] text-[11px] text-rose-500 hover:text-rose-400 hover:bg-rose-500/10",
                  isCollapsed ? "justify-center p-4 h-auto rounded-2xl" : "gap-5 px-6 py-4 h-auto rounded-2xl justify-start"
                )}
              >
                <LogOut className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
                {!isCollapsed && (
                  <span className="animate-in slide-in-from-left-4 duration-500">Sign Out</span>
                )}
              </Button>
            )}
          </div>
        </nav>

        {!isCollapsed && (
          <div className="pt-8 border-t border-white/5 mt-auto animate-in fade-in duration-1000">
            <div className="rounded-3xl bg-gradient-to-br from-white/5 to-transparent p-6 border border-white/5 relative overflow-hidden group">
              {user && (
                <div className="mb-4">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Signed in as</p>
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <p className="text-[10px] font-bold text-[#F4F7FF]/60">Realm Synchronized</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}