
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
      className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      {/* Left Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Admin Panel
        </h1>
        <p className="text-sm sm:text-base text-white/70">
          Manage your portfolio content and information
        </p>
      </div>

      {/* Right Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent 
          border border-blue-400/50 text-blue-400 hover:bg-blue-400/10 font-semibold py-2 px-4 rounded"
        >
          User's View
        </button>

        <Button
          onClick={() => navigate('/admin/messages')}
          className="border bg-transparent text-blue-400 border-blue-400 hover:bg-blue-400/10 w-12 h-12 flex items-center justify-center"
        >
          <MessageSquareDashed size={24} />
        </Button>

        <Button
          onClick={() => navigate('/admin/details')}
          className="border bg-transparent text-blue-400 border-blue-400 hover:bg-blue-400/10 w-12 h-12 flex items-center justify-center"
        >
          <User2 size={24} />
        </Button>

        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-xl shadow-md transition duration-200"
        onClick={()=> 
        {sessionStorage.removeItem("adminCreds");
         navigate('/admin-login')
        }}>
          <LogOut size={24} />
        Logout
        </button>

      </div>
    </motion.div>

    {/* Tabs */}
    <Tabs value={hoverTab || activeTab} onValueChange={() => {}} className="w-full mt-10">
      <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/10 border-white/20">
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
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-sm sm:text-base"
          >
            {icon}
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

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
