import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import AdminPanel from '@/components/Admin/AdminPanel';
import Messages from '@/components/Admin/messages';
import Navigation from '@/components/Navigation';

const Index = ({access}) => {

  return (

    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    

      {access === true ? 
      ( <AdminPanel/> ) : 
      access === "msg" ? (
        <Messages/>
      ) :
      (
        <div className="relative">
         
         <Navigation />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
        </div>
       )}

    </div>
  );
};

export default Index;
