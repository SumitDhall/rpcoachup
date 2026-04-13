
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
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [role, setRole] = useState('Student');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 1. Create Base User Profile
      const userProfileRef = doc(db, 'users', user.uid);
      const profileData = {
        id: user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userProfileRef, profileData);

      // 2. Create Role-Specific Profile
      if (role === 'Student') {
        const studentProfileRef = doc(db, 'users', user.uid, 'studentProfile', 'studentProfile');
        await setDoc(studentProfileRef, {
          id: 'studentProfile',
          userProfileId: user.uid,
          gradeLevel: '',
        });
      } else if (role === 'Teacher') {
        const teacherProfileRef = doc(db, 'users', user.uid, 'teacherProfile', 'teacherProfile');
        await setDoc(teacherProfileRef, {
          id: 'teacherProfile',
          userProfileId: user.uid,
          experienceYears: 0,
          qualifications: '',
        });
      }

      toast({
        title: "Registration Successful",
        description: `Welcome to RP Coach-Up, ${formData.firstName}!`,
      });

      router.push(`/${role.toLowerCase()}/dashboard`);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
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
              <RadioGroup defaultValue="Student" onValueChange={setRole} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="Student" id="Student" className="peer sr-only" />
                  <Label
                    htmlFor="Student"
                    className="flex flex-col items-center gap-2 justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary"
                  >
                    <User className="h-8 w-8 text-primary" />
                    <span className="font-bold">Student</span>
                    <span className="text-xs text-muted-foreground text-center">I want to learn new skills and subjects</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="Teacher" id="Teacher" className="peer sr-only" />
                  <Label
                    htmlFor="Teacher"
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
                <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
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
