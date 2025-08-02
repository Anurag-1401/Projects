
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';


const ExperienceSection = () => {

   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

const [experiences, setExperiences] = useState([]);
const sorted = experiences.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
useEffect(()=>{
  fetchExperience()
},[])

const fetchExperience = async () => {
  try {
      const response = await axios.get(`${baseUrl}/api/get-experience`);
       if(response.status == 200){
         setExperiences(response.data.data)
       } else {
         console.log("Experiences Not Found");
       }

  } catch (error) {
    console.error("Error fetching Experiences:", error);
    toast({
      title: "No Experiences Available",
      description: "Let Anurag add Experiences to publish",
    });
  }
};



  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Experience
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
          Each line of code refines my ability to deliver smarter, faster, and cleaner — both as a developer and as a future tech leader.          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {sorted.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative mb-12 ${index !== experiences.length - 1 ? 'pb-12' : ''}`}
            >
              {/* Timeline line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-blue-500 to-purple-500 bottom-0 z-10"></div>
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full z-20 top-8"></div>
              
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ml-8 relative">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle className="text-white text-xl">{experience.post}</CardTitle>
                      <CardDescription className="text-blue-400 font-medium text-lg">
                        {experience.company}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <div className="flex items-center text-white/60 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {experience.period[0]} - {experience.period[1]}
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {experience.location}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-white/80 leading-relaxed">
                    {experience.description}
                  </p>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Key Achievements:</h4>
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="flex items-start text-white/70">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, techIndex) => (
                        <Badge 
                          key={techIndex}
                          variant="secondary" 
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
