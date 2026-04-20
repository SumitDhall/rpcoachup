
"use client"

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen, ArrowLeft, Loader2, User, GraduationCap, Phone, Mail } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, collection, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { sendNotificationEmail } from '@/app/actions/notifications';
import { cn } from '@/lib/utils';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const roleParam = searchParams.get('role');
  const [role, setRole] = useState(roleParam === 'teacher' ? 'Teacher' : 'Student');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (roleParam === 'teacher') setRole('Teacher');
    else if (roleParam === 'student') setRole('Student');
  }, [roleParam]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create the Auth User first
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const batch = writeBatch(db);

      // 2. Set the core user profile
      const userProfileRef = doc(db, 'users', user.uid);
      batch.set(userProfileRef, {
        id: user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3. Attempt to generate AI content (done after auth to ensure user exists)
      // We wrap these in try/catch to ensure registration doesn't fail just because AI service is slow
      let adminEmailContent = null;
      let userEmailContent = null;

      try {
        adminEmailContent = await sendNotificationEmail({
          recipientType: 'admin',
          type: 'registration',
          userType: role,
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: formData.email
        });

        userEmailContent = await sendNotificationEmail({
          recipientType: 'user',
          type: 'registration',
          userType: role,
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: formData.email,
          details: `Welcome to RP Coach-Up! Your account as a ${role} has been created.`
        });
      } catch (aiError) {
        console.warn("AI Email generation skipped due to error:", aiError);
      }

      // 4. Add notifications to batch if AI generation was successful
      if (adminEmailContent?.success && adminEmailContent?.email) {
        const adminNotifRef = doc(collection(db, 'notifications'));
        batch.set(adminNotifRef, {
          to: adminEmailContent.email.recipientEmail,
          from: "RP Coach-Up <support@rpcoachup.com>",
          message: {
            subject: adminEmailContent.email.subject,
            text: adminEmailContent.email.body,
            html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #266EDB; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">RP Coach-Up</h1>
              </div>
              <div style="padding: 30px; background-color: white;">
                ${adminEmailContent.email.body.replace(/\n/g, '<br>')}
              </div>
              <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #777;">
                © 2026 RP Coach-Up | Admin Notification
              </div>
            </div>`
          },
          type: 'registration',
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: formData.email,
          timestamp: serverTimestamp(),
          read: false
        });
      }

      if (userEmailContent?.success && userEmailContent?.email) {
        const userNotifRef = doc(collection(db, 'notifications'));
        batch.set(userNotifRef, {
          to: userEmailContent.email.recipientEmail,
          from: "RP Coach-Up <support@rpcoachup.com>",
          message: {
            subject: userEmailContent.email.subject,
            text: userEmailContent.email.body,
            html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #266EDB; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">RP Coach-Up</h1>
              </div>
              <div style="padding: 30px; background-color: white;">
                ${userEmailContent.email.body.replace(/\n/g, '<br>')}
              </div>
              <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #777;">
                © 2026 RP Coach-Up | Welcome to the Community
              </div>
            </div>`
          },
          type: 'registration',
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: formData.email,
          timestamp: serverTimestamp(),
          read: false
        });
      }

      // 5. Commit all Firestore writes
      await batch.commit();

      toast({
        title: "Registration Successful",
        description: `Welcome to RP Coach-Up, ${formData.firstName}!`,
      });

      router.push(`/${role.toLowerCase()}/dashboard`);
    } catch (error: any) {
      console.error("Registration error details:", error);
      let msg = "An error occurred during registration.";
      if (error.code === 'auth/email-already-in-use') {
        msg = "This email is already in use.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Your password is too weak.";
      } else if (error.message?.includes('permissions')) {
        msg = "Database permission error. Please contact support.";
      }
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: msg,
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
              {!roleParam && <Label>I want to join as a...</Label>}
              <RadioGroup 
                value={role} 
                onValueChange={setRole} 
                className={cn(
                  "grid gap-4 items-stretch",
                  roleParam ? "grid-cols-1" : "grid-cols-2"
                )}
              >
                {(!roleParam || roleParam === 'student') && (
                  <div className="h-full">
                    <RadioGroupItem value="Student" id="Student" className="peer sr-only" />
                    <Label
                      htmlFor="Student"
                      className="flex h-full flex-col items-center gap-2 justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-all"
                    >
                      <User className="h-8 w-8 text-primary" />
                      <span className="font-bold">Student</span>
                      <span className="text-xs text-muted-foreground text-center">I want to find a tutor</span>
                    </Label>
                  </div>
                )}
                {(!roleParam || roleParam === 'teacher') && (
                  <div className="h-full">
                    <RadioGroupItem value="Teacher" id="Teacher" className="peer sr-only" />
                    <Label
                      htmlFor="Teacher"
                      className="flex h-full flex-col items-center gap-2 justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent/5 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-all"
                    >
                      <GraduationCap className="h-8 w-8 text-primary" />
                      <span className="font-bold">Teacher</span>
                      <span className="text-xs text-muted-foreground text-center">I want to share my expertise</span>
                    </Label>
                  </div>
                )}
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
      
      <footer className="mt-12 w-full max-w-4xl">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-primary p-1 rounded-lg"><BookOpen className="text-primary-foreground h-5 w-5" /></div>
            <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 text-sm font-medium">
            <a href="tel:+919896959389" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" /> +91 98969 59389
            </a>
            <a href="mailto:support@rpcoachup.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" /> support@rpcoachup.com
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">© 2026 RP Coach-Up. All rights reserved.</p>
            <p className="text-[10px] text-muted-foreground/40 font-medium italic">design and developed by 'SK group'</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
