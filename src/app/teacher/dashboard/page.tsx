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
  GraduationCap,
  ClipboardList,
  FileText,
  Clock,
  IndianRupee,
  Briefcase,
  Menu,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { notifyAdmin } from '@/app/actions/notifications';

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

  const interests = useMemo(() => {
    if (!rawInterests) return null;
    return [...rawInterests].sort((a, b) => {
      const timeA = a.submissionDate?.toMillis?.() || 0;
      const timeB = b.submissionDate?.toMillis?.() || 0;
      return timeB - timeA;
    });
  }, [rawInterests]);

  const [activeTab, setActiveTab] = useState('profile');
  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [subjects, setSubjects] = useState('');
  const [notes, setNotes] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeData, setResumeData] = useState('');
  
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
      reader.onloadend = () => {
        setResumeData(reader.result as string);
      };
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
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all mandatory fields (Name, Phone, Email, Subjects, Resume)."
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const submissionData = {
        teacherId: user?.uid,
        teacherName,
        phone,
        email,
        qualifications: qualifications || 'N/A',
        experienceYears: experienceYears || '0',
        hoursPerWeek: hoursPerWeek || '0',
        expectedSalary: expectedSalary || 'N/A',
        subjects,
        resumeName: resumeName || '',
        resumeData: resumeData || '', 
        submissionDate: serverTimestamp(),
        status: 'Pending',
        notes: notes || ''
      };

      await addDoc(collection(db, 'teacherInterests'), submissionData);

      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `Professional Teacher Profile: ${teacherName}`,
        body: `New teacher profile submitted for subjects: ${subjects}. Contact: ${phone}`,
        userEmail: email,
        userName: teacherName,
        timestamp: serverTimestamp(),
        read: false
      });

      notifyAdmin({
        type: 'interest',
        userType: 'Teacher',
        userName: teacherName,
        userEmail: email,
        details: `Subjects: ${subjects}, Exp: ${experienceYears} yrs, Salary: ${expectedSalary}`
      });
      
      setShowSuccessDialog(true);
      
      // Clear specialization fields
      setQualifications('');
      setExperienceYears('');
      setHoursPerWeek('');
      setExpectedSalary('');
      setSubjects('');
      setNotes('');
      setResumeName('');
      setResumeData('');
      setPhone('');

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to submit profile. Please check your permissions." });
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
        <Button variant="secondary" className="w-full justify-start gap-3">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
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
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
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
              <h1 className="text-3xl font-headline font-bold text-primary">Teacher Professional Portal</h1>
              <p className="text-muted-foreground">Welcome, Educator {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="w-fit border-primary text-primary">Verified Teacher Account</Badge>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted w-full max-w-md grid grid-cols-2">
              <TabsTrigger value="profile">Update Specialization</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="shadow-lg border-primary/10">
                <CardHeader>
                  <CardTitle>Professional Specialty Profile</CardTitle>
                  <CardDescription>Update your professional details and subjects you'd like to teach. All contact details are mandatory.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="teacherName">Full Legal Name <span className="text-destructive">*</span></Label>
                        <Input 
                          id="teacherName"
                          value={teacherName} 
                          onChange={e => setTeacherName(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone / WhatsApp <span className="text-destructive">*</span></Label>
                        <Input 
                          id="phone"
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          placeholder="Contact number" 
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Professional Email <span className="text-destructive">*</span></Label>
                      <Input 
                        id="email"
                        type="email"
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="Your email address" 
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="qualifications">Highest Qualification <span className="text-destructive">*</span></Label>
                        <Input 
                          id="qualifications"
                          value={qualifications} 
                          onChange={e => setQualifications(e.target.value)} 
                          placeholder="e.g., M.Sc Mathematics, B.Ed" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience <span className="text-destructive">*</span></Label>
                        <Input 
                          id="experience"
                          type="number"
                          value={experienceYears} 
                          onChange={e => setExperienceYears(e.target.value)} 
                          placeholder="Years" 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Availability (Hours/Week)</Label>
                        <Input 
                          id="hours"
                          type="number"
                          value={hoursPerWeek} 
                          onChange={e => setHoursPerWeek(e.target.value)} 
                          placeholder="e.g., 10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary">Expected Monthly Salary</Label>
                        <Input 
                          id="salary"
                          value={expectedSalary} 
                          onChange={e => setExpectedSalary(e.target.value)} 
                          placeholder="e.g., 15000 INR" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjects">Subjects for Tuition <span className="text-destructive">*</span></Label>
                      <Textarea 
                        id="subjects"
                        value={subjects} 
                        onChange={e => setSubjects(e.target.value)} 
                        required
                        placeholder="e.g., Physics (Class 11-12), Chemistry, Calculus" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume / CV (.doc, .docx, .pdf, .jpg) <span className="text-destructive">*</span></Label>
                      <div className="flex items-center gap-4">
                         <Input 
                          id="resume"
                          type="file"
                          accept=".doc,.docx,.pdf,image/*"
                          onChange={handleFileChange}
                          className="flex-1 cursor-pointer"
                          required
                        />
                        {resumeName && <Badge variant="secondary" className="h-10 px-3 flex gap-2 items-center"><FileText className="h-3 w-3" /> {resumeName.slice(0, 10)}...</Badge>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea 
                        id="notes"
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="Preferred timings, specific areas of expertise, teaching methodology..." 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4 border-t pt-6">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-12 text-lg shadow-lg shadow-primary/20">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Professional Profile
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    My Professional Records
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : interests && interests.length > 0 ? (
                    interests.map(i => (
                      <Card key={i.id} className="border-l-4 border-l-primary hover:bg-secondary/5 transition-colors">
                        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <GraduationCap className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-bold text-sm">{i.subjects}</p>
                            </div>
                            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {i.experienceYears} yrs</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {i.hoursPerWeek}h/wk</span>
                              <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {i.expectedSalary}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                            <Badge 
                              variant={i.status === 'Pending' ? 'outline' : 'default'} 
                              className={`font-bold ${
                                i.status === 'Completed' ? 'bg-green-600' : 
                                i.status === 'In-Progress' ? 'bg-blue-500 hover:bg-blue-600' : ''
                              }`}
                            >
                              {i.status}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{i.submissionDate?.toDate?.()?.toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 border rounded-xl border-dashed">
                      <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">No teaching records found.</p>
                      <Button variant="link" onClick={() => setActiveTab('profile')} className="font-bold text-primary">
                        Submit your specialties
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader className="flex flex-col items-center gap-4 py-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center">
              <AlertDialogTitle className="text-2xl font-headline font-bold text-primary">Request Received!</AlertDialogTitle>
              <AlertDialogDescription className="text-base mt-2">
                Your request has been received and our management team will contact you within 7 working days. And you can check the status of request in History tab.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowSuccessDialog(false)}
              className="w-full h-12 text-lg font-bold"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
