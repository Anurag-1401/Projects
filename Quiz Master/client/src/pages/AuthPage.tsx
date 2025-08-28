import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Brain, Mail, Lock, User } from 'lucide-react';
import axios from 'axios'

export function AuthPage() {
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        try {
          const response = await axios.post(`${baseURL}/api/login`, {email,password});

          if (response.status === 200) {
            toast({title:'User Login Successfull'})
            console.log(response.data);
            localStorage.setItem("userCreds", JSON.stringify({ Email:email }));
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate('/dashboard',{replace:true});
          }
          }
        catch (error) {
          console.log("Error",error)
          toast({
            title: "Login Failed",
            description: error.response.data.message,
            variant: "destructive",
          });
        }
      } else {
      try {
          const response = await axios.post(`${baseURL}/api/register`, {name,email,password});

          if (response.status === 201) {
            toast({title:'User Created Successfull'})
            console.log('User created:', response.data);
            localStorage.setItem("userCreds", JSON.stringify({ Email:email }));
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate('/dashboard',{replace:true});
          } 
      } catch (error) {
      toast({
        title: "SignUp Failed",
        description: error.response.data.message,
        variant: "destructive",
      });
      console.log("Error",error)
    } 
  }
} catch (error){
  
} finally {
  setLoading(false)
}
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-quiz-gradient-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-quiz-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-quiz-glow">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-quiz-gradient bg-clip-text text-transparent">
            QuizMaster
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, share, and take amazing quizzes
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle>{isLogin ? 'Welcome back' : 'Create account'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Sign up to start creating quizzes'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-quiz-gradient hover:opacity-90 transition-opacity shadow-quiz-glow"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-primary hover:text-primary/80"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}