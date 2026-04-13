
"use client"

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  DialogDescription,
  DialogFooter,
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
  Users, 
  Settings, 
  Loader2,
  UserCheck,
  GraduationCap,
  Mail,
  Calendar,
  Award,
  BookMarked,
  User,
  ClipboardList,
  Clock,
  Trash2,
  LogOut,
  ShieldAlert,
  Phone,
  School,
  MapPin,
  DollarSign,
  Bell,
  CheckCircle2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Briefcase,
  FileText,
  IndianRupee,
  Download
} from 'lucide-react';
import { useAuth, useFirestore, useCollection, useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, limit, doc, where, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

// Component to fetch and display role-specific profile details and interests
function UserDetailsContent({ userId, userType }: { userId: string; userType: string }) {
  const db = useFirestore();
  const { toast } = useToast();
  const [statusChangeTarget, setStatusChangeTarget] = useState<{id: string, currentStatus: string, collection: string} | null>(null);
  
  const profilePath = userType === 'Student' 
    ? `users/${userId}/studentProfile/studentProfile` 
    : `users/${userId}/teacherProfile/teacherProfile`;

  const docRef = useMemoFirebase(() => {
    return doc(db, profilePath);
  }, [db, profilePath]);

  const { data: details, isLoading: isLoadingProfile, error: profileError } = useDoc(docRef);

  // Fetch interests related to this user
  const interestCollection = userType === 'Student' ? 'studentInterests' : 'teacherInterests';
  const interestField = userType === 'Student' ? 'studentId' : 'teacherId';
  
  const interestsQuery = useMemoFirebase(() => {
    return query(
      collection(db, interestCollection), 
      where(interestField, '==', userId),
      limit(50)
    );
  }, [db, userId, interestCollection, interestField]);

  const { data: interests, isLoading: isLoadingInterests, error: interestsError } = useCollection(interestsQuery);

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
        description: "The original file content was not found for this record.",
      });
      return;
    }

    try {
      // The dataUrl is already the correctly encoded data from the teacher's upload
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Complete",
        description: `Successfully retrieved ${fileName}.`,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while attempting to reconstruct the file.",
      });
    }
  };

  if (isLoadingProfile || isLoadingInterests) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (profileError || interestsError) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
        <p className="font-bold">Error loading profile data</p>
        <p>You may not have sufficient permissions or the profile might not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Role Specific Info - Only for Students now per requirements */}
      {userType === 'Student' && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            Account Summary
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-secondary/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Registered Grade Level</p>
              <p className="font-medium">{details?.gradeLevel || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Interests List */}
      <div className={`space-y-4 ${userType === 'Teacher' ? 'pt-4 border-t' : ''}`}>
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
           {userType === 'Student' ? 'Tuition Requirements' : 'Professional Specializations'}
        </h4>
        {interests && interests.length > 0 ? (
          <div className="space-y-3">
            {[...interests].sort((a,b) => (b.submissionDate?.toMillis?.() || 0) - (a.submissionDate?.toMillis?.() || 0)).map((int: any) => (
              <div key={int.id} className="p-4 border rounded-xl bg-card hover:border-primary/30 transition-colors shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-bold text-primary">{int.subject || int.subjects || 'General Interest'}</span>
                  <button 
                    onClick={() => setStatusChangeTarget({ id: int.id, currentStatus: int.status, collection: interestCollection })}
                    className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
                  >
                    <Badge 
                      variant={int.status === 'Pending' ? 'outline' : 'default'} 
                      className={`text-[10px] cursor-pointer gap-1 py-1 px-2 ${int.status === 'Completed' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
                      {int.status === 'Completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {int.status}
                    </Badge>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium text-xs">Name: {int.studentName || int.teacherName}</span>
                  </div>
                  {int.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{int.phone}</span>
                    </div>
                  )}

                  {userType === 'Student' && (
                    <>
                      {int.school && (
                        <div className="flex items-center gap-2">
                          <School className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">School: {int.school} ({int.gradeOrClass})</span>
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

                  {userType === 'Teacher' && (
                    <>
                      {int.qualifications && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">Edu: {int.qualifications}</span>
                        </div>
                      )}
                      {int.experienceYears && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">Exp: {int.experienceYears}</span>
                        </div>
                      )}
                      {int.hoursPerWeek && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">Commitment: {int.hoursPerWeek}</span>
                        </div>
                      )}
                      {int.resumeName && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-[10px] text-green-700 font-bold uppercase">Attached Resume</p>
                              <p className="text-xs text-green-800 font-medium truncate max-w-[200px]">{int.resumeName}</p>
                            </div>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-green-700 hover:bg-green-100"
                            onClick={() => handleDownloadResume(int.resumeName, int.resumeData)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {(int.affordableRange || int.expectedSalary) && (
                    <div className="flex items-center gap-2 text-accent mt-1">
                      <IndianRupee className="h-3 w-3" />
                      <span className="text-xs font-bold">{int.affordableRange || `Salary Expectation: ${int.expectedSalary}`}</span>
                    </div>
                  )}
                </div>

                {int.notes && (
                  <div className="bg-secondary/20 p-2 rounded-lg text-xs italic text-muted-foreground">
                    "{int.notes}"
                  </div>
                )}
                
                <p className="text-[10px] text-muted-foreground text-right">
                  Submitted on: {int.submissionDate?.toDate?.()?.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic bg-secondary/20 p-4 rounded-lg text-center">
            No interests have been submitted yet.
          </p>
        )}
      </div>

      <AlertDialog open={!!statusChangeTarget} onOpenChange={(open) => !open && setStatusChangeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {statusChangeTarget?.currentStatus === 'Pending' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <RotateCcw className="h-5 w-5 text-primary" />}
              Update Submission Status?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will change the status of this requirement from <strong>{statusChangeTarget?.currentStatus}</strong> to <strong>{statusChangeTarget?.currentStatus === 'Pending' ? 'Completed' : 'Pending'}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusToggle} className={statusChangeTarget?.currentStatus === 'Pending' ? 'bg-green-600 hover:bg-green-700' : ''}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
  const [mounted, setMounted] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (activeTab === 'students') return users.filter(u => u.userType === 'Student');
    if (activeTab === 'teachers') return users.filter(u => u.userType === 'Teacher');
    return [];
  }, [users, activeTab]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Verifying Administrative Access...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminDoc) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You do not have administrative permissions to view this portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            If you believe this is an error, please ensure your account UID is registered in the <code>roles_admin</code> collection.
          </CardContent>
          <div className="p-6 pt-0 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleSignOut}>Sign Out</Button>
            <Button className="flex-1" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const sortedNotifications = [...(notifications || [])].sort((a, b) => {
    const timeA = a.timestamp?.toDate?.() || 0;
    const timeB = b.timestamp?.toDate?.() || 0;
    return timeB - timeA;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-primary p-1 rounded-lg">
            <BookOpen className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
          <Badge variant="outline" className="text-[10px] ml-auto">ADMIN</Badge>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Button 
            variant={activeTab === 'notifications' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-4 w-4" />
            Notifications
            {notifications && notifications.length > 0 && (
              <Badge className="ml-auto" variant="destructive">{notifications.length}</Badge>
            )}
          </Button>
          <Button 
            variant={activeTab === 'students' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => {
                setActiveTab('students');
                setCurrentPage(1);
            }}
          >
            <UserCheck className="h-4 w-4" />
            Manage Students
          </Button>
          <Button 
            variant={activeTab === 'teachers' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => {
                setActiveTab('teachers');
                setCurrentPage(1);
            }}
          >
            <GraduationCap className="h-4 w-4" />
            Manage Teachers
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4" />
            System Settings
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full gap-2 text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-headline font-bold">Admin Portal</h1>
                <p className="text-muted-foreground">Monitor platform activity and manage system alerts.</p>
              </div>
            </div>
          </header>

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Notifications</CardTitle>
                  <CardDescription>Real-time alerts for registrations and interest submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingNotifications ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                  ) : sortedNotifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground italic">No notifications yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {sortedNotifications.map((n) => (
                        <div key={n.id} className="group relative flex flex-col gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <div className={`p-2 rounded-lg ${n.type === 'registration' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent-foreground'}`}>
                                {n.type === 'registration' ? <UserCheck className="h-5 w-5" /> : <ClipboardList className="h-5 w-5" />}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">{n.subject}</h4>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {mounted && n.timestamp?.toDate ? n.timestamp.toDate().toLocaleString() : 'Recent'}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                              onClick={() => setNotificationToDelete(n.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap pl-11">{n.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab === 'students' || activeTab === 'teachers') && (
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b">
                  <div>
                    <CardTitle>{activeTab === 'students' ? 'Manage Students' : 'Manage Teachers'}</CardTitle>
                    <CardDescription>View and manage registered {activeTab === 'students' ? 'student' : 'teacher'} accounts.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoadingUsers ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                  ) : (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <Table id="users-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Full Name</TableHead>
                              <TableHead>Email Address</TableHead>
                              <TableHead>Account Type</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedUsers.map((u) => (
                              <TableRow key={u.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {u.userType === 'Student' ? <UserCheck className="h-4 w-4 text-primary" /> : <GraduationCap className="h-4 w-4 text-accent" />}
                                    </span>
                                    {u.firstName} {u.lastName}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                <TableCell>
                                  <Badge variant={u.userType === 'Student' ? 'outline' : 'secondary'}>
                                      {u.userType}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewDetails(u)}
                                  >
                                    View Profile
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t mt-4">
                        <p className="text-sm text-muted-foreground">
                          Displaying {paginatedUsers.length} of {totalUsers} registered {activeTab}
                        </p>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="gap-2"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <div className="flex items-center gap-1 min-w-[100px] justify-center text-sm font-medium">
                            <span>Page {currentPage}</span>
                            <span className="text-muted-foreground">/ {totalPages}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="gap-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Comprehensive User Profile
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                  </div>
                  <Badge className="px-3 py-1 text-sm">
                    {selectedUser.userType}
                  </Badge>
                </div>
              </div>

              <UserDetailsContent 
                userId={selectedUser.id} 
                userType={selectedUser.userType} 
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close Portal View</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!notificationToDelete} onOpenChange={(open) => !open && setNotificationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notification record from the platform database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNotification} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
