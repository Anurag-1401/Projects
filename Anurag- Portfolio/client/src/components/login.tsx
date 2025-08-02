import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { RecaptchaVerifier, signInWithPhoneNumber ,createUserWithEmailAndPassword} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase/config.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FcGoogle } from 'react-icons/fc';
import { Github } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';




declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmResult: any;
  }
};


declare global {
  interface Window {
    confirmationResult: import("firebase/auth").ConfirmationResult;
  }
};




export default function Login() {

   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const navigate = useNavigate();
const location = useLocation();

const redirectPath = location.state?.from || "/";


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpBtn, setOtpBtn] = useState(false);





  const sendTokenToBackend = async () => {
    const idToken = await auth.currentUser.getIdToken();
    fetch(`${baseUrl}/api/profile`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
      .then(res => res.json())
      .then(data => console.log('Backend response:', data))
      .catch(err => console.error('Backend error:', err));
  };




  const loginEmail = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        photo: user.photoURL,
      };

      const response = await axios.post(`${baseUrl}/api/user`,userData)
      if(response.status === 201){
        console.log(response)
      };

      console.log("✅ Logged In:", user.email);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.email}`,
      });

      navigate(redirectPath, { replace: true });
  
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = userCredential.user;
  
          console.log("✅ New User Registered:", newUser.email);
          toast({
            title: "Signup Successful",
            description: `Account created for ${newUser.email}`,
          });

          navigate(redirectPath, { replace: true });
  
        } catch (signupError: any) {
          console.error("❌ Signup Error:", signupError);
          toast({
            title: "Signup Failed",
            description: signupError.message,
            variant: "destructive",
          });
        }
  
      } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast({
          title: "Login Failed",
          description: "Incorrect email or password",
          variant: "destructive",
        });
      } else if (error.code === "auth/network-request-failed") {
        toast({
          title: "Network Error",
          description: "Check your internet connection",
          variant: "destructive",
        });
      } else {
        console.error("❌ Login Error:", error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };
  
  



  // const loginGoogle = () => {
  //   signInWithPopup(auth, googleProvider)
  //     .then(async res => {
  //       console.log("Google Sign-in", res.user);

  //       await sendTokenToBackend();

  //       const userData = {
  //         email: res.user.email,
  //         name: res.user.displayName,
  //         uid: res.user.uid,
  //         photo: res.user.photoURL,
  //       };
  
  //       const response = await axios.post('http://localhost:5000/api/user',userData)
  //       if(response.status === 201){
  //         console.log(response)
  //       };

  //       navigate(redirectPath, { replace: true });
  //     })
  //     .catch(err => console.error(err));
  // };




  const loginGoogle = async () => {
  
    try {
      const res = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-in", res.user);
  
      await sendTokenToBackend(); 
  
      const userData = {
        email: res.user.email,
        name: res.user.displayName,
        uid: res.user.uid,
        photo: res.user.photoURL,
      };
  
      const response = await axios.post(`${baseUrl}/api/user`, userData);
  
      if (response.status === 201) {
        console.log("User saved to DB:", response.data);
      }
  
      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        alert("You closed the Google Sign-In popup. Please try again.");
      } else if (err.code === "auth/cancelled-popup-request") {
        console.warn("Cancelled duplicate popup request.");
      } else {
        console.error("Google Sign-In Error:", err);
      }

    } 
  };

  const loginGithub = () => {

    signInWithPopup(auth, githubProvider)
      .then(async res => {
        console.log("GitHub Sign-in", res.user);
        await sendTokenToBackend(); 

        const userData = {
          email: res.user.email,
          name: res.user.displayName,
          uid: res.user.uid,
          photo: res.user.photoURL,
        };
  
        const response = await axios.post(`${baseUrl}/api/user`,userData)
        if(response.status === 201){
          console.log(response)
        };

        navigate(redirectPath, { replace: true });
      })
      .catch(err => {console.error(err);
        toast({
          title: "Login Failed",
          description: "Account exits by different login method",
          variant: "destructive",
        });
      });

}



  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
        callback: (response: any) => {
          console.log("reCAPTCHA solved", response);
        },
        "expired-callback": () => {
          console.warn("reCAPTCHA expired");
        }
      });
    }
  };





  const requestOTP = async () => {

      if (!phone) {
        toast({
          title: "Error",
          description: "Please enter the mobile number",
          variant: "destructive"
        });
      
        return;
      }

      setOtpBtn(true);
      setUpRecaptcha();

const appVerifier = window.recaptchaVerifier;
    
        try {
          const confirmationResult = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
          window.confirmationResult = confirmationResult;
          setOtpBtn(true);
          toast({ title: "OTP sent successfully!" });
        } catch (error) {
          console.error("OTP send error", error);
          toast({ title: "Failed to send OTP Try another way!" });
        }
      };
    
      const verifyOTP = async () => {
        if (window.confirmResult) {
          try {
            const result = await window.confirmResult.confirm(otp);
            alert('Phone authentication successful!');
            console.log(result.user);
      
            const userData = {
              email: result.user.email || "", 
              name: result.user.displayName || "",
              uid: result.user.uid,
              photo: result.user.photoURL || "",
            };
      
            const response = await axios.post(`${baseUrl}/api/user`, userData);
            if (response.status === 201 || response.status === 200) {
              console.log('User stored:', response.data);
            }
      
            navigate(redirectPath, { replace: true });
      
          } catch (error) {
            alert("Incorrect OTP");
            console.error(error);
          }
        }
      };
      



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6">
    <div className="grid grid-cols-1 md:grid-cols-1 gap-3 w-[450px]">
      <h2 className="text-3xl font-bold text-center text-white">Login</h2>

      <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur">
        <div className='flex gap-4'>
        <Input type="tel" placeholder="Currently Unavailable" value={phone} disabled={true} onChange={e => setPhone(e.target.value)} 
        className="bg-white border-white/20 text-white" />
        {phone && <Button onClick={requestOTP} className="w-40 bg-blue-500 hover:bg-blue-600 text-white">Send OTP</Button>}
        </div>

        {otpBtn && (<div className='flex gap-4'>
        <Input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="bg-white/10 text-white border-white/20" />
        <Button onClick={verifyOTP} className="w-[250px] bg-green-500 hover:bg-green-600 text-white">Verify OTP</Button>
        </div>)
        }
        <div id="recaptcha"></div>
      </div>

      <p className='text-white text-center'>OR</p>

      <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur ">
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/10 text-white border-white/20" />

        { email &&
          <div className='flex gap-4'>
        <Input type="text" placeholder="password" onChange={e => setPassword(e.target.value)} className="bg-white/10 text-white border-white/20" />
        <Button onClick={loginEmail} className="w-full bg-blue-500 hover:bg-blue-600 text-white">Login with Email</Button>
        </div>
        }

      </div>

      <p className='text-white text-center'>OR</p>

      <div className="flex gap-4 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur w-full">
        <Button onClick={loginGoogle} className="w-full bg-white 
        hover:bg-black hover:text-white text-black hover:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <FcGoogle className="h-5 w-5" />
        Continue with Google
        </Button>

        <Button onClick={loginGithub} className="w-full bg-gray-700 
        hover:bg-gray-800 text-white hover:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:mr-5">
            <Github className="h-4 w-4" />
            Login with GitHub
          </Button>
      </div>
    </div>
  </div>
  );
}
