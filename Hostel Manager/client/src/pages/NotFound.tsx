import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
<<<<<<<< HEAD:Quiz Master/client/src/pages/NotFound.tsx
        <a href="/dashboard" className="text-blue-500 hover:text-blue-700 underline">
========
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline" replace>
>>>>>>>> 3b028b90 (New Members):Hostel Manager/client/src/pages/NotFound.tsx
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
