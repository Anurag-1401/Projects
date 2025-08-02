import { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "@/components/ui/use-toast";


const AdminAccessGate = () => {

  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);


  useEffect(() => {
    checkIfAdminExists();
  }, []);

  const checkIfAdminExists = async () => {
   
    try {
      const response = await axios.get(`${baseUrl}/api/get-admin/1`);
      if (response.status === 200) {
        navigate("/admin-login",{replace:true});
        console.log(response,response.data.Admin)
      } else {
        navigate("/admin-register",{replace:true});
        console.log(response)
      }
    } catch (error: any) {
      console.error("Error checking admin existence:", error);

      if (error.response && error.response.status === 404) {
        navigate("/admin-register",{replace:true});
      } else {

      toast({
        title: "Sorry there is an error",
        description: `Try again later`,
        className: "bg-green-500 text-white",
      });

      navigate('/');

    }

     
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        {checking && <h2 className="text-white">Checking Admin Status... Please wait!</h2>}
    </div>
  );
};

export default AdminAccessGate;
