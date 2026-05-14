'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Users, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { name: "Artists", href: "/artists", icon: Users },
    { name: "Sorties", href: "#", icon: Calendar },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Navigation Trigger - Top Right */}
      <div className="md:hidden absolute top-6 right-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="icon" className="h-10 w-10 shadow-lg shadow-primary/20">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="glass-card border-l border-white/10 w-80">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-left">
                <Link 
                  href="/" 
                  className="text-gradient text-2xl font-bold"
                  onClick={handleLinkClick}
                >
                  Dance Realm
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors",
                    pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
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

      {/* Desktop Persistent Right Sidebar - Collapsible */}
      <aside 
        className={cn(
          "hidden md:flex flex-col glass-card border-l border-white/5 p-6 transition-all duration-300 relative z-40 h-full",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Toggle Button for Desktop Sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-4 top-10 h-8 w-8 rounded-full bg-card border border-white/10 text-primary shadow-xl hover:bg-primary/10 transition-colors z-50"
        >
          {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        <div className={cn("flex flex-col mb-8 overflow-hidden", isCollapsed ? "items-center" : "items-start")}>
          <Link href="/" className={cn("font-bold text-gradient leading-none transition-all", isCollapsed ? "text-xl" : "text-2xl")}>
            {isCollapsed ? "DR" : "Dance Realm"}
          </Link>
          {!isCollapsed && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 animate-in fade-in duration-500 whitespace-nowrap">
              Connecting Dancers
            </span>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {!isCollapsed && (
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold px-4 mb-2 animate-in fade-in duration-500">
              Navigation
            </div>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              title={isCollapsed ? link.name : ""}
              className={cn(
                "flex items-center transition-all font-bold uppercase tracking-widest text-xs",
                isCollapsed ? "justify-center p-3 rounded-lg" : "gap-4 px-4 py-3 rounded-xl",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <link.icon className={cn("shrink-0", isCollapsed ? "h-6 w-6" : "h-4 w-4")} />
              {!isCollapsed && (
                <span className="truncate animate-in slide-in-from-left-2 duration-300">{link.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="pt-6 border-t border-white/5 mt-auto animate-in fade-in duration-500">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-transparent p-4 border border-white/5">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">System Status</p>
              <p className="text-[10px] text-muted-foreground">Realm synchronized.</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
