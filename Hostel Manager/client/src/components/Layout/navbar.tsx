import {Home,LogOut} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'


export default function Navbar() {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(() => {
      return sessionStorage.getItem("activeTab") || 'dashboard';
  }); 

    const handleLogout = (): void => {
        setActiveTab('dashboard')
        localStorage.removeItem('adminCreds');
        localStorage.removeItem('User')
        
        navigate('/',{replace:true})
    }

    const logger = JSON.parse(localStorage.getItem("adminCreds")); 

    return(
        <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center h-auto md:h-16 py-3 md:py-0 gap-3">
            
            <div className="flex items-center justify-between md:justify-start">
              <div className="flex items-center">
                <Home className="h-7 w-7 text-blue-600 mr-2" />
                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                  SGGS Hostel Management
                </h1>
              </div>
            </div>
      
            <div className="flex flex-col md:justify-end sm:flex-row sm:items-center sm:space-x-4 gap-2 md:gap-4 text-sm">
              <span className="text-gray-600 text-center sm:text-left">
                Welcome, {logger?.Email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
      
          </div>
        </div>
      </header>
    )
}