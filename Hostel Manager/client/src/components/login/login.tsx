import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast';
import { Home, AlertCircle, User, Lock } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,updateProfile} from 'firebase/auth'
import { auth, googleProvider} from './firebase/config.js';


declare global {
    interface Window {
      confirmationResult: import("firebase/auth").ConfirmationResult;
    }
};


export function Login() {

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("signin");

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [create,setCreate] = useState(false);



  const signUpEmail = async () => {
    try {

      const role = email.startsWith("2") ? "studentLogin" : "admin";
      const apiRes = await axios.post(`${baseURL}/${role}/create`, {
        email: email,
        password:password
      });
  
      if (apiRes.status === 201) {
        toast({ title: "Account Created Successful" });
        console.log(apiRes)
      } else {
        throw new Error(`Unexpected status ${apiRes.status}`);
      }

      localStorage.setItem("adminCreds", JSON.stringify({ Email:email }));
      role === 'studentLogin' && localStorage.setItem("User", JSON.stringify(apiRes.data));
      navigate('/home',{replace:true})

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
  
     
      

      const profileRes = await fetch(`${baseURL}/auth/profile`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
  
     
     
      if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
      const profileData = await profileRes.json();
      console.log("✅ Profile:", profileData);

      
 } catch (err: any) {
      console.error("❌ Signup Error:", err);
      toast({
        title: "Signup Failed",
        description: err.response.data.detail,
        variant: "destructive",
      });
    }
  };
  



const loginEmail = async () => {
    try {
      const role = email.startsWith("2") ? "studentLogin" : "admin";

      const apiRes = await axios.post(`${baseURL}/${role}/login`, {
        email:email,
        password:password,
      });
  
      if (apiRes.status === 200) {
        toast({ title: "Login Successful" });
        console.log(apiRes)
      } else {
        throw new Error(`Unexpected status ${apiRes.status}`);
      }

      localStorage.setItem("adminCreds", JSON.stringify({ Email: email }));
      role === 'studentLogin' && localStorage.setItem("User", JSON.stringify(apiRes.data));
      navigate('/home',{replace:true})

      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const idToken = await userCredential.user.getIdToken();

    
      // const profileRes = await fetch(`${baseURL}/auth/profile`, {
      //   headers: { Authorization: `Bearer ${idToken}` },
      // });
  
     
     
      // if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
      // const profileData = await profileRes.json();
      // console.log("✅ Profile:", profileData);

     
    

} catch (error: any) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast({
          title: "Login Failed",
          description: "Incorrect email or password",
          variant: "destructive",
        });
      } else if (error.code === "auth/user-not-found"){
        toast({
          title: "User Not Found",
          description: "Create Account First",
          variant: "destructive",
        });
      }else if (error.code === "auth/network-request-failed") {
        toast({
          title: "Network Error",
          description: "Check your internet connection",
          variant: "destructive",
        });
      } else {
        console.error("❌ Login Error:", error);
        toast({
          title: "Error in Login",
          description: error.response.data.detail,
          variant: "destructive",
        });
      }
    }
  };



  const loginGoogle = () => {

      signInWithPopup(auth, googleProvider)
        .then(async res => {

          const userData = {
            email: res.user.email,
            name: res.user.displayName,
          };
          
        const role = userData.email.startsWith("2") ? "studentLogin" : "admin";

        const response = await axios.post(`${baseURL}/${role}/google-${create? 'create' : 'login'}`,userData)
          if(response.status === 201){
            toast({ title: "Account Created Successful" });
            console.log(response)
          } else if(response.status === 200){
            toast({ title: "Login Successful" });
            console.log(response)
          };

          console.log("Google Sign-in", res.user);
  
          const idToken = await res.user.getIdToken();

          localStorage.setItem("adminCreds", JSON.stringify({ Email: res.user.email }));
          role === 'studentLogin' && localStorage.setItem("User", JSON.stringify(response.data));
          navigate('/home',{replace:true})

          const profileRes = await fetch(`${baseURL}/auth/profile`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
      
          if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
          const profileData = await profileRes.json();
          console.log("✅ Profile:", profileData);
      
  
        }).catch(err => {
          console.error(err, err.message);
          toast({
            title: err.response.data.detail,
          });
        });
    };
    
  

 
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Home className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            SGGS Hostel Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
           
            <div className='flex justify-center'>
            <div className="flex min-w-[350px] rounded-lg bg-gray-100 p-2 h-12">
            <button
              className={`flex-1 px-4 py-2 rounded-md transition-all ${
                activeTab === "signin"
                  ? "bg-blue-900 text-white text-sm"
                  : "text-black text-sm"
              }`}
              onClick={() => {
              setActiveTab("signin")
              setCreate(false)
              }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-md transition-all ${
                activeTab === "signup"
                  ? "bg-blue-900 text-white text-sm"
                  : "text-black text-sm"
              }`}
              onClick={() => {
              setActiveTab("signup");
              setCreate(true)
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
            {/* {create ? 'Sign Up' : 'Login'} */}
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault();create ? signUpEmail() : loginEmail();}} className="space-y-4">
              <div className="space-y-2">

                <Label htmlFor="username">Institute Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter email"
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
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {create ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

              <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                OR Simply
              </p>
              <Button onClick={loginGoogle} className="w-max bg-white border
             hover:bg-black hover:text-white text-black hover:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
             <FcGoogle className="h-5 w-5" />
             Continue with Google
             </Button>
              </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}