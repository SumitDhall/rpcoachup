
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Menu,
  MessageSquare,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit, orderBy } from 'firebase/firestore';
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

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !user?.email) return null;
    // Removed orderBy to avoid requiring a composite index during prototyping
    return query(
      collection(db, 'messages'),
      where('recipientEmail', '==', user.email),
      limit(100)
    );
  }, [db, user?.email]);
  const { data: rawMessages, isLoading: isLoadingMessages } = useCollection(messagesQuery);

  const interests = useMemo(() => {
    if (!rawInterests) return null;
    return [...rawInterests].sort((a, b) => {
      const timeA = a.submissionDate?.toMillis?.() || 0;
      const timeB = b.submissionDate?.toMillis?.() || 0;
      return timeB - timeA;
    });
  }, [rawInterests]);

  const messages = useMemo(() => {
    if (!rawMessages) return null;
    return [...rawMessages].sort((a, b) => {
      const timeA = a.timestamp?.toMillis?.() || 0;
      const timeB = b.timestamp?.toMillis?.() || 0;
      return timeB - timeA;
    });
  }, [rawMessages]);

  const [activeTab, setActiveTab] = useState('interests');
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
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

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

      sendNotificationEmail({
        recipientType: 'admin',
        type: 'interest',
        userType: 'Student',
        userName: studentName,
        userEmail: email,
        details: `Subject: ${subject}, Grade: ${gradeLevel}, School: ${school}, Budget: ${affordableRange}`
      });

      sendNotificationEmail({
        recipientType: 'user',
        type: 'interest',
        userType: 'Student',
        userName: studentName,
        userEmail: email,
        details: `Subject: ${subject}`
      });
      
      setShowSuccessDialog(true);

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
        description: "An unexpected error occurred." 
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
      <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <BookOpen className="text-primary h-6 w-6" />
        <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
      </Link>
      <nav className="flex-1 px-4 space-y-1">
        <Button variant={activeTab === 'interests' || activeTab === 'history' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('interests')}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Button>
        <Button variant={activeTab === 'messages' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('messages')}>
          <MessageSquare className="h-4 w-4" /> Messages
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
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Navigation
              </SheetTitle>
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
              <h1 className="text-3xl font-headline font-bold text-primary">Student Dashboard</h1>
              <p className="text-muted-foreground">Manage your learning journey, {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="w-fit border-primary text-primary bg-primary/5">Student Portal</Badge>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`grid w-full max-w-md bg-muted ${activeTab === 'messages' ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {(activeTab === 'interests' || activeTab === 'history') && (
                <>
                  <TabsTrigger value="interests">New Tuition Request</TabsTrigger>
                  <TabsTrigger value="history">Inquiry History</TabsTrigger>
                </>
              )}
              {activeTab === 'messages' && <TabsTrigger value="messages">Inbox</TabsTrigger>}
            </TabsList>

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
                        <Label htmlFor="studentName" className="flex items-center gap-1">
                          <User className="h-3 w-3" /> Student Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input id="studentName" value={studentName} onChange={e => setStudentName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Subject Needed <span className="text-destructive">*</span>
                        </Label>
                        <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g., Mathematics" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="school" className="flex items-center gap-1">
                          <School className="h-3 w-3" /> Current School <span className="text-destructive">*</span>
                        </Label>
                        <Input id="school" value={school} onChange={e => setSchool(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gradeLevel" className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" /> Class / Grade <span className="text-destructive">*</span>
                        </Label>
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
                        <Label htmlFor="phone" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Contact Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> Contact Email <span className="text-destructive">*</span>
                        </Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Budget (INR)</Label>
                        <Select value={affordableRange} onValueChange={setAffordableRange}>
                          <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                            {feeOptions.map(f => <SelectItem key={f} value={`${f} INR`}>{f} INR</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Start Date</Label>
                        <Input id="startDate" type="date" value={intendedStartDate} onChange={e => setIntendedStartDate(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</Label>
                      <Input id="address" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="min-h-[80px]" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-12 text-lg shadow-lg">
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
                  <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" /> Application History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                  ) : interests && interests.length > 0 ? (
                    interests.map(i => (
                      <div key={i.id} className="p-5 border rounded-2xl flex items-center justify-between gap-4 bg-card shadow-sm border-l-4 border-l-primary">
                        <div>
                          <p className="font-bold text-lg">{i.subject}</p>
                          <p className="text-xs text-muted-foreground">{i.gradeOrClass} | {i.school}</p>
                        </div>
                        <Badge variant={i.status === 'Pending' ? 'outline' : 'default'} className={i.status === 'Completed' ? 'bg-green-600' : i.status === 'In-Progress' ? 'bg-blue-500' : ''}>
                          {i.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl">
                      <p className="text-muted-foreground">No inquiries found.</p>
                      <Button variant="link" className="mt-2 text-primary font-bold" onClick={() => setActiveTab('interests')}>Start your first request now</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> My Messages</CardTitle>
                  <CardDescription>Archive of simulated emails and updates sent to you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoadingMessages ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
                  ) : messages && messages.length > 0 ? (
                    messages.map(msg => (
                      <div 
                        key={msg.id} 
                        className="p-4 border rounded-xl hover:bg-secondary/5 transition-colors cursor-pointer group"
                        onClick={() => setSelectedMessage(msg)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{msg.subject}</h4>
                          <span className="text-[10px] text-muted-foreground">{msg.timestamp?.toDate?.()?.toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.body}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No messages yet.</p>
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
            <div className="bg-green-100 p-3 rounded-full"><CheckCircle2 className="h-12 w-12 text-green-600" /></div>
            <div className="text-center">
              <AlertDialogTitle className="text-2xl font-headline font-bold text-primary">Request Submitted!</AlertDialogTitle>
              <AlertDialogDescription className="text-base mt-2">
                Please go and check the Inquiry History tab, you can see any status updates there. Our management will contact you within 7 working days, thanks!
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogAction onClick={() => setShowSuccessDialog(false)} className="w-full h-12 text-lg font-bold">OK</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4 border-t">
            <p className="text-[10px] text-muted-foreground text-right">{selectedMessage?.timestamp?.toDate?.()?.toLocaleString()}</p>
            <div className="bg-secondary/20 p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed">
              {selectedMessage?.body}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
