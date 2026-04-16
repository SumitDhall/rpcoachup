
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);

    try {
      // We remove the explicit actionCodeSettings here. 
      // Firebase will use the default redirect behavior configured in the Firebase Console.
      // This avoids "Unauthorized Domain" errors if the current window origin hasn't been whitelisted.
      await sendPasswordResetEmail(auth, email);
      
      setIsSent(true);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      let message = "Could not send reset email.";
      
      if (error.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many requests. Please try again later.";
      } else if (error.code === 'auth/unauthorized-continue-uri') {
        message = "The redirect URL is not authorized in Firebase Console.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Link href="/login" className="mb-8 flex items-center gap-2 text-primary font-medium hover:underline group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Login
      </Link>
      
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl">
              <BookOpen className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Reset Password</CardTitle>
          <CardDescription>
            {isSent 
              ? "Instructions have been sent to your email." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        
        {isSent ? (
          <CardContent className="flex flex-col items-center py-6 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                An email has been sent to <span className="font-bold text-foreground">{email}</span>. 
              </p>
              <p className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-dashed">
                Tip: If you don't see the email within a few minutes, please check your <strong>Spam or Junk</strong> folder.
              </p>
            </div>
            <Button className="w-full mt-4 h-11" asChild>
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full h-11 text-lg font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Need help? Contact <a href="mailto:support@rpcoachup.com" className="text-primary hover:underline">support@rpcoachup.com</a>
      </div>
    </div>
  );
}
