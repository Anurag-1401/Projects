import { useNavigate} from 'react-router-dom';
import { useEffect, useState,ComponentProps, useRef, Children  } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail ,Goal,Instagram} from 'lucide-react';
import Profile from './img/image.png'
import { auth } from '../firebase/config';
import { onAuthStateChanged,signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';


const HeroSection = () => {

  const  navigate = useNavigate()


const [isLoggedIn, setIsLoggedIn] = useState(false);
const email = "bhavthankaranurag@gmail.com";

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


  const handleClick = (targetPath: string) => {
    const user = auth.currentUser;
    if (user) {
      navigate(targetPath);
    } else {
      toast({
        title: "You have to login first",
        description: "Access denied!",
        className: "bg-red-500 text-white",
      });
      navigate("/login", { state: { from: targetPath } });
    }
  };


  return (
<div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex flex-col md:flex-row items-center justify-center gap-20 px-4 md:px-0 relative overflow-hidden">


<div className="absolute inset-0">
    <div className="absolute top-1/5 left-1/5 w-full h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 w-full h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
  </div>


      <div className="ml-5 w-64 h-[450px] sm:w-64 sm:h-75 md:w-80 md:h-85 mb-5 mt-10 md:mb-20 relative -top-[20px] md:-top-[50px] 
      overflow-hidden shadow-lg  hover:scale-110 transition-transform duration-300 border p-2">
      <img src={Profile} className="w-full h-full object-cover" alt="" />
      </div>

    <section id="home" className="flex flex-col items-center justify-center relative overflow-hidden">

  

        <div className="container mx-auto px-4 text-center relative z-10 max-w-2xl md:max-w-4xl">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className='hover:scale-105 transition-transform duration-300'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r 
            from-blue-300 via-purple-200 to-pink-200 bg-clip-text text-transparent"
          >
            Anurag Bhavthankar
            </motion.h1>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-5 mt-10"
          >
            Full Stack Developer & AI-ML Enthusiast.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Passionate about creating innovative web solutions with modern technologies. I build responsive, user-friendly applications that deliver exceptional experiences.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 mt-10"
          >

            <Button onClick={() => {
                handleClick("/project");
              }}
              size="lg"
              className="bg-gradient-to-r from-blue-300 to-purple-200 hover:from-blue-200 hover:to-white hover:text-lg text-grey px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View My Work
            </Button>

            
            <Button onClick={() => {
                 handleClick("/contact");
               }}
              variant="outline"
              size="lg"
              className="border-2 border-blue-400/50 text-black hover:bg-black/10 hover:text-white hover:text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-4 h-4 mr-2" />
              Get In Touch
            </Button>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center space-x-6 mt-6 sm:mt-0"
            >
            <a href="https://github.com/Anurag-1401" target="_blank" className="text-white hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/anurag-bhavthankar/" target="main" className="text-white hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href={`mailto:${email}`} className="text-white hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
              <Mail className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/anurag_07_03/" target="main" className="text-white hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
              <Instagram className="w-6 h-6" />
            </a>
            
          </motion.div>
          
        </motion.div>
        

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2"
          >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/40 cursor-pointer"
          >
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </motion.div>

      </div>

      
 <motion.div
   initial={{ opacity: 0, y: 30 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.8, delay: 1.0 }}
   className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 mt-10 px-4"
   >

<Button
     onClick={() => {
       handleClick("/explore");
     }}

  className="mt-10 flex items-center gap-3 px-8 py-6 bg-blue-600/20 text-white rounded-full shadow-lg hover:bg-white hover:text-lg hover:text-black hover:shadow-xl transition-all duration-300 transform hover:scale-105"
>
  <Goal className="w-6 h-6 text-blue-400" />
  <p className="font-semibold text-md">Explore Anurag</p>
</Button>

</motion.div>

<motion.div
   initial={{ opacity: 0, y: 30 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.8, delay: 1.0 }}
   className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
   >

{isLoggedIn && (
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-xl shadow-md transition duration-200"

        onClick={handleLogout}>
          
          Logout
        </button>
      )}

</motion.div>


    </section>
    </div>
  );
};

export default HeroSection;
