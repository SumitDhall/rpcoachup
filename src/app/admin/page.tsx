
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
  BookOpen, 
  Users, 
  Settings, 
  Loader2,
  UserCheck,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';

export default function AdminPortal() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('users');

  // Fetch real users from Firestore
  const usersQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'), limit(50));
  }, [db]);
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

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
                              <Button variant="ghost" size="sm">Details</Button>
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
    </div>
  );
}
