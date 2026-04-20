
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Loader2, Phone, Mail } from 'lucide-react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading: isAuthCheckLoading } = useUser();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleRoleRedirect = async (uid: string) => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    
    try {
      const adminDocRef = doc(db, 'roles_admin', uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists()) {
        router.push('/admin');
        return;
      }

      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = (userData.userType || 'Student').toLowerCase();
        router.push(`/${role}/dashboard`);
      } else {
        toast({
          variant: "destructive",
          title: "Profile Missing",
          description: "Your authentication exists, but your database profile is missing.",
        });
        await signOut(auth);
        setIsRedirecting(false);
        setHasAttemptedRedirect(false);
      }
    } catch (e) {
      console.error("Redirect check failed", e);
      setIsRedirecting(false);
      setHasAttemptedRedirect(false);
    }
  };

  useEffect(() => {
    if (!isAuthCheckLoading && user && !isRedirecting && !hasAttemptedRedirect) {
      setHasAttemptedRedirect(true);
      handleRoleRedirect(user.uid);
    }
    if (!isAuthCheckLoading && !user) {
      setHasAttemptedRedirect(false);
    }
  }, [user, isAuthCheckLoading, isRedirecting, hasAttemptedRedirect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasAttemptedRedirect(false);

    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        toast({ 
          title: "Login Successful", 
          description: "Verifying your profile details..." 
        });
      })
      .catch((error: any) => {
        setIsLoading(false);
        let errorMessage = "Invalid email or password.";
        
        if (error.code === 'auth/user-not-found') {
          toast({
            variant: "destructive",
            title: "User Not Registered",
            description: "We couldn't find an account with this email.",
          });
          return;
        } else if (error.code === 'auth/invalid-credential') {
          errorMessage = "Invalid login credentials. Please check your email and password.";
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = "Too many failed attempts. Please try again later.";
        }

        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        });
      });
  };

  if (isAuthCheckLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Authenticating and verifying profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Link href="/" className="mb-8 flex items-center gap-2 text-primary font-medium hover:underline group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>
      
      <Card className="w-full max-md shadow-2xl border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl">
              <BookOpen className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Welcome Back</CardTitle>
          <CardDescription>
            Login to your account to continue
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" title="Reset your password" className="text-xs text-primary font-medium hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 text-lg font-bold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">Register</Link>
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
