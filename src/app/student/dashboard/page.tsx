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
  MessageSquare, 
  Loader2, 
  LogOut, 
  ClipboardList,
  Edit2,
  AlertCircle,
  History
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
    if (!subject || !studentName) return; 
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        studentId: user?.uid,
        studentName,
        phone: phone || 'Not Provided',
        email: email || profile?.email || 'Not Provided',
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
        subject: `New Tuition Interest: ${subject}`,
        body: `Student ${studentName} requested tuition for ${subject}.`,
        userEmail: profile?.email,
        userName: studentName,
        timestamp: serverTimestamp(),
        read: false
      });

      notifyAdmin({
        type: 'interest',
        userType: 'Student',
        userName: studentName,
        userEmail: profile?.email || '',
        details: `Subject: ${subject}`
      });
      
      setIsSubmitted(true);
      toast({ title: "Application Submitted", description: "Our team will review your requirements." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not submit. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const feeOptions = Array.from({ length: 14 }, (_, i) => 7000 + i * 1000);

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
          <Button variant="outline" className="w-full text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Student Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {profile?.firstName}</p>
            </div>
            <Badge variant="secondary" className="w-fit">Student Account</Badge>
          </header>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md bg-muted">
              <TabsTrigger value="interests">New Application</TabsTrigger>
              <TabsTrigger value="history">My History</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card className="border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle>Tuition Requirement Form</CardTitle>
                  <CardDescription>Tell us about the subject and support you need. Contact details are optional.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student Name</Label>
                        <Input 
                          id="studentName"
                          disabled={isSubmitted} 
                          value={studentName} 
                          onChange={e => setStudentName(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject Needed</Label>
                        <Input 
                          id="subject"
                          disabled={isSubmitted} 
                          value={subject} 
                          onChange={e => setSubject(e.target.value)} 
                          required 
                          placeholder="e.g., Mathematics, Physics" 
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input 
                          id="phone"
                          disabled={isSubmitted} 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          placeholder="Mobile or Whatsapp" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Contact Email (Optional)</Label>
                        <Input 
                          id="email"
                          disabled={isSubmitted} 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          placeholder="Your email address" 
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Monthly Fee Budget (INR)</Label>
                        <Select disabled={isSubmitted} value={affordableRange} onValueChange={setAffordableRange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                            {feeOptions.map(f => <SelectItem key={f} value={`${f} INR`}>{f} INR</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Intended Start Date</Label>
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
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea 
                        id="notes"
                        disabled={isSubmitted} 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="e.g., Specific school name, preferred timings, address, topics to cover..." 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" disabled={isSubmitting || isSubmitted} className="flex-1 font-bold h-12">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Application
                    </Button>
                    {isSubmitted && (
                      <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setIsSubmitted(false)}>
                        <Edit2 className="h-4 w-4 mr-2" /> New Submission
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
                    My Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : interests && interests.length > 0 ? (
                    interests.map(i => (
                      <div key={i.id} className="p-4 border rounded-xl flex items-center justify-between bg-card hover:bg-secondary/5 transition-colors shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                            <ClipboardList className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold">{i.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              Requested: {i.submissionDate?.toDate?.()?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={i.status === 'Completed' ? 'default' : 'outline'} className={i.status === 'Completed' ? 'bg-green-600' : ''}>
                          {i.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border rounded-xl border-dashed">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">No applications found yet.</p>
                      <Button variant="link" onClick={() => (document.querySelector('[data-value="interests"]') as HTMLElement)?.click()}>
                        Start your first application
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