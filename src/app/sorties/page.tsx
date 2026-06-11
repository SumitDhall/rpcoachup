'use client';

import React from "react";
import BlipsFeed from "@/features/blips/components/BlipsFeed";

/**
 * Sorties Page
 * Reuses the consolidated BlipsFeed feature for a consistent vertical video experience.
 */
export default function SortiesPage() {
  return (
    <div className="h-screen w-full bg-black">
      <BlipsFeed />
    </div>
  );
}
