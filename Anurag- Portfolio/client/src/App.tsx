import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route ,RouterProvider} from "react-router-dom";
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import PrivateRoute from './components/privateRoute';
import Login from './components/login'
import ProtectedAdminRoute from "./components/Admin/AdminAuth/protectedAdminRoute";
import AdminAccessGate from "./components/Admin/AdminAuth/AdminAccessGate";
import AdminRegister from "./components/Admin/AdminAuth/AdminRegister";
import AdminLogin from "./components/Admin/AdminAuth/AdminLogin";
import AdminDetails from "./components/Admin/adminDetails";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminAccessGate />} />
          
          <Route
          path="/admin-profile"
          element={ <ProtectedAdminRoute> <Index access={true} /> </ProtectedAdminRoute> }/>

          <Route path="/admin/details" element={<AdminDetails />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/project" element={<ProjectsSection />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/admin/messages" element={<Index access="msg"/> }></Route>


          <Route path="/explore" element={<PrivateRoute>
            <Index access={false} />
          </PrivateRoute>}/>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
