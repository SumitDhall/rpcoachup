
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Loader2, ShieldAlert, LogOut } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleRoleRedirect = async (uid: string) => {
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
        setIsRedirecting(false);
        toast({
          variant: "destructive",
          title: "Profile Not Found",
          description: "Your authentication is valid, but we couldn't find your profile. Please register again or sign out.",
        });
      }
    } catch (e) {
      console.error("Redirection check failed:", e);
      setIsRedirecting(false);
      toast({
        variant: "destructive",
        title: "Access Error",
        description: "Failed to verify user permissions. Please try again.",
      });
    }
  };

  // Automatically redirect if user is already logged in
  useEffect(() => {
    if (!isAuthCheckLoading && user && !isRedirecting) {
      handleRoleRedirect(user.uid);
    }
  }, [user, isAuthCheckLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut(auth);
    setIsLoading(false);
    toast({ title: "Signed Out", description: "Session deleted successfully." });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await handleRoleRedirect(userCredential.user.uid);
      
      toast({ 
        title: "Login Successful", 
        description: "Welcome back!" 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Invalid email or password.";
      
      // Handle Firebase Auth specific error codes
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid login credentials. Please check your email and password.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Account not found.";
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthCheckLoading || (user && isRedirecting)) {
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
            {user ? `Logged in as ${user.email}` : "Login to your account"}
          </CardDescription>
        </CardHeader>
        
        {user ? (
          <CardContent className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start text-xs text-amber-800">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Session Detected</p>
                <p>You are currently signed in, but we couldn't automatically redirect you. This might be due to a missing profile document or permission error.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">Create New Profile</Link>
               </Button>
               <Button variant="destructive" className="w-full" onClick={handleSignOut} disabled={isLoading}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
               </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full h-11 text-lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary font-semibold hover:underline">Register</Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
