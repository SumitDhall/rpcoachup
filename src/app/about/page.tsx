
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Target, Lightbulb, ShieldCheck, Users, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';

export default function AboutPage() {
  const { user, isUserLoading } = useUser();
  const mentorImg = PlaceHolderImages.find(img => img.id === 'teacher-mentoring');
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">RP Coach-Up</span>
          </Link>
          <div className="flex items-center gap-3">
            {isUserLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : user ? (
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/login">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Link href="/" className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-8 hover:underline group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
              <h1 className="text-4xl lg:text-6xl font-headline font-bold mb-6 text-primary">
                Our Mission: Bridging the <span className="text-accent">Knowledge Gap</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                At RP Coach-Up, we believe that the right connection can change a student's life. 
                We're committed to ensuring that every student finds the perfect mentor, 
                and every teacher finds a student they are passionate about helping.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border">
                  <Image 
                    src={mentorImg?.imageUrl || "https://picsum.photos/seed/edu2/600/400"} 
                    alt={mentorImg?.description || "Teacher mentoring a student"}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint="teacher mentoring"
                  />
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-headline font-bold">Why RP Coach-Up?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Traditional tutoring platforms often lack the personal touch. We focus on interests, teaching styles, and availability to create meaningful matches.
                  </p>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      icon: Target,
                      title: "Targeted Matching",
                      desc: "We analyze student interests and teacher expertise to find the perfect educational overlap."
                    },
                    {
                      icon: ShieldCheck,
                      title: "Verified Excellence",
                      desc: "Every teacher on our platform undergoes a rigorous verification process."
                    },
                    {
                      icon: Lightbulb,
                      title: "Personalized Growth",
                      desc: "We focus on individual learning paths rather than one-size-fits-all curricula."
                    }
                  ].map((value, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 bg-accent/10 p-2 rounded-lg h-fit">
                        <value.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{value.title}</h4>
                        <p className="text-sm text-muted-foreground">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-4">The Impact of Quality Education</h2>
              <p className="text-primary-foreground/80">
                By streamlining the connection process, we let teachers focus on teaching and students focus on learning.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <Card className="bg-white/10 border-none text-primary-foreground">
                <CardContent className="pt-8">
                  <Target className="h-10 w-10 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl font-bold mb-2">95%</h3>
                  <p className="text-sm text-primary-foreground/70">Satisfaction Rate</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-none text-primary-foreground">
                <CardContent className="pt-8">
                  <Users className="h-10 w-10 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl font-bold mb-2">10k+</h3>
                  <p className="text-sm text-primary-foreground/70">Connections Facilitated</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-none text-primary-foreground">
                <CardContent className="pt-8">
                  <Target className="h-10 w-10 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl font-bold mb-2">3x</h3>
                  <p className="text-sm text-primary-foreground/70">better learning</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline font-bold mb-8">Ready to find your match?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-xl px-12" asChild>
                <Link href="/register">Join Us Today</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl px-12" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-primary p-1 rounded-lg">
              <BookOpen className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            © {currentYear || '2025'} RP Coach-Up. Empowering education through technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
