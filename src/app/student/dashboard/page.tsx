
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BookOpen, 
  Send, 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Loader2, 
  LogOut, 
  Globe,
  User,
  Phone,
  School,
  MapPin,
  Calendar as CalendarIcon,
  IndianRupee,
  Clock,
  ClipboardList
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { notifyAdmin } from '@/app/actions/notifications';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  // Fetch interests related to this user with a limit to satisfy security rules
  const interestsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'studentInterests'),
      where('studentId', '==', user.uid),
      limit(50)
    );
  }, [db, user?.uid]);

  const { data: interests, isLoading: isLoadingInterests } = useCollection(interestsQuery);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [gradeOrClass, setGradeOrClass] = useState('');
  const [address, setAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [affordableRange, setAffordableRange] = useState('');
  const [intendedStartDate, setIntendedStartDate] = useState('');
  
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !phone || !studentName || !user || !profile) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all mandatory fields (Name, Phone, Subject)."
      });
      return;
    }
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        studentId: user.uid,
        studentName,
        phone,
        school,
        gradeOrClass,
        address,
        subject,
        affordableRange,
        intendedStartDate,
        submissionDate: serverTimestamp(),
        status: 'Pending',
        notes
      };

      await addDoc(collection(db, 'studentInterests'), submissionData);

      // Create Notification for Admin Portal
      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `New Interest Submission from ${studentName}: ${subject}`,
        body: `Student: ${studentName}\nSubject: ${subject}\nPhone: ${phone}\nSchool: ${school}\nClass: ${gradeOrClass}\nAddress: ${address}\nStart Date: ${intendedStartDate}\nFees: ${affordableRange}\nNotes: ${notes}`,
        userEmail: profile.email,
        userName: `${profile.firstName} ${profile.lastName}`,
        timestamp: serverTimestamp(),
        read: false
      });

      // AI simulation for admin
      notifyAdmin({
        type: 'interest',
        userType: 'Student',
        userName: `${profile.firstName} ${profile.lastName}`,
        userEmail: profile.email,
        details: `Student Name: ${studentName}. Subject: ${subject}. Phone: ${phone}. Start Date: ${intendedStartDate}. Fees: ${affordableRange}.`
      });
      
      // Reset Form
      setStudentName('');
      setPhone('');
      setSchool('');
      setGradeOrClass('');
      setAddress('');
      setSubject('');
      setNotes('');
      setAffordableRange('');
      setIntendedStartDate('');

      toast({
        title: "Interest Submitted!",
        description: "Administrators will review your details to find the best match for you.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not submit interest."
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
        feedbackType: 'Platform',
        comment: feedback,
        submissionDate: serverTimestamp(),
        rating: 5
      });

      setFeedback('');
      toast({
        title: "Feedback Received",
        description: "Thank you for helping us improve RP Coach-Up!",
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

  const feeOptions = [200, 300, 400, 500, 600, 700, 800, 900, 1000];

  // Sort interests by date in memory (descending)
  const sortedInterests = interests ? [...interests].sort((a, b) => {
    const dateA = a.submissionDate?.toMillis?.() || 0;
    const dateB = b.submissionDate?.toMillis?.() || 0;
    return dateB - dateA;
  }) : [];

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
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/">
              <Globe className="h-4 w-4" />
              Public Website
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <History className="h-4 w-4" />
            History
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full gap-2 text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold">Welcome back, {profile?.firstName || 'Learner'}!</h1>
              <p className="text-muted-foreground">Manage your learning interests and view your profile information.</p>
            </div>
            <Badge variant="outline" className="w-fit text-primary border-primary">Student Account</Badge>
          </header>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="bg-muted w-full md:w-auto grid grid-cols-3">
              <TabsTrigger value="interests">Submit Interests</TabsTrigger>
              <TabsTrigger value="overview">My Profile</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-md h-fit">
                  <CardHeader>
                    <CardTitle className="text-xl">Profile Details</CardTitle>
                    <CardDescription>Your registered information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="font-medium">{profile?.firstName} {profile?.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                      <Send className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email Address</p>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Submissions</CardTitle>
                    <CardDescription>Track your active tuition requirements.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoadingInterests ? (
                      <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : sortedInterests.length > 0 ? (
                      <div className="space-y-3">
                        {sortedInterests.map((int) => (
                          <div key={int.id} className="p-4 border rounded-xl bg-card hover:border-primary/30 transition-colors shadow-sm space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-primary">{int.subject}</span>
                              <Badge variant={int.status === 'Pending' ? 'outline' : 'default'} className="text-[10px]">
                                {int.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>Submitted: {int.submissionDate?.toDate?.()?.toLocaleDateString()}</span>
                              </div>
                              {int.intendedStartDate && (
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-3 w-3" />
                                  <span>Start Date: {int.intendedStartDate}</span>
                                </div>
                              )}
                              {int.affordableRange && (
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="h-3 w-3" />
                                  <span>Budget: {int.affordableRange}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                        <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>No requirements submitted yet.</p>
                        <Button variant="link" onClick={() => {
                           const trigger = document.querySelector('[value="interests"]') as HTMLElement;
                           trigger?.click();
                        }}>
                          Submit your first interest
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="interests">
              <Card className="max-w-3xl mx-auto shadow-lg border-primary/10">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Student Tuition Requirement Form
                  </CardTitle>
                  <CardDescription>
                    Provide complete details to help us find the perfect teacher for you.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6 py-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="student-name" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Name of Student <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="student-name" 
                          placeholder="Full name of the student" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="e.g. +91 98765 43210" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="school" className="flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          School of Student
                        </Label>
                        <Input 
                          id="school" 
                          placeholder="e.g. DPS International" 
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="class" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                          Class / Grade
                        </Label>
                        <Input 
                          id="class" 
                          placeholder="e.g. Grade 10, Class A" 
                          value={gradeOrClass}
                          onChange={(e) => setGradeOrClass(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Address
                      </Label>
                      <Input 
                        id="address" 
                        placeholder="Street address for home tuition or proximity matching" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest-input" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Interest / Subject Name <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        id="interest-input" 
                        placeholder="e.g. Mathematics, Physics" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="details">Additional Details (Specific Topics or Needs)</Label>
                      <Textarea 
                        id="details" 
                        placeholder="Tell us more about current level or specific needs..." 
                        className="min-h-[80px]" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fees" className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          Affordable Fees (INR / hour)
                        </Label>
                        <Select value={affordableRange} onValueChange={setAffordableRange}>
                          <SelectTrigger id="fees">
                            <SelectValue placeholder="Select hourly fee" />
                          </SelectTrigger>
                          <SelectContent>
                            {feeOptions.map((fee) => (
                              <SelectItem key={fee} value={`${fee} INR`}>
                                {fee} INR / hour
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="start-date" className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          Intended Start Date
                        </Label>
                        <Input 
                          id="start-date" 
                          type="date"
                          value={intendedStartDate}
                          onChange={(e) => setIntendedStartDate(e.target.value)}
                        />
                      </div>
                    </div>

                  </CardContent>
                  <CardFooter className="bg-secondary/10 rounded-b-lg p-6">
                    <Button type="submit" className="w-full gap-2 h-12 text-lg font-bold" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      Submit Tuition Requirement
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                  <CardTitle>Share your Feedback</CardTitle>
                  <CardDescription>
                    Help us improve RP Coach-Up. Your feedback goes directly to our administration team.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select id="category" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Platform Experience</option>
                        <option>Course Quality</option>
                        <option>Teacher Match</option>
                        <option>Technical Issue</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Type your feedback here..." 
                        className="min-h-[150px]" 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                       {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Feedback"}
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
