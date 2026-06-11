'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Users, Calendar, ChevronLeft, ChevronRight, LayoutDashboard, Palette, LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/providers/AuthProvider";
import { navStyles } from "@/lib/nav-styles";

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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

  const showFooter = mounted && !['/blips'].includes(pathname);
  const collapsedLogo = PlaceHolderImages.find(img => img.id === 'brand-logo-collapsed');

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full bg-[#050816]">
      {/* Mobile Navigation Trigger */}
      <div className="md:hidden fixed top-6 right-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="icon" className="h-12 w-12 rounded-2xl bg-vibrant-gradient shadow-lg shadow-primary/40">
              <Menu className="h-6 w-6 text-[#050816]" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className={cn(
              navStyles.panel, 
              "w-80 p-0 border-none bg-black/80" 
            )}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Dance Realm Navigation</SheetTitle>
              <SheetDescription>Access your dashboard and the global dance community.</SheetDescription>
            </SheetHeader>

            <div className={navStyles.glowContainer}>
              <div className={navStyles.primaryGlow} />
              <div className={navStyles.secondaryGlow} />
            </div>

            <div className="p-8 h-full flex flex-col">
              <div className={navStyles.branding.container}>
                <Link href="/" onClick={handleLinkClick} className={cn(navStyles.branding.title, "text-3xl")}>
                  DΛNCE ЯEΛLM
                </Link>
                <div className="space-y-4 mt-4 w-full">
                  <p className={navStyles.branding.subtitle}>
                    Connecting Dancers Worldwide
                  </p>
                  <div className={navStyles.branding.divider} />
                </div>
              </div>

              <nav className="flex-1 flex flex-col gap-8 mt-12">
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
                          navStyles.navItem.base,
                          "gap-5 px-6 py-4",
                          pathname === link.href ? navStyles.navItem.active : navStyles.navItem.inactive
                        )}
                      >
                        <link.icon className="h-5 w-5 shrink-0" />
                        <span>{link.name}</span>
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
                          navStyles.navItem.base,
                          "gap-5 px-6 py-4",
                          pathname === link.href ? navStyles.navItem.active : navStyles.navItem.inactive
                        )}
                      >
                        <link.icon className="h-5 w-5 shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    )) : (
                      <Button 
                        onClick={() => { logout(); handleLinkClick(); }}
                        variant="ghost" 
                        className="flex items-center justify-start gap-5 px-6 py-4 h-auto rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span>Sign Out</span>
                      </Button>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <div className="flex-1">
          {children}
        </div>
        {showFooter && <SiteFooter />}
      </main>

      {/* Desktop Persistent Sidebar */}
      <aside 
        className={cn(
          navStyles.panel,
          navStyles.sidebarLayout,
          "hidden md:flex sticky top-0 h-screen transition-all duration-500 overflow-visible",
          isCollapsed ? "w-24" : "w-80"
        )}
      >
        <div className={navStyles.glowContainer}>
          <div className={navStyles.primaryGlow} />
          {!isCollapsed && <div className={navStyles.secondaryGlow} />}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-5 top-12 h-10 w-10 rounded-full bg-card border border-white/20 text-primary shadow-2xl hover:bg-primary hover:text-background transition-all z-50"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>

        <div className={cn(navStyles.branding.container, "mb-12")}>
          <Link href="/" className={cn(navStyles.branding.title, isCollapsed ? "text-2xl" : "text-4xl")}>
            {isCollapsed ? (
              collapsedLogo ? (
                <div className="relative h-12 w-12">
                  <Image src={collapsedLogo.imageUrl} alt="DR Logo" fill className="object-contain" priority />
                </div>
              ) : "DR"
            ) : "DΛNCE ЯEΛLM"}
          </Link>
          <div className="space-y-4 mt-4 w-full animate-in fade-in slide-in-from-top-4 duration-700">
            {!isCollapsed && (
              <>
                <p className={navStyles.branding.subtitle}>
                  Connecting Dancers Worldwide
                </p>
                <div className={navStyles.branding.divider} />
              </>
            )}
          </div>
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
                navStyles.navItem.base,
                isCollapsed ? "justify-center p-4" : "gap-5 px-6 py-4",
                pathname === link.href ? navStyles.navItem.active : navStyles.navItem.inactive
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
                  navStyles.navItem.base,
                  isCollapsed ? "justify-center p-4" : "gap-5 px-6 py-4",
                  pathname === link.href ? navStyles.navItem.active : navStyles.navItem.inactive
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
            <div className={navStyles.accountBox}>
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