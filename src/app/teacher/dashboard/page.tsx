
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
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { notifyAdmin } from '@/app/actions/notifications';

export default function TeacherDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [specialization, setSpecialization] = useState('');
  const [availability, setAvailability] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialization || !user || !profile) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'teacherInterests'), {
        teacherId: user.uid,
        subject: specialization,
        level: 'N/A',
        topics: [],
        availability: availability,
        submissionDate: serverTimestamp(),
        status: 'Pending',
        notes: notes
      });

      // Create Notification for Admin Portal
      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `New Teacher Specialization: ${specialization}`,
        body: `Teacher ${profile.firstName} ${profile.lastName} has submitted teaching availability.\nSubject: ${specialization}\nAvailability: ${availability}`,
        userEmail: profile.email,
        userName: `${profile.firstName} ${profile.lastName}`,
        timestamp: serverTimestamp(),
        read: false
      });

      // AI simulation for admin
      notifyAdmin({
        type: 'interest',
        userType: 'Teacher',
        userName: `${profile.firstName} ${profile.lastName}`,
        userEmail: profile.email,
        details: `Specialization: ${specialization}. Availability: ${availability}. Notes: ${notes}`
      });
      
      setSpecialization('');
      setAvailability('');
      setNotes('');
      toast({
        title: "Teaching Interest Submitted",
        description: "Administrators will review your availability to find potential students.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not submit teaching interest."
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

  if (isUserLoading || isProfileLoading) {
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

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="bg-muted w-full md:w-auto grid grid-cols-2">
              <TabsTrigger value="interests">Teaching Profile</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle>Submit Teaching Interests</CardTitle>
                  <CardDescription>
                    Update the subjects you specialize in and when you are available for classes.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Specialization / Subject</label>
                      <Input 
                        placeholder="e.g. Mathematics, Science" 
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Availability</label>
                      <Input 
                        placeholder="e.g. Weekdays evenings, Weekends" 
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Additional Notes</label>
                      <Textarea 
                        placeholder="Describe your teaching approach or specific requirements..." 
                        className="min-h-[100px]" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Teaching Interest"}
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
