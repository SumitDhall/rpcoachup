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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BookOpen, 
  LayoutDashboard, 
  Loader2, 
  LogOut, 
  ClipboardList,
  Edit2,
  AlertCircle,
  History,
  User,
  Phone,
  Mail,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit, orderBy } from 'firebase/firestore';
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
      orderBy('submissionDate', 'desc'),
      limit(50)
    );
  }, [db, user?.uid]);
  const { data: interests, isLoading: isLoadingInterests } = useCollection(interestsQuery);

  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [affordableRange, setAffordableRange] = useState('');
  const [intendedStartDate, setIntendedStartDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    if (!subject || !studentName || !phone || !email) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please provide Name, Phone, Email, and Subject to proceed."
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
        body: `Student ${studentName} requested tuition for ${subject}. Contact: ${phone}`,
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
        details: `Subject: ${subject}, Budget: ${affordableRange}`
      });
      
      setIsSubmitted(true);
      toast({ 
        title: "Application Success", 
        description: "Your tuition requirements have been shared with our advisors." 
      });
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

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
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
      </aside>

      <main className="flex-1 lg:ml-64 p-8">
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
                          disabled={isSubmitted} 
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
                          disabled={isSubmitted} 
                          value={subject} 
                          onChange={e => setSubject(e.target.value)} 
                          required 
                          placeholder="e.g., Mathematics (Class X)" 
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Contact Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="phone"
                          disabled={isSubmitted} 
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
                          disabled={isSubmitted} 
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
                        <Select disabled={isSubmitted} value={affordableRange} onValueChange={setAffordableRange}>
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
                          disabled={isSubmitted} 
                          value={intendedStartDate} 
                          onChange={e => setIntendedStartDate(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Requirements</Label>
                      <Textarea 
                        id="notes"
                        disabled={isSubmitted} 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="Specific school name, preferred timings, home address, topics you're struggling with..." 
                        className="min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4 border-t pt-6">
                    <Button type="submit" disabled={isSubmitting || isSubmitted} className="flex-1 font-bold h-12 text-lg shadow-lg shadow-primary/20">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Request
                    </Button>
                    {isSubmitted && (
                      <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setIsSubmitted(false)}>
                        <Edit2 className="h-4 w-4 mr-2" /> Edit/New Submission
                      </Button>
                    )}
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
                      <div key={i.id} className="p-5 border rounded-2xl flex items-center justify-between bg-card hover:bg-secondary/5 transition-all shadow-sm border-l-4 border-l-primary">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2.5 rounded-xl">
                            <ClipboardList className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{i.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {i.submissionDate?.toDate?.()?.toLocaleString() || 'Syncing...'}
                            </p>
                            {i.affordableRange && <p className="text-[10px] font-medium text-accent mt-1">Budget: {i.affordableRange}</p>}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={i.status === 'Completed' ? 'default' : 'outline'} 
                            className={`px-3 py-1 font-bold ${i.status === 'Completed' ? 'bg-green-600' : ''}`}
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
    </div>
  );
}
