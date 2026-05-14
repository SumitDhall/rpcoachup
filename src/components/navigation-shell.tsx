'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function NavigationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Artists", href: "/artists", icon: Users },
    { name: "Sorties", href: "#", icon: Calendar },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Navigation Trigger - Visible only on mobile */}
      <div className="md:hidden absolute top-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-primary border border-primary/20 bg-card/50 backdrop-blur-sm">
              <Menu className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-card border-l border-white/10 w-80">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-left">
                <Link href="/" className="text-gradient text-2xl font-bold">DanceVerse</Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors",
                    pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
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
      <main className="flex-1 relative overflow-auto">
        {children}
      </main>

      {/* Desktop Persistent Right Sidebar */}
      <aside className="hidden md:flex w-72 flex-col glass-card border-l border-white/5 p-6 space-y-8 z-40">
        <div className="flex flex-col mb-4">
          <Link href="/" className="text-2xl font-bold text-gradient leading-none">DanceVerse</Link>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Admin Portal</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold px-4 mb-2">
            Navigation
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-xs",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent p-4 border border-white/5">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">System Status</p>
            <p className="text-[10px] text-muted-foreground">All rhythms synchronized.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
