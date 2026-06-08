'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, ArrowLeft, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Layer 1: Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/dance-realm_background_image_without_dancers.png"
          alt="Dance Realm Background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-110 contrast-110"
        />
      </div>

      {/* Background Layer 2: Dark Overlay */}
      <div className="fixed inset-0 z-10 bg-[#050816]/75 pointer-events-none" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] z-10" />

      {/* Page Content Layer 3 */}
      <div className="relative z-20 w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground hover:text-primary">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Realm
          </Link>
        </Button>

        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-4xl font-black italic uppercase tracking-tighter text-gradient">
              Login
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">
              Select a Demo Role to Enter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={() => login('dancer')}
                className="h-20 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 group transition-all"
                variant="outline"
              >
                <div className="flex flex-col items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Demo Dancer</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => login('artist')}
                className="h-20 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/50 hover:bg-secondary/5 group transition-all"
                variant="outline"
              >
                <div className="flex flex-col items-center gap-2">
                  <Sparkles className="h-6 w-6 text-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Demo Artist</span>
                </div>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest">
                <span className="bg-[#050816] px-4 text-muted-foreground">OR LOGIN WITH EMAIL</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="dancer@realm.com" 
                  className="bg-black/20 border-white/5 focus:border-primary/50"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-black/20 border-white/5 focus:border-primary/50"
                  disabled
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button disabled className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest opacity-50 cursor-not-allowed">
              Sign In (Demo Only)
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              New to the Realm?{" "}
              <Link href="/register" className="text-primary hover:underline">Register Now</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
