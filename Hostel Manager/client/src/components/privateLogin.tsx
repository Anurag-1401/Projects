import React from "react";
import { Navigate } from "react-router-dom";


const PrivateLogin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const admin = JSON.parse(localStorage.getItem("adminCreds") || "null"); 
    const userData = JSON.parse(localStorage.getItem("User") || "null");

     if (userData || admin) {
      return <Navigate to="/home" replace />;
    }
    
      return children;
    };

export default PrivateLogin;

