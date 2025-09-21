import React from "react";
import { Navigate } from "react-router-dom";
import HeaderStudent from './Layout/headerStudent'


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const admin = JSON.parse(localStorage.getItem("adminCreds")); 

    if (!admin || !admin.Email) {
        return <Navigate to="/" replace />;
      }
    
      return admin.Email.startsWith("2") ? <HeaderStudent /> : <>{children}</>;
    };

export default PrivateRoute;
