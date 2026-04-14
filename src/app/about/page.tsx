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
import { BookOpen, ArrowLeft, Target, Lightbulb, ShieldCheck, Users, Loader2, Star, Quote } from 'lucide-react';
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

        {/* Features Section */}
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
                    { icon: Target, title: "Targeted Matching", desc: "We analyze student interests and teacher expertise to find the perfect educational overlap." },
                    { icon: ShieldCheck, title: "Verified Excellence", desc: "Every teacher on our platform undergoes a rigorous verification process." },
                    { icon: Lightbulb, title: "Personalized Growth", desc: "We focus on individual learning paths rather than one-size-fits-all curricula." }
                  ].map((value, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 bg-accent/10 p-2 rounded-lg h-fit"><value.icon className="h-5 w-5 text-accent" /></div>
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
        <section className="py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-headline font-bold text-primary mb-4">The Community Voice</h2>
              <p className="text-muted-foreground">Hear directly from our students and educators about their learning journeys.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Student Feedback */}
              <div className="space-y-6">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-2 text-primary">
                  <Users className="h-6 w-6" /> Student Success Stories
                </h3>
                <div className="px-10 relative">
                  {isLoadingStudentFB ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : studentFeedback.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {studentFeedback.map(fb => (
                          <CarouselItem key={fb.id}>
                            <Card className="border-none shadow-md h-full">
                              <CardContent className="pt-6">
                                <div className="flex gap-1 mb-2">
                                  {[...Array(fb.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}
                                </div>
                                <Quote className="h-8 w-8 text-primary/10 mb-2" />
                                <p className="text-sm italic text-muted-foreground mb-4">"{fb.comment}"</p>
                                <div className="flex items-center justify-between border-t pt-3 mt-auto">
                                  <span className="text-xs font-bold text-primary">{fb.userName}</span>
                                  {fb.teacherName && (
                                    <Badge variant="outline" className="text-[10px]">{fb.teacherName}</Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-10" />
                      <CarouselNext className="-right-10" />
                    </Carousel>
                  ) : (
                    <p className="text-sm italic text-muted-foreground text-center py-8">No student feedback yet.</p>
                  )}
                </div>
              </div>

              {/* Teacher Feedback */}
              <div className="space-y-6">
                <h3 className="text-2xl font-headline font-bold flex items-center gap-2 text-accent">
                  <Users className="h-6 w-6" /> Educator Experiences
                </h3>
                <div className="px-10 relative">
                  {isLoadingTeacherFB ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" /></div>
                  ) : teacherFeedback.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {teacherFeedback.map(fb => (
                          <CarouselItem key={fb.id}>
                            <Card className="border-none shadow-md h-full">
                              <CardContent className="pt-6">
                                <div className="flex gap-1 mb-2">
                                  {[...Array(fb.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}
                                </div>
                                <Quote className="h-8 w-8 text-accent/10 mb-2" />
                                <p className="text-sm italic text-muted-foreground mb-4">"{fb.comment}"</p>
                                <div className="flex items-center border-t pt-3 mt-auto">
                                  <span className="text-xs font-bold text-accent">{fb.userName}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-10" />
                      <CarouselNext className="-right-10" />
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
        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline font-bold mb-8">Ready to find your match?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-xl px-12" asChild><Link href="/register">Join Us Today</Link></Button>
              <Button variant="outline" size="lg" className="rounded-xl px-12" asChild><Link href="/login">Sign In</Link></Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t py-12">
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