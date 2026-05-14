
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp, 
  Music2,
  Bell
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Analytics", href: "#", icon: TrendingUp },
  { name: "Classes", href: "#", icon: Music2 },
  { name: "Dancers", href: "#", icon: Users },
  { name: "Schedule", href: "#", icon: Calendar },
  { name: "Settings", href: "#", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-xl border-r border-white/5">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gradient tracking-tight">
          DanceVerse
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1 opacity-60">
          Universal Rhythm Dash
        </p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "" : "group-hover:text-primary transition-colors"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase">Updates</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            New Urban flow workshop series starts tomorrow. Don't miss out!
          </p>
        </div>
      </div>
    </div>
  );
}
