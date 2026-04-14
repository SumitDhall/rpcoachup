
"use client"

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  BookOpen,
  LayoutDashboard,
  Loader2,
  LogOut,
  User,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  School,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Menu,
  History,
  MessageSquare,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { sendNotificationEmail } from '@/app/actions/notifications';

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

  const interestsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'studentInterests'),
      where('studentId', '==', user.uid),
      limit(100)
    );
  }, [db, user?.uid]);
  const { data: rawInterests, isLoading: isLoadingInterests } = useCollection(interestsQuery);

  const matchesQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'matchProposals'),
      where('studentId', '==', user.uid),
      limit(50)
    );
  }, [db, user?.uid]);
  const { data: matches } = useCollection(matchesQuery);

  const [activeTab, setActiveTab] = useState('interests');
  
  // Tuition Request State
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [school, setSchool] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [affordableRange, setAffordableRange] = useState('');
  const [intendedStartDate, setIntendedStartDate] = useState('');
  
  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState('5');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackTeacher, setFeedbackTeacher] = useState('General Platform Feedback');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (profile) {
      setStudentName(`${profile.firstName} ${profile.lastName}`);
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !studentName || !phone || !email || !school || !gradeLevel) {
      toast({ variant: "destructive", title: "Required Fields Missing", description: "Please complete mandatory fields." });
      return; 
    }
    setIsSubmitting(true);
    try {
      const submissionData = {
        studentId: user?.uid,
        studentName,
        phone,
        email,
        subject,
        school,
        gradeOrClass: gradeLevel,
        address,
        affordableRange: affordableRange || 'Flexible',
        intendedStartDate: intendedStartDate || 'TBD',
        submissionDate: serverTimestamp(),
        status: 'Pending',
        notes: notes || ''
      };
      await addDoc(collection(db, 'studentInterests'), submissionData);
      addDocumentNonBlocking(collection(db, 'notifications'), {
        type: 'interest',
        subject: `Student Tuition Inquiry: ${subject}`,
        body: `Student ${studentName} requested tuition for ${subject}.`,
        userEmail: email,
        userName: studentName,
        timestamp: serverTimestamp(),
        read: false
      });
      setShowSuccessDialog(true);
      setSubject(''); setSchool(''); setGradeLevel(''); setAddress(''); setNotes(''); setPhone(''); setAffordableRange(''); setIntendedStartDate('');
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Submission Failed", description: "An error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment || !feedbackRating) {
      toast({ variant: "destructive", title: "Incomplete Feedback", description: "Please provide a rating and a comment." });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user?.uid,
        userName: `${profile?.firstName} ${profile?.lastName}`,
        userType: 'Student',
        rating: Number(feedbackRating),
        comment: feedbackComment,
        teacherName: feedbackTeacher,
        createdAt: serverTimestamp()
      });
      toast({ title: "Feedback Received", description: "Thank you for sharing your thoughts!" });
      setFeedbackComment('');
      setFeedbackRating('5');
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Feedback Error", description: "Could not submit feedback." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const gradeOptions = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  if (isUserLoading || isProfileLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <BookOpen className="text-primary h-6 w-6" />
        <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
      </Link>
      <nav className="flex-1 px-4 space-y-1">
        <Button variant={activeTab === 'interests' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('interests')}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Button>
        <Button variant={activeTab === 'history' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('history')}>
          <History className="h-4 w-4" /> Inquiry History
        </Button>
        <Button variant={activeTab === 'feedback' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('feedback')}>
          <MessageSquare className="h-4 w-4" /> Feedback
        </Button>
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background flex-col lg:flex-row">
      <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BookOpen className="text-primary h-6 w-6" />
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="h-6 w-6 text-primary" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <SidebarContent />
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Student Portal</h1>
              <p className="text-muted-foreground">Manage your learning journey, {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary bg-primary/5">Student Dashboard</Badge>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="interests">
              <Card className="border-primary/10 shadow-xl">
                <CardHeader>
                  <CardTitle>Tuition Requirement Form</CardTitle>
                  <CardDescription>Fill out the details to match with a teacher.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student Full Name *</Label>
                        <Input id="studentName" value={studentName} onChange={e => setStudentName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject Needed *</Label>
                        <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g., Mathematics" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="school">Current School *</Label>
                        <Input id="school" value={school} onChange={e => setSchool(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gradeLevel">Class / Grade *</Label>
                        <Select value={gradeLevel} onValueChange={setGradeLevel} required>
                          <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                          <SelectContent>
                            {gradeOptions.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Contact Phone *</Label>
                        <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Contact Email *</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-12 text-lg">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Request
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader><CardTitle>Inquiry History</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? <Loader2 className="animate-spin mx-auto" /> : (rawInterests && rawInterests.length > 0 ? [...rawInterests].sort((a,b) => b.submissionDate?.toMillis() - a.submissionDate?.toMillis()).map(i => (
                    <div key={i.id} className="p-4 border rounded-xl flex items-center justify-between bg-card shadow-sm border-l-4 border-l-primary">
                      <div><p className="font-bold">{i.subject}</p><p className="text-xs text-muted-foreground">{i.gradeOrClass}</p></div>
                      <Badge variant={i.status === 'Pending' ? 'outline' : 'default'}>{i.status}</Badge>
                    </div>
                  )) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                      <p className="text-muted-foreground">No inquiries found.</p>
                      <Button variant="link" onClick={() => setActiveTab('interests')}>Start your first request now</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="border-accent/10 shadow-xl">
                <CardHeader>
                  <CardTitle>Share Your Feedback</CardTitle>
                  <CardDescription>Tell us about your experience with RP Coach-Up and your teachers.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Button key={star} type="button" variant={Number(feedbackRating) >= star ? "default" : "outline"} size="icon" className="h-10 w-10" onClick={() => setFeedbackRating(star.toString())}>
                            <Star className={`h-5 w-5 ${Number(feedbackRating) >= star ? "fill-current" : ""}`} />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedbackTeacher">Who is this feedback for?</Label>
                      <Select value={feedbackTeacher} onValueChange={setFeedbackTeacher}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Platform Feedback">General Platform Feedback</SelectItem>
                          {matches?.map(m => (
                            <SelectItem key={m.id} value={`Teacher: ${m.teacherName}`}>Teacher: {m.teacherName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedbackComment">Comment</Label>
                      <Textarea id="feedbackComment" value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} required placeholder="How can we improve? What did you like?" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-12 font-bold text-lg bg-accent text-accent-foreground hover:bg-accent/90">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Feedback
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Request Submitted!</AlertDialogTitle>
            <AlertDialogDescription>
              Your request has been received. Our management will contact you within 7 working days. You can check the status in the Inquiry History tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogAction onClick={() => {setShowSuccessDialog(false); setActiveTab('history');}}>OK</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
