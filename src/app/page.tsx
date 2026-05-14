
"use client";

import { MetricCards } from "@/components/dashboard/metric-cards";
import { PerformanceCharts } from "@/components/dashboard/performance-charts";
import { CategoryCharts } from "@/components/dashboard/category-charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardNav } from "@/components/dashboard/nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
        <DashboardNav />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(187,133,255,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(230,140,255,0.05),transparent_40%)]">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between px-6 bg-background/80 backdrop-blur-lg border-b border-white/5">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search dancers, routines or metrics..." 
                className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary h-9 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="h-8 w-8 rounded-full border border-white/10 bg-card flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Performance Overview</h2>
            <p className="text-muted-foreground">Welcome back to the studio. Here is what happened in your verse today.</p>
          </div>

          {/* Metric Cards Row */}
          <MetricCards />

          {/* Charts and Feed Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Performance Charts */}
            <PerformanceCharts />

            {/* Category Breakdown */}
            <CategoryCharts />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity Stream occupies 1/3 but we could expand it or add more widgets */}
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>

            {/* Placeholder for more detailed metrics or scheduled rehearsals */}
            <div className="lg:col-span-2 glass-card rounded-xl p-6 flex items-center justify-center border border-white/5 bg-white/2 overflow-hidden relative min-h-[400px]">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img 
                  src="https://picsum.photos/seed/danceverse/800/600" 
                  alt="dance-bg" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center z-10 space-y-4">
                <h3 className="text-xl font-semibold text-gradient">Global Showcase Mode</h3>
                <p className="text-muted-foreground max-w-sm">Connect with global verses to share routines and join live challenges across time zones.</p>
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8">
                  Launch Universe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-8 text-center text-xs text-muted-foreground opacity-50">
          &copy; 2024 DanceVerse Dash. All rhythmic rights reserved.
        </footer>
      </main>
    </div>
  );
}
