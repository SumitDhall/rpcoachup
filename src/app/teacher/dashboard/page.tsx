
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
  Loader2, 
  LogOut, 
  User, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Edit2,
  History,
  Mail,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
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
      orderBy('submissionDate', 'desc'),
      limit(50)
    );
  }, [db, user?.uid]);
  const { data: interests, isLoading: isLoadingInterests } = useCollection(teacherInterestsQuery);

  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [subjects, setSubjects] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'teacherInterests'), {
        teacherId: user?.uid,
        teacherName,
        phone: phone || 'Not Provided',
        email: email || profile?.email || 'Not Provided',
        qualifications,
        subjects,
        submissionDate: serverTimestamp(),
        status: 'Pending'
      });

      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `New Teacher Application: ${teacherName}`,
        body: `Applied for subjects: ${subjects}`,
        userEmail: profile?.email,
        userName: `${profile?.firstName} ${profile?.lastName}`,
        timestamp: serverTimestamp(),
        read: false
      });

      notifyAdmin({
        type: 'interest',
        userType: 'Teacher',
        userName: `${profile?.firstName} ${profile?.lastName}`,
        userEmail: profile?.email || '',
        details: `Subjects: ${subjects}`
      });
      
      setIsSubmitted(true);
      toast({ title: "Profile Submitted", description: "Admin will review shortly." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Submission failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full text-destructive" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" /> Sign Out</Button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-2xl font-bold">Hello, Educator {profile?.firstName}!</h1>
            <Badge variant="outline" className="mt-1">Teacher Professional Portal</Badge>
          </header>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="bg-muted w-fit grid grid-cols-2">
              <TabsTrigger value="interests">My Specialty Profile</TabsTrigger>
              <TabsTrigger value="feedback">Help & Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Professional Profile Details</CardTitle>
                  <CardDescription>Share your educational background, qualifications, and the subjects you specialize in teaching.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Full Name</Label>
                        <Input disabled={isSubmitted} value={teacherName} onChange={e => setTeacherName(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} required placeholder="Your full legal name" />
                      </div>
                      <div className="space-y-1">
                        <Label>Phone (Optional)</Label>
                        <Input disabled={isSubmitted} value={phone} onChange={e => setPhone(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="Primary contact number" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Email (Optional)</Label>
                      <Input disabled={isSubmitted} value={email} onChange={e => setEmail(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="Primary professional email" />
                    </div>
                    <div className="space-y-1">
                      <Label>Qualifications</Label>
                      <Input disabled={isSubmitted} value={qualifications} onChange={e => setQualifications(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="e.g., M.Sc Mathematics, B.Ed, PhD in Physics" />
                    </div>
                    <div className="space-y-1">
                      <Label>Specialty Subjects</Label>
                      <Input disabled={isSubmitted} value={subjects} onChange={e => setSubjects(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="e.g., Physics, Chemistry, Calculus, English Literature" />
                    </div>
                  </CardContent>
                  <CardFooter className="gap-4">
                    <Button type="submit" disabled={isSubmitting || isSubmitted} className="flex-1 font-bold">Submit Profile for Verification</Button>
                    {isSubmitted && <Button type="button" variant="outline" onClick={() => setIsSubmitted(false)}><Edit2 className="h-4 w-4 mr-2" /> Update Profile</Button>}
                  </CardFooter>
                </form>
              </Card>

              {interests && interests.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Submission History
                  </h3>
                  <div className="grid gap-4">
                    {interests.map(i => (
                      <Card key={i.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm">{i.subjects}</p>
                            <p className="text-[10px] text-muted-foreground italic">Applied on: {i.submissionDate?.toDate?.()?.toLocaleDateString()}</p>
                          </div>
                          <Badge variant={i.status === 'Completed' ? 'default' : 'outline'} className={i.status === 'Completed' ? 'bg-green-600' : ''}>
                            {i.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>How are we doing?</CardTitle>
                  <CardDescription>Tell us about your experience as a teacher on the RP Coach-Up platform. Your feedback helps us build a better environment for educators.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea placeholder="Share your experience or suggestions for new features..." className="min-h-[150px]" />
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full sm:w-auto">Submit Feedback</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
