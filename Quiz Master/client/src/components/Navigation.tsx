import { useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, Plus, Play, BarChart3, LogOut, User, Brain, Menu, X,Edit
} from 'lucide-react';

export function Navigation() {

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const logger = JSON.parse(localStorage.getItem("userCreds")); 
  const user = JSON.parse(localStorage.getItem("user")); 
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-card border-b border-border shadow-sm overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
            <div className="w-8 h-8 bg-quiz-gradient rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-quiz-gradient bg-clip-text text-transparent">
              QuizMaster
            </span>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link to="/dashboard">
              <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} size="sm" className="flex items-center space-x-1 lg:space-x-2">
                <Home className="w-4 h-4" /><span>Dashboard</span>
              </Button>
            </Link>
            <Link to="/create">
              <Button variant={isActive('/create') ? 'default' : 'ghost'} size="sm" className="flex items-center space-x-1 lg:space-x-2">
                <Plus className="w-4 h-4" /><span>Create Quiz</span>
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant={isActive('/browse') ? 'default' : 'ghost'} size="sm" className="flex items-center space-x-1 lg:space-x-2">
                <Play className="w-4 h-4" /><span>Browse</span>
              </Button>
            </Link>
            <Link to="/results">
              <Button variant={isActive('/results') ? 'default' : 'ghost'} size="sm" className="flex items-center space-x-1 lg:space-x-2">
                <BarChart3 className="w-4 h-4" /><span>Results</span>
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 relative">
            <div 
              className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <User className="w-4 h-4" /><span className="truncate max-w-[100px]">{logger?.Email}</span>
            </div>

            <Link to="/" replace>
            <Button onClick={()=>{
              localStorage.removeItem('userCreds');
              localStorage.removeItem('user');
            }}
            variant="outline" size="sm" className="flex items-center space-x-1 lg:space-x-2">
              <LogOut className="w-4 h-4" /><span>Logout</span>
            </Button>
            </Link>
          </div>

          {profileOpen && (
             <div className="fixed top-16 right-4 w-56 bg-card border border-border shadow-md rounded-md p-4 z-50">
               <div className="flex items-center justify-between mb-2">
                 <span className="font-semibold">{user.name || "User"}</span>
               </div>
               <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
             </div>
           )}

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-2 pb-4 space-y-1 flex flex-col w-full">
          {[
            { path: '/dashboard', icon: <Home className="w-4 h-4"/>, label: 'Dashboard' },
            { path: '/create', icon: <Plus className="w-4 h-4"/>, label: 'Create Quiz' },
            { path: '/browse', icon: <Play className="w-4 h-4"/>, label: 'Browse' },
            { path: '/results', icon: <BarChart3 className="w-4 h-4"/>, label: 'Results' }
          ].map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
              <Button variant={isActive(item.path) ? 'default' : 'ghost'} size="sm" className="w-full flex items-center space-x-2 justify-start">
                {item.icon}<span>{item.label}</span>
              </Button>
            </Link>
          ))}
          <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground truncate">
            <User className="w-4 h-4" /><span className="truncate">{logger?.Email}</span>
          </div>
          <Link to="/" replace>
            <Button onClick={()=>{
              localStorage.removeItem('userCreds');
              localStorage.removeItem('user');
            }}
            variant="outline" size="sm" className="flex items-center space-x-1 lg:space-x-2">
              <LogOut className="w-4 h-4" /><span>Logout</span>
            </Button>
            </Link>
        </div>
      )}
    </nav>
  );
}
