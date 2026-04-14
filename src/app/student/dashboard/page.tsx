
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/sheet";
import { 
  BookOpen, 
  LayoutDashboard, 
  Loader2, 
  LogOut, 
  ClipboardList,
  AlertCircle,
  History,
  User,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  School,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Menu
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { notifyAdmin } from '@/app/actions/notifications';

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

  const interests = useMemo(() => {
    if (!rawInterests) return null;
    return [...rawInterests].sort((a, b) => {
      const timeA = a.submissionDate?.toMillis?.() || 0;
      const timeB = b.submissionDate?.toMillis?.() || 0;
      return timeB - timeA;
    });
  }, [rawInterests]);

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
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please provide Name, Phone, Email, Subject, School, and Class to proceed."
      });
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
      
      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `Student Tuition Inquiry: ${subject}`,
        body: `Student ${studentName} (${gradeLevel}) requested tuition for ${subject} at ${school}. Contact: ${phone}`,
        userEmail: email,
        userName: studentName,
        timestamp: serverTimestamp(),
        read: false
      });

      notifyAdmin({
        type: 'interest',
        userType: 'Student',
        userName: studentName,
        userEmail: email,
        details: `Subject: ${subject}, Grade: ${gradeLevel}, School: ${school}, Budget: ${affordableRange}`
      });
      
      setShowSuccessDialog(true);

      // Reset form fields except profile defaults
      setSubject('');
      setSchool('');
      setGradeLevel('');
      setAddress('');
      setNotes('');
      setPhone('');
      setAffordableRange('');
      setIntendedStartDate('');

    } catch (error) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Submission Failed", 
        description: "An unexpected error occurred. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const feeOptions = Array.from({ length: 15 }, (_, i) => 5000 + i * 1000);
  const gradeOptions = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-2">
        <BookOpen className="text-primary h-6 w-6" />
        <span className="font-headline font-bold text-lg">RP Coach-Up</span>
      </div>
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
      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <BookOpen className="text-primary h-6 w-6" />
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <SidebarContent />
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Student Dashboard</h1>
              <p className="text-muted-foreground">Manage your learning journey, {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="w-fit border-primary text-primary bg-primary/5">Student Portal</Badge>
          </header>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md bg-muted">
              <TabsTrigger value="interests">New Tuition Request</TabsTrigger>
              <TabsTrigger value="history">Inquiry History</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card className="border-primary/10 shadow-xl">
                <CardHeader>
                  <CardTitle>Tuition Requirement Form</CardTitle>
                  <CardDescription>All fields marked with an asterisk (*) are required for matching.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="studentName" className="flex items-center gap-1">
                          <User className="h-3 w-3" /> Student Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="studentName"
                          value={studentName} 
                          onChange={e => setStudentName(e.target.value)} 
                          required 
                          placeholder="Full name of student"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Subject Needed <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="subject"
                          value={subject} 
                          onChange={e => setSubject(e.target.value)} 
                          required 
                          placeholder="e.g., Mathematics" 
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="school" className="flex items-center gap-1">
                          <School className="h-3 w-3" /> Current School <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="school"
                          value={school} 
                          onChange={e => setSchool(e.target.value)} 
                          placeholder="Name of the school" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gradeLevel" className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" /> Class / Grade <span className="text-destructive">*</span>
                        </Label>
                        <Select value={gradeLevel} onValueChange={setGradeLevel} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradeOptions.map(grade => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Contact Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="phone"
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          placeholder="Mobile or Whatsapp Number" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> Contact Email <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="email"
                          type="email"
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          placeholder="Your email address" 
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" /> Monthly Fee Budget (INR)
                        </Label>
                        <Select value={affordableRange} onValueChange={setAffordableRange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Flexible">Flexible / Not Decided</SelectItem>
                            {feeOptions.map(f => <SelectItem key={f} value={`${f} INR`}>{f} INR</SelectItem>)}
                            <SelectItem value="Above 20000 INR">Above 20,000 INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Intended Start Date
                        </Label>
                        <Input 
                          id="startDate"
                          type="date" 
                          value={intendedStartDate} 
                          onChange={e => setIntendedStartDate(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Full Address
                      </Label>
                      <Input 
                        id="address"
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        placeholder="House number, street, locality..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Requirements</Label>
                      <Textarea 
                        id="notes"
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="Preferred timings, specific topics you're struggling with, or any other preferences..." 
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-12 text-lg shadow-lg shadow-primary/20">
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
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Application History
                  </CardTitle>
                  <CardDescription>Track the status of your tuition inquiries.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                  ) : interests && interests.length > 0 ? (
                    interests.map(i => (
                      <div key={i.id} className="p-5 border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card hover:bg-secondary/5 transition-all shadow-sm border-l-4 border-l-primary">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2.5 rounded-xl">
                            <ClipboardList className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{i.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              {i.gradeOrClass} | {i.school}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Submitted: {i.submissionDate?.toDate?.()?.toLocaleString() || 'Syncing...'}
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto text-right">
                          <Badge 
                            variant={i.status === 'Pending' ? 'outline' : 'default'} 
                            className={`px-3 py-1 font-bold ${
                              i.status === 'Completed' ? 'bg-green-600' : 
                              i.status === 'In-Progress' ? 'bg-blue-500 hover:bg-blue-600' : ''
                            }`}
                          >
                            {i.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl">
                      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">You haven't submitted any inquiries yet.</p>
                      <Button variant="link" className="mt-2 text-primary font-bold" onClick={() => (document.querySelector('[data-value="interests"]') as HTMLElement)?.click()}>
                        Start your first request now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader className="flex flex-col items-center gap-4 py-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center">
              <AlertDialogTitle className="text-2xl font-headline font-bold text-primary">Request Submitted!</AlertDialogTitle>
              <AlertDialogDescription className="text-base mt-2">
                Please go and check the Inquiry History tab, you can see any status updates there. Our management will contact you within 7 working days, thanks!
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
