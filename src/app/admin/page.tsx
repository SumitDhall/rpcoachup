
"use client"

import { useState, useEffect } from 'react';
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
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth, useFirestore, useCollection, useDoc, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, limit, doc, where, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Component to fetch and display role-specific profile details and interests
function UserDetailsContent({ userId, userType }: { userId: string; userType: string }) {
  const db = useFirestore();
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
      {/* Role Specific Info */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          {userType === 'Student' ? <BookMarked className="h-4 w-4" /> : <Award className="h-4 w-4" />}
          Base Account Information
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {userType === 'Student' ? (
            <div className="bg-secondary/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Registered Grade Level</p>
              <p className="font-medium">{details?.gradeLevel || 'Not specified'}</p>
            </div>
          ) : (
            <>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-medium">{details?.experienceYears || 0} Years</p>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Qualifications</p>
                <p className="font-medium whitespace-pre-wrap">{details?.qualifications || 'Not specified'}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Interests List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
           Tuition Interests / Raised Requirements
        </h4>
        {interests && interests.length > 0 ? (
          <div className="space-y-3">
            {[...interests].sort((a,b) => (b.submissionDate?.toMillis?.() || 0) - (a.submissionDate?.toMillis?.() || 0)).map((int: any) => (
              <div key={int.id} className="p-4 border rounded-xl bg-card hover:border-primary/30 transition-colors shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-bold text-primary">{int.subject}</span>
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
                
                {userType === 'Student' && (
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium text-xs">Student: {int.studentName}</span>
                    </div>
                    {int.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{int.phone}</span>
                      </div>
                    )}
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
                    {int.affordableRange && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">Budget: {int.affordableRange}</span>
                      </div>
                    )}
                    {int.intendedStartDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">Start Date: {int.intendedStartDate}</span>
                      </div>
                    )}
                  </div>
                )}

                {int.availability && (
                  <p className="text-xs font-medium text-accent flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Availability: {int.availability}
                  </p>
                )}

                {int.notes && (
                  <div className="bg-secondary/20 p-2 rounded-lg text-xs italic text-muted-foreground">
                    "{int.notes}"
                  </div>
                )}
                
                <p className="text-[10px] text-muted-foreground text-right">
                  Raised on: {int.submissionDate?.toDate?.()?.toLocaleDateString()}
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

      {/* Confirmation Dialog for Status Change */}
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin access check via sentinel collection
  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'roles_admin', user.uid);
  }, [db, user?.uid]);
  const { data: adminDoc, isLoading: isAdminLoading } = useDoc(adminDocRef);

  // Queries are only enabled if the user is verified as an admin
  const usersQuery = useMemoFirebase(() => {
    if (!db || !adminDoc) return null;
    return query(collection(db, 'users'), limit(50));
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

  const handlePrint = () => {
    window.print();
  };

  // Wait for auth to initialize
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

  // Redirect if not admin (and not loading)
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

  // Pagination logic
  const totalUsers = users?.length || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const paginatedUsers = users?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];

  return (
    <div className="flex min-h-screen bg-background">
      <style jsx global>{`
        @media print {
          aside, header, .no-print, button, .pagination-controls {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .printable-area {
            display: block !important;
            border: none !important;
            box-shadow: none !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #ddd !important;
            padding: 8px !important;
            text-align: left !important;
          }
          .printable-header {
            display: block !important;
            margin-bottom: 20px !important;
            text-align: center !important;
          }
        }
        .printable-header {
          display: none;
        }
      `}</style>

      {/* Admin Sidebar */}
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
            variant={activeTab === 'users' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4" />
            Manage Users
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

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between no-print">
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

          {activeTab === 'users' && (
            <div className="space-y-6">
              <Card className="printable-area">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                  <div>
                    <CardTitle>User Accounts Management</CardTitle>
                    <CardDescription className="no-print">View and manage all registered students and teachers.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handlePrint} className="no-print gap-2">
                    <Printer className="h-4 w-4" />
                    Print Current Page
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="printable-header">
                    <h2 className="text-xl font-bold">RP Coach-Up User Accounts Report</h2>
                    <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages} | Generated on {new Date().toLocaleDateString()}</p>
                  </div>

                  {isLoadingUsers ? (
                    <div className="flex justify-center p-8 no-print"><Loader2 className="h-8 w-8 animate-spin" /></div>
                  ) : (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <Table id="users-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead className="text-right no-print">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedUsers.map((u) => (
                              <TableRow key={u.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span className="no-print">
                                      {u.userType === 'Student' ? <UserCheck className="h-4 w-4 text-primary" /> : <GraduationCap className="h-4 w-4 text-accent" />}
                                    </span>
                                    {u.firstName} {u.lastName}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground whitespace-nowrap">{u.email}</TableCell>
                                <TableCell>
                                  <Badge variant={u.userType === 'Student' ? 'outline' : 'secondary'}>
                                    {u.userType}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap no-print">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewDetails(u)}
                                  >
                                    Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center justify-between no-print pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Showing {paginatedUsers.length} of {totalUsers} users
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <span className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="gap-1"
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

      {/* User Details Dialog */}
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

      {/* Notification Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!notificationToDelete} onOpenChange={(open) => !open && setNotificationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notification record from the platform.
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
