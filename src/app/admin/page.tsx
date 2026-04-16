
"use client"

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
  ShieldAlert,
  Phone,
  School,
  MapPin,
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
  Edit2,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useAuth, useFirestore, useCollection, useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, limit, doc, where, deleteDoc, serverTimestamp, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { sendNotificationEmail } from '@/app/actions/notifications';

function logSystemEvent(db: any, admin: any, type: string, description: string) {
  if (!admin) return;
  addDocumentNonBlocking(collection(db, 'systemLogs'), {
    type,
    description,
    adminId: admin.uid,
    adminEmail: admin.email,
    timestamp: serverTimestamp(),
  });
}

function createAdminNotification(db: any, type: 'registration' | 'interest' | 'assignment' | 'status_update' | 'feedback', subject: string, body: string, userEmail?: string, userName?: string) {
  addDocumentNonBlocking(collection(db, 'notifications'), {
    type,
    subject,
    body,
    userEmail: userEmail || 'system',
    userName: userName || 'System',
    timestamp: serverTimestamp(),
    read: false
  });
}

function TeacherAssignmentManager({ studentId, studentName, isAdmin }: { studentId: string; studentName: string; isAdmin: boolean }) {
  const db = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Get all teachers
  const teachersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'users'), where('userType', '==', 'Teacher'), limit(100));
  }, [db, isAdmin]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection(teachersQuery);

  // Get all completed teacher interests to filter eligible teachers
  const completedInterestsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'teacherInterests'), where('status', '==', 'Completed'), limit(500));
  }, [db, isAdmin]);
  const { data: completedInterests, isLoading: isLoadingInterests } = useCollection(completedInterestsQuery);

  const matchesQuery = useMemoFirebase(() => {
    if (!db || !isAdmin || !studentId) return null;
    return query(collection(db, 'matchProposals'), where('studentId', '==', studentId));
  }, [db, isAdmin, studentId]);
  const { data: currentMatches, isLoading: isLoadingMatches } = useCollection(matchesQuery);

  const matchedTeacherIds = useMemo(() => {
    return new Set(currentMatches?.map(m => m.teacherId) || []);
  }, [currentMatches]);

  const completedTeacherIds = useMemo(() => {
    return new Set(completedInterests?.map(i => i.teacherId) || []);
  }, [completedInterests]);

  const handleAssignTeacher = (teacher: any) => {
    const teacherFullName = `${teacher.firstName} ${teacher.lastName}`;
    const matchData = {
      studentId,
      studentName,
      teacherId: teacher.id,
      teacherName: teacherFullName,
      assignedAt: serverTimestamp(),
      status: 'active'
    };
    
    addDocumentNonBlocking(collection(db, 'matchProposals'), matchData);
    logSystemEvent(db, adminUser, 'assignment', `Assigned Teacher: ${teacherFullName} to Student: ${studentName}`);

    createAdminNotification(
      db, 
      'assignment', 
      'New Teacher Assignment', 
      `Teacher ${teacherFullName} has been assigned to student ${studentName}.`,
      teacher.email,
      teacherFullName
    );

    sendNotificationEmail({
      recipientType: 'user',
      type: 'status_update',
      userType: 'Teacher',
      userName: teacherFullName,
      userEmail: teacher.email,
      details: `You have been assigned to student ${studentName}.`
    });

    toast({
      title: "Teacher Assigned",
      description: `Successfully matched ${teacher.firstName} with ${studentName}.`,
    });
  };

  const handleUnassignTeacher = (teacherId: string) => {
    const matchToDelete = currentMatches?.find(m => m.teacherId === teacherId);
    if (matchToDelete) {
      deleteDocumentNonBlocking(doc(db, 'matchProposals', matchToDelete.id));
      logSystemEvent(db, adminUser, 'unassignment', `Removed Teacher: ${matchToDelete.teacherName} from Student: ${studentName}`);

      toast({
        title: "Teacher Unassigned",
        description: "The match has been removed.",
      });
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    return teachers.filter(t => 
      completedTeacherIds.has(t.id) && (
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [teachers, searchTerm, completedTeacherIds]);

  if (!isAdmin) return null;
  if (isLoadingTeachers || isLoadingMatches || isLoadingInterests) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4 pt-6 border-t mt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Assign Teachers
          </h4>
          <p className="text-[10px] text-muted-foreground italic">Only showing verified/completed teachers</p>
        </div>
        <Badge variant="secondary" className="font-normal">
          {matchedTeacherIds.size} Assigned
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search verified teachers..." 
          className="pl-9 h-9 text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => {
            const isAssigned = matchedTeacherIds.has(teacher.id);
            return (
              <div key={teacher.id} className="flex items-center justify-between p-2 rounded-lg border bg-secondary/5">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isAssigned ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{teacher.firstName} {teacher.lastName}</p>
                    <p className="text-[10px] text-muted-foreground">{teacher.email}</p>
                  </div>
                </div>
                {isAssigned ? (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 text-destructive"
                    onClick={() => handleUnassignTeacher(teacher.id)}
                  >
                    <UserMinus className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-primary"
                    onClick={() => handleAssignTeacher(teacher)}
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center py-4 text-xs text-muted-foreground italic">No verified teachers found.</p>
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
  
  const profilePath = user.userType === 'Student' 
    ? `users/${user.id}/studentProfile/studentProfile` 
    : `users/${user.id}/teacherProfile/teacherProfile`;

  const docRef = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return doc(db, profilePath);
  }, [db, profilePath, isAdmin]);

  const { data: details, isLoading: isLoadingProfile } = useDoc(docRef);

  const interestCollection = user.userType === 'Student' ? 'studentInterests' : 'teacherInterests';
  const interestField = user.userType === 'Student' ? 'studentId' : 'teacherId';
  
  const interestsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin || !user.id) return null;
    return query(
      collection(db, interestCollection), 
      where(interestField, '==', user.id),
      limit(50)
    );
  }, [db, user.id, interestCollection, interestField, isAdmin]);

  const { data: interests, isLoading: isLoadingInterests } = useCollection(interestsQuery);

  const getNextStatus = (current: string) => {
    if (current === 'Pending') return 'In-Progress';
    if (current === 'In-Progress') return 'Completed';
    return 'Pending';
  };

  const handleStatusToggle = () => {
    if (!statusChangeTarget) return;
    
    const newStatus = getNextStatus(statusChangeTarget.currentStatus);
    const interestRef = doc(db, statusChangeTarget.collection, statusChangeTarget.id);
    
    updateDocumentNonBlocking(interestRef, { status: newStatus });
    
    // REMOVED createAdminNotification here to reduce clutter. 
    // The Admin is the one performing the action, so an alert to themselves is unnecessary.
    // We still log the event and send the user email below.

    logSystemEvent(db, adminUser, 'status_update', `Updated status to ${newStatus} for ${statusChangeTarget.userName}'s interest in ${statusChangeTarget.subject}`);

    sendNotificationEmail({
      recipientType: 'user',
      type: 'status_update',
      userType: user.userType,
      userName: statusChangeTarget.userName,
      userEmail: statusChangeTarget.userEmail,
      details: `Your inquiry for "${statusChangeTarget.subject}" is now: ${newStatus}`
    });

    setStatusChangeTarget(null);
  };

  const handleDownloadResume = (fileName: string, dataUrl: string) => {
    if (!dataUrl) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "The original file content was not found.",
      });
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `Downloading ${fileName}`,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while downloading the file.",
      });
    }
  };

  if (!isAdmin) return null;
  if (isLoadingProfile || isLoadingInterests) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
           {user.userType === 'Student' ? 'Tuition Requirements' : 'Professional Specializations'}
        </h4>
        {interests && interests.length > 0 ? (
          <div className="space-y-3">
            {[...interests].sort((a,b) => (b.submissionDate?.toMillis?.() || 0) - (a.submissionDate?.toMillis?.() || 0)).map((int: any) => (
              <div key={int.id} className="p-4 border rounded-xl bg-card shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-bold text-primary">{int.subject || int.subjects}</span>
                  <button 
                    onClick={() => setStatusChangeTarget({ 
                      id: int.id, 
                      currentStatus: int.status, 
                      collection: interestCollection,
                      subject: int.subject || int.subjects,
                      userName: int.studentName || int.teacherName,
                      userEmail: int.email || user.email
                    })}
                    className="focus:outline-none"
                  >
                    <Badge 
                      variant={int.status === 'Pending' ? 'outline' : 'default'} 
                      className={`text-[10px] cursor-pointer ${
                        int.status === 'Completed' ? 'bg-green-600' : 
                        int.status === 'In-Progress' ? 'bg-blue-500 hover:bg-blue-600' : ''
                      }`}
                    >
                      {int.status}
                    </Badge>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">For: {int.studentName || int.teacherName}</span>
                  </div>
                  {int.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{int.phone}</span>
                    </div>
                  )}
                  {int.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{int.email}</span>
                    </div>
                  )}

                  {user.userType === 'Student' && (
                    <>
                      {int.school && (
                        <div className="flex items-center gap-2">
                          <School className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{int.school} ({int.gradeOrClass})</span>
                        </div>
                      )}
                      {int.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                          <span className="text-xs">{int.address}</span>
                        </div>
                      )}
                    </>
                  )}

                  {user.userType === 'Teacher' && (
                    <>
                      {int.resumeName && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-800 font-medium truncate max-w-[150px]">{int.resumeName}</span>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 text-green-700"
                            onClick={() => handleDownloadResume(int.resumeName, int.resumeData)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {(int.affordableRange || int.expectedSalary) && (
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <IndianRupee className="h-3 w-3" />
                      <span className="text-xs font-bold">{int.affordableRange || int.expectedSalary}</span>
                    </div>
                  )}
                </div>

                {int.notes && (
                  <div className="bg-secondary/20 p-2 rounded-lg text-xs italic text-muted-foreground">
                    "{int.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            No submissions found.
          </p>
        )}
      </div>

      {user.userType === 'Student' && (
        <TeacherAssignmentManager studentId={user.id} studentName={`${user.firstName} ${user.lastName}`} isAdmin={isAdmin} />
      )}

      <AlertDialog open={!!statusChangeTarget} onOpenChange={(open) => !open && setStatusChangeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this submission as <strong>{statusChangeTarget ? getNextStatus(statusChangeTarget.currentStatus) : ''}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusToggle}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
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
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      onPurge();
      toast({ title: "Collection Cleared", description: `All documents in ${collectionName} have been deleted.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Purge Failed", description: "Could not clear collection." });
    } finally {
      setIsPurging(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button variant="outline" className="justify-start gap-2 h-12 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => setShowConfirm(true)}>
        <Trash2 className="h-4 w-4" />
        {label}
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all documents in the <strong>{collectionName}</strong> collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePurge} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isPurging}>
              {isPurging ? <Loader2 className="animate-spin h-4 w-4" /> : 'Yes, Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
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
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>Full audit trail of administrative actions.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-[10px] text-muted-foreground">
                      {log.timestamp?.toDate?.()?.toLocaleString() || 'Syncing...'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase">{log.type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{log.description}</TableCell>
                    <TableCell className="text-right text-[10px]">{log.adminEmail}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">No logs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
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

  // Global fetch of interests for sorting and filtering students
  const studentInterestsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'studentInterests'), limit(500));
  }, [db, isAdmin]);
  const { data: allStudentInterests } = useCollection(studentInterestsQuery);

  const teacherInterestsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'teacherInterests'), limit(500));
  }, [db, isAdmin]);
  const { data: allTeacherInterests } = useCollection(teacherInterestsQuery);

  useEffect(() => {
    if (!isUserLoading && !isAdminLoading && user && adminDocRef && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Restricted",
        description: "You do not have permission to view the Admin Portal.",
      });
    }
  }, [isUserLoading, isAdminLoading, isAdmin, user, adminDocRef, toast]);

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
    return [...rawNotifications].sort((a, b) => {
      const timeA = a.timestamp?.toMillis?.() || 0;
      const timeB = b.timestamp?.toMillis?.() || 0;
      return timeB - timeA;
    });
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
      if (!allStudentInterests) return baseStudents;

      // Filter and Sort Logic for Students
      return baseStudents
        .map(s => {
          const studentInterests = allStudentInterests.filter(i => i.studentId === s.id);
          const hasPending = studentInterests.some(i => i.status === 'Pending');
          const hasInProgress = studentInterests.some(i => i.status === 'In-Progress');
          const hasCompleted = studentInterests.some(i => i.status === 'Completed');
          
          const oldestInquiryDate = studentInterests.reduce((min, i) => {
            const date = i.submissionDate?.toMillis?.() || Infinity;
            return date < min ? date : min;
          }, Infinity);

          return { ...s, studentInterests, hasPending, hasInProgress, hasCompleted, oldestInquiryDate };
        })
        // Only include students with non-empty inquiries
        .filter(s => s.studentInterests.length > 0)
        // Sort: Pending first, then by date (oldest first / first come first serve)
        .sort((a, b) => {
          if (a.hasPending && !b.hasPending) return -1;
          if (!a.hasPending && b.hasPending) return 1;
          return a.oldestInquiryDate - b.oldestInquiryDate;
        });
    }
    
    if (activeTab === 'teachers') {
      const baseTeachers = users.filter(u => u.userType === 'Teacher');
      if (!allTeacherInterests) return baseTeachers;

      // Filter and Sort Logic for Teachers (Matching Student Logic)
      return baseTeachers
        .map(t => {
          const teacherInterests = allTeacherInterests.filter(i => i.teacherId === t.id);
          const hasPending = teacherInterests.some(i => i.status === 'Pending');
          const hasInProgress = teacherInterests.some(i => i.status === 'In-Progress');
          const hasCompleted = teacherInterests.some(i => i.status === 'Completed');
          
          const oldestInquiryDate = teacherInterests.reduce((min, i) => {
            const date = i.submissionDate?.toMillis?.() || Infinity;
            return date < min ? date : min;
          }, Infinity);

          return { ...t, teacherInterests, hasPending, hasInProgress, hasCompleted, oldestInquiryDate };
        })
        // Only include teachers with non-empty profiles
        .filter(t => t.teacherInterests.length > 0)
        // Sort: Pending first, then by date (oldest first / first come first serve)
        .sort((a, b) => {
          if (a.hasPending && !b.hasPending) return -1;
          if (!a.hasPending && b.hasPending) return 1;
          return a.oldestInquiryDate - b.oldestInquiryDate;
        });
    }
    
    return [];
  }, [users, allStudentInterests, allTeacherInterests, activeTab]);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  if (isUserLoading || isAdminLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have administrative permissions.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleSignOut}>Sign Out</Button>
            <Button className="flex-1" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="bg-primary p-1 rounded-lg">
          <BookOpen className="text-primary-foreground h-5 w-5" />
        </div>
        <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
      </Link>
      <nav className="flex-1 px-4 space-y-1">
        <SheetClose asChild>
          <Button variant={activeTab === 'notifications' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('notifications'); setCurrentPage(1);}}>
            <Bell className="h-4 w-4" /> Notifications
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'students' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('students'); setCurrentPage(1);}}>
            <UserCheck className="h-4 w-4" /> Students
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'teachers' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('teachers'); setCurrentPage(1);}}>
            <GraduationCap className="h-4 w-4" /> Teachers
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'settings' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('settings'); setCurrentPage(1);}}>
            <History className="h-4 w-4" /> Activity Logs
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant={activeTab === 'maintenance' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('maintenance'); setCurrentPage(1);}}>
            <Database className="h-4 w-4" /> Maintenance
          </Button>
        </SheetClose>
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
          <div className="bg-primary p-1.5 rounded-lg">
            <BookOpen className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="flex flex-col h-full">
          <Link href="/" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-1 rounded-lg">
              <BookOpen className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
          </Link>
          <nav className="flex-1 px-4 space-y-1">
            <Button variant={activeTab === 'notifications' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('notifications'); setCurrentPage(1);}}>
              <Bell className="h-4 w-4" /> Notifications
            </Button>
            <Button variant={activeTab === 'students' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('students'); setCurrentPage(1);}}>
              <UserCheck className="h-4 w-4" /> Students
            </Button>
            <Button variant={activeTab === 'teachers' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('teachers'); setCurrentPage(1);}}>
              <GraduationCap className="h-4 w-4" /> Teachers
            </Button>
            <Button variant={activeTab === 'settings' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('settings'); setCurrentPage(1);}}>
              <History className="h-4 w-4" /> Activity Logs
            </Button>
            <Button variant={activeTab === 'maintenance' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => {setActiveTab('maintenance'); setCurrentPage(1);}}>
              <Database className="h-4 w-4" /> Maintenance
            </Button>
          </nav>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Admin Portal</h1>
              <p className="text-muted-foreground">System Administration and Matching</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="h-8 px-4 font-bold border-primary text-primary bg-primary/5 uppercase">
                System Administrator
              </Badge>
            </div>
          </header>

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {isLoadingNotifications ? <Loader2 className="animate-spin mx-auto text-primary" /> : (notifications && notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="flex items-start justify-between p-4 border rounded-xl bg-card shadow-sm hover:border-primary/20 transition-colors">
                    <div className="flex gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg h-fit">
                        {n.type === 'registration' && <UserCheck className="h-5 w-5 text-primary" />}
                        {n.type === 'interest' && <ClipboardList className="h-5 w-5 text-accent" />}
                        {n.type === 'assignment' && <UserPlus className="h-5 w-5 text-green-500" />}
                        {n.type === 'status_update' && <Edit2 className="h-5 w-5 text-blue-500" />}
                        {n.type === 'feedback' && <MessageSquare className="h-5 w-5 text-orange-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{n.subject}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{n.timestamp?.toDate?.()?.toLocaleString()}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setNotificationToDelete(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                )) : <p className="text-center py-8 text-muted-foreground italic">No notifications.</p>)}
              </CardContent>
            </Card>
          )}

          {(activeTab === 'students' || activeTab === 'teachers') && ((activeTab === 'students' && !allStudentInterests) || (activeTab === 'teachers' && !allTeacherInterests) ? (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>{activeTab === 'students' ? 'Student Inquiries' : 'Teacher Profiles'}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-tight">
                      <Clock className="h-3 w-3" /> Sorting: Pending first, oldest priority
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{filteredUsers.length} Found</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Details</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.length > 0 ? paginatedUsers.map(u => (
                        <TableRow key={u.id} className={`hover:bg-secondary/5 ${u.hasPending ? 'bg-primary/5' : ''}`}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>{u.firstName} {u.lastName}</span>
                                {u.hasPending && <Badge variant="default" className="text-[8px] h-4 bg-primary px-1.5 uppercase font-bold">NEW</Badge>}
                                {u.hasInProgress && <Badge variant="secondary" className="text-[8px] h-4 bg-blue-500 text-white px-1.5 uppercase font-bold">IN-PROGRESS</Badge>}
                                {u.hasCompleted && <Badge variant="secondary" className="text-[8px] h-4 bg-green-600 text-white px-1.5 uppercase font-bold">COMPLETED</Badge>}
                              </div>
                              <span className="sm:hidden text-[10px] text-muted-foreground">{u.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px]">{u.email}</span>
                                {u.oldestInquiryDate !== Infinity && (
                                   <span className="text-[9px] flex items-center gap-1 font-medium text-primary">
                                     <Clock className="h-2.5 w-2.5" /> {activeTab === 'students' ? 'First Inquiry:' : 'First Applied:'} {new Date(u.oldestInquiryDate).toLocaleDateString()}
                                   </span>
                                )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="h-8" onClick={() => { setSelectedUser(u); setIsDetailsOpen(true); }}>View {activeTab === 'students' ? 'Requests' : 'Profile'}</Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">No results found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-xs self-center font-medium">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {activeTab === 'settings' && <SystemSettingsLogs isAdmin={isAdmin} />}

          {activeTab === 'maintenance' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Database Maintenance</CardTitle>
                    <CardDescription>Purge test data and clear collections. Use with caution.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex gap-4 items-start mb-6">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-destructive">Danger Zone</h4>
                    <p className="text-xs text-muted-foreground">These actions are permanent.</p>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <PurgeCollectionButton 
                    collectionName="studentInterests" 
                    label="Clear Student Interests" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all student interests')}
                    isAdmin={isAdmin}
                  />
                  <PurgeCollectionButton 
                    collectionName="teacherInterests" 
                    label="Clear Teacher Interests" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all teacher interests')}
                    isAdmin={isAdmin}
                  />
                  <PurgeCollectionButton 
                    collectionName="matchProposals" 
                    label="Clear All Matches" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all match proposals')}
                    isAdmin={isAdmin}
                  />
                  <PurgeCollectionButton 
                    collectionName="notifications" 
                    label="Clear Notifications" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all notifications')}
                    isAdmin={isAdmin}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {selectedUser?.firstName[0]}{selectedUser?.lastName[0]}
              </div>
              <div>
                <p>{selectedUser?.firstName} {selectedUser?.lastName}</p>
                <p className="text-xs font-normal text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetailsContent user={selectedUser} isAdmin={isAdmin} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!notificationToDelete} onOpenChange={(open) => !open && setNotificationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Alert?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNotification} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
