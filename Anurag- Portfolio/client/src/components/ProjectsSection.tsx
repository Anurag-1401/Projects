import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Home } from 'lucide-react';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';




const ProjectsSection = () => {

  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

  const navigate = useNavigate()

  const [projects,setProjects] = useState([]);

  useEffect(()=>{
    fetchProjects()
  },[])

  const fetchProjects = async () => {
    try {
     console.log(baseUrl);
        const response = await axios.get(`${baseUrl}/api/get-projects`);
         if(response.status == 200){
           setProjects(response.data.project)
         } else {
           console.log("Projects Not Found");
         }
      }
    catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "No Projects Available",
        description: "Let Anurag add Projects to Publish",
      });
    }
  };

  
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Button
     onClick={() => {
       navigate("/",{replace:true});
     }}

  className="mb-10 flex items-center gap-3 px-8 py-6 bg-blue-600/20 text-white rounded-full shadow-lg hover:bg-white hover:text-lg hover:text-black hover:shadow-xl transition-all duration-300 transform hover:scale-105"
>
  <Home className="w-6 h-6 text-blue-400" />
</Button>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            A showcase of my recent work, featuring full-stack applications built with modern technologies and best practices.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-20 pb-10 max-w-6xl mx-auto px-4">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden h-full">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                  <img 
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white text-2xl">{project.title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex}
                        variant="secondary" 
                        className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href={project.demo} target='main'>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                    </a>

                    <a href={project.github} target='main'>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    </a>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10"
        >
        <h3 className="text-xl md:text-2xl text-center font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Other Projects
          </h3>        
          </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {otherProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105 h-320px] md:h-[260px] md:w-[440px]">
              <CardHeader>
                  <CardTitle className="text-white text-xl mb-5">{project.title}</CardTitle>
                  <CardDescription className="text-white/70 text-md">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1 mb-7">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <Badge 
                        key={techIndex}
                        variant="secondary" 
                        className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="bg-white/10 text-white/60 text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <a href={project.demo} target='main' className='mr-3'>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-" />
                      Live Demo
                    </Button>
                    </a>

                    <a href={project.github} className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 flex-1" target='main'>
                    <Button
                      size="sm"
                      variant="outline"
                      >
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </Button>
                    </a>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
};

export default ProjectsSection;
