
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Send, LayoutDashboard, BrainCircuit, MessageSquare, History, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboard() {
  const { toast } = useToast();
  const [interest, setInterest] = useState('');
  const [interestsList, setInterestsList] = useState(['Mathematics', 'Computer Science']);
  const [feedback, setFeedback] = useState('');

  const handleSubmitInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interest) return;
    setInterestsList([...interestsList, interest]);
    setInterest('');
    toast({
      title: "Interest Submitted!",
      description: "Our AI matching engine is now looking for the best courses for you.",
    });
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    toast({
      title: "Feedback Received",
      description: "Thank you for helping us improve RP Coach-Up!",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-50">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-primary p-1 rounded-lg">
            <BookOpen className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">RP Coach-Up</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-3">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <BrainCircuit className="h-4 w-4" />
            My Matches
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <History className="h-4 w-4" />
            History
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" asChild>
            <a href="/">Logout</a>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold">Welcome back, Alex!</h1>
              <p className="text-muted-foreground">Manage your learning interests and view personalized matches.</p>
            </div>
            <Badge variant="outline" className="w-fit text-primary border-primary">Student Account</Badge>
          </header>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-muted w-full md:w-auto grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="interests">Submit Interests</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">Your Current Interests</CardTitle>
                    <CardDescription>Topics you&apos;ve expressed interest in learning.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {interestsList.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm py-1.5 px-3">
                        {item}
                      </Badge>
                    ))}
                    {interestsList.length === 0 && (
                      <p className="text-muted-foreground text-sm">No interests added yet.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">Suggested Matches</CardTitle>
                    <CardDescription>AI-generated matches based on your profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">Advanced Web Dev</h4>
                        <p className="text-xs text-muted-foreground">Taught by Dr. Emily Stone</p>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">98% Match</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer opacity-80">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">Modern Mathematics</h4>
                        <p className="text-xs text-muted-foreground">Taught by Prof. Aris</p>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">85% Match</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full text-primary" size="sm">View all matches</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="interests">
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                  <CardTitle>What do you want to learn next?</CardTitle>
                  <CardDescription>
                    Describe your learning goals, preferred subjects, or specific topics you need help with.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitInterest}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="interest-input">Interest / Subject Name</Label>
                      <Input 
                        id="interest-input" 
                        placeholder="e.g. Quantum Physics, React Development, Academic Writing" 
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="details">Additional Details (Optional)</Label>
                      <Textarea id="details" placeholder="Tell us more about your current level or specific needs..." className="min-h-[100px]" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full gap-2">
                      <Send className="h-4 w-4" />
                      Submit Interest
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                  <CardTitle>Share your Feedback</CardTitle>
                  <CardDescription>
                    Help us improve RP Coach-Up. Your feedback goes directly to our administration team.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitFeedback}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select id="category" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Platform Experience</option>
                        <option>Course Quality</option>
                        <option>Teacher Match</option>
                        <option>Technical Issue</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Type your feedback here..." 
                        className="min-h-[150px]" 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      Send Feedback
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function Label({ children, ...props }: any) {
  return <label className="text-sm font-medium leading-none" {...props}>{children}</label>;
}
