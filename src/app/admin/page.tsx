
"use client"

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  BookOpen, 
  Settings, 
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
  User
} from 'lucide-react';
import { useAuth, useFirestore, useCollection, useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, limit, doc, where, deleteDoc, serverTimestamp, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

// Helper to log system events
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

// Component to handle student assignments for a teacher
function StudentAssignmentManager({ teacherId, teacherName }: { teacherId: string; teacherName: string }) {
  const db = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const studentsQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'), where('userType', '==', 'Student'), limit(100));
  }, [db]);
  const { data: students, isLoading: isLoadingStudents } = useCollection(studentsQuery);

  const matchesQuery = useMemoFirebase(() => {
    return query(collection(db, 'matchProposals'), where('teacherId', '==', teacherId));
  }, [db, teacherId]);
  const { data: currentMatches, isLoading: isLoadingMatches } = useCollection(matchesQuery);

  const matchedStudentIds = useMemo(() => {
    return new Set(currentMatches?.map(m => m.studentId) || []);
  }, [currentMatches]);

  const handleAssignStudent = (student: any) => {
    const studentFullName = `${student.firstName} ${student.lastName}`;
    const matchData = {
      teacherId,
      teacherName,
      studentId: student.id,
      studentName: studentFullName,
      assignedAt: serverTimestamp(),
      status: 'active'
    };
    
    addDocumentNonBlocking(collection(db, 'matchProposals'), matchData);
    logSystemEvent(db, adminUser, 'assignment', `Assigned Student: ${studentFullName} to Teacher: ${teacherName}`);
    
    toast({
      title: "Student Assigned",
      description: `Successfully matched ${student.firstName} with ${teacherName}.`,
    });
  };

  const handleUnassignStudent = (studentId: string) => {
    const matchToDelete = currentMatches?.find(m => m.studentId === studentId);
    if (matchToDelete) {
      deleteDocumentNonBlocking(doc(db, 'matchProposals', matchToDelete.id));
      logSystemEvent(db, adminUser, 'unassignment', `Removed Student: ${matchToDelete.studentName} from Teacher: ${teacherName}`);
      
      toast({
        title: "Student Unassigned",
        description: "The match has been removed.",
      });
    }
  };

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(s => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  if (isLoadingStudents || isLoadingMatches) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4 pt-6 border-t mt-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Assign Students
        </h4>
        <Badge variant="secondary" className="font-normal">
          {matchedStudentIds.size} Assigned
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search students..." 
          className="pl-9 h-9 text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const isAssigned = matchedStudentIds.has(student.id);
            return (
              <div key={student.id} className="flex items-center justify-between p-2 rounded-lg border bg-secondary/5">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isAssigned ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{student.firstName} {student.lastName}</p>
                    <p className="text-[10px] text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                {isAssigned ? (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 text-destructive"
                    onClick={() => handleUnassignStudent(student.id)}
                  >
                    <UserMinus className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-primary"
                    onClick={() => handleAssignStudent(student)}
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center py-4 text-xs text-muted-foreground italic">No students found.</p>
        )}
      </div>
    </div>
  );
}

// Component to handle teacher assignments for a student
function TeacherAssignmentManager({ studentId, studentName }: { studentId: string; studentName: string }) {
  const db = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const teachersQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'), where('userType', '==', 'Teacher'), limit(100));
  }, [db]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection(teachersQuery);

  const matchesQuery = useMemoFirebase(() => {
    return query(collection(db, 'matchProposals'), where('studentId', '==', studentId));
  }, [db, studentId]);
  const { data: currentMatches, isLoading: isLoadingMatches } = useCollection(matchesQuery);

  const matchedTeacherIds = useMemo(() => {
    return new Set(currentMatches?.map(m => m.teacherId) || []);
  }, [currentMatches]);

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
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  if (isLoadingTeachers || isLoadingMatches) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4 pt-6 border-t mt-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Assign Teachers
        </h4>
        <Badge variant="secondary" className="font-normal">
          {matchedTeacherIds.size} Assigned
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search teachers..." 
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
          <p className="text-center py-4 text-xs text-muted-foreground italic">No teachers found.</p>
        )}
      </div>
    </div>
  );
}

// Component to fetch and display role-specific profile details and interests
function UserDetailsContent({ user }: { user: any }) {
  const db = useFirestore();
  const { toast } = useToast();
  const [statusChangeTarget, setStatusChangeTarget] = useState<{id: string, currentStatus: string, collection: string} | null>(null);
  
  const profilePath = user.userType === 'Student' 
    ? `users/${user.id}/studentProfile/studentProfile` 
    : `users/${user.id}/teacherProfile/teacherProfile`;

  const docRef = useMemoFirebase(() => {
    return doc(db, profilePath);
  }, [db, profilePath]);

  const { data: details, isLoading: isLoadingProfile } = useDoc(docRef);

  const interestCollection = user.userType === 'Student' ? 'studentInterests' : 'teacherInterests';
  const interestField = user.userType === 'Student' ? 'studentId' : 'teacherId';
  
  const interestsQuery = useMemoFirebase(() => {
    return query(
      collection(db, interestCollection), 
      where(interestField, '==', user.id),
      limit(50)
    );
  }, [db, user.id, interestCollection, interestField]);

  const { data: interests, isLoading: isLoadingInterests } = useCollection(interestsQuery);

  const handleStatusToggle = () => {
    if (!statusChangeTarget) return;
    
    const newStatus = statusChangeTarget.currentStatus === 'Pending' ? 'Completed' : 'Pending';
    const interestRef = doc(db, statusChangeTarget.collection, statusChangeTarget.id);
    
    updateDocumentNonBlocking(interestRef, { status: newStatus });
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
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while downloading the file.",
      });
    }
  };

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
                    onClick={() => setStatusChangeTarget({ id: int.id, currentStatus: int.status, collection: interestCollection })}
                    className="focus:outline-none"
                  >
                    <Badge 
                      variant={int.status === 'Pending' ? 'outline' : 'default'} 
                      className={`text-[10px] cursor-pointer ${int.status === 'Completed' ? 'bg-green-600' : ''}`}
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

      {user.userType === 'Student' ? (
        <TeacherAssignmentManager studentId={user.id} studentName={`${user.firstName} ${user.lastName}`} />
      ) : (
        <StudentAssignmentManager teacherId={user.id} teacherName={`${user.firstName} ${user.lastName}`} />
      )}

      <AlertDialog open={!!statusChangeTarget} onOpenChange={(open) => !open && setStatusChangeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this submission as <strong>{statusChangeTarget?.currentStatus === 'Pending' ? 'Completed' : 'Pending'}</strong>?
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

function PurgeCollectionButton({ collectionName, label, onPurge }: { collectionName: string, label: string, onPurge: () => void }) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isPurging, setIsPurging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePurge = async () => {
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

function SystemSettingsLogs() {
  const db = useFirestore();
  const logsQuery = useMemoFirebase(() => {
    return query(collection(db, 'systemLogs'), orderBy('timestamp', 'desc'), limit(100));
  }, [db]);
  const { data: logs, isLoading } = useCollection(logsQuery);

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

  const usersQuery = useMemoFirebase(() => {
    if (!db || !adminDoc) return null;
    return query(collection(db, 'users'), limit(500));
  }, [db, adminDoc]);
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !adminDoc) return null;
    return query(collection(db, 'notifications'), limit(50));
  }, [db, adminDoc]);
  const { data: notifications, isLoading: isLoadingNotifications } = useCollection(notificationsQuery);

  const handleDeleteNotification = async () => {
    if (notificationToDelete) {
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
    if (activeTab === 'students') return users.filter(u => u.userType === 'Student');
    if (activeTab === 'teachers') return users.filter(u => u.userType === 'Teacher');
    return [];
  }, [users, activeTab]);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !adminDoc) {
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

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="p-6 flex items-center gap-2">
          <BookOpen className="text-primary h-6 w-6" />
          <span className="font-headline font-bold text-lg">RP Coach-Up</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Button variant={activeTab === 'notifications' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('notifications')}>
            <Bell className="h-4 w-4" /> Notifications
          </Button>
          <Button variant={activeTab === 'students' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('students')}>
            <UserCheck className="h-4 w-4" /> Students
          </Button>
          <Button variant={activeTab === 'teachers' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('teachers')}>
            <GraduationCap className="h-4 w-4" /> Teachers
          </Button>
          <Button variant={activeTab === 'settings' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('settings')}>
            <History className="h-4 w-4" /> Activity Logs
          </Button>
          <Button variant={activeTab === 'maintenance' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('maintenance')}>
            <Database className="h-4 w-4" /> Maintenance
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-headline font-bold">Admin Portal</h1>

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {isLoadingNotifications ? <Loader2 className="animate-spin mx-auto" /> : (notifications && notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="flex items-start justify-between p-4 border rounded-xl bg-card">
                    <div className="flex gap-3">
                      {n.type === 'registration' ? <UserCheck className="h-5 w-5 text-primary" /> : <ClipboardList className="h-5 w-5 text-accent" />}
                      <div>
                        <h4 className="font-bold text-sm">{n.subject}</h4>
                        <p className="text-xs text-muted-foreground">{n.body}</p>
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
              <CardHeader>
                <CardTitle>{activeTab === 'students' ? 'Students' : 'Teachers'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>{u.firstName} {u.lastName}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(u); setIsDetailsOpen(true); }}>Profile</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-xs self-center">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && <SystemSettingsLogs />}

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
                    <p className="text-xs text-muted-foreground">These actions are permanent. Use them only when you need to "clean" the database for fresh test cycles. Note: User accounts themselves (Authentication) must be deleted via the Firebase Console.</p>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <PurgeCollectionButton 
                    collectionName="studentInterests" 
                    label="Clear Student Interests" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all student interests')}
                  />
                  <PurgeCollectionButton 
                    collectionName="teacherInterests" 
                    label="Clear Teacher Interests" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all teacher interests')}
                  />
                  <PurgeCollectionButton 
                    collectionName="matchProposals" 
                    label="Clear All Matches" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all match proposals')}
                  />
                  <PurgeCollectionButton 
                    collectionName="notifications" 
                    label="Clear Notifications" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all notifications')}
                  />
                  <PurgeCollectionButton 
                    collectionName="systemLogs" 
                    label="Clear Activity Logs" 
                    onPurge={() => logSystemEvent(db, user, 'maintenance', 'Purged all system logs')}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><CardTitle>{selectedUser?.firstName}'s Profile</CardTitle></DialogHeader>
          {selectedUser && <UserDetailsContent user={selectedUser} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!notificationToDelete} onOpenChange={(open) => !open && setNotificationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Alert?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNotification} className="bg-destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
