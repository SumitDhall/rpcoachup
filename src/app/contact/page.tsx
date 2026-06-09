'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Send, MessageSquare, ArrowLeft, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mocking an API call
    setTimeout(() => {
      toast({
        title: "Message Synchronized",
        description: "Your request has been sent to the Realm curators. We'll get back to you soon.",
      });
      setIsSubmitting(false);
      // Reset form logic would go here
    }, 1500);
  };

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
      <div className="fixed inset-0 z-10 bg-[#050816]/80 pointer-events-none" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] z-10 pointer-events-none" />

      {/* Page Content Layer 3 */}
      <div className="relative z-20 w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Realm</span>
          </Link>
        </Button>

        <Card className="glass-card border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="space-y-2 text-center pb-8 border-b border-white/5">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-[1.25rem] bg-vibrant-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gradient leading-tight">
              Customer Care
            </CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-[0.4em] font-black opacity-70">
              Synchronize with our support team
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-10 px-8 md:px-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-black text-primary/80 flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Name
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    required
                    className="bg-black/40 border-white/10 focus:border-primary/50 h-14 rounded-xl text-sm placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-black text-primary/80 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="dancer@realm.com" 
                    required
                    className="bg-black/40 border-white/10 focus:border-primary/50 h-14 rounded-xl text-sm placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-[10px] uppercase tracking-widest font-black text-secondary/80 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> Subject
                </Label>
                <Input 
                  id="subject" 
                  placeholder="How can we help you?" 
                  required
                  className="bg-black/40 border-white/10 focus:border-secondary/50 h-14 rounded-xl text-sm placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] uppercase tracking-widest font-black text-secondary/80 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> Your Message
                </Label>
                <Textarea 
                  id="message" 
                  placeholder="Share your thoughts or questions here..." 
                  required
                  className="bg-black/40 border-white/10 focus:border-secondary/50 min-h-[150px] rounded-xl text-sm resize-none placeholder:text-white/20 p-4"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-16 rounded-2xl bg-vibrant-gradient text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all border-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Syncing...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pt-6 pb-10 px-8">
            <div className="flex flex-wrap justify-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary" />
                support@dancerealm.co
              </div>
              {/* <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-secondary" />
                +44 (7435 573346)
              </div> */}
            </div>
            <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Average response time: <span className="text-emerald-500">24 Hours</span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
