
"use client"

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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
  SheetClose
} from "@/components/ui/sheet";
import { 
  BookOpen, 
  Loader2, 
  LogOut, 
  History, 
  Menu,
  CheckCircle2,
  MessageSquare,
  Star,
  User,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  FileText,
  Info,
  Calendar,
  IndianRupee,
  PlusCircle,
  Users,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, where, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { sendNotificationEmail } from '@/app/actions/notifications';

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

  const teacherEnquiriesQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'teacherEnquiries'),
      where('teacherId', '==', user.uid),
      limit(1)
    );
  }, [db, user?.uid]);
  const { data: rawEnquiries, isLoading: isLoadingEnquiries } = useCollection(teacherEnquiriesQuery);

  const existingEnquiry = useMemo(() => rawEnquiries?.[0] || null, [rawEnquiries]);

  const matchesQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'matchProposals'),
      where('teacherId', '==', user.uid),
      limit(100)
    );
  }, [db, user?.uid]);
  const { data: matches } = useCollection(matchesQuery);

  const [activeTab, setActiveTab] = useState('history');
  
  const [teacherName, setTeacherName] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [subjects, setSubjects] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeData, setResumeData] = useState('');

  const [feedbackRating, setFeedbackRating] = useState('5');
  const [feedbackComment, setFeedbackComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Sync basic user profile data
  useEffect(() => {
    if (profile) {
      setTeacherName(`${profile.firstName} ${profile.lastName}`);
      setEmail(profile.email || '');
    }
  }, [profile]);

  // Sync existing enquiry data for editing
  useEffect(() => {
    if (existingEnquiry) {
      setTeacherName(existingEnquiry.teacherName || '');
      setPhoneValue(existingEnquiry.phone || '');
      setEmail(existingEnquiry.email || '');
      setQualifications(existingEnquiry.qualifications || '');
      setExperienceYears(existingEnquiry.experienceYears || '');
      setSubjects(existingEnquiry.subjects || '');
      setExpectedSalary(existingEnquiry.expectedSalary || '');
      setResumeName(existingEnquiry.resumeName || '');
      setResumeData(existingEnquiry.resumeData || '');
    }
  }, [existingEnquiry]);

  const formatPhoneNumber = (digits: string) => {
    if (digits.length === 0) return '';
    let formatted = '+91 ';
    if (digits.length > 0) {
      formatted += digits.slice(0, 4);
    }
    if (digits.length > 4) {
      formatted += '-' + digits.slice(4, 7);
    }
    if (digits.length > 7) {
      formatted += '-' + digits.slice(7, 10);
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/\D/g, '');
    let userNumber = digitsOnly;
    if (digitsOnly.startsWith('91')) {
      userNumber = digitsOnly.slice(2);
    }
    const limited = userNumber.slice(0, 10);
    setPhoneValue(formatPhoneNumber(limited));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 500) { // Limit to 500KB for Base64 Firestore storage
        toast({ variant: "destructive", title: "File too large", description: "Please upload a resume smaller than 500KB." });
        return;
      }
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setResumeData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phoneValue.replace(/\D/g, '');
    const userNumber = digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;
    
    if (!teacherName || !subjects || userNumber.length !== 10 || !email || !resumeName || !qualifications || !experienceYears) {
      toast({ 
        variant: "destructive", 
        title: "Validation Error", 
        description: userNumber.length !== 10 
          ? "Please enter a valid 10-digit phone number." 
          : "Please complete all mandatory fields, including your resume." 
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        teacherId: user?.uid,
        teacherName,
        phone: phoneValue,
        email,
        qualifications,
        experienceYears,
        subjects,
        expectedSalary: expectedSalary || 'Negotiable',
        resumeName,
        resumeData,
        updatedAt: serverTimestamp(),
      };

      if (existingEnquiry) {
        updateDocumentNonBlocking(doc(db, 'teacherEnquiries', existingEnquiry.id), payload);
        toast({ title: "Profile Updated", description: "Your professional record has been updated successfully." });
        setActiveTab('history');
      } else {
        await addDoc(collection(db, 'teacherEnquiries'), {
          ...payload,
          submissionDate: serverTimestamp(),
          status: 'Pending'
        });
        setShowSuccessDialog(true);
      }
      
      const aiResult = await sendNotificationEmail({
        recipientType: 'admin',
        type: 'interest',
        userType: 'Teacher',
        userName: teacherName,
        userEmail: email,
        details: `${teacherName} ${existingEnquiry ? 'updated' : 'submitted'} a specialty profile for ${subjects}. Experience: ${experienceYears} years.`
      });

      if (aiResult.success && aiResult.email) {
        addDocumentNonBlocking(collection(db, 'notifications'), {
          to: aiResult.email.recipientEmail,
          from: "RP Coach-Up <support@rpcoachup.com>",
          message: {
            subject: aiResult.email.subject,
            text: aiResult.email.body,
            html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #266EDB; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">RP Coach-Up</h1>
              </div>
              <div style="padding: 30px; background-color: white;">
                ${aiResult.email.body.replace(/\n/g, '<br>')}
              </div>
              <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #777;">
                © 2026 RP Coach-Up | Profile ${existingEnquiry ? 'Updated' : 'Confirmation'}
              </div>
            </div>`
          },
          type: 'interest',
          userName: teacherName,
          userEmail: email,
          timestamp: serverTimestamp(),
          read: false
        });
      }

    } catch (error) {
      // Error handled by global listener
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment || !feedbackRating) {
      toast({ variant: "destructive", title: "Incomplete Feedback", description: "Please provide a rating and a comment." });
      return;
    }
    setIsSubmitting(true);
    try {
      const aiResult = await sendNotificationEmail({
        recipientType: 'admin',
        type: 'status_update',
        userType: 'Teacher',
        userName: `${profile?.firstName} ${profile?.lastName}`,
        userEmail: profile?.email || '',
        details: `Teacher provided a ${feedbackRating}-star review. Comment: ${feedbackComment}`
      });

      if (aiResult.success && aiResult.email) {
        addDocumentNonBlocking(collection(db, 'notifications'), {
          to: aiResult.email.recipientEmail,
          from: "RP Coach-Up <support@rpcoachup.com>",
          message: {
            subject: aiResult.email.subject,
            text: aiResult.email.body,
            html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #266EDB; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">RP Coach-Up</h1>
              </div>
              <div style="padding: 30px; background-color: white;">
                ${aiResult.email.body.replace(/\n/g, '<br>')}
              </div>
              <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #777;">
                © 2026 RP Coach-Up | Feedback Received
              </div>
            </div>`
          },
          type: 'feedback',
          userName: `${profile?.firstName} ${profile?.lastName}`,
          userEmail: profile?.email || 'N/A',
          timestamp: serverTimestamp(),
          read: false
        });
      }

      await addDoc(collection(db, 'feedback'), {
        userId: user?.uid,
        userName: `${profile?.firstName} ${profile?.lastName}`,
        userType: 'Teacher',
        rating: Number(feedbackRating),
        comment: feedbackComment,
        createdAt: serverTimestamp()
      });

      toast({ title: "Feedback Received", description: "Thank you for your valuable feedback!" });
      setFeedbackComment('');
      setFeedbackRating('5');
    } catch (error) {
      // Error handled by global listener
    } finally {
      setIsSubmitting(false);
    }
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const navItems = [
      { id: 'history', icon: History, label: 'Professional Records' },
      { id: 'profile', icon: existingEnquiry ? Edit : PlusCircle, label: existingEnquiry ? 'Update Profile' : 'Submit Profile' },
      { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
    ];

    return (
      <div className="flex flex-col h-full">
        <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary p-1 rounded-lg">
            <BookOpen className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </Link>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const btn = (
              <Button 
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'} 
                className="w-full justify-start gap-3" 
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
            return isMobile ? <SheetClose asChild key={item.id}>{btn}</SheetClose> : btn;
          })}
        </nav>
        <div className="p-4 border-t space-y-4">
          <div className="px-2 mb-4 space-y-2 text-[10px] text-muted-foreground">
            <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> +91 98969 59389</p>
            <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> support@rpcoachup.com</p>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
          <div className="mt-4 pt-4 border-t text-center space-y-1">
             <p className="text-[10px] text-muted-foreground">© 2026 RP Coach-Up</p>
             <p className="text-[8px] text-muted-foreground/50 italic">design and developed by 'SK group'</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background flex-col lg:flex-row">
      <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary p-1.5 rounded-lg">
            <BookOpen className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="h-6 w-6 text-primary" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Teacher Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <SidebarContent isMobile={false} />
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 flex flex-col min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8 flex-1 w-full">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Teacher Portal</h1>
              <p className="text-muted-foreground">Welcome, Educator {profile?.firstName}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary bg-primary/5 uppercase font-bold">Verified Teacher</Badge>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Professional Records</CardTitle>
                      <CardDescription>Records of your professional profile and current assignments.</CardDescription>
                    </div>
                    <Button onClick={() => setActiveTab('profile')} className="gap-2">
                      {existingEnquiry ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                      {existingEnquiry ? 'Update Professional Record' : 'Submit Profile'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingEnquiries ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                  ) : (existingEnquiry ? (
                    <div className="space-y-6">
                      <div key={existingEnquiry.id} className="p-5 border rounded-xl space-y-4 bg-card shadow-sm border-l-4 border-l-primary">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-lg">{existingEnquiry.subjects}</p>
                            <Badge variant={existingEnquiry.status === 'Pending' ? 'outline' : 'default'} className={existingEnquiry.status === 'Hired' ? 'bg-green-600 text-white' : existingEnquiry.status === 'In-Progress' ? 'bg-blue-500 text-white' : ''}>
                              {existingEnquiry.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Submited: {existingEnquiry.submissionDate?.toDate?.()?.toLocaleDateString() || 'Just now'}
                          </p>
                        </div>

                        {matches && matches.length > 0 && (
                          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full mt-1"><Users className="h-4 w-4 text-primary" /></div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">Assigned Students</p>
                              <ol className="list-decimal list-inside space-y-0.5">
                                {Array.from(new Set(matches.map(m => m.studentName))).map((name, idx) => (
                                  <li key={idx} className="text-sm font-semibold">{name}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 text-sm border-t pt-4">
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                              <User className="h-4 w-4" /> Teacher Details
                            </p>
                            <div className="space-y-1">
                              <p className="font-medium">{existingEnquiry.teacherName}</p>
                              <p className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" /> {existingEnquiry.qualifications}</p>
                              <p className="flex items-center gap-2 text-muted-foreground"><Briefcase className="h-3.5 w-3.5" /> {existingEnquiry.experienceYears} Years Experience</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Contact Details
                            </p>
                            <div className="space-y-1">
                              <p className="flex items-center gap-2 font-medium"><Phone className="h-3.5 w-3.5 text-primary" /> {existingEnquiry.phone}</p>
                              <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {existingEnquiry.email}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" /> Salary Expectation
                            </p>
                            <div className="space-y-1">
                              <p className="flex items-center gap-2 text-accent font-bold"><IndianRupee className="h-3.5 w-3.5" /> {existingEnquiry.expectedSalary}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                               <FileText className="h-3 w-3" /> Supporting Docs
                            </p>
                            <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 p-2 rounded-lg w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              Resume: {existingEnquiry.resumeName}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-secondary/10 p-4 rounded-xl border border-dashed border-primary/20 text-center">
                        <p className="text-sm text-muted-foreground">You can only maintain one professional profile. Use the "Update" button to make changes.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-secondary/5">
                      <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4 text-primary">
                        <Briefcase className="h-8 w-8" />
                      </div>
                      <p className="text-muted-foreground font-medium mb-4">No professional record found.</p>
                      <Button onClick={() => setActiveTab('profile')}>Submit your first profile</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="shadow-2xl border-primary/10 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle>{existingEnquiry ? 'Update Professional Record' : 'Submit Profile'}</CardTitle>
                  <CardDescription>
                    {existingEnquiry 
                      ? "Make changes to your existing professional record below." 
                      : "Submit your teaching subjects, qualifications, and background."}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitProfile}>
                  <CardContent className="space-y-8 pt-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <User className="h-4 w-4" /> Personal Information
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="teacherName">Full Name *</Label>
                          <Input id="teacherName" value={teacherName} onChange={e => setTeacherName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Professional Email *</Label>
                          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone / WhatsApp (10-digit) *</Label>
                          <Input 
                            id="phone" 
                            value={phoneValue} 
                            onChange={handlePhoneChange} 
                            required 
                            placeholder="+91 XXXX-XXX-XXX" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salary">Expected Monthly Salary (Optional)</Label>
                          <Input id="salary" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} placeholder="e.g., ₹15,000" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <GraduationCap className="h-4 w-4" /> Academic & Professional Background
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="qualifications">Highest Qualification *</Label>
                          <Input id="qualifications" value={qualifications} onChange={e => setQualifications(e.target.value)} required placeholder="e.g., M.Sc Mathematics, B.Ed" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience *</Label>
                          <Input id="experience" type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} required placeholder="e.g., 5" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subjects">Subjects Specialized In *</Label>
                        <Textarea 
                          id="subjects" 
                          value={subjects} 
                          onChange={e => setSubjects(e.target.value)} 
                          required 
                          placeholder="Please list the subjects you are qualified to teach (e.g., Physics, Chemistry for Class XI-XII)." 
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                        <FileText className="h-4 w-4" /> Supporting Documents
                      </div>
                      <div className="p-6 border-2 border-dashed rounded-xl bg-secondary/5 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="resume" className="text-base">{existingEnquiry ? 'Replace Professional Resume (Optional)' : 'Upload Professional Resume / CV *'}</Label>
                          <Input 
                            id="resume" 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            onChange={handleFileChange} 
                            required={!existingEnquiry}
                            className="h-12 pt-2 cursor-pointer bg-background"
                          />
                          <p className="text-[10px] text-muted-foreground">Accepted formats: PDF, DOC, DOCX. Max size: 500KB.</p>
                        </div>
                        {resumeName && (
                          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 p-2 rounded-lg w-fit">
                            <CheckCircle2 className="h-3 w-3" />
                            File Selected: {resumeName}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-secondary/5 pt-6 pb-8">
                    <Button type="submit" disabled={isSubmitting} className="w-full font-bold h-14 text-xl shadow-lg shadow-primary/20">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {existingEnquiry ? 'Update Professional Record' : 'Submit Professional Profile'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="border-accent/10 shadow-xl overflow-hidden">
                <CardHeader className="bg-accent/5 border-b">
                  <CardTitle>Teacher Experience Feedback</CardTitle>
                  <CardDescription>Your insights help us improve the platform for both students and educators.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-8 pt-8">
                    <div className="space-y-4">
                      <Label className="text-lg">Overall Platform Satisfaction</Label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Button 
                            key={star} 
                            type="button" 
                            variant={Number(feedbackRating) >= star ? "default" : "outline"} 
                            size="icon" 
                            className={`h-12 w-12 rounded-xl transition-all duration-300 hover:scale-125 hover:rotate-6 active:scale-90 ${Number(feedbackRating) >= star ? 'bg-accent text-accent-foreground scale-110 shadow-lg shadow-accent/40' : 'hover:border-accent/50'}`} 
                            onClick={() => setFeedbackRating(star.toString())}
                          >
                            <Star className={`h-6 w-6 transition-transform duration-500 ${Number(feedbackRating) >= star ? "fill-current scale-110" : "scale-100"}`} />
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground italic animate-pulse">Select a star to rate our platform</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedbackComment" className="text-lg">Your Feedback / Suggestions</Label>
                      <Textarea 
                        id="feedbackComment" 
                        value={feedbackComment} 
                        onChange={e => setFeedbackComment(e.target.value)} 
                        required 
                        placeholder="Share your teaching experience with RP Coach-Up. How can we better support you?" 
                        className="min-h-[150px] text-base"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-secondary/5 pt-6 pb-8">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 font-bold text-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                      {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Submit Feedback
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="bg-secondary/30 border-t py-12 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-lg">
                <BookOpen className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 text-sm font-medium">
              <a href="tel:+919896959389" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> +91 98969 59389
              </a>
              <a href="mailto:support@rpcoachup.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> support@rpcoachup.com
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">© 2026 RP Coach-Up. Empowering education through technology.</p>
              <p className="text-[10px] text-muted-foreground/40 font-medium italic">design and developed by 'SK group'</p>
            </div>
          </div>
        </footer>
      </main>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-2xl text-primary">Profile Received!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Thank you for submitting your profile. Our support team will review your application and contact you within 7 working days for the next process.
              <br /><br />
              You can monitor the status of your application at the Professional Records page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-6">
            <AlertDialogAction 
              onClick={() => {setShowSuccessDialog(false); setActiveTab('history');}}
              className="px-10 h-12 rounded-xl text-lg font-bold"
            >
              Understand, Thank You
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
