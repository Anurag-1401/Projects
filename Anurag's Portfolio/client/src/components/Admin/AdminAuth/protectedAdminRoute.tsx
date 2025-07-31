import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const admin = JSON.parse(sessionStorage.getItem("adminCreds")); 

  if (!admin || !admin.Email || !admin.Password) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
