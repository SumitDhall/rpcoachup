'use client';

import React from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import DancerDashboard from "@/features/dashboard/components/DancerDashboard";

export default function Page() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user || user.role !== 'dancer') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Lock className="h-12 w-12 text-primary animate-pulse" />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Synchronizing Realm...</h2>
      </div>
    );
  }

  return <DancerDashboard />;
}
