
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Users, Calendar, ChevronLeft, ChevronRight, Zap, LogIn, UserPlus } from "lucide-react";
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

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide footer only on the Blips page
  const showFooter = mounted && pathname !== '/blips';

  const navLinks = [
    { name: "Artists", href: "/artists", icon: Users },
    { name: "Blips", href: "/blips", icon: Calendar },
  ];

  const authLinks = [
    { name: "Sign In", href: "/login", icon: LogIn },
    { name: "Register", href: "/register", icon: UserPlus },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

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
            <SheetHeader className="mb-8">
              <SheetTitle className="text-left">
                <Link 
                  href="/" 
                  className="text-gradient text-3xl font-black italic uppercase tracking-tighter"
                  onClick={handleLinkClick}
                >
                  Dance Realm
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4">
              {[...navLinks, ...authLinks].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all",
                    pathname === link.href 
                      ? "bg-vibrant-gradient text-[#050816] shadow-xl shadow-primary/30" 
                      : "hover:bg-white/5 text-[#F4F7FF]/60 hover:text-white"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                </Link>
              ))}
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
            {isCollapsed ? "DR" : "Dance Realm"}
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
              Menu
            </div>
          )}
          {navLinks.map((link) => (
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
            {authLinks.map((link) => (
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
          </div>
        </nav>

        {!isCollapsed && (
          <div className="pt-8 border-t border-white/5 mt-auto animate-in fade-in duration-1000">
            <div className="rounded-3xl bg-gradient-to-br from-white/5 to-transparent p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 blur-3xl group-hover:bg-accent/30 transition-all" />
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-2">Live Status</p>
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
