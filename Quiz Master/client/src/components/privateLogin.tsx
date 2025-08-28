import React from "react";
import { Navigate } from "react-router-dom";


const PrivateLogin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("userCreds") || "null"); 

    if (user?.Email) {
        return <Navigate to="/dashboard" replace />;
      }
    
      return children;
    };

export default PrivateLogin;