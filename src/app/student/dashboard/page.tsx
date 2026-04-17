
"use client"

import { useState, useEffect } from 'react';
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
  SheetClose
} from "@/components/ui/sheet";
import {
  BookOpen,
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
  Star,
  Info,
  PlusCircle
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

  // Default landing tab is 'history' (Tutor Inquiry)
  const [activeTab, setActiveTab] = useState('history');
  
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
    if (!subject || !studentName || !phone || !email || !school || !gradeLevel || !address || !affordableRange) {
      toast({ variant: "destructive", title: "Required Fields Missing", description: "Please complete all mandatory fields, including address and budget." });
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
        affordableRange,
        intendedStartDate: intendedStartDate || 'Immediately',
        submissionDate: serverTimestamp(),
        status: 'Pending',
        notes: notes || ''
      };
      
      await addDoc(collection(db, 'studentInterests'), submissionData);
      
      addDocumentNonBlocking(collection(db, 'notifications'), {
        type: 'interest',
        subject: `Student Tuition Inquiry: ${subject}`,
        body: `Student ${studentName} requested tuition for ${subject}. Budget: ${affordableRange}.`,
        userEmail: email,
        userName: studentName,
        timestamp: serverTimestamp(),
        read: false
      });

      sendNotificationEmail({
        recipientType: 'user',
        type: 'interest',
        userType: 'Student',
        userName: studentName,
        userEmail: email,
        details: `Your inquiry for ${subject} has been submitted successfully.`
      });

      setShowSuccessDialog(true);
      setSubject(''); setSchool(''); setGradeLevel(''); setAddress(''); setNotes(''); setPhone(''); setAffordableRange(''); setIntendedStartDate('');
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
        userType: 'Student',
        rating: Number(feedbackRating),
        comment: feedbackComment,
        teacherName: feedbackTeacher,
        createdAt: serverTimestamp()
      });

      addDocumentNonBlocking(collection(db, 'notifications'), {
        type: 'feedback',
        subject: `New Student Feedback: ${feedbackRating} Stars`,
        body: `Student ${profile?.firstName} ${profile?.lastName} shared feedback: "${feedbackComment}"`,
        userEmail: profile?.email || 'N/A',
        userName: `${profile?.firstName} ${profile?.lastName}`,
        timestamp: serverTimestamp(),
        read: false
      });

      sendNotificationEmail({
        recipientType: 'admin',
        type: 'interest',
        userType: 'Student',
        userName: `${profile?.firstName} ${profile?.lastName}`,
        userEmail: profile?.email || '',
        details: `Student provided a ${feedbackRating}-star review. Comment: ${feedbackComment}`
      });

      toast({ title: "Feedback Received", description: "Thank you for sharing your thoughts!" });
      setFeedbackComment('');
      setFeedbackRating('5');
    } catch (error) {
      // Handled by central emitter
    } finally {
      setIsSubmitting(false);
    }
  };

  const gradeOptions = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
  
  const budgetRanges = [
    "Below ₹2,000",
    "₹2,000 - ₹5,000",
    "₹5,000 - ₹10,000",
    "₹10,000 - ₹15,000",
    "₹15,000 - ₹20,000",
    "Above ₹20,000",
    "Per Session Basis",
    "Negotiable"
  ];

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
            <History className="h-4 w-4" /> Tutor Inquiry
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'interests' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('interests')}>
            <PlusCircle className="h-4 w-4" /> Submit Enquiry
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'feedback' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('feedback')}>
            <MessageSquare className="h-4 w-4" /> Feedback
          </Button>
        </SheetClose>
      </nav>
      <div className="p-4 border-t space-y-4">
        <div className="px-2 space-y-2 text-[10px] text-muted-foreground">
          <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> +91 98969 59389</p>
          <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> support@rpcoachup.com</p>
        </div>
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
            <SheetHeader className="sr-only text-left">
              <SheetTitle>Student Navigation</SheetTitle>
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
              <History className="h-4 w-4" /> Tutor Inquiry
            </Button>
            <Button variant={activeTab === 'interests' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('interests')}>
              <PlusCircle className="h-4 w-4" /> Submit Enquiry
            </Button>
            <Button variant={activeTab === 'feedback' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('feedback')}>
              <MessageSquare className="h-4 w-4" /> Feedback
            </Button>
          </nav>
          <div className="p-4 border-t space-y-4">
            <div className="px-2 space-y-2 text-[10px] text-muted-foreground">
              <p className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Phone className="h-3 w-3" /> +91 98969 59389</p>
              <p className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><Mail className="h-3 w-3" /> support@rpcoachup.com</p>
            </div>
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8 flex-1 w-full">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Student Portal</h1>
              <p className="text-muted-foreground">Manage your learning journey, {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary bg-primary/5">Student Dashboard</Badge>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="interests">
              <Card className="border-primary/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle>Tuition Requirement Form</CardTitle>
                  <CardDescription>Provide detailed requirements to find the best matching teacher.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-8 pt-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <User className="h-4 w-4" /> Personal Information
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Student Full Name *</Label>
                          <Input id="studentName" value={studentName} onChange={e => setStudentName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject Needed *</Label>
                          <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g., Mathematics, Science" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <School className="h-4 w-4" /> Academic Details
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
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <MapPin className="h-4 w-4" /> Contact & Location
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Contact Phone *</Label>
                          <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+91" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Contact Email *</Label>
                          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Full Home Address *</Label>
                        <Textarea 
                          id="address" 
                          value={address} 
                          onChange={e => setAddress(e.target.value)} 
                          required 
                          placeholder="Please provide your complete landmark address for home tuition." 
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <IndianRupee className="h-4 w-4" /> Budget & Timeline
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Monthly Fee Budget (INR) *</Label>
                          <Select value={affordableRange} onValueChange={setAffordableRange} required>
                            <SelectTrigger id="budget"><SelectValue placeholder="Select Budget Range" /></SelectTrigger>
                            <SelectContent>
                              {budgetRanges.map(range => <SelectItem key={range} value={range}>{range}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Intended Start Date</Label>
                          <Input id="startDate" type="date" value={intendedStartDate} onChange={e => setIntendedStartDate(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <Info className="h-4 w-4" /> Additional Information
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes / Special Requirements</Label>
                        <Textarea 
                          id="notes" 
                          value={notes} 
                          onChange={e => setNotes(e.target.value)} 
                          placeholder="e.g., Preferred teacher gender, specific topics to focus on, or timing preferences." 
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-secondary/5 pt-6 pb-8">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-14 text-xl shadow-lg shadow-primary/20">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Request
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Tutor Inquiry</CardTitle>
                      <CardDescription>Detailed records of your submitted tuition requests.</CardDescription>
                    </div>
                    {rawInterests && rawInterests.length > 0 && (
                      <Button onClick={() => setActiveTab('interests')} className="gap-2 shrink-0">
                        <PlusCircle className="h-4 w-4" /> Submit New Inquiry
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingInterests ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : (rawInterests && rawInterests.length > 0 ? [...rawInterests].sort((a,b) => (b.submissionDate?.toMillis?.() || 0) - (a.submissionDate?.toMillis?.() || 0)).map(i => (
                    <div key={i.id} className="p-5 border rounded-xl space-y-4 bg-card shadow-sm border-l-4 border-l-primary">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">{i.subject}</p>
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
                            <User className="h-4 w-4" /> Student & Academic
                          </p>
                          <div className="space-y-1">
                            <p className="font-medium">{i.studentName}</p>
                            <p className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" /> {i.gradeOrClass}</p>
                            <p className="flex items-center gap-2 text-muted-foreground"><School className="h-3.5 w-3.5" /> {i.school}</p>
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
                            <IndianRupee className="h-3 w-3" /> Budget & Timeline
                          </p>
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-accent font-bold"><IndianRupee className="h-3.5 w-3.5" /> {i.affordableRange}</p>
                            <p className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Starts: {i.intendedStartDate}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                             <MapPin className="h-3 w-3" /> Location
                          </p>
                          <p className="text-xs leading-relaxed text-muted-foreground bg-secondary/10 p-2 rounded-lg">{i.address}</p>
                        </div>
                      </div>

                      {i.notes && (
                        <div className="space-y-2 text-sm pt-2">
                           <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                             <Info className="h-3 w-3" /> Special Requirements
                           </p>
                           <p className="text-xs italic bg-accent/5 p-3 rounded-lg border-l-2 border-accent">"{i.notes}"</p>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-secondary/5">
                      <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4 text-primary">
                        <History className="h-8 w-8" />
                      </div>
                      <p className="text-muted-foreground font-medium mb-4">No tuition requests found yet.</p>
                      <Button onClick={() => setActiveTab('interests')}>Start your first request now</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="border-accent/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-accent/5 border-b">
                  <CardTitle>Share Your Feedback</CardTitle>
                  <CardDescription>Tell us about your experience with RP Coach-Up and your teachers.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-8 pt-8">
                    <div className="space-y-4">
                      <Label className="text-lg">Overall Satisfaction</Label>
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
                      <p className="text-xs text-muted-foreground italic animate-pulse">Select a star to rate your experience</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="feedbackTeacher" className="text-lg">Who is this feedback for?</Label>
                      <Select value={feedbackTeacher} onValueChange={setFeedbackTeacher}>
                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Platform Feedback">General Platform Feedback</SelectItem>
                          {matches?.map(m => (
                            <SelectItem key={m.id} value={m.teacherName}>{m.teacherName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedbackComment" className="text-lg">Your Comments</Label>
                      <Textarea 
                        id="feedbackComment" 
                        value={feedbackComment} 
                        onChange={e => setFeedbackComment(e.target.value)} 
                        required 
                        placeholder="How can we improve? What did you like about your experience?" 
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

        <footer className="mt-auto pt-12 pb-8 border-t text-center text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4 text-xs font-medium">
            <a href="tel:+919896959389" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" /> +91 98969 59389
            </a>
            <a href="mailto:support@rpcoachup.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="h-3 w-3" /> support@rpcoachup.com
            </a>
          </div>
          <div className="space-y-1">
            <p className="text-[10px]">© 2026 RP Coach-Up Platform. All rights reserved.</p>
            <p className="text-[10px] text-muted-foreground/30 italic">design and developed by 'SK group'</p>
          </div>
        </footer>
      </main>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-2xl text-primary">Request Submitted!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Thank you for your enquiry. Our support team will contact you within 7 working days. 
              <br /><br />
              You can track the progress of your request on Tutor Enquiry page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <AlertDialogAction 
              onClick={() => {setShowSuccessDialog(false); setActiveTab('history');}}
              className="px-10 h-12 rounded-xl text-lg font-bold"
            >
              Great, Thank You
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
