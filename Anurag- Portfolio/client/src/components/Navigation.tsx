import { useState ,useEffect} from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { auth } from '../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Navigation = () => {
  const navigate = useNavigate()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); 
  }, []);


  const handleLogout = () => {
    signOut(auth)
      .then(() => {console.log("User logged out");
         toast({
                title: "Logout Successful",
                description: `Visit Again`,
              });
    navigate("/", { replace: true });

      })
      .catch(err => console.error("Logout error:", err));
  };



  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const other = {
    '#projects':'/project',
    '#contact':'/contact',
    '#home':'/'
  }

  const handleScroll = (href: string) => {
    const nav = other[href];

    if(nav){
      navigate(nav,nav === '/' ? {replace:true} : {replace:false});
    }

    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Portfolio
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleScroll(item.href)}
                className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-110 transform"
              >
                {item.name}
              </button>
            ))}
        {isLoggedIn && (
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-xl shadow-md transition duration-200"

        onClick={handleLogout}>
          
          Logout
        </button>
      )}
          </div>

          


    {/* Mobile Menu Button */}
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>
    </div>
  </div>


  {/* Mobile Navigation */}
    {isMobileMenuOpen && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
  >
    {navItems.map((item) => (
      <button
        key={item.name}
        onClick={() => {
          handleScroll(item.href);
          setIsMobileMenuOpen(false); // close on click
        }}
        className="block w-full text-left py-2 text-white/80 hover:text-white transition-colors duration-300"
      >
        {item.name}
      </button>
    ))}
    {isLoggedIn && (
      <button
        onClick={() => {
          handleLogout();
          setIsMobileMenuOpen(false); 
        }}
        className="block w-full text-left py-2 text-red-400 hover:text-red-500 transition-colors duration-300"
      >
        Logout
      </button>
    )}
  </motion.div>
)}

      </div>
    </nav>
  );
};

export default Navigation;
