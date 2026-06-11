'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import BlipsFeed from "@/features/blips/components/BlipsFeed";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BlipsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuthDialog(true);
    }
  }, [user, isLoading]);

  const handleAuthRedirect = () => {
    setShowAuthDialog(false);
    router.push('/login');
  };

  if (isLoading || (!user && !showAuthDialog)) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
           <Lock className="h-12 w-12 text-primary animate-pulse mx-auto" />
           <p className="text-sm font-black uppercase tracking-widest text-primary">Synchronizing Rhythms...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlipsFeed />

      <Dialog open={showAuthDialog} onOpenChange={(open) => { if (!open) handleAuthRedirect(); }}>
        <DialogContent className="p-[2px] bg-vibrant-gradient border-none max-w-md rounded-[2.5rem] overflow-hidden">
          <div className="bg-black/95 text-white p-8 rounded-[calc(2.5rem-2px)] flex flex-col gap-6">
            <DialogHeader className="space-y-4 text-center items-center">
              <div className="h-20 w-20 rounded-[1.5rem] bg-vibrant-gradient flex items-center justify-center shadow-2xl shadow-primary/20 animate-in zoom-in-50 duration-500">
                <Sparkles className="h-10 w-10 text-white fill-white/20" />
              </div>
              <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter leading-tight">
                Sign in Required
              </DialogTitle>
              <DialogDescription className="text-sm text-white/60 leading-relaxed font-medium">
                Join the Dance Realm community to witness these incredible rhythms. Please sign in or register to check the BLIPS and connect with artists worldwide.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-2">
              <Button 
                onClick={handleAuthRedirect}
                className="w-1/2 h-12 rounded-2xl bg-vibrant-gradient text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all border-none"
              >
                Got It
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
