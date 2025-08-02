import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import party from 'party-js'

const AdminLogin = () => {

  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setrePassword] = useState("");
  const [conP, setConP] = useState("");
  const [f,setF] = useState(false);
  const [pass,setPass] = useState(false);

const handleClick = () => {
      const btn = document.getElementById('confettiBtn');
      if (btn) {
        party.confetti(btn, {
          count: party.variation.range(40, 60),
          spread: 70,
          speed: party.variation.range(500, 800),
        });
      }
    };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {

      const response = await axios.get(`${baseUrl}/api/get-admin/0`,{params:{email,password}});

      if(response.status === 200){
        toast({
          title: "Welcome Admin",
          description: `Logged in as ${email}`,
          className: "bg-green-500 text-white",
        });

        console.log(response,response.data.Admin)
        
      sessionStorage.setItem("adminCreds", JSON.stringify({ Email: email, Password: password }));

      navigate("/admin-profile", { replace: true});

      } else {
        console.log(response.status)
        toast({
          title: "Access Denied",
          description: "You are not authorized as an admin.",
          className: "bg-red-600 text-white",
        });
      }

} catch (error) {

  if (error.response && error.response.status === 400) {


      toast({
        title: "Login Failed",
        description: error.response.data.message,
        className: "bg-red-500 text-white",
      });
    }

    else if (error.response && error.response.status === 404) {


      toast({
        title: "Login Failed",
        description: error.response.data.message,
        className: "bg-red-500 text-white",
      });
    }

  }
  };



  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Enter Email First",
        description: "We need your email to reset password.",
        className: "bg-yellow-500 text-black",
      });
      return;
    } else if(rePassword !== conP) {
      toast({
        title: "Both password do not match",
        description: "Enter correct and try again",
        className: "bg-yellow-500 text-black",
      });
    }

    try {
      const response = await axios.get(`${baseUrl}/api/reset-password`,{params:{email,rePassword}});

      if(response.status === 200){
        toast({
          title: "Password updated",
          description: `Of email: ${email}`,
          className: "bg-green-500 text-white",
        });
        
        handleClick();

        console.log(response,response.data.Admin)

    } else {
      console.log(response.status)
      toast({
        title: "Try again",
      });
    }

} catch (err) {
      toast({
        title: "Error",
        description: err.message,
        className: "bg-red-500 text-white",
      });
    }
  };


  const handleKey = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      setPass(true);
    }
  }



  return (
     <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 pt-10 flex justify-center items-center">
        <div className="mt-10 bg-black/10 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>

        <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur ">
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} className="bg-white/10 text-white border-white/20" />

        { pass &&
          <div className='flex gap-4'>
        <Input type="text" placeholder="password" onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} className="bg-white/10 text-white border-white/20" />
        <Button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-600 text-white">Login with Email</Button>
        </div>
        }

      </div>

        <button
          onClick={()=>{handleForgotPassword
            setF(true)
          }}
          className="mt-5  w-full mt-3 text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>

        {f && (
          <>
            <Input
              type="text"
              placeholder="Enter new password"
              onChange={e => setrePassword(e.target.value)}
              className="mt-5 bg-white/10 text-white border-white/20"
            />
            {rePassword && (
              <>
                <Input
                  type="text"
                  placeholder="confirm password"
                  onChange={e => setConP(e.target.value)}
                  className="mt-5 bg-white/10 text-white border-white/20"
                />
                {conP && (
                  <Button  id="confettiBtn"
                    onClick={()=>{
                      handleForgotPassword();
                    }}
                    className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Update
                  </Button>
                )}
              </>
            )}
          </>
        )}
        

      </div>
    </div>
  );
};

export default AdminLogin;
