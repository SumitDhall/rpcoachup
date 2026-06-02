'use client';

import React, { useState } from "react";
import Link from "next/link";
import { UserPlus, ArrowLeft, Music2, User, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function RegisterPage() {
  const [userType, setUserType] = useState<"dancer" | "artist">("dancer");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Button asChild variant="ghost" className="mb-2 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Realm</span>
          </Link>
        </Button>

        <Card className="glass-card border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-8 border-b border-white/5">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-2xl bg-vibrant-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="h-6 w-6 text-background fill-current" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black italic uppercase tracking-tighter text-gradient">
              Join the Realm
            </CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">
              Synchronize your rhythm with the world
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="dancer" onValueChange={(v) => setUserType(v as "dancer" | "artist")} className="w-full">
            <div className="px-8 pt-8">
              <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/5 h-14 p-1 rounded-xl">
                <TabsTrigger value="dancer" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px]">
                  <User className="w-3 h-3 mr-2" />
                  Dancer
                </TabsTrigger>
                <TabsTrigger value="artist" className="rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-black uppercase tracking-widest text-[10px]">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Artist
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="space-y-6 pt-8 px-8">
              <TabsContent value="dancer" className="space-y-4 m-0 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="dancer-name" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Display Name</Label>
                  <Input 
                    id="dancer-name" 
                    placeholder="Urban Groove" 
                    className="bg-black/20 border-white/5 focus:border-primary/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dancer-email" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Email</Label>
                  <Input 
                    id="dancer-email" 
                    type="email" 
                    placeholder="dancer@realm.com" 
                    className="bg-black/20 border-white/5 focus:border-primary/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dancer-password" className="text-[10px] uppercase tracking-widest font-black text-primary/80">Password</Label>
                  <Input 
                    id="dancer-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-black/20 border-white/5 focus:border-primary/50 h-12"
                  />
                </div>
              </TabsContent>

              <TabsContent value="artist" className="space-y-4 m-0 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="artist-name" className="text-[10px] uppercase tracking-widest font-black text-secondary/80">Stage Name</Label>
                  <Input 
                    id="artist-name" 
                    placeholder="The Virtuoso" 
                    className="bg-black/20 border-white/5 focus:border-secondary/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist-bio" className="text-[10px] uppercase tracking-widest font-black text-secondary/80">Mini Bio</Label>
                  <Textarea 
                    id="artist-bio" 
                    placeholder="Tell the realm about your journey..." 
                    className="bg-black/20 border-white/5 focus:border-secondary/50 min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist-email" className="text-[10px] uppercase tracking-widest font-black text-secondary/80">Email</Label>
                  <Input 
                    id="artist-email" 
                    type="email" 
                    placeholder="artist@realm.com" 
                    className="bg-black/20 border-white/5 focus:border-secondary/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist-password" className="text-[10px] uppercase tracking-widest font-black text-secondary/80">Password</Label>
                  <Input 
                    id="artist-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-black/20 border-white/5 focus:border-secondary/50 h-12"
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col gap-6 pt-4 pb-8 px-8">
            <Button className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-xl ${userType === 'dancer' ? 'bg-primary text-primary-foreground shadow-primary/20' : 'bg-secondary text-secondary-foreground shadow-secondary/20'}`}>
              <UserPlus className="w-5 h-5 mr-2" />
              {userType === 'dancer' ? 'Join as Dancer' : 'Register as Artist'}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Already synchronized?{" "}
              <Link href="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}