
"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  UserCheck,
  GraduationCap,
  Trash2,
  LogOut,
  Phone,
  School,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserMinus,
  Search,
  Bell,
  History,
  Database,
  AlertTriangle,
  ClipboardList,
  IndianRupee,
  FileText,
  Download,
  User,
  Mail,
  Menu,
  PlusCircle,
  Briefcase
} from 'lucide-react';
import { useAuth, useFirestore, useCollection, useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, limit, doc, where, deleteDoc, serverTimestamp, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { sendNotificationEmail } from '@/app/actions/notifications';

function logSystemEvent(db: any, admin: any, type: string, description: string) {
  if (!admin || !db) return;
  addDocumentNonBlocking(collection(db, 'systemLogs'), {
    type,
    description,
    adminId: admin.uid,
    adminEmail: admin.email || 'Admin',
    timestamp: serverTimestamp(),
  });
}

function writeEmailNotification(db: any, recipientEmail: string, subject: string, body: string, type: string, userName?: string) {
  if (!db) return;
  addDocumentNonBlocking(collection(db, 'notifications'), {
    to: recipientEmail,
    from: "RP Coach-Up <support@rpcoachup.com>",
    message: {
      subject: subject,
      text: body,
      html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #266EDB; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">RP Coach-Up</h1>
        </div>
        <div style="padding: 30px; background-color: white;">
          ${body.replace(/\n/g, '<br>')}
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #777;">
          © 2026 RP Coach-Up | Empowering Learning
        </div>
      </div>`
    },
    type,
    userName: userName || 'System',
    timestamp: serverTimestamp(),
    read: false
  });
}

function TeacherAssignmentManager({ studentId, studentName, enquiryId, subject, isAdmin }: { studentId: string; studentName: string; enquiryId: string; subject: string; isAdmin: boolean }) {
  const db = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const teachersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'users'), where('userType', '==', 'Teacher'), limit(100));
  }, [db, isAdmin]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection(teachersQuery);

  const completedEnquiriesQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'teacherEnquiries'), where('status', '==', 'Hired'), limit(500));
  }, [db, isAdmin]);
  const { data: hiredEnquiries, isLoading: isLoadingEnquiries } = useCollection(completedEnquiriesQuery);

  const matchesQuery = useMemoFirebase(() => {
    if (!db || !isAdmin || !enquiryId) return null;
    return query(collection(db, 'matchProposals'), where('enquiryId', '==', enquiryId));
  }, [db, isAdmin, enquiryId]);
  const { data: currentMatches, isLoading: isLoadingMatches } = useCollection(matchesQuery);

  const matchedTeacherIds = useMemo(() => {
    return new Set(currentMatches?.map(m => m.teacherId) || []);
  }, [currentMatches]);

  const hiredTeacherIds = useMemo(() => {
    return new Set(hiredEnquiries?.map(i => i.teacherId) || []);
  }, [hiredEnquiries]);

  const handleAssignTeacher = async (teacher: any) => {
    const teacherFullName = `${teacher.firstName} ${teacher.lastName}`;
    const matchData = {
      studentId,
      studentName,
      enquiryId,
      subject,
      teacherId: teacher.id,
      teacherName: teacherFullName,
      assignedAt: serverTimestamp(),
      status: 'active'
    };
    
    addDocumentNonBlocking(collection(db, 'matchProposals'), matchData);
    logSystemEvent(db, adminUser, 'assignment', `Assigned Teacher: ${teacherFullName} to Student: ${studentName} for ${subject}`);

    const aiResult = await sendNotificationEmail({
      recipientType: 'user',
      type: 'status_update',
      userType: 'Teacher',
      userName: teacherFullName,
      userEmail: teacher.email,
      details: `You have been assigned to student ${studentName} for ${subject}.`
    });

    if (aiResult.success && aiResult.email) {
      writeEmailNotification(db, aiResult.email.recipientEmail, aiResult.email.subject, aiResult.email.body, 'assignment', teacherFullName);
    }

    toast({
      title: "Teacher Assigned",
      description: `Successfully matched ${teacher.firstName} with ${studentName} for ${subject}.`,
    });
  };

  const handleUnassignTeacher = (teacherId: string) => {
    const matchToDelete = currentMatches?.find(m => m.teacherId === teacherId);
    if (matchToDelete) {
      deleteDocumentNonBlocking(doc(db, 'matchProposals', matchToDelete.id));
      logSystemEvent(db, adminUser, 'unassignment', `Removed Teacher: ${matchToDelete.teacherName} from ${studentName} for ${subject}`);

      toast({
        title: "Teacher Unassigned",
        description: "The assignment has been removed.",
      });
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    return teachers.filter(t => 
      hiredTeacherIds.has(t.id) && (
        `${t.firstName || ''} ${t.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [teachers, searchTerm, hiredTeacherIds]);

  if (!isAdmin) return null;
  if (isLoadingTeachers || isLoadingMatches || isLoadingEnquiries) {
    return <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-3 pt-3 border-t mt-3">
      <div className="flex items-center justify-between">
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
          <UserPlus className="h-3 w-3" /> Assign Mentor for {subject}
        </h5>
        <Badge variant="secondary" className="text-[8px] font-bold h-4">
          {matchedTeacherIds.size} Active
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        <Input 
          placeholder="Find hired teachers..." 
          className="pl-7 h-7 text-[10px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-[150px] overflow-y-auto space-y-1 pr-1">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => {
            const isAssigned = matchedTeacherIds.has(teacher.id);
            return (
              <div key={teacher.id} className="flex items-center justify-between p-1.5 rounded-md border bg-secondary/5">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isAssigned ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {(teacher.firstName || '?')[0]}{(teacher.lastName || '?')[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium leading-none">{teacher.firstName} {teacher.lastName}</p>
                    <p className="text-[8px] text-muted-foreground">{teacher.email}</p>
                  </div>
                </div>
                {isAssigned ? (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleUnassignTeacher(teacher.id)}
                  >
                    <UserMinus className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-6 w-6 text-primary"
                    onClick={() => handleAssignTeacher(teacher)}
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center py-2 text-[10px] text-muted-foreground italic">No hired teachers found.</p>
        )}
      </div>
    </div>
  );
}

function UserDetailsContent({ user, isAdmin }: { user: any; isAdmin: boolean }) {
  const db = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [statusChangeTarget, setStatusChangeTarget] = useState<{id: string, currentStatus: string, collection: string, subject: string, userName: string, userEmail: string} | null>(null);
  
  const enquiryCollection = user.userType === 'Student' ? 'studentEnquiries' : 'teacherEnquiries';
  const enquiryField = user.userType === 'Student' ? 'studentId' : 'teacherId';
  
  const enquiriesQuery = useMemoFirebase(() => {
    if (!db || !isAdmin || !user.id) return null;
    return query(
      collection(db, enquiryCollection), 
      where(enquiryField, '==', user.id),
      limit(50)
    );
  }, [db, user.id, enquiryCollection, enquiryField, isAdmin]);

  const { data: enquiries, isLoading: isLoadingEnquiries } = useCollection(enquiriesQuery);

  const getNextStatus = (current: string) => {
    if (user.userType === 'Student') {
      if (current === 'Pending') return 'Enrolled';
      if (current === 'Enrolled') return 'Course Complete';
      return 'Pending';
    } else {
      if (current === 'Pending') return 'In-Progress';
      if (current === 'In-Progress') return 'Hired';
      return 'Pending';
    }
  };

  const handleStatusToggle = async () => {
    if (!statusChangeTarget) return;
    
    const newStatus = getNextStatus(statusChangeTarget.currentStatus);
    const enquiryRef = doc(db, statusChangeTarget.collection, statusChangeTarget.id);
    
    updateDocumentNonBlocking(enquiryRef, { status: newStatus });
    
    logSystemEvent(db, adminUser, 'status_update', `Updated status to ${newStatus} for ${statusChangeTarget.userName}'s enquiry in ${statusChangeTarget.subject}`);

    const aiResult = await sendNotificationEmail({
      recipientType: 'user',
      type: 'status_update',
      userType: user.userType,
      userName: statusChangeTarget.userName,
      userEmail: statusChangeTarget.userEmail,
      details: `Your enquiry for "${statusChangeTarget.subject}" is now: ${newStatus}`
    });

    if (aiResult.success && aiResult.email) {
      writeEmailNotification(db, aiResult.email.recipientEmail, aiResult.email.subject, aiResult.email.body, 'status_update', statusChangeTarget.userName);
    }

    setStatusChangeTarget(null);
  };

  const handleDownloadResume = (fileName: string, dataUrl: string) => {
    if (!dataUrl) {
      toast({ variant: "destructive", title: "Download Failed", description: "The original file content was not found." });
      return;
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) return null;
  if (isLoadingEnquiries) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
           {user.userType === 'Student' ? 'Tuition Enquiries' : 'Professional Specializations'}
        </h4>
        {enquiries && enquiries.length > 0 ? (
          <div className="space-y-4">
            {[...enquiries].sort((a,b) => (b.submissionDate?.toMillis?.() || 0) - (a.submissionDate?.toMillis?.() || 0)).map((int: any) => (
              <div key={int.id} className="p-4 border rounded-xl bg-card shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-bold text-primary">{int.subject || int.subjects}</span>
                  <button onClick={() => setStatusChangeTarget({ id: int.id, currentStatus: int.status, collection: enquiryCollection, subject: int.subject || int.subjects, userName: int.studentName || int.teacherName, userEmail: int.email || user.email })} className="focus:outline-none">
                    <Badge variant={int.status === 'Pending' ? 'outline' : 'default'} className={`text-[10px] cursor-pointer ${int.status === 'Course Complete' || int.status === 'Hired' ? 'bg-green-600 text-white' : int.status === 'Enrolled' || int.status === 'In-Progress' ? 'bg-blue-500 text-white' : ''}`}>
                      {int.status}
                    </Badge>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2"><User className="h-3 w-3 text-muted-foreground" /><span className="text-xs">For: {int.studentName || int.teacherName}</span></div>
                  {int.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /><span className="text-xs">{int.phone}</span></div>}
                  {int.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /><span className="text-xs">{int.email}</span></div>}
                  {user.userType === 'Student' && int.school && <div className="flex items-center gap-2"><School className="h-3 w-3 text-muted-foreground" /><span className="text-xs">{int.school} ({int.gradeOrClass})</span></div>}
                  {user.userType === 'Teacher' && int.resumeName && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
                      <div className="flex items-center gap-2"><FileText className="h-3 w-3 text-green-600" /><span className="text-xs text-green-800 font-medium truncate max-w-[150px]">{int.resumeName}</span></div>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-green-700" onClick={() => handleDownloadResume(int.resumeName, int.resumeData)}><Download className="h-3 w-3" /></Button>
                    </div>
                  )}
                  {(int.affordableRange || int.expectedSalary) && <div className="flex items-center gap-2 text-accent mt-1"><IndianRupee className="h-3 w-3" /><span className="text-xs font-bold">{int.affordableRange || int.expectedSalary}</span></div>}
                </div>

                {user.userType === 'Student' && (
                  <TeacherAssignmentManager 
                    studentId={user.id} 
                    studentName={`${user.firstName} ${user.lastName}`} 
                    enquiryId={int.id}
                    subject={int.subject}
                    isAdmin={isAdmin} 
                  />
                )}
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground italic text-center py-4">No submissions found.</p>}
      </div>

      <AlertDialog open={!!statusChangeTarget} onOpenChange={(open) => !open && setStatusChangeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Update Status?</AlertDialogTitle><AlertDialogDescription>Mark this enquiry as <strong>{statusChangeTarget ? getNextStatus(statusChangeTarget.currentStatus) : ''}</strong>?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleStatusToggle}>Confirm</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PurgeCollectionButton({ collectionName, label, onPurge, isAdmin }: { collectionName: string, label: string, onPurge: () => void, isAdmin: boolean }) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isPurging, setIsPurging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePurge = async () => {
    if (!isAdmin) return;
    setIsPurging(true);
    try {
      const q = query(collection(db, collectionName), limit(500));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      onPurge();
      toast({ title: "Collection Cleared", description: `All documents in ${collectionName} have been deleted.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Purge Failed", description: "Could not clear collection." });
    } finally {
      setIsPurging(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button variant="outline" className="justify-start gap-2 h-12 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => setShowConfirm(true)}><Trash2 className="h-4 w-4" />{label}</Button>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" />Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete all documents in the <strong>{collectionName}</strong> collection. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handlePurge} className="bg-destructive text-destructive-foreground" disabled={isPurging}>{isPurging ? <Loader2 className="animate-spin h-4 w-4" /> : 'Yes, Delete All'}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SystemSettingsLogs({ isAdmin }: { isAdmin: boolean }) {
  const db = useFirestore();
  const logsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'systemLogs'), orderBy('timestamp', 'desc'), limit(100));
  }, [db, isAdmin]);
  const { data: logs, isLoading } = useCollection(logsQuery);

  if (!isAdmin) return null;
  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader><div className="flex items-center gap-2"><History className="h-5 w-5 text-primary" /><div><CardTitle>Activity Logs</CardTitle><CardDescription>Full audit trail of administrative actions.</CardDescription></div></div></CardHeader>
      <CardContent><div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Admin</TableHead></TableRow></TableHeader><TableBody>{logs && logs.length > 0 ? logs.map((log) => (<TableRow key={log.id}><TableCell className="text-[10px] text-muted-foreground">{log.timestamp?.toDate?.()?.toLocaleString() || 'Syncing...'}</TableCell><TableCell><Badge variant="outline" className="text-[10px] uppercase">{log.type}</Badge></TableCell><TableCell className="text-xs">{log.description}</TableCell><TableCell className="text-right text-[10px]">{log.adminEmail}</TableCell></TableRow>)) : <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">No logs found.</TableCell></TableRow>}</TableBody></Table></div></CardContent>
    </Card>
  );
}

export default function AdminPortal() {
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('notifications');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user?.uid]);
  const { data: adminDoc, isLoading: isAdminLoading } = useDoc(adminDocRef);

  const isAdmin = !!adminDoc;

  const studentEnquiriesQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'studentEnquiries'), limit(500));
  }, [db, isAdmin]);
  const { data: allStudentEnquiries } = useCollection(studentEnquiriesQuery);

  const teacherEnquiriesQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'teacherEnquiries'), limit(500));
  }, [db, isAdmin]);
  const { data: allTeacherEnquiries } = useCollection(teacherEnquiriesQuery);

  const usersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'users'), limit(500));
  }, [db, isAdmin]);
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'notifications'), limit(50));
  }, [db, isAdmin]);
  const { data: rawNotifications, isLoading: isLoadingNotifications } = useCollection(notificationsQuery);

  const notifications = useMemo(() => {
    if (!rawNotifications) return [];
    return [...rawNotifications].sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
  }, [rawNotifications]);

  const handleDeleteNotification = async () => {
    if (notificationToDelete && isAdmin) {
      await deleteDoc(doc(db, 'notifications', notificationToDelete));
      setNotificationToDelete(null);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (activeTab === 'students') {
      const baseStudents = users.filter(u => u.userType === 'Student');
      if (!allStudentEnquiries) return baseStudents;
      
      return baseStudents.map(s => {
        const studentEnquiries = allStudentEnquiries.filter(i => i.studentId === s.id);
        const hasPending = studentEnquiries.some(i => i.status === 'Pending');
        const hasEnrolled = studentEnquiries.some(i => i.status === 'Enrolled');
        const hasCompleted = studentEnquiries.some(i => i.status === 'Course Complete');
        return { ...s, studentEnquiries, hasPending, hasEnrolled, hasCompleted };
      }).filter(s => s.studentEnquiries && s.studentEnquiries.length > 0);
    }
    if (activeTab === 'teachers') {
      const baseTeachers = users.filter(u => u.userType === 'Teacher');
      if (!allTeacherEnquiries) return baseTeachers;

      return baseTeachers.map(t => {
        const teacherEnquiries = allTeacherEnquiries.filter(i => i.teacherId === t.id);
        const hasPending = teacherEnquiries.some(i => i.status === 'Pending');
        const hasInProgress = teacherEnquiries.some(i => i.status === 'In-Progress');
        const hasHired = teacherEnquiries.some(i => i.status === 'Hired');
        return { ...t, teacherEnquiries, hasPending, hasInProgress, hasHired };
      }).filter(t => t.teacherEnquiries && t.teacherEnquiries.length > 0);
    }
    return [];
  }, [users, allStudentEnquiries, allTeacherEnquiries, activeTab]);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  if (isUserLoading || isAdminLoading || !user) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const NavButton = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => {
      const btn = (
        <Button 
          variant={activeTab === id ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3" 
          onClick={() => setActiveTab(id)}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      );
      return isMobile ? <SheetClose asChild>{btn}</SheetClose> : btn;
    };

    return (
      <div className="flex flex-col h-full">
        <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary p-1 rounded-lg"><BookOpen className="text-primary-foreground h-5 w-5" /></div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </Link>
        <nav className="flex-1 px-4 space-y-1">
          <NavButton id="notifications" icon={Bell} label="Notifications" />
          <NavButton id="students" icon={UserCheck} label="Students" />
          <NavButton id="teachers" icon={GraduationCap} label="Teachers" />
          <NavButton id="settings" icon={History} label="Activity Logs" />
          <NavButton id="maintenance" icon={Database} label="Maintenance" />
        </nav>
        <div className="p-4 border-t mt-auto">
          <div className="px-2 mb-4 space-y-2 text-[10px] text-muted-foreground"><p className="flex items-center gap-2"><Phone className="h-3 w-3" /> +91 98969 59389</p><p className="flex items-center gap-2"><Mail className="h-3 w-3" /> support@rpcoachup.com</p></div>
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" />Sign Out</Button>
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
              <SheetTitle>Admin Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <SidebarContent isMobile={false} />
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 flex flex-col min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8 flex-1 w-full">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-3xl font-headline font-bold text-primary">Admin Portal</h1><p className="text-muted-foreground">System Administration and Matching</p></div></header>

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {isLoadingNotifications ? <Loader2 className="animate-spin mx-auto text-primary" /> : (notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="flex items-start justify-between p-4 border rounded-xl bg-card shadow-sm">
                    <div className="flex gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg h-fit">
                        {n.type === 'registration' ? <UserCheck className="h-5 w-5 text-primary" /> : <ClipboardList className="h-5 w-5 text-accent" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{(n.message?.subject) || n.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{(n.message?.text) || n.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{n.timestamp?.toDate?.()?.toLocaleString() || 'Synced'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setNotificationToDelete(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                )) : <p className="text-center py-8 text-muted-foreground italic">No notifications.</p>)}
              </CardContent>
            </Card>
          )}

          {(activeTab === 'students' || activeTab === 'teachers') && (
            <Card>
              <CardHeader><div className="flex items-center justify-between"><div><CardTitle>{activeTab === 'students' ? 'Student Enquiries' : 'Teacher Profiles'}</CardTitle></div><Badge variant="secondary">{filteredUsers.length} Found</Badge></div></CardHeader>
              <CardContent>
                <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="hidden sm:table-cell">Details</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{paginatedUsers.length > 0 ? paginatedUsers.map(u => (<TableRow key={u.id} className="hover:bg-secondary/5"><TableCell className="font-medium"><div className="flex flex-col"><div className="flex items-center gap-2 flex-wrap"><span>{u.firstName} {u.lastName}</span>{u.hasPending ? <Badge variant="default" className="text-[8px] h-4 bg-primary px-1.5 uppercase font-bold">NEW</Badge> : u.hasEnrolled || u.hasInProgress ? <Badge variant="secondary" className="text-[8px] h-4 bg-blue-500 text-white px-1.5 uppercase font-bold">{u.userType === 'Student' ? 'ENROLLED' : 'IN-PROGRESS'}</Badge> : u.hasCompleted || u.hasHired ? <Badge variant="secondary" className="text-[8px] h-4 bg-green-600 text-white px-1.5 uppercase font-bold">{u.userType === 'Student' ? 'COURSE COMPLETE' : 'HIRED'}</Badge> : null}</div></div></TableCell><TableCell className="hidden sm:table-cell text-muted-foreground"><div className="flex flex-col gap-1"><span className="text-[11px]">{u.email}</span></div></TableCell><TableCell className="text-right"><Button variant="outline" size="sm" className="h-8" onClick={() => { setSelectedUser(u); setIsDetailsOpen(true); }}>View {activeTab === 'students' ? 'Enquiries' : 'Profile'}</Button></TableCell></TableRow>)) : <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">No results found.</TableCell></TableRow>}</TableBody></Table></div>
                {totalPages > 1 && <div className="flex justify-center gap-2 mt-4"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button><span className="text-xs self-center font-medium">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button></div>}
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && <SystemSettingsLogs isAdmin={isAdmin} />}

          {activeTab === 'maintenance' && (
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /><div><CardTitle>Database Maintenance</CardTitle><CardDescription>Purge test data and clear collections. Use with caution.</CardDescription></div></div></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <PurgeCollectionButton 
                    collectionName="studentEnquiries" 
                    label="Clear Student Enquiries" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all student enquiries')} 
                    isAdmin={isAdmin} 
                  />
                  <PurgeCollectionButton 
                    collectionName="teacherEnquiries" 
                    label="Clear Teacher Profiles" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all teacher profiles')} 
                    isAdmin={isAdmin} 
                  />
                  <PurgeCollectionButton 
                    collectionName="matchProposals" 
                    label="Clear All Matches (Assignments)" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all match proposals')} 
                    isAdmin={isAdmin} 
                  />
                  <PurgeCollectionButton 
                    collectionName="notifications" 
                    label="Clear All Notifications" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all system notifications')} 
                    isAdmin={isAdmin} 
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <footer className="bg-secondary/30 border-t py-12 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6"><div className="bg-primary p-1 rounded-lg"><BookOpen className="text-primary-foreground h-5 w-5" /></div><span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span></div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 text-sm font-medium">
              <a href="tel:+919896959389" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-4 w-4" /> +91 98969 59389</a>
              <a href="mailto:support@rpcoachup.com" className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-4 w-4" /> support@rpcoachup.com</a>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">© 2026 RP Coach-Up. All rights reserved.</p>
              <p className="text-[10px] text-muted-foreground/40 font-medium italic">design and developed by 'SK group'</p>
            </div>
          </div>
        </footer>
      </main>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{(selectedUser?.firstName || '?')[0]}{(selectedUser?.lastName || '?')[0]}</div><div><p>{selectedUser?.firstName} {selectedUser?.lastName}</p><p className="text-xs font-normal text-muted-foreground">{selectedUser?.email}</p></div></DialogTitle></DialogHeader>
          {selectedUser && <UserDetailsContent user={selectedUser} isAdmin={isAdmin} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!notificationToDelete} onOpenChange={(open) => !open && setNotificationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Notification?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteNotification} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
