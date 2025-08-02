import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Bot, Database, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AboutSection = () => {

   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
  const feat = {
    Code,Bot,Database,Users
  };

   const [profileData, setProfileData] = useState({
      name: '',
      profession: '',
      description: '',
      about:'',
      features:[],
      facts:[],
      journey:'',
      email: '',
      contact: '',
      location: '',
      github: '',
      linkedin: '',
      insta: ''
    });

    useEffect(()=>{
      fetchAdmin();
    },[])

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/getAdminDetails`)
        if (response.status == 200) {
          setProfileData(response.data.Admin)
        }
      } catch (error) {
        
      }
    };
  


  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 mt-12 pt-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
          {profileData.about}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {profileData.features.map((feature, index) => {
            const Icon = feat[feature.icon]
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">My Journey</h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {profileData.journey.slice(0,120)}
                  </p>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {profileData.journey.slice(120)}
                  </p>
                </div>


                
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Quick Facts</h3>
                  <ul className="space-y-3 text-white/70">
                  {profileData.facts.map((fact,index)=>(
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      {fact}
                    </li>
                     ))}
                  </ul>
                </div>

             
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
