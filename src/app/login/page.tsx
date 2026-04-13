
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading: isAuthCheckLoading } = useUser();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Automatically redirect if user is already logged in
  useEffect(() => {
    if (!isAuthCheckLoading && user) {
      handleRoleRedirect(user.uid);
    }
  }, [user, isAuthCheckLoading]);

  const handleRoleRedirect = async (uid: string) => {
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
        toast({
          variant: "destructive",
          title: "Profile Not Found",
          description: "Your authentication is valid, but we couldn't find your platform profile. Please contact support.",
        });
      }
    } catch (e) {
      console.error("Redirection check failed:", e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await handleRoleRedirect(user.uid);
      
      toast({ 
        title: "Login Successful", 
        description: "Welcome back to RP Coach-Up!" 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Invalid credentials or system error.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "The email or password you entered is incorrect.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <CardDescription>Login to your RP Coach-Up account</CardDescription>
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
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg border flex gap-3 items-start text-xs text-muted-foreground">
              <ShieldAlert className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p>
                <strong>Admin Access:</strong> To login as admin, your account UID must exist in the <code>roles_admin</code> Firestore collection.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 text-lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">Register now</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
