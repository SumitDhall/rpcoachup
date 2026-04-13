
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
  History
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
    if (!teacherName || !phone) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'teacherInterests'), {
        teacherId: user?.uid,
        teacherName,
        phone,
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
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
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
            <Badge variant="outline" className="mt-1">Teacher Dashboard</Badge>
          </header>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="bg-muted w-fit grid grid-cols-2">
              <TabsTrigger value="interests">Profile Info</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Profile</CardTitle>
                  <CardDescription>Share your educational background and expertise.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Full Name</Label>
                        <Input disabled={isSubmitted} value={teacherName} onChange={e => setTeacherName(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} />
                      </div>
                      <div className="space-y-1">
                        <Label>Phone</Label>
                        <Input disabled={isSubmitted} value={phone} onChange={e => setPhone(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Qualifications</Label>
                      <Input disabled={isSubmitted} value={qualifications} onChange={e => setQualifications(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="e.g., M.Sc Mathematics, B.Ed" />
                    </div>
                    <div className="space-y-1">
                      <Label>Specialty Subjects</Label>
                      <Input disabled={isSubmitted} value={subjects} onChange={e => setSubjects(e.target.value)} className={isSubmitted ? "bg-secondary/50" : ""} placeholder="e.g., Physics, Chemistry, Calculus" />
                    </div>
                  </CardContent>
                  <CardFooter className="gap-4">
                    <Button type="submit" disabled={isSubmitting || isSubmitted} className="flex-1">Submit Profile</Button>
                    {isSubmitted && <Button type="button" variant="outline" onClick={() => setIsSubmitted(false)}><Edit2 className="h-4 w-4 mr-2" /> Edit</Button>}
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback</CardTitle>
                  <CardDescription>Tell us about your experience as a teacher on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea placeholder="Share your experience..." />
                </CardContent>
                <CardFooter>
                  <Button variant="secondary">Submit Feedback</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
