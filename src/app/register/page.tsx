'use client';

import React from "react";
import Link from "next/link";
import { UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground hover:text-primary">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Realm
          </Link>
        </Button>

        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-4xl font-black italic uppercase tracking-tighter text-gradient">
              Register
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold opacity-70">
              Join the global dance community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Stage Name</Label>
              <Input 
                id="name" 
                placeholder="The Prodigy" 
                className="bg-black/20 border-white/5 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="dancer@realm.com" 
                className="bg-black/20 border-white/5 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-black/20 border-white/5 focus:border-primary/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
              Join Realm
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Already a member?{" "}
              <Link href="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
