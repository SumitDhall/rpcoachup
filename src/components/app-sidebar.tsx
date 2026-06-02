
"use client";

import * as React from "react";
import { Users, Calendar } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const DanceLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <circle cx="12" cy="5" r="2.5" />
    <path d="M12 7.5c-2.5 0-5.5 1.5-6.5 4s1.5 4.5 4.5 4.5 4.5-1.5 5.5-4-1.5-4.5-4.5-4.5z" />
    <path d="M10 16v5M14 16v5" />
    <path d="M5.5 11.5C3.5 13 2 16 2 16M18.5 11.5C20.5 13 22 16 22 16" />
  </svg>
);

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-white/5 py-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_15px_rgba(82,168,255,0.3)]">
            <DanceLogo />
          </div>
          <span className="text-xl font-bold text-gradient tracking-tight group-data-[collapsible=icon]:hidden">
            DanceVerse
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-widest text-muted-foreground opacity-60 group-data-[collapsible=icon]:hidden">
            Explore
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Artists">
                  <a href="/artists" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Artists</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Blips">
                  <a href="/blips" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">Blips</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
