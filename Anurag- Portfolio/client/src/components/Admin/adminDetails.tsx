import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader,CardTitle } from '@/components/ui/card';
import axios from 'axios';
import party  from 'party-js';


const AdminDetails = () => {

  const [credentials, setCredentials] = useState({email: '',password: ''});  
      const [rePassword, setrePassword] = useState("");
      const [conP, setConP] = useState("");
      const [f,setF] = useState(false);
      const [visitor,setVisitor] = useState([]);

const handleClick = () => {

    const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
      const btn = document.getElementById('confettiBtn');
      if (btn) {
        party.confetti(btn, {
          count: party.variation.range(40, 60),
          spread: 70,
          speed: party.variation.range(500, 800),
        });
      }
    };



useEffect(()=>{
    fetchVisitors();
    fetchAdmin();
},[])

const fetchVisitors = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/get-visitors`);

        if(response.status === 200){
            setVisitor(response.data.Visitors);
            console.log(response.data.Visitors);

        }
    } catch (error) {
        console.log(error);
    }
};

const fetchAdmin = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/get-admin/1`);
    if (response.status === 200) {
      credentials.email = response.data.Admin.email;
      credentials.password = response.data.Admin.password;
      console.log("credentials",credentials)
    } 
} catch (error){

}
};

const handleForgotPassword = async () => {
        if (!credentials.email) {
          toast({
            title: "Enter Email First",
            description: "We need your email to reset password.",
            className: "bg-yellow-500 text-black",
          });
          setTimeout(() => {
            window.location.reload()
          }, 500);
          return;
        } else if(rePassword !== conP) {
          toast({
            title: "Both password do not match",
            description: "Enter correct and try again",
            className: "bg-yellow-500 text-black",
          });
        }
    
  try {
      const response = await axios.put(`${baseUrl}/api/reset-password`,{
        email: credentials.email,
        Password:credentials.password,
        rePassword,
      });
    
          if(response.status === 200){
            toast({
              title: "Password updated",
              description: `Of email: ${credentials.email}`,
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


return(
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 pt-10">

<div className="ml-10 bg-black/10 shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-md">
    <div className="space-y-4 bg-white/5 p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur">
      <Input
        type="email"
        placeholder="Email"
        value={credentials.email}
        disabled={true}
        className="bg-white/10 text-white border-white/20"
      />
      <Input
        type="text"
        placeholder="Password"
        value={credentials.password}
        disabled={true}
        className="bg-white/10 text-white border-white/20"
      />
    </div>

    <button
      onClick={() => setF(p=>!p)}
      className="w-full mt-4 text-sm text-blue-600 hover:underline"
    >
      {f ? 'cancel':'Change Password'}
    </button>

    {f && (
      <>
        <Input
          type="password"
          placeholder="Enter new password"
          onChange={(e) => setrePassword(e.target.value)}
          className="mt-4 bg-white/10 text-white border-white/20"
        />
        {rePassword && (
          <>
            <Input
              type="password"
              placeholder="Confirm password"
              onChange={(e) => setConP(e.target.value)}
              className="mt-4 bg-white/10 text-white border-white/20"
            />
            {conP && (
              <Button  id="confettiBtn"
                onClick={()=>{handleForgotPassword();
                }}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Update
              </Button>
            )}
          </>
        )}
      </>
    )}
  </div>

   

    <Card className="mt-20 bg-white/5 border-white/10 backdrop-blur-sm mx-4 md:mx-10">
    <CardHeader>
        <CardTitle>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Who Visit Your Portfolio
        </h1>
        </CardTitle>
    </CardHeader>

    <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visitor?.map((visit, index) => (
          <div
            key={index}
            className="p-4 bg-white/5 rounded-lg border border-white/10 w-full max-w-full"
          >
            <div className='flex items-center justify-between'>
              
              <h4 className="text-white font-semibold text-lg flex-grow">
                {visit.name}
              </h4>

            </div>

            <p className="text-blue-400 font-medium mb-4 break-words">{visit.email}</p>
            <p>{new Date(visit.updatedAt).toLocaleString()}</p>
      </div>
    ))}
    </div>

    </CardContent>
    </Card>

</div>

);
}

export default AdminDetails;
