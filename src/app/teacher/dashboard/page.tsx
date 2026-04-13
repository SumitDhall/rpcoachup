
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Globe, 
  Users, 
  Calendar, 
  Star, 
  Loader2, 
  LogOut, 
  User, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Clock, 
  IndianRupee 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { notifyAdmin } from '@/app/actions/notifications';
import Link from 'next/link';

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

  // Form State
  const [teacherName, setTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [workingExperience, setWorkingExperience] = useState('');
  const [subjects, setSubjects] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown Options
  const hourOptions = Array.from({ length: 21 }, (_, i) => 8 + i * 2); // 8 to 48 with step 2
  const salaryOptions = [5000, 6000, 7000, 8000, 9000, 10000];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'doc' || extension === 'docx') {
        setResumeFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a .doc or .docx file."
        });
        e.target.value = '';
      }
    }
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !phone || !resumeFile || !user || !profile) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all mandatory fields and attach your resume."
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const submissionData = {
        teacherId: user.uid,
        teacherName,
        phone,
        qualifications,
        experienceYears: workingExperience,
        subjects,
        hoursPerWeek,
        expectedSalary,
        resumeName: resumeFile.name,
        submissionDate: serverTimestamp(),
        status: 'Pending',
        notes
      };

      await addDoc(collection(db, 'teacherInterests'), submissionData);

      // Create Notification for Admin Portal
      await addDoc(collection(db, 'notifications'), {
        type: 'interest',
        subject: `New Teacher Application: ${teacherName}`,
        body: `Teacher: ${teacherName}\nSubjects: ${subjects}\nPhone: ${phone}\nExperience: ${workingExperience}\nCommitment: ${hoursPerWeek} hrs/week\nSalary: ${expectedSalary} INR/mo\nResume: ${resumeFile.name}`,
        userEmail: profile.email,
        userName: `${profile.firstName} ${profile.lastName}`,
        timestamp: serverTimestamp(),
        read: false
      });

      // AI simulation for admin
      notifyAdmin({
        type: 'interest',
        userType: 'Teacher',
        userName: `${profile.firstName} ${profile.lastName}`,
        userEmail: profile.email,
        details: `Name: ${teacherName}. Subjects: ${subjects}. Phone: ${phone}. Experience: ${workingExperience}. Salary expectation: ${expectedSalary}.`
      });
      
      // Reset Form
      setTeacherName('');
      setPhone('');
      setQualifications('');
      setWorkingExperience('');
      setSubjects('');
      setHoursPerWeek('');
      setExpectedSalary('');
      setResumeFile(null);
      setNotes('');

      toast({
        title: "Interest Submitted",
        description: "Administrators will review your profile and contact you shortly.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not submit teaching interest."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback || !user) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        userProfileId: user.uid,
        feedbackType: 'Teacher',
        comment: feedback,
        submissionDate: serverTimestamp(),
        rating: 5
      });

      setFeedback('');
      toast({
        title: "Feedback Received",
        description: "Thank you! We value your professional input.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not submit feedback."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-primary p-1 rounded-lg">
            <BookOpen className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-3">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/">
              <Globe className="h-4 w-4" />
              Public Website
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-4 w-4" />
            My Students
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Star className="h-4 w-4" />
            Reviews
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full gap-2 text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold">Hello, {profile?.firstName || 'Educator'}!</h1>
              <p className="text-muted-foreground">Submit your teaching interests to find your perfect student matches.</p>
            </div>
            <Badge variant="outline" className="w-fit text-accent border-accent">Teacher Account</Badge>
          </header>

          <Tabs defaultValue="interests" className="space-y-6">
            <TabsList className="bg-muted w-full md:w-auto grid grid-cols-2">
              <TabsTrigger value="interests">Teaching Profile</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="interests">
              <Card className="max-w-4xl mx-auto shadow-lg border-primary/20">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Teacher Specialization & Interest Form
                  </CardTitle>
                  <CardDescription>
                    Provide your professional details to help us optimize your matching profile.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-6 py-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="teacher-name" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="teacher-name" 
                          placeholder="Your professional name" 
                          value={teacherName}
                          onChange={(e) => setTeacherName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="e.g. +91 98765 43210" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="qualification" className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          Qualification
                        </Label>
                        <Input 
                          id="qualification" 
                          placeholder="e.g. M.Sc. Mathematics, PhD in Physics" 
                          value={qualifications}
                          onChange={(e) => setQualifications(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          Working Experience
                        </Label>
                        <Input 
                          id="experience" 
                          placeholder="e.g. 5 Years in Corporate Training" 
                          value={workingExperience}
                          onChange={(e) => setWorkingExperience(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjects" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Subject(s) Specialty
                      </Label>
                      <Input 
                        id="subjects" 
                        placeholder="e.g. Calculus, Quantum Mechanics, Organic Chemistry" 
                        value={subjects}
                        onChange={(e) => setSubjects(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="hours" className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Hours per Week Commitment
                        </Label>
                        <Select value={hoursPerWeek} onValueChange={setHoursPerWeek}>
                          <SelectTrigger id="hours">
                            <SelectValue placeholder="Select weekly hours" />
                          </SelectTrigger>
                          <SelectContent>
                            {hourOptions.map((h) => (
                              <SelectItem key={h} value={`${h} hours`}>
                                {h} hours / week
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary" className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          Expected Salary (INR / month)
                        </Label>
                        <Select value={expectedSalary} onValueChange={setExpectedSalary}>
                          <SelectTrigger id="salary">
                            <SelectValue placeholder="Select monthly salary" />
                          </SelectTrigger>
                          <SelectContent>
                            {salaryOptions.map((s) => (
                              <SelectItem key={s} value={`${s} INR`}>
                                {s.toLocaleString()} INR / month
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="resume" className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Resume Attachment (.doc/.docx only) <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex flex-col gap-2">
                        <Input 
                          id="resume" 
                          type="file" 
                          accept=".doc,.docx"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        {resumeFile && (
                          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Selected: {resumeFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Professional Notes</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Describe your teaching philosophy or any specific requirements..." 
                        className="min-h-[100px]" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                  </CardContent>
                  <CardFooter className="bg-secondary/10 rounded-b-lg p-6">
                    <Button type="submit" className="w-full gap-2 h-12 text-lg font-bold" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      Submit Professional Profile
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                  <CardTitle>Professional Feedback</CardTitle>
                  <CardDescription>Help us optimize the platform for educators.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cat">Category</Label>
                      <select id="cat" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Student Matching Accuracy</option>
                        <option>Scheduling Tools</option>
                        <option>Communication Tools</option>
                        <option>Payment System</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="msg">Your Message</Label>
                      <Textarea 
                        id="msg" 
                        placeholder="Detailed feedback..." 
                        className="min-h-[150px]" 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Feedback"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
