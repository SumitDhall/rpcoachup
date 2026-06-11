'use client';

import React from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import ArtistStudio from "@/features/studio/components/ArtistStudio";

export default function Page() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user || user.role !== 'artist') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-secondary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Accessing Creator Core...</h2>
      </div>
    );
  }

  return <ArtistStudio />;
}
