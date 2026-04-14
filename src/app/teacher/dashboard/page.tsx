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
  BookOpen, 
  LayoutDashboard, 
  Loader2, 
  LogOut, 
  History, 
  Edit2,
  GraduationCap,
  ClipboardList
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

  useEffect(() => {
    if (profile) {
      setTeacherName(`${profile.firstName} ${profile.lastName}`);
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !subjects) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'teacherInterests'), {
        teacherId: user?.uid,
        teacherName,
        phone: phone || 'Not Provided',
        email: email || profile?.email || 'Not Provided',
        qualifications: qualifications || 'N/A',
        subjects,
        submissionDate: serverTimestamp(),
        status: 'Pending'
      });

      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `Teacher Application: ${teacherName}`,
        body: `New teacher profile submitted for subjects: ${subjects}`,
        userEmail: profile?.email,
        userName: teacherName,
        timestamp: serverTimestamp(),
        read: false
      });

      notifyAdmin({
        type: 'interest',
        userType: 'Teacher',
        userName: teacherName,
        userEmail: profile?.email || '',
        details: `Subjects: ${subjects}`
      });
      
      setIsSubmitted(true);
      toast({ title: "Profile Submitted", description: "The administration will review your credentials shortly." });
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
              <h1 className="text-3xl font-headline font-bold text-primary">Teacher Professional Portal</h1>
              <p className="text-muted-foreground">Welcome, Educator {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="w-fit border-primary text-primary">Verified Teacher Account</Badge>
          </header>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-muted w-full max-w-md grid grid-cols-2">
              <TabsTrigger value="profile">Update Specialization</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="shadow-lg border-primary/10">
                <CardHeader>
                  <CardTitle>Specialization Profile</CardTitle>
                  <CardDescription>Update your professional details and subjects you'd like to teach. Contact fields are optional.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="teacherName">Full Legal Name</Label>
                        <Input 
                          id="teacherName"
                          disabled={isSubmitted} 
                          value={teacherName} 
                          onChange={e => setTeacherName(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input 
                          id="phone"
                          disabled={isSubmitted} 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          placeholder="Contact number" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Professional Email (Optional)</Label>
                      <Input 
                        id="email"
                        disabled={isSubmitted} 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="Your email address" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications & Degrees</Label>
                      <Input 
                        id="qualifications"
                        disabled={isSubmitted} 
                        value={qualifications} 
                        onChange={e => setQualifications(e.target.value)} 
                        placeholder="e.g., M.Sc Mathematics, B.Ed" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjects">Subjects for Tuition</Label>
                      <Textarea 
                        id="subjects"
                        disabled={isSubmitted} 
                        value={subjects} 
                        onChange={e => setSubjects(e.target.value)} 
                        required
                        placeholder="e.g., Physics (Class 11-12), Chemistry, Calculus" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" disabled={isSubmitting || isSubmitted} className="flex-1 font-bold h-12">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Specialty Profile
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
                    My Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingInterests ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : interests && interests.length > 0 ? (
                    interests.map(i => (
                      <Card key={i.id} className="border-l-4 border-l-primary hover:bg-secondary/5 transition-colors">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <GraduationCap className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{i.subjects}</p>
                              <p className="text-[10px] text-muted-foreground">Applied: {i.submissionDate?.toDate?.()?.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Badge variant={i.status === 'Completed' ? 'default' : 'outline'} className={i.status === 'Completed' ? 'bg-green-600' : ''}>
                            {i.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 border rounded-xl border-dashed">
                      <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">No teaching records found.</p>
                      <Button variant="link" onClick={() => (document.querySelector('[data-value="profile"]') as HTMLElement)?.click()}>
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
    </div>
  );
}