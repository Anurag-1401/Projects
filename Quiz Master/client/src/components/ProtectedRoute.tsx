import React from "react";
import { Navigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("userCreds") || "null");

  if (user?.Email) {
    return (
      <>
        <Navigation />
        {children}
      </>
    );
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
