
"use client"

import { useState, useEffect } from 'react';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
  AlertCircle,
  Bell,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, limit, doc, where, deleteDoc } from 'firebase/firestore';

// Component to fetch and display role-specific profile details
function UserRoleDetails({ userId, userType }: { userId: string; userType: string }) {
  const db = useFirestore();
  
  const profilePath = userType === 'Student' 
    ? `users/${userId}/studentProfile/studentProfile` 
    : `users/${userId}/teacherProfile/teacherProfile`;

  const docRef = useMemoFirebase(() => {
    return doc(db, profilePath);
  }, [db, profilePath]);

  const { data: details, isLoading } = useDoc(docRef);

  if (isLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          {userType === 'Student' ? <BookMarked className="h-4 w-4" /> : <Award className="h-4 w-4" />}
          {userType} Specific Information
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {userType === 'Student' ? (
            <div className="bg-secondary/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Grade Level</p>
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
    </div>
  );
}

export default function AdminPortal() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('notifications');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const usersQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'), limit(50));
  }, [db]);
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  const notificationsQuery = useMemoFirebase(() => {
    return query(collection(db, 'notifications'), limit(50));
  }, [db]);
  const { data: notifications, isLoading: isLoadingNotifications } = useCollection(notificationsQuery);

  const handleDeleteNotification = (id: string) => {
    deleteDoc(doc(db, 'notifications', id));
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const sortedNotifications = [...(notifications || [])].sort((a, b) => {
    const timeA = a.timestamp?.toDate?.() || 0;
    const timeB = b.timestamp?.toDate?.() || 0;
    return timeB - timeA;
  });

  return (
    <div className="flex min-h-screen bg-background">
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
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Logout Portal</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="rounded-full lg:hidden" asChild>
                <Link href="/"><ArrowLeft className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 items-center text-muted-foreground hover:text-primary transition-colors" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Website
                </Link>
              </Button>
              <div className="h-8 w-px bg-border hidden lg:block mx-2" />
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
                              onClick={() => handleDeleteNotification(n.id)}
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
              <Card>
                <CardHeader>
                  <CardTitle>User Accounts Management</CardTitle>
                  <CardDescription>View and manage all registered students and teachers.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users?.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {u.userType === 'Student' ? <UserCheck className="h-4 w-4 text-primary" /> : <GraduationCap className="h-4 w-4 text-accent" />}
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
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Profile Details
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

              <UserRoleDetails 
                userId={selectedUser.id} 
                userType={selectedUser.userType} 
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
