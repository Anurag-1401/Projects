import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { ArrowBigRight} from 'lucide-react';


const AdminRegister = () => {

const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const navigate = useNavigate();



  const handleRegister = async (e) => {
    e.preventDefault();

    if(!email || !password){
      toast({
        title: "Email or password missing",
      });
    } else if(password !== conPassword){
      toast({
        title: "Both passwords should be same",
      });
    }

    try {

      const response = await axios.post(`${baseUrl}/api/add-admin`,{email,password});

      if(response.status === 201) {
        console.log(response,response.data.Admin);

        toast({
          title: "Admin Registered Successfully",
          description: `Welcome, ${email}`,
        });
  
        navigate("/admin-profile",{replace:true}); 
      } else {
        console.log(response.status);
        toast({
          title: "Try again",
        });
      }

} catch (error) {
  if(error.response && error.response.status === 400){
    toast({
      title: "Admin already exists",
      description: 'Please Login',
      className: "bg-red-500 text-white"
    });
    navigate('/admin-login',{replace:true});
  } else {
      toast({
        title: "Registration Failed",
        description: error.message,
        className: "bg-red-500 text-white"
      });
      console.log(error)
    }
  }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex justify-center items-center">
     
        <div className="mt-10 bg-black/10 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Registration</h2>
        
        <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur ">
        
        <Input type="email" placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} className="bg-white/10 text-white border-white/20" />
        
        {email && <Input type="password" placeholder="password" value={password} 
        onChange={(e) => setPassword(e.target.value)} className="bg-white/10 text-white border-white/20" />
        }
        {password && (
          <Input type="password" placeholder="Cnnfirm password" value={conPassword} 
          onChange={(e) => setConPassword(e.target.value)} 
          className="bg-white/10 text-white border-white/20" />
                  
        )}

        </div>


        {conPassword && <Button
              onClick={handleRegister}
              className="bg-gradient-to-r from-blue-500 to-purple-600 mt-5
              hover:from-blue-600 hover:to-purple-700 flex-1"
            >
              <ArrowBigRight className="w-4 h-4 mr-2" />
              Submit
            </Button>}

      </div>
      </div>

  );
};

export default AdminRegister;
