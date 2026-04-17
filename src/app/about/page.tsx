
"use client"

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { 
  BookOpen, 
  ArrowLeft, 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  Loader2, 
  Star, 
  Quote,
  Menu 
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, where } from 'firebase/firestore';

export default function AboutPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const mentorImg = PlaceHolderImages.find(img => img.id === 'teacher-mentoring');
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const isLoggedIn = !!user;

  // Fetch Feedback without complex orderBy in the query to avoid composite index requirement
  const studentFeedbackBaseQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'feedback'), where('userType', '==', 'Student'), limit(20));
  }, [db]);

  const teacherFeedbackBaseQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'feedback'), where('userType', '==', 'Teacher'), limit(20));
  }, [db]);

  const { data: rawStudentFeedback, isLoading: isLoadingStudentFB } = useCollection(studentFeedbackBaseQuery);
  const { data: rawTeacherFeedback, isLoading: isLoadingTeacherFB } = useCollection(teacherFeedbackBaseQuery);

  // Client-side sorting and limiting
  const studentFeedback = useMemo(() => {
    if (!rawStudentFeedback) return [];
    return [...rawStudentFeedback]
      .sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;
        return dateB - dateA;
      });
  }, [rawStudentFeedback]);

  const teacherFeedback = useMemo(() => {
    if (!rawTeacherFeedback) return [];
    return [...rawTeacherFeedback]
      .sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;
        return dateB - dateA;
      });
  }, [rawTeacherFeedback]);

  return (
    <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">RP Coach-Up</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/programs/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Programs</Link>
            <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
            <Link href="/about" className="text-sm font-medium text-primary font-bold">About Us</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
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

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader className="text-left border-b pb-4">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="bg-primary p-1 rounded-lg">
                        <BookOpen className="text-primary-foreground h-5 w-5" />
                      </div>
                      <span className="font-headline font-bold text-primary">RP Coach-Up</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 mt-6">
                    <SheetClose asChild>
                      <Link href="/programs/dashboard" className="text-base font-semibold py-3 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        Programs
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/#features" className="text-base font-semibold py-3 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        How it Works
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/about" className="text-base font-bold py-3 px-3 rounded-lg bg-primary/5 text-primary">
                        About Us
                      </Link>
                    </SheetClose>
                    
                    <div className="pt-6 mt-4 border-t border-border/50 flex flex-col gap-3">
                      {isUserLoading ? (
                         <div className="flex justify-center py-2"><Loader2 className="h-5 w-5 animate-spin" /></div>
                      ) : user ? (
                        <SheetClose asChild>
                          <Button className="w-full justify-start gap-2" asChild>
                            <Link href="/login">Dashboard</Link>
                          </Button>
                        </SheetClose>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Button variant="outline" className="w-full justify-start" asChild>
                              <Link href="/login">Log in</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button className="w-full justify-start" asChild>
                              <Link href="/register">Get Started</Link>
                            </Button>
                          </SheetClose>
                        </>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-secondary/20 to-background overflow-hidden">
          <div className="container mx-auto px-4 text-center lg:text-left">
            <div className="max-w-3xl">
              <Link href="/" className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-8 hover:underline group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-headline font-bold mb-6 text-primary leading-tight">
                Our Mission: Bridging the <span className="text-accent">Knowledge Gap</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                At RP Coach-Up, we believe that the right connection can change a student's life. 
                We're committed to ensuring that every student finds the perfect mentor, 
                and every teacher finds a student they are passionate about helping.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border aspect-[16/10]">
                  <Image 
                    src={mentorImg?.imageUrl || "https://picsum.photos/seed/edu2/600/400"} 
                    alt={mentorImg?.description || "Teacher mentoring a student"}
                    fill
                    className="object-cover"
                    data-ai-hint="teacher mentoring"
                  />
                </div>
              </div>
              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-headline font-bold">Why RP Coach-Up?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Traditional tutoring platforms often lack the personal touch. We focus on interests, teaching styles, and availability to create meaningful matches.
                  </p>
                </div>
                <div className="grid gap-6">
                  {[
                    { icon: Target, title: "Targeted Matching", desc: "We analyze student interests and teacher expertise to find the perfect educational overlap." },
                    { icon: ShieldCheck, title: "Verified Excellence", desc: "Every teacher on our platform undergoes a rigorous verification process." },
                    { icon: Lightbulb, title: "Personalized Growth", desc: "We focus on individual learning paths rather than one-size-fits-all curricula." }
                  ].map((value, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 bg-accent/10 p-2 rounded-lg h-fit shrink-0"><value.icon className="h-5 w-5 text-accent" /></div>
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

        {/* Feedback Section */}
        <section className="py-24 bg-secondary/10 overflow-hidden max-w-full">
          <div className="container mx-auto px-4 max-w-full overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-4">The Community Voice</h2>
              <p className="text-muted-foreground">Hear directly from our students and educators about their learning journeys.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 max-w-full overflow-hidden">
              {/* Student Feedback */}
              <div className="space-y-6 w-full max-w-full overflow-hidden">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-2 text-primary px-2">
                  <Users className="h-6 w-6 shrink-0" /> Student Success
                </h3>
                <div className="px-8 sm:px-12 relative w-full overflow-hidden">
                  {isLoadingStudentFB ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : studentFeedback.length > 0 ? (
                    <Carousel className="w-full max-w-full">
                      <CarouselContent>
                        {studentFeedback.map(fb => (
                          <CarouselItem key={fb.id}>
                            <Card className="border-none shadow-md h-full">
                              <CardContent className="pt-6">
                                <div className="flex gap-1 mb-2">
                                  {[...Array(fb.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}
                                </div>
                                <Quote className="h-8 w-8 text-primary/10 mb-2" />
                                <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">"{fb.comment}"</p>
                                <div className="flex items-center justify-between border-t pt-3 mt-auto">
                                  <span className="text-xs font-bold text-primary">{fb.userName}</span>
                                  {fb.teacherName && fb.teacherName !== 'General Platform Feedback' && (
                                    <Badge variant="outline" className="text-[10px] truncate max-w-[120px]">{fb.teacherName}</Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="flex -left-4 sm:-left-12 h-8 w-8 z-10" />
                      <CarouselNext className="flex -right-4 sm:-right-12 h-8 w-8 z-10" />
                    </Carousel>
                  ) : (
                    <p className="text-sm italic text-muted-foreground text-center py-8">No student feedback yet.</p>
                  )}
                </div>
              </div>

              {/* Teacher Feedback */}
              <div className="space-y-6 w-full max-w-full overflow-hidden">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-2 text-accent px-2">
                  <Users className="h-6 w-6 shrink-0" /> Educator Experiences
                </h3>
                <div className="px-8 sm:px-12 relative w-full overflow-hidden">
                  {isLoadingTeacherFB ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" /></div>
                  ) : teacherFeedback.length > 0 ? (
                    <Carousel className="w-full max-w-full">
                      <CarouselContent>
                        {teacherFeedback.map(fb => (
                          <CarouselItem key={fb.id}>
                            <Card className="border-none shadow-md h-full">
                              <CardContent className="pt-6">
                                <div className="flex gap-1 mb-2">
                                  {[...Array(fb.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}
                                </div>
                                <Quote className="h-8 w-8 text-accent/10 mb-2" />
                                <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">"{fb.comment}"</p>
                                <div className="flex items-center border-t pt-3 mt-auto">
                                  <span className="text-xs font-bold text-accent">{fb.userName}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="flex -left-4 sm:-left-12 h-8 w-8 z-10" />
                      <CarouselNext className="flex -right-4 sm:-right-12 h-8 w-8 z-10" />
                    </Carousel>
                  ) : (
                    <p className="text-sm italic text-muted-foreground text-center py-8">No teacher feedback yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-8">Ready to find your match?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-xl px-12 h-14 text-lg" 
                disabled={isLoggedIn}
                asChild={!isLoggedIn}
              >
                {isLoggedIn ? <span>Join Us Today</span> : <Link href="/register">Join Us Today</Link>}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-xl px-12 h-14 text-lg border-2" 
                disabled={isLoggedIn}
                asChild={!isLoggedIn}
              >
                {isLoggedIn ? <span>Sign In</span> : <Link href="/login">Sign In</Link>}
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t py-12 max-w-full">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-primary p-1 rounded-lg"><BookOpen className="text-primary-foreground h-5 w-5" /></div>
            <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
          </div>
          <p className="text-sm text-muted-foreground mb-8">© {currentYear || '2025'} RP Coach-Up. Empowering education through technology.</p>
        </div>
      </footer>
    </div>
  );
}
