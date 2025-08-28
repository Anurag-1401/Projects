import { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Clock, 
  User, 
  Search,
  BookOpen,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

export function BrowseQuizzes() {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const logger = JSON.parse(localStorage.getItem("userCreds")); 

  const [quizzes, setQuizzes] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { toast } = useToast();
  useEffect(() => {

    let filtered = quizzes.filter((q) =>q.createdBy !== logger?.Email && attempted.some((qa) => qa.quizId !== q._id));
  
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(query) ||
          quiz.description.toLowerCase().includes(query)
      );
    }
    setFilteredQuizzes(filtered);
  }, [searchQuery, quizzes, attempted, logger?.Email]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(()=>{
    fetchQuizzes();
    fetchAttempts();
  },[])

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/get-quizzes`);
      setQuizzes(response.data)
      console.log("quizzes",response)
    } catch (error) {
      console.error("Error fetching quizzes:", error.message || error);
     toast({title:"Error Fetching Quizzes"})
    }
  }

  const fetchAttempts = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/get-attempted-quizzes?userId=${JSON.parse(localStorage.getItem("user"))?._id}`);
      if (response.status === 200) {
        setAttempted(response.data);
        console.log("Quizzes Attempted:",response)
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Browse Quizzes</h1>
          <p className="text-muted-foreground mt-2">
            Discover and take quizzes created by the community
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
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
                        <User className="h-3 w-3" />
                        <span>
                          {logger?.Email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(quiz.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {quiz.questions.length <= 5 ? 'Quick' : 
                         quiz.questions.length <= 10 ? 'Medium' : 'Long'}
                      </Badge>
                      <Link to={`/quiz/${quiz._id}`} replace>
                        <Button className="bg-quiz-gradient hover:opacity-90">
                          <Play className="h-4 w-4 mr-2" />
                          Take Quiz
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No quizzes found' : 'No quizzes available'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all quizzes'
                  : ''
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}