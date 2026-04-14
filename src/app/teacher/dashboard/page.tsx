
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
  History, 
  Menu,
  CheckCircle2,
  MessageSquare,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function TeacherDashboard() {
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

  const teacherInterestsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'teacherInterests'),
      where('teacherId', '==', user.uid),
      limit(100)
    );
  }, [db, user?.uid]);
  const { data: rawInterests, isLoading: isLoadingInterests } = useCollection(teacherInterestsQuery);

  const [activeTab, setActiveTab] = useState('profile');
  
  // Specialty Form State
  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [subjects, setSubjects] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeData, setResumeData] = useState('');

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState('5');
  const [feedbackComment, setFeedbackComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (profile) {
      setTeacherName(`${profile.firstName} ${profile.lastName}`);
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setResumeData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !subjects || !phone || !email || !resumeName) {
      toast({ variant: "destructive", title: "Missing Info", description: "Complete mandatory fields." });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'teacherInterests'), {
        teacherId: user?.uid,
        teacherName, phone, email,
        qualifications: qualifications || 'N/A',
        experienceYears: experienceYears || '0',
        subjects, resumeName, resumeData,
        submissionDate: serverTimestamp(),
        status: 'Pending'
      });
      addDocumentNonBlocking(collection(db, 'notifications'), {
        type: 'interest',
        subject: `New Teacher Profile: ${teacherName}`,
        body: `${teacherName} submitted a specialty profile for ${subjects}.`,
        userEmail: email,
        userName: teacherName,
        timestamp: serverTimestamp(),
        read: false
      });
      setShowSuccessDialog(true);
      setQualifications(''); setExperienceYears(''); setSubjects(''); setResumeName(''); setResumeData(''); setPhone('');
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to submit profile." });
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
        userType: 'Teacher',
        rating: Number(feedbackRating),
        comment: feedbackComment,
        createdAt: serverTimestamp()
      });
      toast({ title: "Feedback Received", description: "Thank you for your valuable feedback!" });
      setFeedbackComment('');
      setFeedbackRating('5');
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Feedback Error", description: "Could not submit feedback." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Button variant={activeTab === 'profile' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('profile')}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Button>
        <Button variant={activeTab === 'history' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('history')}>
          <History className="h-4 w-4" /> Professional Records
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
              <h1 className="text-3xl font-headline font-bold text-primary">Teacher Portal</h1>
              <p className="text-muted-foreground">Welcome, Educator {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary">Verified Teacher</Badge>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="profile">
              <Card className="shadow-lg border-primary/10">
                <CardHeader>
                  <CardTitle>Professional Specialty Profile</CardTitle>
                  <CardDescription>Update your subjects and professional details.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="teacherName">Full Name *</Label>
                        <Input id="teacherName" value={teacherName} onChange={e => setTeacherName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone / WhatsApp *</Label>
                        <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjects">Subjects *</Label>
                      <Textarea id="subjects" value={subjects} onChange={e => setSubjects(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume *</Label>
                      <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-12 text-lg">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Profile
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader><CardTitle>My Professional Records</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? <Loader2 className="animate-spin mx-auto" /> : (rawInterests && rawInterests.length > 0 ? [...rawInterests].sort((a,b) => b.submissionDate?.toMillis() - a.submissionDate?.toMillis()).map(i => (
                    <div key={i.id} className="p-4 border rounded-xl border-l-4 border-l-primary flex items-center justify-between bg-card shadow-sm">
                      <div><p className="font-bold">{i.subjects}</p><p className="text-[10px] text-muted-foreground">{i.experienceYears} yrs experience</p></div>
                      <Badge variant={i.status === 'Pending' ? 'outline' : 'default'}>{i.status}</Badge>
                    </div>
                  )) : (
                    <div className="text-center py-12 border rounded-xl border-dashed">
                      <p className="text-sm text-muted-foreground">No records found.</p>
                      <Button variant="link" onClick={() => setActiveTab('profile')}>Submit your specialties</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="border-accent/10 shadow-xl">
                <CardHeader>
                  <CardTitle>Teacher Experience Feedback</CardTitle>
                  <CardDescription>We value your expertise. Let us know how we can support you better.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Platform Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Button key={star} type="button" variant={Number(feedbackRating) >= star ? "default" : "outline"} size="icon" className="h-10 w-10" onClick={() => setFeedbackRating(star.toString())}>
                            <Star className={`h-5 w-5 ${Number(feedbackRating) >= star ? "fill-current" : ""}`} />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedbackComment">Your Experience / Feedback</Label>
                      <Textarea id="feedbackComment" value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} required placeholder="Share your teaching experience with RP Coach-Up..." />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-12 font-bold text-lg bg-accent text-accent-foreground">
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
            <AlertDialogTitle className="text-primary">Profile Received!</AlertDialogTitle>
            <AlertDialogDescription>
              Your professional profile has been received. Our team will contact you within 7 working days. You can monitor progress in the Professional Records tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogAction onClick={() => {setShowSuccessDialog(false); setActiveTab('history');}}>OK</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
