import React from "react";
import { Navigate} from "react-router-dom";
import HeaderStudent from './Layout/headerStudent'
import HeaderAdmin from "./Layout/header";

const PrivateRoute: React.FC = () => {
    const admin = JSON.parse(localStorage.getItem("adminCreds")); 
    const userData = JSON.parse(localStorage.getItem("User") || "null");

    if (!userData && !admin) {
      return <Navigate to="/" replace />;
    }

    if (userData) {
      return <HeaderStudent />;
    }

    if (admin) {
      return <HeaderAdmin />;
    }
    return <Navigate to="/" replace />;
};

export default PrivateRoute;
