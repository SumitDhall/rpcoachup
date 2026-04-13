
"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Users, 
  GraduationCap,
  Calendar
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProgramsDashboard() {
  const adImg = PlaceHolderImages.find(img => img.id === 'home-tuition-ad');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Featured Flyer Section */}
          <section className="grid lg:grid-cols-2 gap-8 items-center bg-primary/5 rounded-3xl p-8 lg:p-12 border border-primary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="space-y-6 relative z-10">
              <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-bold rounded-full">
                ACTIVE PROGRAM
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-headline font-bold text-primary leading-tight">
                RP Coach-UP <br /> 
                <span className="text-foreground">Home Tuition</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Applications are invited to provide premium home tuitions (one-to-one class) 
                for all subjects from <span className="font-bold text-foreground">Classes I to XII</span>.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 p-4 bg-background rounded-2xl shadow-sm border">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Call for Enquiry</p>
                    <p className="text-xl font-bold">+91 98969 59389</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-background rounded-2xl shadow-sm border">
                  <div className="bg-accent/10 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Resume</p>
                    <p className="text-xl font-bold">rpcoachup@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" className="rounded-xl h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20" asChild>
                  <Link href="/register?role=teacher">Apply as Teacher</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-xl h-14 px-8 text-lg font-bold border-2" asChild>
                  <Link href="/register?role=student">Enroll Student</Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                <Image 
                  src={adImg?.imageUrl || "https://picsum.photos/seed/tutorad/800/800"} 
                  alt="Home Tuition Advertisement"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint="teacher student"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="text-lg font-bold">One-to-One Personalized Learning</p>
                  <p className="text-sm opacity-80">Classes I - XII | All Subjects</p>
                </div>
              </div>
            </div>
          </section>

          {/* Program Features */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CheckCircle2,
                title: "Individual Focus",
                desc: "One-to-one sessions tailored specifically for student success."
              },
              {
                icon: Users,
                title: "Expert Tutors",
                desc: "Verified professionals with deep subject expertise."
              },
              {
                icon: MapPin,
                title: "In-Home Convenience",
                desc: "Quality education delivered right to your doorstep."
              },
              {
                icon: Calendar,
                title: "Flexible Schedule",
                desc: "Timings that work around your existing routine."
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-md bg-secondary/20">
                <CardHeader>
                  <div className="bg-white p-2 rounded-lg w-fit mb-2 shadow-sm">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </section>

          {/* Footer Info */}
          <footer className="text-center py-12 border-t mt-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-primary p-1 rounded-lg">
                <BookOpen className="text-primary-foreground h-4 w-4" />
              </div>
              <span className="font-headline font-bold text-primary">RP Coach-Up Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering local education through verified home tuition programs.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
