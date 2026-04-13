
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen, ArrowLeft, Loader2, User, GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/${role}/dashboard`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Link href="/" className="mb-8 flex items-center gap-2 text-primary font-medium hover:underline group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>
      
      <Card className="w-full max-w-lg shadow-2xl border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl">
              <BookOpen className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline">Create Account</CardTitle>
          <CardDescription>Join our community of lifelong learners</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>I want to join as a...</Label>
              <RadioGroup defaultValue="student" onValueChange={setRole} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="student" id="student" className="peer sr-only" />
                  <Label
                    htmlFor="student"
                    className="flex flex-col items-center gap-2 justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                  >
                    <User className="h-8 w-8 text-primary" />
                    <span className="font-bold">Student</span>
                    <span className="text-xs text-muted-foreground text-center">I want to learn new skills and subjects</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="teacher" id="teacher" className="peer sr-only" />
                  <Label
                    htmlFor="teacher"
                    className="flex flex-col items-center gap-2 justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                  >
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <span className="font-bold">Teacher</span>
                    <span className="text-xs text-muted-foreground text-center">I want to share my expertise</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded border-muted text-primary focus:ring-primary" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-12 text-lg font-bold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
