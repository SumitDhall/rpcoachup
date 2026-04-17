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
  SheetClose
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
  Star,
  User,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  FileText,
  Info,
  Calendar,
  IndianRupee,
  PlusCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { sendNotificationEmail } from '@/app/actions/notifications';

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

  // Set default tab to 'history' (Professional Records)
  const [activeTab, setActiveTab] = useState('history');
  
  // Specialty Form State
  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [subjects, setSubjects] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
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
    if (!teacherName || !subjects || !phone || !email || !resumeName || !qualifications || !experienceYears) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please complete all mandatory fields, including your resume." });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'teacherInterests'), {
        teacherId: user?.uid,
        teacherName,
        phone,
        email,
        qualifications,
        experienceYears,
        subjects,
        expectedSalary: expectedSalary || 'Negotiable',
        resumeName,
        resumeData,
        submissionDate: serverTimestamp(),
        status: 'Pending'
      });
      
      addDocumentNonBlocking(collection(db, 'notifications'), {
        type: 'interest',
        subject: `New Teacher Application: ${teacherName}`,
        body: `${teacherName} submitted a specialty profile for ${subjects}. Experience: ${experienceYears} years.`,
        userEmail: email,
        userName: teacherName,
        timestamp: serverTimestamp(),
        read: false
      });

      setShowSuccessDialog(true);
      // Reset form
      setQualifications(''); 
      setExperienceYears(''); 
      setSubjects(''); 
      setResumeName(''); 
      setResumeData(''); 
      setPhone('');
      setExpectedSalary('');
    } catch (error) {
      // Handled by central emitter
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

      // Notify Admin in Firestore
      addDocumentNonBlocking(collection(db, 'notifications'), {
        type: 'feedback',
        subject: `New Teacher Feedback: ${feedbackRating} Stars`,
        body: `Teacher ${profile?.firstName} ${profile?.lastName} shared feedback: "${feedbackComment}"`,
        userEmail: profile?.email || 'N/A',
        userName: `${profile?.firstName} ${profile?.lastName}`,
        timestamp: serverTimestamp(),
        read: false
      });

      // Notify Admin via simulated email
      sendNotificationEmail({
        recipientType: 'admin',
        type: 'interest',
        userType: 'Teacher',
        userName: `${profile?.firstName} ${profile?.lastName}`,
        userEmail: profile?.email || '',
        details: `Teacher provided a ${feedbackRating}-star review. Comment: ${feedbackComment}`
      });

      toast({ title: "Feedback Received", description: "Thank you for your valuable feedback!" });
      setFeedbackComment('');
      setFeedbackRating('5');
    } catch (error) {
      // Handled by central emitter
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || isProfileLoading || !user) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="bg-primary p-1 rounded-lg">
          <BookOpen className="text-primary-foreground h-5 w-5" />
        </div>
        <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
      </Link>
      <nav className="flex-1 px-4 space-y-1">
        <SheetClose asChild>
          <Button variant={activeTab === 'history' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('history')}>
            <History className="h-4 w-4" /> Professional Records
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'profile' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('profile')}>
            <PlusCircle className="h-4 w-4" /> Submit Profile
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'feedback' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('feedback')}>
            <MessageSquare className="h-4 w-4" /> Feedback
          </Button>
        </SheetClose>
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
          <div className="bg-primary p-1.5 rounded-lg">
            <BookOpen className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="h-6 w-6 text-primary" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Teacher Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="flex flex-col h-full">
          <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-1 rounded-lg">
              <BookOpen className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
          </Link>
          <nav className="flex-1 px-4 space-y-1">
            <Button variant={activeTab === 'history' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('history')}>
              <History className="h-4 w-4" /> Professional Records
            </Button>
            <Button variant={activeTab === 'profile' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('profile')}>
              <PlusCircle className="h-4 w-4" /> Submit Profile
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
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Teacher Portal</h1>
              <p className="text-muted-foreground">Welcome, Educator {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary bg-primary/5 uppercase font-bold">Verified Teacher</Badge>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Professional Records</CardTitle>
                      <CardDescription>Detailed records of your submitted specialty profiles and application status.</CardDescription>
                    </div>
                    {rawInterests && rawInterests.length > 0 && (
                      <Button onClick={() => setActiveTab('profile')} className="gap-2">
                        <PlusCircle className="h-4 w-4" /> New/Updated Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingInterests ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                  ) : (rawInterests && rawInterests.length > 0 ? (
                    [...rawInterests].sort((a,b) => (b.submissionDate?.toMillis?.() || 0) - (a.submissionDate?.toMillis?.() || 0)).map(i => (
                      <div key={i.id} className="p-5 border rounded-xl space-y-4 bg-card shadow-sm border-l-4 border-l-primary">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg">{i.subjects}</p>
                            <Badge variant={i.status === 'Pending' ? 'outline' : 'default'} className={i.status === 'Completed' ? 'bg-green-600 text-white' : i.status === 'In-Progress' ? 'bg-blue-500 text-white' : ''}>
                              {i.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {i.submissionDate?.toDate?.()?.toLocaleDateString() || 'Just now'}
                          </p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 text-sm border-t pt-4">
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                              <User className="h-4 w-4" /> Teacher Details
                            </p>
                            <div className="space-y-1">
                              <p className="font-medium">{i.teacherName}</p>
                              <p className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" /> {i.qualifications}</p>
                              <p className="flex items-center gap-2 text-muted-foreground"><Briefcase className="h-3.5 w-3.5" /> {i.experienceYears} Years Experience</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Contact Details
                            </p>
                            <div className="space-y-1">
                              <p className="flex items-center gap-2 font-medium"><Phone className="h-3.5 w-3.5 text-primary" /> {i.phone}</p>
                              <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {i.email}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" /> Salary Expectation
                            </p>
                            <div className="space-y-1">
                              <p className="flex items-center gap-2 text-accent font-bold"><IndianRupee className="h-3.5 w-3.5" /> {i.expectedSalary}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                               <FileText className="h-3 w-3" /> Supporting Docs
                            </p>
                            <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 p-2 rounded-lg w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              Resume: {i.resumeName}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-secondary/5">
                      <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4 text-primary">
                        <Briefcase className="h-8 w-8" />
                      </div>
                      <p className="text-muted-foreground font-medium mb-4">No professional records found.</p>
                      <Button onClick={() => setActiveTab('profile')}>Submit your first profile</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="shadow-2xl border-primary/10 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle>Submit Profile</CardTitle>
                  <CardDescription>Update your teaching subjects, qualifications, and professional background.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-8 pt-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <User className="h-4 w-4" /> Personal Information
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="teacherName">Full Name *</Label>
                          <Input id="teacherName" value={teacherName} onChange={e => setTeacherName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Professional Email *</Label>
                          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone / WhatsApp *</Label>
                          <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+91" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salary">Expected Monthly Salary (Optional)</Label>
                          <Input id="salary" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} placeholder="e.g., ₹15,000" />
                        </div>
                      </div>
                    </div>

                    {/* Professional Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <GraduationCap className="h-4 w-4" /> Academic & Professional Background
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="qualifications">Highest Qualification *</Label>
                          <Input id="qualifications" value={qualifications} onChange={e => setQualifications(e.target.value)} required placeholder="e.g., M.Sc Mathematics, B.Ed" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience *</Label>
                          <Input id="experience" type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} required placeholder="e.g., 5" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subjects">Subjects Specialized In *</Label>
                        <Textarea 
                          id="subjects" 
                          value={subjects} 
                          onChange={e => setSubjects(e.target.value)} 
                          required 
                          placeholder="Please list the subjects you are qualified to teach (e.g., Physics, Chemistry for Class XI-XII)." 
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <FileText className="h-4 w-4" /> Supporting Documents
                      </div>
                      <div className="p-6 border-2 border-dashed rounded-xl bg-secondary/5 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="resume" className="text-base">Upload Professional Resume / CV *</Label>
                          <Input 
                            id="resume" 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            onChange={handleFileChange} 
                            required 
                            className="h-12 pt-2 cursor-pointer bg-background"
                          />
                          <p className="text-[10px] text-muted-foreground">Accepted formats: PDF, DOC, DOCX. Max size: 5MB.</p>
                        </div>
                        {resumeName && (
                          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 p-2 rounded-lg w-fit">
                            <CheckCircle2 className="h-3 w-3" />
                            File Selected: {resumeName}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-secondary/5 pt-6 pb-8">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-14 text-xl shadow-lg shadow-primary/20">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Professional Profile
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="border-accent/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-accent/5 border-b">
                  <CardTitle>Teacher Experience Feedback</CardTitle>
                  <CardDescription>Your insights help us improve the platform for both students and educators.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-8 pt-8">
                    <div className="space-y-4">
                      <Label className="text-lg">Overall Platform Satisfaction</Label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Button 
                            key={star} 
                            type="button" 
                            variant={Number(feedbackRating) >= star ? "default" : "outline"} 
                            size="icon" 
                            className={`h-12 w-12 rounded-xl transition-all duration-300 hover:scale-125 hover:rotate-6 active:scale-90 ${Number(feedbackRating) >= star ? 'bg-accent text-accent-foreground scale-110 shadow-lg shadow-accent/40' : 'hover:border-accent/50'}`} 
                            onClick={() => setFeedbackRating(star.toString())}
                          >
                            <Star className={`h-6 w-6 transition-transform duration-500 ${Number(feedbackRating) >= star ? "fill-current scale-110" : "scale-100"}`} />
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground italic animate-pulse">Select a star to rate our platform</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedbackComment" className="text-lg">Your Feedback / Suggestions</Label>
                      <Textarea 
                        id="feedbackComment" 
                        value={feedbackComment} 
                        onChange={e => setFeedbackComment(e.target.value)} 
                        required 
                        placeholder="Share your teaching experience with RP Coach-Up. How can we better support you?" 
                        className="min-h-[150px] text-base"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-secondary/5 pt-6 pb-8">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 font-bold text-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
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
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-2xl text-primary">Profile Received!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Your professional specialty profile has been received. Our team will review your qualifications and resume and contact you within **7 working days** for verification.
              <br /><br />
              You can monitor the status of your application in the **Professional Records** tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <AlertDialogAction 
              onClick={() => {setShowSuccessDialog(false); setActiveTab('history');}}
              className="px-10 h-12 rounded-xl text-lg font-bold"
            >
              Understand, Thank You
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
