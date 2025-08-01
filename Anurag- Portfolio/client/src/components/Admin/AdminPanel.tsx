
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User,User2, FolderOpen, Settings, Award, MessageSquareDashed,LogOut} from 'lucide-react';
import { Experience, Profile ,Projects, Skills} from '../Admin'

const AdminPanel = () => {

  const [activeTab, setActiveTab] = useState(() => {
return sessionStorage.getItem("activeTab");

});

const [hoverTab, setHoverTab] = useState('');
const navigate = useNavigate();

 


return (

  <div className="min-h-screen pt-10 pb-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
  >

    <div className="text-center md:text-left w-full md:w-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        Admin Panel
      </h1>
      <p className="text-sm sm:text-base text-white/70">
        Manage your portfolio content and information
      </p>
    </div>

    {/* Right Buttons */}
    <div className="w-full md:w-auto flex flex-wrap justify-center md:justify-end items-center gap-3">
      <button
        onClick={() => navigate('/')}
        className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent border border-blue-400/50 hover:bg-blue-400/10 py-2 px-4 rounded"
      >
        User's View
      </button>

      <Button
        onClick={() => navigate('/admin/messages')}
        className="border bg-transparent text-blue-400 border-blue-400 hover:bg-blue-400/10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
      >
        <MessageSquareDashed size={22} />
      </Button>

      <Button
        onClick={() => navigate('/admin/details')}
        className="border bg-transparent text-blue-400 border-blue-400 hover:bg-blue-400/10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
      >
        <User2 size={22} />
      </Button>

      <button
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 flex items-center gap-2"
        onClick={() => {
          sessionStorage.removeItem("adminCreds");
          navigate('/', { replace: true });
        }}
      >
        <LogOut size={20} />
        <span className="hidden sm:inline">Logout</span>
      </button>

    </div>
  </motion.div>

    {/* Tabs */}
    <Tabs value={hoverTab || activeTab} onValueChange={() => {}} className="w-full mt-10">
  <TabsList className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white/10 border-white/20 mb-10">
    {[
      { value: "profile", label: "Profile", icon: <User className="w-4 h-4 mr-2" /> },
      { value: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4 mr-2" /> },
      { value: "skills", label: "Skills", icon: <Award className="w-4 h-4 mr-2" /> },
      { value: "experience", label: "Experience", icon: <Settings className="w-4 h-4 mr-2" /> }
    ].map(({ value, label, icon }) => (
      <TabsTrigger
        key={value}
        value={value}
        onClick={() => {
          setActiveTab(value);
          sessionStorage.setItem('activeTab', value);
        }}
        onMouseEnter={() => setHoverTab(value)}
        onMouseLeave={() => setHoverTab('')}
        className="flex items-center justify-center sm:justify-start data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-xs sm:text-sm md:text-base"
      >
        {icon}
        <span>{label}</span>
      </TabsTrigger>
    ))}
  </TabsList>

  {/* Tab Contents */}
  <TabsContent value="profile" className="mt-6">
    <Profile />
  </TabsContent>
  <TabsContent value="projects" className="mt-6">
    <Projects />
  </TabsContent>
  <TabsContent value="skills" className="mt-6">
    <Skills />
  </TabsContent>
  <TabsContent value="experience" className="mt-6">
    <Experience />
  </TabsContent>
</Tabs>

  </div>
</div>

  );
};

export default AdminPanel;
