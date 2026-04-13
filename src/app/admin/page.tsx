
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
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { matchStudentsTeachersCourses } from '@/ai/flows/admin-course-teacher-matching';

// Mock data for initial view
const mockStudents = [
  { id: 's1', name: 'Alex Johnson', interests: ['Quantum Physics', 'Mathematics'], status: 'Active' },
  { id: 's2', name: 'Maria Garcia', interests: ['Web Development', 'UI Design'], status: 'Pending' }
];

const mockTeachers = [
  { id: 't1', name: 'Prof. Miller', skills: ['Mathematics', 'Physics'], availability: 'Weekdays 5-9PM' },
  { id: 't2', name: 'Dr. Emily Stone', skills: ['Web Dev', 'Data Science'], availability: 'Flexible' }
];

const mockCourses = [
  { id: 'c1', title: 'Advanced Calculus', description: 'Deep dive into limits and integrals.' },
  { id: 'c2', title: 'Fullstack React', description: 'Modern web development with Next.js.' }
];

export default function AdminPortal() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  const handleRunAiMatching = async () => {
    setIsMatching(true);
    try {
      // Use the pre-defined flow
      const result = await matchStudentsTeachersCourses({
        students: mockStudents.map(s => ({ studentId: s.id, interests: s.interests })),
        teachers: mockTeachers.map(t => ({ teacherId: t.id, teachingInterests: t.skills, availability: t.availability })),
        courses: mockCourses.map(c => ({ courseId: c.id, title: c.title, description: c.description }))
      });
      
      setMatches(result.matches);
      setActiveTab('matches');
      toast({
        title: "Matching Complete",
        description: "AI has successfully generated resource allocation suggestions.",
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
          <Button variant="outline" className="w-full" asChild>
            <a href="/">Logout Portal</a>
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
              disabled={isMatching}
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
                  <CardDescription>Create, update, or remove student and teacher accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell><Badge variant="outline">Student</Badge></TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1.5 text-xs">
                              {student.status === 'Active' ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <AlertCircle className="h-3 w-3 text-yellow-500" />}
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {mockTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell><Badge variant="secondary">Teacher</Badge></TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1.5 text-xs text-green-500">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                          Student: {mockStudents.find(s => s.id === match.studentId)?.name || match.studentId}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {match.teacherId && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">Teacher:</span>
                            <span>{mockTeachers.find(t => t.id === match.teacherId)?.name || match.teacherId}</span>
                          </div>
                        )}
                        {match.courseId && (
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="font-medium">Course:</span>
                            <span>{mockCourses.find(c => c.id === match.courseId)?.title || match.courseId}</span>
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
                <p className="text-sm text-muted-foreground">General settings interface would be here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
