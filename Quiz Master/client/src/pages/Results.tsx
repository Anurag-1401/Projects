import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {Play} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Link} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import axios from "axios";

export default function Results() {
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const [attempts, setAttempts] = useState<any[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/get-attempted-quizzes?userId=${JSON.parse(localStorage.getItem("user"))?._id}`);
      if (response.status === 200) {
        setAttempts(response.data);
        console.log("Quizzes:",response)
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  const getQuiz = async (attempt: any) => {
    try {
      const response = await axios.get(`${baseURL}/api/get-quiz/${attempt.quizId}`);
      if (response.status === 200) {
        setSelectedAttempt({
          ...attempt,
          questions: response.data.questions,
        });
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Quiz Results</h1>

      {attempts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No attempts found. Take a quiz to see your results here!
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition cursor-pointer"
                onClick={() => getQuiz(attempt)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    {attempt.title || "Unknown Quiz"}
                  </h3>
                  <Badge variant={getScoreBadgeVariant(attempt.score)}>
                    {attempt.score}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(attempt.createdAt)}
                </p>
              </div>
            ))}

            {selectedAttempt && (
              <Card className="mt-6">
                <CardHeader>
                 <div className="flex justify-between">
                 <CardTitle>
                    {selectedAttempt.title || "Quiz Details"}
                    </CardTitle>
                    <Link to={`/quiz/${selectedAttempt.quizId}`}>
                        <Button className="bg-quiz-gradient hover:opacity-90">
                          <Play className="h-4 w-4 mr-2" />
                          Play Again
                        </Button>
                      </Link>
                 
                 </div>
                  <CardDescription>
                    Attempted on {formatDate(selectedAttempt.createdAt)} | Score:{" "}
                    {selectedAttempt.score}% | Time Spent:{" "}
                    {Math.floor(selectedAttempt.timeSpent / 60)} min{" "}
                    {selectedAttempt.timeSpent % 60} sec
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <p>
                      <span className="font-medium">Total Questions:</span>{" "}
                      {selectedAttempt.questions.length}
                    </p>
                    <p>
                      <span className="font-medium">Correct Answers:</span>{" "}
                      {
                        selectedAttempt.answers.filter(
                          (ans: any, i: number) =>
                            ans === selectedAttempt.questions[i].correctAnswer
                        ).length
                      }
                    </p>
                    <p>
                      <span className="font-medium">Wrong Answers:</span>{" "}
                      {
                        selectedAttempt.answers.filter(
                          (ans: any, i: number) =>
                            ans !== selectedAttempt.questions[i].correctAnswer
                        ).length
                      }
                    </p>
                  </div>

                  <div className="space-y-4">
                    {selectedAttempt.questions.map((q: any, i: number) => {
                      const userAnswer = selectedAttempt.answers[i];
                      const isCorrect = userAnswer === q.correctAnswer;

                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-lg border ${
                            isCorrect
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                          }`}
                        >
                          <p className="font-semibold">
                            {i + 1}. {q.question}
                          </p>
                          <p className="text-sm">
                        <span className="font-medium">Your Answer:</span>{" "}
                        {userAnswer !== undefined && userAnswer !== null
                          ? q.options[userAnswer]
                          : "Not Attempted"}
                      </p>
                
                      <p className="text-sm">
                        <span className="font-medium">Correct Answer:</span>{" "}
                        {q.options[q.correctAnswer]}
                      </p>
                      
                        </div>
                        
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setSelectedAttempt(null)}
                    className="mt-4 px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                  >
                    Back to Results
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
