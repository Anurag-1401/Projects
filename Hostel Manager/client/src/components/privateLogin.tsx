import React from "react";
import { Navigate } from "react-router-dom";


const PrivateLogin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const admin = JSON.parse(localStorage.getItem("adminCreds") || "null"); 

    if (admin || admin?.Email) {
        return <Navigate to="/home" replace />;
      }
    
      return children;
    };

export default PrivateLogin;


// import React from "react";
// import { Navigate } from "react-router-dom";


// const PrivateLogin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const admin = JSON.parse(localStorage.getItem("adminCreds") || "null"); 

//     if (admin || admin?.Email) {
//         return <Navigate to={admin.Email.startsWith("2") ? "/student" : '/admin'} replace />;
//       }
    
//       return children;
//     };

// export default PrivateLogin;

