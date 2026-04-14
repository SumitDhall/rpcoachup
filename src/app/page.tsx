
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Star, ArrowRight, ShieldCheck, Zap, Search, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-education');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">RP Coach-Up</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/programs/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Programs</Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
          </nav>
          <div className="flex items-center gap-3">
            {isUserLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : user ? (
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/login">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 max-w-2xl">
                <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-primary">
                  Master Your Future with <span className="text-accent underline decoration-accent/30 underline-offset-8">RP Coach-Up</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The smarter way to find tuition. We connect students with the perfect courses and teachers based on shared interests and goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-xl" asChild>
                    <Link href="/register?role=student">Find a Tutor</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-2" asChild>
                    <Link href="/register?role=teacher">Join as Teacher</Link>
                  </Button>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-3xl transition group-hover:bg-primary/20" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border aspect-[16/9]">
                  <Image 
                    src={heroImg?.imageUrl || "https://picsum.photos/seed/edu1/1200/600"} 
                    alt="Students learning"
                    width={1200}
                    height={600}
                    className="object-cover w-full h-full"
                    data-ai-hint="classroom teacher"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-headline font-bold">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Our platform streamlines the search for quality education. We facilitate meaningful connections to ensure the best learning outcomes.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="grid gap-8">
                  {[
                    {
                      icon: Search,
                      title: "Smart Search",
                      description: "Easily find courses and teachers that align with your unique interests and learning styles."
                    },
                    {
                      icon: Users,
                      title: "Collaborative Learning",
                      description: "Connect with teachers who are passionate about the exact topics you want to master."
                    },
                    {
                      icon: Zap,
                      title: "Fast Results",
                      description: "Submit your interests and get personalized connection suggestions in a streamlined portal."
                    }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="bg-primary/10 p-3 rounded-xl h-fit">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-headline font-bold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border shadow-xl bg-muted aspect-[4/5]">
                 <Image 
                    src="https://picsum.photos/seed/tutorad/800/1000" 
                    alt="RP Coach-Up Home Tuition Flyer"
                    width={800}
                    height={1000}
                    className="object-cover w-full h-full"
                    data-ai-hint="tuition flyer"
                  />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="pt-8 text-center text-sm text-muted-foreground">
            © {mounted ? new Date().getFullYear() : '2025'} RP Coach-Up. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
