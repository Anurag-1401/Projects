import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, Trophy ,X} from 'lucide-react';
import axios from 'axios';

export function QuizPlayer() {
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [score, setScore] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [code,setCode] = useState('')

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/get-quiz/${quizId}`);
        setQuiz(response.data);
        setAnswers(new Array(response.data.questions.length).fill(-1));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load quiz.',
          variant: 'destructive',
        });
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || isCompleted || !hasStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          completeQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted, hasStarted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (answerIndex: number) => {
    if (isCompleted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeQuiz = async () => {
    if (!quiz) return;

    const calculatedScore = quiz.questions.filter((q: any, i: number) => answers[i] === q.correctAnswer).length;
    setScore(Math.round((calculatedScore / quiz.questions.length) * 100));
    setIsCompleted(true);

    toast({
      title: "Quiz Completed!",
      description: `You scored ${Math.round((calculatedScore / quiz.questions.length) * 100)}%`,
    });

    const user = JSON.parse(localStorage.getItem("user")); 

    try {
      const response = await axios.post(`${baseURL}/api/add-quiz`,{
        userId:user._id,
        title:quiz.title,
        quizId:quiz._id,
        answers,
        score:Math.round((calculatedScore / quiz.questions.length) * 100),
        timeSpent:Math.floor((Date.now()- startTime) / 1000)
        })

        if(response.status === 201){
          console.log(response)
        }
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
   
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(quiz?.questions.length || 0).fill(-1));
    setIsCompleted(false);
    setStartTime(Date.now());
    if (quiz?.timeLimit) setTimeLeft(quiz.timeLimit * 60);
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-quiz-gradient-light p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription className="mt-2">{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Enter Quiz Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-lg text-center"
            />
            <Button
              className="bg-quiz-gradient hover:opacity-90 w-full"
              onClick={() => {
                if (code === quiz.code) {
                  setHasStarted(true);
                  setStartTime(Date.now());
                  if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
                } else {
                  alert("❌ Wrong Quiz Code!");
                }
              }}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const currentQ = quiz.questions[currentQuestion];

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-quiz-gradient-light flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-quiz-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold bg-quiz-gradient bg-clip-text text-transparent mb-2">
                {score}%
              </div>
              <p className="text-muted-foreground">
                You got {quiz.questions.filter((q: any, i: number) => answers[i] === q.correctAnswer).length} out of {quiz.questions.length} correct
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Question Results:</h3>
              {quiz.questions.map((question: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Question {index + 1}</span>
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <Button onClick={restartQuiz} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
              </Button>
              <Button onClick={() => navigate('/browse',{replace:true})} className="flex-1 bg-quiz-gradient hover:opacity-90">
                Browse More Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quiz-gradient-light p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>Question {currentQuestion + 1} of {quiz.questions.length}</CardDescription>
              </div>
              {timeLeft !== null && (
                <Badge variant={timeLeft < 60 ? 'destructive' : 'secondary'} className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(timeLeft)}</span>
                </Badge>
              )}
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
         <div className='space-x-5'>
         <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button variant="outline" onClick={()=>navigate('/browse',{replace:true})}  className='hover:bg-red-400'>
            <X className="w-4 h-4 " />
            Cancel
          </Button>
         </div>
          
          <Button
            onClick={nextQuestion}
            
            className="bg-quiz-gradient hover:opacity-90"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
