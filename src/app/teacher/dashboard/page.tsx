
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Send, LayoutDashboard, Calendar, Users, Star, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

export default function TeacherDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const teacherProfileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid, 'teacherProfile', 'teacherProfile');
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);
  const { data: teacherProfile, isLoading: isTeacherProfileLoading } = useDoc(teacherProfileRef);

  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherProfileRef || !user) return;
    setIsSubmitting(true);

    try {
      await updateDoc(teacherProfileRef, {
        qualifications: 'Updated Profile', // Simplified for now
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Teaching Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback || !user) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        userProfileId: user.uid,
        feedbackType: 'Teacher',
        comment: feedback,
        submissionDate: serverTimestamp(),
        rating: 5
      });

      setFeedback('');
      toast({
        title: "Feedback Received",
        description: "Thank you! We value your professional input.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not submit feedback."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || isProfileLoading || isTeacherProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-primary p-1 rounded-lg">
            <BookOpen className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-3">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-4 w-4" />
            My Students
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Star className="h-4 w-4" />
            Reviews
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold">Hello, {profile?.firstName || 'Educator'}!</h1>
              <p className="text-muted-foreground">Manage your teaching interests and student connections.</p>
            </div>
            <Badge variant="outline" className="w-fit text-accent border-accent">Teacher Account</Badge>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Active Students</span>
                </div>
                <div className="text-3xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card className="bg-accent text-accent-foreground">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-accent-foreground/80 mb-2">
                  <Star className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
                </div>
                <div className="text-3xl font-bold">N/A</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Hours Taught</span>
                </div>
                <div className="text-3xl font-bold text-primary">0h</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="bg-muted w-full md:w-auto grid grid-cols-2">
              <TabsTrigger value="interests">Teaching Profile</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle>Teaching Profile</CardTitle>
                  <CardDescription>
                    Update the subjects you specialize in and when you are available for classes.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitProfile}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input value={`${profile?.firstName} ${profile?.lastName}`} disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Specialization</label>
                      <Input placeholder="e.g. Mathematics, Science" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea placeholder="Describe your teaching philosophy..." className="min-h-[100px]" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Professional Feedback</CardTitle>
                  <CardDescription>Help us optimize the platform for educators.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Student Matching Accuracy</option>
                        <option>Scheduling Tools</option>
                        <option>Communication Tools</option>
                        <option>Payment System</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Message</label>
                      <Textarea 
                        placeholder="Detailed feedback..." 
                        className="min-h-[150px]" 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Feedback"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
