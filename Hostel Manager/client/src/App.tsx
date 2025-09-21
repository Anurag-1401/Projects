import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Login} from './components/login/login'
import PrivateRoute from "./components/privateRoute";
import PrivateLogin from "./components/privateLogin";
import HeaderAdmin from './components/Layout/header';
import NotFound from "./pages/NotFound";
import { DataProvider } from "./hooks/DataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DataProvider>
        <Routes>
          <Route path="/" element={<PrivateLogin><Login/></PrivateLogin>} />
          <Route path="/home" element={ <PrivateRoute><HeaderAdmin/></PrivateRoute> }/>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </DataProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
