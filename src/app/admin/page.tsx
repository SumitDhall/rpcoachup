
"use client"

import { useState } from 'react';
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
  User
} from 'lucide-react';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, limit, doc } from 'firebase/firestore';

// Component to fetch and display role-specific details
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

  if (!details) {
    return <p className="text-sm text-muted-foreground italic">No detailed profile information found.</p>;
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        {userType === 'Student' ? <BookMarked className="h-4 w-4" /> : <Award className="h-4 w-4" />}
        {userType} Specific Information
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {userType === 'Student' ? (
          <div className="bg-secondary/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Grade Level</p>
            <p className="font-medium">{details.gradeLevel || 'Not specified'}</p>
          </div>
        ) : (
          <>
            <div className="bg-secondary/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Experience</p>
              <p className="font-medium">{details.experienceYears || 0} Years</p>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Qualifications</p>
              <p className="font-medium whitespace-pre-wrap">{details.qualifications || 'Not specified'}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch real users from Firestore
  const usersQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'), limit(50));
  }, [db]);
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

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
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
            Logout Portal
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-headline font-bold">Admin Portal</h1>
              <p className="text-muted-foreground">Monitor platform activity and manage user accounts.</p>
            </div>
          </header>

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

          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>Manage global settings and administrative controls.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Global configuration for platform operations and administrative visibility.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Profile Details
            </DialogTitle>
            <DialogDescription>
              Viewing comprehensive information for platform account.
            </DialogDescription>
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

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined:</span>
                    <span>{selectedUser.createdAt?.toDate ? selectedUser.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-[10px] bg-secondary px-1 rounded">{selectedUser.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Role-Specific Content */}
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
