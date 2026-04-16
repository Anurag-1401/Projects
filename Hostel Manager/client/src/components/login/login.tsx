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
import { useData } from '@/hooks/DataContext.js'
import BGImage from '../../../public/image.png'


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
  const [isCC, setIsCC] = useState(false)
  const [branch, setBranch] = useState("")
  const [year, setYear] = useState("")

const getUserType = (email: string) => {
  return email.startsWith("2") ? "student" : "admin"
}

  const signUpEmail = async () => {
    try {

      setLoading(true);

      const userType = getUserType(email)

      if (userType === "student") {

      const res = await axios.post(`${baseURL}/studentLogin/create`, {
        email,
        password
      })

      localStorage.setItem("User", JSON.stringify(res.data))

    } else {

      const role = isCC ? "coordinator" : "warden"

      const res = await axios.post(`${baseURL}/admin/create`, {
        email,
        password,
        role,
        branch: isCC ? branch : null,
        year: isCC ? Number(year) : null
      })

      localStorage.setItem("adminCreds", JSON.stringify({
        Email: email,
        role
      }))
    }

      toast({ title: "Account Created" })

      navigate('/home',{replace:true})

      window.location.reload();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
  
      const profileRes = await fetch(`${baseURL}/auth/profile`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
     
      if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
      const profileData = await profileRes.json();
      console.log("✅ Profile:", profileData);

  } catch (err) {
      console.error("❌ Signup Error:", err);
      toast({
        title: "Signup Failed",
        description: err.response.data.detail,
        variant: "destructive",
      });
    } finally{
      setLoading(false);
    }
  };
  



const loginEmail = async () => {
    try {
      setLoading(true);
      const userType = getUserType(email)

    if (userType === "student") {

      const res = await axios.post(`${baseURL}/studentLogin/login`, {
        email,
        password
      })

      localStorage.setItem("User", JSON.stringify(res.data))

    } else {

      const res = await axios.post(`${baseURL}/admin/login`, {
        email,
        password
      })

      localStorage.setItem("adminCreds", JSON.stringify({
        Email: email,
        role: res.data.role
      }))
    }

      toast({ title: "Login Successful" })
      navigate('/home',{replace:true})

      window.location.reload();

      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const idToken = await userCredential.user.getIdToken();

    
      // const profileRes = await fetch(`${baseURL}/auth/profile`, {
      //   headers: { Authorization: `Bearer ${idToken}` },
      // });
  
     
     
      // if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
      // const profileData = await profileRes.json();
      // console.log("✅ Profile:", profileData);
} catch (error) {
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
      finally {
        setLoading(false);
      }
  };


  
const loginGoogle = () => {
  setLoading(true);
  signInWithPopup(auth, googleProvider)
    .then(async res => {

      const email = res.user.email;
      const name = res.user.displayName;

      const userData = { email, name };

      // ✅ detect user type
      const userType = getUserType(email);

      const endpoint = userType === "student" ? "studentLogin" : "admin";

      const response = await axios.post(
        `${baseURL}/${endpoint}/google-${create ? "create" : "login"}`,
        userData
      );

      // ✅ Toast
      if (response.status === 201) {
        toast({ title: "Account Created Successful" });
      } else if (response.status === 200) {
        toast({ title: "Login Successful" });
      }

      // 🔥 STORE DATA PROPERLY
      if (userType === "admin") {
        localStorage.setItem("adminCreds", JSON.stringify({
          Email: email,
          role: response.data?.role || "warden" // fallback
        }));
      }

      if (userType === "student") {
        localStorage.setItem("User", JSON.stringify(response.data));
      }

      navigate("/home", { replace: true });
      window.location.reload();

      // ✅ Firebase token (optional but good)
      const idToken = await res.user.getIdToken();

      const profileRes = await fetch(`${baseURL}/auth/profile`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!profileRes.ok) throw new Error("Profile fetch failed");

      const profileData = await profileRes.json();
      console.log("✅ Profile:", profileData);

    })
    .catch(err => {
      console.error(err);

      toast({
        title: "Google Login Failed",
        description: err.response?.data?.detail || err.message,
        variant: "destructive"
      });
    }).finally(() => setLoading(false));
};
    
  

 
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4
      bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: `url(${BGImage})`}}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-white drop-shadow-lg">
            SGGS Hostel Management
          </h2>
          <p className="mt-2 text-md text-gray-100">
            Sign in to access
          </p>
        </div>

        <Card className="shadow-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">          <CardHeader>
            <CardTitle className="text-center">
           
            <div className='flex justify-center'>
            <div className="flex min-w-[350px] rounded-lg bg-white/20 p-1 h-12 backdrop-blur-sm">
            <button
              className={`flex-1 px-4 py-2 rounded-md transition-all ${
                activeTab === "signin"
                  ? "bg-blue-900 text-white text-sm shadow-md"
                  : "text-gray-200 text-sm hover:bg-white/10"
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
                  ? "bg-blue-900 text-white text-sm shadow-md"
                  : "text-gray-200 text-sm hover:bg-white/10"
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
            <form onSubmit={(e) => { e.preventDefault();
              if (create) signUpEmail(); 
              else loginEmail();
              }} 
              className="space-y-4">
              <div className="space-y-2">

                <Label className='text-gray-200' htmlFor="username">Institute Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className='text-gray-200' htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {create && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-200">
                    <input
                      type="checkbox"
                      checked={isCC}
                      onChange={() => setIsCC(!isCC)}
                    />
                    Are you Class Coordinator?
                  </label>
                </div>
              )}

              {create && isCC && (
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <Label className="text-gray-200">Branch</Label>
                  <Input
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="bg-white/20 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-200">Year</Label>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-white/20 text-white"
                  />
                </div>

              </div>
            )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg"
                disabled={loading}
              >
                {loading ? 'Processing...' : (create ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>

              <div className="mt-6 text-center">
              <p className="text-sm text-gray-300 mb-3">
                OR Simply
              </p>
              <Button onClick={loginGoogle} 
              className="w-max bg-white/90 text-black hover:bg-black hover:text-white transition-all duration-300 
                          transform hover:scale-105">
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