
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
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
      // 1. Check Admin status
      const adminDocRef = doc(db, 'roles_admin', uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists()) {
        router.push('/admin');
        return;
      }

      // 2. Check Standard User status
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = (userData.userType || 'Student').toLowerCase();
        router.push(`/${role}/dashboard`);
      } else {
        // Handle case where user auth exists but no Firestore profile yet
        toast({
          variant: "destructive",
          title: "Profile Missing",
          description: "Your login was successful, but your profile details are missing from our database. Please contact support or try registering again with a different email.",
        });
        // We sign out here to allow them to attempt a clean registration or contact support
        await signOut(auth);
        setIsRedirecting(false);
        setHasAttemptedRedirect(false);
        // We don't automatically redirect to register to avoid the loop
      }
    } catch (e) {
      console.error("Redirection error:", e);
      setIsRedirecting(false);
      setHasAttemptedRedirect(false);
    }
  };

  // Automatically redirect if user is already logged in
  useEffect(() => {
    if (!isAuthCheckLoading && user && !isRedirecting && !hasAttemptedRedirect) {
      setHasAttemptedRedirect(true);
      handleRoleRedirect(user.uid);
    }
    // If user logs out, reset the attempt tracker
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

    // Reset attempt tracker on new manual login attempt
    setHasAttemptedRedirect(false);

    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        toast({ 
          title: "Login Successful", 
          description: "Verifying your profile details..." 
        });
        // Redirection is handled by the useEffect above
      })
      .catch((error: any) => {
        setIsLoading(false);
        let errorMessage = "Invalid email or password.";
        
        if (error.code === 'auth/user-not-found') {
          toast({
            variant: "destructive",
            title: "User Not Registered",
            description: "We couldn't find an account with this email. Please register for a new account.",
          });
          return;
        } else if (error.code === 'auth/invalid-credential') {
          errorMessage = "Invalid login credentials. Please check your email and password.";
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = "Incorrect password.";
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
      
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl">
              <BookOpen className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
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
      
      <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
        <p>© 2026 RP Coach-Up. All rights reserved.</p>
        <p className="text-[10px] text-muted-foreground/30 italic">design and developed by 'SK group'</p>
      </div>
    </div>
  );
}
