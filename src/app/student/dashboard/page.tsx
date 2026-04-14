
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
  Send, 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Loader2, 
  LogOut, 
  User,
  Phone,
  School,
  MapPin,
  Calendar as CalendarIcon,
  IndianRupee,
  Clock,
  ClipboardList,
  Edit2,
  Bell,
  CheckCircle2,
  AlertCircle,
  Mail
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
  const [school, setSchool] = useState('');
  const [gradeOrClass, setGradeOrClass] = useState('');
  const [address, setAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [affordableRange, setAffordableRange] = useState('');
  const [intendedStartDate, setIntendedStartDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !studentName) return; 
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        studentId: user?.uid,
        studentName,
        phone: phone || 'Not Provided',
        email: email || profile?.email || 'Not Provided',
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
      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `New Interest: ${subject} from ${studentName}`,
        body: `Student requested tuition for ${subject}.`,
        userEmail: profile?.email,
        userName: `${profile?.firstName} ${profile?.lastName}`,
        timestamp: serverTimestamp(),
        read: false
      });

      notifyAdmin({
        type: 'interest',
        userType: 'Student',
        userName: `${profile?.firstName} ${profile?.lastName}`,
        userEmail: profile?.email || '',
        details: `Subject: ${subject}`
      });
      
      setIsSubmitted(true);
      toast({ title: "Submitted!", description: "Review in progress." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Submission failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const feeOptions = Array.from({ length: 14 }, (_, i) => 7000 + i * 1000);

  if (isUserLoading || isProfileLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="p-6 flex items-center gap-2">
          <BookOpen className="text-primary h-5 w-5" />
          <span className="font-headline font-bold text-lg">RP Coach-Up</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-3"><LayoutDashboard className="h-4 w-4" /> Dashboard</Button>
          <Button variant="ghost" className="w-full justify-start gap-3"><MessageSquare className="h-4 w-4" /> Messages</Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full text-destructive" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" /> Sign Out</Button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-2xl font-bold">Welcome, {profile?.firstName}!</h1>
            <Badge variant="outline" className="mt-1">Student Dashboard</Badge>
          </header>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-fit bg-muted">
              <TabsTrigger value="interests">Submit Interests</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Tuition Requirement Form</CardTitle>
                  <CardDescription>Enter details about the student needing tuition.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Student Name</Label>
                        <Input disabled={isSubmitted} value={studentName} onChange={e => setStudentName(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} required />
                      </div>
                      <div className="space-y-1">
                        <Label>Phone (Optional)</Label>
                        <Input disabled={isSubmitted} value={phone} onChange={e => setPhone(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="Contact phone number" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Email (Optional)</Label>
                        <Input disabled={isSubmitted} value={email} onChange={e => setEmail(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="Contact email address" />
                      </div>
                      <div className="space-y-1">
                        <Label>Subject</Label>
                        <Input disabled={isSubmitted} value={subject} onChange={e => setSubject(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} required placeholder="e.g., Mathematics, Physics" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Monthly Fee Budget</Label>
                        <Select disabled={isSubmitted} value={affordableRange} onValueChange={setAffordableRange}>
                          <SelectTrigger className={isSubmitted ? "bg-secondary/50" : ""}><SelectValue placeholder="Select range" /></SelectTrigger>
                          <SelectContent>{feeOptions.map(f => <SelectItem key={f} value={`${f} INR`}>{f} INR</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Intended Start Date</Label>
                        <Input type="date" disabled={isSubmitted} value={intendedStartDate} onChange={e => setIntendedStartDate(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Notes / Special Requirements</Label>
                      <Textarea disabled={isSubmitted} value={notes} onChange={e => setNotes(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="e.g., Preferred timings, school name, specific topics, address details..." />
                    </div>
                  </CardContent>
                  <CardFooter className="gap-4">
                    <Button type="submit" disabled={isSubmitting || isSubmitted} className="flex-1 font-bold">Submit Application</Button>
                    {isSubmitted && <Button type="button" variant="outline" onClick={() => setIsSubmitted(false)}><Edit2 className="h-4 w-4 mr-2" /> Edit Last Submission</Button>}
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>My Progress</CardTitle>
                  <CardDescription>Track the status of your tuition requirement submissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : interests && interests.length > 0 ? (
                    interests.map(i => (
                      <div key={i.id} className="p-4 border rounded-xl flex items-center justify-between bg-card shadow-sm hover:bg-secondary/5 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                            <ClipboardList className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{i.subject}</p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-2.5 w-2.5" />
                              Submitted: {i.submissionDate?.toDate?.()?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={i.status === 'Completed' ? 'default' : 'outline'} className={i.status === 'Completed' ? 'bg-green-600' : ''}>
                            {i.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border rounded-xl border-dashed">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">No submissions found yet.</p>
                      <p className="text-xs text-muted-foreground/60">Your tuition requests will appear here after submission.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Feedback</CardTitle>
                  <CardDescription>We value your thoughts on how we can improve our services.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea placeholder="Share your suggestions or report issues here..." className="min-h-[150px]" />
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full sm:w-auto">Send Feedback</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
