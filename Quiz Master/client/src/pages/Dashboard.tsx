import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  BarChart3, 
  Clock, 
  Users, 
  Trophy,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import axios from "axios";

export function Dashboard() {
  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);

  const fetchQuizzes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await axios.get(`${baseURL}/api/get-quizzes?createdBy=${user?.email}`);
      if (response.status === 200) {
        setQuizzes(response.data);
        console.log("Quizzes",response.data)
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchAttempts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await axios.get(`${baseURL}/api/get-attempted-quizzes?userId=${user?._id}`);
      if (response.status === 200) {
        setAttempts(response.data);
        console.log("Quizzes Attempted",response.data)
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
  }, []);

  const averageScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
      : 0;

  const recentQuizzes = quizzes.slice(0, 3);
  const recentAttempts = attempts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {JSON.parse(localStorage.getItem("user") || "{}")?.name || "User"}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your quiz activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-quiz-gradient text-white border-0 shadow-quiz-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created Quizzes</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attempts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Last {attempts.length} attempts</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest quiz attempts and creations</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAttempts.length > 0 ? (
                <div className="space-y-4">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{attempt.title || "Unknown Quiz"}</p>
                        <p className="text-sm text-muted-foreground">
                          Completed {new Date(attempt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={attempt.score >= 80 ? 'default' : attempt.score >= 60 ? 'secondary' : 'destructive'}>
                        {attempt.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No quiz attempts yet</p>
                  <p className="text-sm">Take your first quiz to see activity here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {quizzes.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Recent Quizzes</CardTitle>
              <CardDescription>Quizzes you've created recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentQuizzes.map((quiz) => (
                  <div key={quiz._id} className="p-4 rounded-lg border bg-card">
                    <h3 className="font-semibold mb-2">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{quiz.questions.length} questions</span>
                      {quiz.timeLimit && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {quiz.timeLimit}m
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
