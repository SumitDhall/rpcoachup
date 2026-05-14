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

const items = [
  {
    title: "Artists",
    url: "#",
    icon: Users,
  },
  {
    title: "Sorties",
    url: "#",
    icon: Calendar,
  },
];

const DanceLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    <path d="M12 8v4" />
    <path d="M10 12h4" />
    <path d="M8 10c0-1 2-2 4-2s4 1 4 2" />
    <path d="m7 21 3-5 2-4" />
    <path d="m17 21-3-5-2-4" />
    <path d="m14 12 4-2" />
    <path d="m10 12-4-2" />
  </svg>
);

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-white/5 py-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_15px_rgba(230,140,255,0.3)]">
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
