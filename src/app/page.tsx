import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Star, ArrowRight, ShieldCheck, Zap, Search } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// This is a server component, so Date is calculated once during the build/request.
// Static year for consistency.
const CURRENT_YEAR = 2025;

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-education');

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
            <Link href="#programs" className="text-sm font-medium hover:text-primary transition-colors">Programs</Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
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
                <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span>Verified Tutors</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-5 w-5 text-accent" />
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-accent/20 rounded-2xl blur-2xl transition group-hover:bg-accent/30" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                  <Image 
                    src={heroImg?.imageUrl || "https://picsum.photos/seed/edu1/1200/600"} 
                    alt={heroImg?.description || "Educational hero"}
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                    data-ai-hint="students studying"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Students", value: "2,500+" },
                { label: "Expert Teachers", value: "350+" },
                { label: "Success Rate", value: "98%" },
                { label: "Courses Offered", value: "120+" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-headline font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-headline font-bold">Expert Education Matching</h2>
              <p className="text-lg text-muted-foreground">
                Our platform streamlines the search for quality education. We facilitate meaningful connections to ensure the best learning outcomes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
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
                <Card key={i} className="border-none shadow-xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                  <CardContent className="pt-8 space-y-4">
                    <div className="bg-primary text-primary-foreground h-12 w-12 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-headline font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-12 lg:p-20 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-primary-foreground">
                <div className="space-y-6">
                  <h2 className="text-4xl lg:text-5xl font-headline font-bold">Ready to Elevate Your Learning Journey?</h2>
                  <p className="text-lg text-primary-foreground/80 max-w-lg">
                    Join thousands of students and teachers who are already using RP Coach-Up to find their perfect match.
                  </p>
                  <div className="flex gap-4">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 rounded-xl font-bold" asChild>
                      <Link href="/register">Start for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl space-y-2">
                    <Star className="text-accent h-6 w-6" />
                    <p className="text-sm font-medium italic">"The match was spot on. My physics tutor is exactly what I needed."</p>
                    <p className="text-xs text-primary-foreground/60">— Sarah J., Student</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl space-y-2 mt-8">
                    <Users className="text-accent h-6 w-6" />
                    <p className="text-sm font-medium italic">"I love teaching students who share my passion for advanced calculus."</p>
                    <p className="text-xs text-primary-foreground/60">— Dr. Robert, Teacher</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1 rounded-lg">
                  <BookOpen className="text-primary-foreground h-5 w-5" />
                </div>
                <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming the landscape of private education through intelligence and human connection.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Find Tutors</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Become a Teacher</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © {CURRENT_YEAR} RP Coach-Up. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
