
"use client"

import { useState } from 'react';
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
  BookOpen, 
  Users, 
  BrainCircuit, 
  Settings, 
  LayoutDashboard, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { matchStudentsTeachersCourses } from '@/ai/flows/admin-course-teacher-matching';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';

export default function AdminPortal() {
  const { toast } = useToast();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState('users');
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  // Fetch real users from Firestore
  const usersQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'), limit(50));
  }, [db]);
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  // Fetch real programs for matching context
  const programsQuery = useMemoFirebase(() => {
    return query(collection(db, 'programs'), limit(20));
  }, [db]);
  const { data: programs } = useCollection(programsQuery);

  // Fetch student interests
  const interestsQuery = useMemoFirebase(() => {
    return query(collection(db, 'studentInterests'), limit(50));
  }, [db]);
  const { data: interests } = useCollection(interestsQuery);

  const handleRunAiMatching = async () => {
    if (!users || !programs || !interests) {
      toast({ title: "Insufficient Data", description: "Not enough data to run matching." });
      return;
    }

    setIsMatching(true);
    try {
      const students = users
        .filter(u => u.userType === 'Student')
        .map(s => ({
          studentId: s.id,
          interests: interests.filter(i => i.studentId === s.id).map(i => i.subject)
        }));

      const teachers = users
        .filter(u => u.userType === 'Teacher')
        .map(t => ({
          teacherId: t.id,
          teachingInterests: [], // This would ideally come from teacherProfile subcollection
          availability: 'Flexible'
        }));

      const courses = programs.map(p => ({
        courseId: p.id,
        title: p.name,
        description: p.description
      }));

      const result = await matchStudentsTeachersCourses({
        students,
        teachers,
        courses
      });
      
      setMatches(result.matches);
      setActiveTab('matches');
      toast({
        title: "Matching Complete",
        description: `AI has suggested ${result.matches.length} matches.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Matching Failed",
        description: "There was an error connecting to the AI service.",
      });
    } finally {
      setIsMatching(false);
    }
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
            variant={activeTab === 'matches' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveTab('matches')}
          >
            <BrainCircuit className="h-4 w-4" />
            AI Matches
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
              <p className="text-muted-foreground">Monitor platform activity and optimize resource matching.</p>
            </div>
            <Button 
              onClick={handleRunAiMatching} 
              disabled={isMatching || isLoadingUsers}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg font-bold"
            >
              {isMatching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Run AI Matcher
            </Button>
          </header>

          {activeTab === 'users' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Accounts Management</CardTitle>
                  <CardDescription>View all registered students and teachers.</CardDescription>
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

          {activeTab === 'matches' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-headline font-bold">AI Recommended Matches</h2>
              {matches.length === 0 ? (
                <div className="text-center p-20 border-2 border-dashed rounded-3xl bg-secondary/20">
                  <BrainCircuit className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No matches generated yet. Click "Run AI Matcher" above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.map((match, i) => (
                    <Card key={i} className="border-accent/20 hover:border-accent transition-colors shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-primary">Suggestion {i + 1}</Badge>
                          <Sparkles className="h-4 w-4 text-accent" />
                        </div>
                        <CardTitle className="text-lg mt-2">
                          Student ID: {match.studentId}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {match.teacherId && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">Suggested Teacher:</span>
                            <span>{match.teacherId}</span>
                          </div>
                        )}
                        {match.courseId && (
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="font-medium">Suggested Course:</span>
                            <span>{match.courseId}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed italic mt-2">
                          &quot;{match.reason}&quot;
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full text-xs h-8">Approve Match</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>Manage global settings and AI parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Global configuration for matching algorithms and administrative controls.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
