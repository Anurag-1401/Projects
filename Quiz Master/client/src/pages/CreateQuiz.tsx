import { useState ,useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, Clock,Play,BookOpen, Calendar } from 'lucide-react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Link} from 'react-router-dom';



export function CreateQuiz() {

  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const logger = JSON.parse(localStorage.getItem("userCreds")); 

  const { toast } = useToast();

  const [quizzes, setQuizzes] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState<number | undefined>();
  const [questions, setQuestions] = useState([
    {
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(()=>{
    fetchQuizzes();
  },[])

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/get-quizzes?createdBy=${logger?.Email}`);
      setQuizzes(response.data)
      console.log("quizzes",response)
    } catch (error) {
      console.error("Error fetching quizzes:", error.message || error);
     toast({title:"Error Fetching Quizzes"})
    }
  }

  const handleSave = async () => {

    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a quiz title",
        variant: "destructive",
      });
      return;
    }

    const validQuestions = questions.filter(q => 
      q.question.trim() && 
      q.options.some(opt => opt.trim())
    );

    if (validQuestions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one complete question",
        variant: "destructive",
      });
      return;
    }

    const data ={
      title,
      description,
      timeLimit,
      questions:validQuestions,
      createdBy:JSON.parse(localStorage.getItem("userCreds")).Email ,
      code:Math.floor(10000000 + Math.random() * 90000000).toString()
    }

    try {
    const response = await axios.post(`${baseURL}/api/create-quiz`, data );

    if (response.status === 200 || response.status === 201) {
      fetchQuizzes()
      toast({
        title: "Quiz Created!",
        description: "Your quiz has been saved successfully",
      });
      console.log("Quiz created:", response.data);
    }
  } catch (error: any) {
    console.error("Error creating quiz:", error);

    toast({
      title: "Error",
      description: error.response?.data?.message || "Something went wrong",
      variant: "destructive",
    });
  }
  };


  const deleteQuiz = async (id:String) => {
    try {
      const response = await axios.delete(`${baseURL}/api/del-quiz/${id}`)
      if(response.status === 200){
        toast({
          title: "Quiz Deleted successfully",
          variant: "destructive",
        });
        fetchQuizzes();
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
          <p className="text-muted-foreground mt-2">
            Build an engaging quiz with multiple choice and true/false questions
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Basic information about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy quiz title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this quiz is about"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (optional)</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="timeLimit"
                    type="number"
                    placeholder="Minutes"
                    value={timeLimit || ''}
                    onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add questions to your quiz</CardDescription>
              </div>
              
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <Card key={qIndex} className="border-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
                      {questions.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Textarea
                          placeholder="Enter your question here"
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select 
                          value={question.type}
                          onValueChange={(value) => {
                            updateQuestion(qIndex, 'type', value);
                            if (value === 'true-false') {
                              updateQuestion(qIndex, 'options', ['True', 'False']);
                            } else {
                              updateQuestion(qIndex, 'options', ['', '', '', '']);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {question.type === 'true-false' ? (
                          <div className="space-y-2">
                            {['True', 'False'].map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={question.correctAnswer === oIndex}
                                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                  className="text-primary"
                                />
                                <span className="text-sm font-medium">{option}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={question.correctAnswer === oIndex}
                                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                  className="text-primary"
                                />
                                <Input
                                  placeholder={`Option ${oIndex + 1}`}
                                  value={option}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Explanation (optional)</Label>
                        <Textarea
                          placeholder="Explain why this is the correct answer"
                          value={question.explanation}
                          onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button onClick={addQuestion} className="bg-quiz-gradient hover:opacity-90 mt-5">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-quiz-gradient hover:opacity-90 shadow-quiz-glow"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Quiz
            </Button>
          </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Quizzes History</h1>
        </div>

        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className='flex justify-between'>
                      <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                      <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteQuiz(quiz._id)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {quiz.description || 'No description provided'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.timeLimit}m</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(quiz.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                     <div className='space-x-2'>
                     <Badge variant="secondary">
                        {quiz.questions.length <= 5 ? 'Quick' : 
                         quiz.questions.length <= 10 ? 'Medium' : 'Long'}
                      </Badge>
                      <span className='text-sm'>Code:{quiz.code}</span>
                      
                     </div>
                     <Link to={`/quiz/${quiz._id}`}>
                        <Button className="bg-quiz-gradient hover:opacity-90">
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
        <p>No Quiz Available</p>
        )}
        </div>
      </div>
    </div>
    </div>
  );
}