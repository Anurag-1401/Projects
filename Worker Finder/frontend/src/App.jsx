// src/App.jsx
import React from 'react';
import HomePage from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SignupPage from './pages/signupPage';
import UserProfile from './pages/UserProfile';
import PlumbingPage from './pages/Workers/PlumbingPage';
import AdminPlumbingPage from './pages/Admin/AdminPlumbingPage';
import CarpentryPage from './pages/Workers/CarpentryPage';
import AdminCarpentryPage from './pages/Admin/AdminCarpentryPage';
import CleaningPage from './pages/Workers/CleaningPage';
import AdminCleaningPage from './pages/Admin/AdminCleaningPage';
import ElectricianPage from './pages/Workers/ElectricianPage';
import AdminElectricianPage from './pages/Admin/AdminElectricianPage';
import MasonPage from './pages/Workers/MasonPage';
import AdminMasonPage from './pages/Admin/AdminMasonPage';
import PaintingPage from './pages/Workers/PaintingPage';
import AdminPaintingPage from './pages/Admin/AdminPaintingPage';
import PaymentPage from './pages/Admin/payments';


function App() {
  
    return (
            <Router>
                <Routes>
                    
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile" element={<UserProfile />} />

                    <Route 
                    >
                        <Route path="/admin/plumber" element={<AdminPlumbingPage />} />
                        <Route path="/admin/carpenter" element={<AdminCarpentryPage />} />
                        <Route path="/admin/painter" element={<AdminPaintingPage />} />
                        <Route path="/admin/mason" element={<AdminMasonPage />} />
                        <Route path="/admin/cleaner" element={<AdminCleaningPage />} />
                        <Route path="/admin/electrician" element={<AdminElectricianPage />} />
                        <Route path='/payments' element={<PaymentPage/>}/>
                    </Route>

                    <Route path="/plumber" element={<PlumbingPage />} />
                    <Route path="/carpenter" element={<CarpentryPage />} />
                    <Route path="/painter" element={<PaintingPage />} />
                    <Route path="/mason" element={<MasonPage />} />
                    <Route path="/cleaner" element={<CleaningPage />} />
                    <Route path="/electrician" element={<ElectricianPage />} />

                    
                </Routes>
            </Router>
    );
}

export default App;
