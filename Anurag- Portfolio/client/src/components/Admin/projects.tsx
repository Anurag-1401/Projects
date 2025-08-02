import { useState , useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ExternalLink,Github,Edit, Trash2, Save,Code,Pencil} from 'lucide-react';
import axios from 'axios';
import party from 'party-js'


const Projects = () => {

  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
  const [suggestedTechsAi, setSuggestedTechsAi] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [orLoading,setOrLoading] = useState(true)
  const [thumbLod,setThumbLod] =useState(false)
  const [projects,setProjects] = useState([]);
  const [isEdit,setisEdit] = useState(false)
  const [editP,seteditP] = useState('')
  const [techString,setTechString] = useState('')


      const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        technologies: [],
        demo: '',
        github: '',
        thumbnail:null,
        featured: false
      });


const handleClick = () => {
      const btn = document.getElementById('confettiBtn');
      if (btn) {
        party.confetti(btn, {
          count: party.variation.range(40, 60),
          spread: 70,
          speed: party.variation.range(500, 800),
        });
      }
    };



      
      const fetchSugg = async (title,description) => {
        try {

          setIsLoading(true)

          const response = await axios.post(`${baseUrl}/api/tech-sugg`,{title,description})
    
          if(response.status == 200){
            setSuggestedTechsAi(response.data.tech);
          } else {
            console.log("Not received suggestions");
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error,error.message);
        }  finally{
          setIsLoading(false)
          setIsLoading1(true)
        }
      };
    
      const handleTechClick = (tech) => {
        const current = techString.split(',').map(t => t.trim());
      
        if (current.includes(tech)) return;
      
        const updated = [...current, tech].filter(Boolean).join(', ');
        setTechString(updated);
      };
      
      
      useEffect(() => {
        setThumbLod(newProject.demo.length > 20);
      }, [newProject.demo]);
      

      const fetchThumbnail = async () => {
        try {
          setIsLoading2(true)
          setOrLoading(false)
          const res = await axios.get(`https://api.microlink.io/?url=${newProject.demo}&screenshot=true`);
          setNewProject({...newProject,thumbnail:res.data?.data?.screenshot?.url});          
        } catch (err) {
          console.error('Error fetching thumbnail', err);

          toast({
            title: "Error Fetching Thumbnail",
            description: "Please try manual upload!",
            variant: "destructive"
          });

        } finally{
          setIsLoading2(false)
          setThumbLod(false)
        }
      };

    

      const handleAddProject = async () => {
        if (!newProject.title || !newProject.description) {
          toast({
            title: "Error",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }
    
       try {
        
        const payload = {
          ...newProject,
          technologies: techString.split(',').map(t=>t.trim()).filter(Boolean)
        };
        const response = await axios.post(`${baseUrl}/api/add-project`,payload)
        if (response.status == 201){
          console.log("Project added",response.data.data)

          toast({
            title: "Project Added",
            description: "Your new project has been added successfully.",
          });
          handleClick();


          setNewProject({
            title: '',
            description: '',
            technologies: [],
            demo: '',
            github: '',
            thumbnail:null,
            featured: false
          });

          setIsLoading1(false)

          setTimeout(() => {
            window.location.reload();
          }, 1500);

        } else {
          console.log("Error adding project")

          toast({
            title: "Project Does Not Added",
            description: "Your new project has not been added.",
          });

        }
       } catch (error) {
        console.log({error})
       }
};



      const fetchProjects = async (id:string) => {
        try {

          if(id.length>0) {
            const response = await axios.get(`${baseUrl}/api/get-projects?id=${id}`);
            if(response.status == 200){
              console.log("id",response.data.project)
              setNewProject(response.data.project)
              seteditP(response.data.project._id)
              setisEdit(true)
            }
            
          } else {
            const response = await axios.get(`${baseUrl}/api/get-projects`);
             if(response.status == 200){
               setProjects(response.data.project)
               console.log(response.data.project)
             } else {
               console.log("Projects Not Found");
             }
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
          toast({
            title: "No Projects Available",
            description: "Please add Projects to Fetch",
          });
        }
      };

      const handleEditProject = async (id:string) => {
        fetchProjects(id)
      };

      const handleUpdateProject = async (id:string) => {
        try {

          const payload = {
            ...newProject,
            technologies: techString.split(',').map(t=>t.trim()).filter(Boolean)
          };

          const response = await axios.put(`${baseUrl}/api/edit-projects/${id}`,payload);

        if(response.status == 200){
          console.log("Project Updated : ",response.data.project)
          toast({
            title: "Project Updated",
            description: "The project has been Updated Successfully.",
          });

          handleClick();


          setNewProject({
            title: '',
            description: '',
            technologies: [],
            demo: '',
            github: '',
            thumbnail:null,
            featured: false
          });

          setisEdit(false)

          setTimeout(() => {
            window.location.reload();
          }, 1500);


        } else {
          console.log("Not updated")
        }
        } catch (error) {
          console.log("Error",error)
        }
      }

      const handleDeleteProject = async (id: number) => {
        try {
          const response = await axios.delete(`${baseUrl}/api/del-project/${id}`)

          if(response.status == 200) {
            console.log("Project Deleted",response.data.project)

            toast({
              title: "Project Deleted",
              description: "The project has been removed from your portfolio.",
            });
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
          else {
            console.log("Not Deleted, Something went wrong")
          }

        } catch (error) {
          console.log("Error",error)
        }
       
      };
  
      return(

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
        <div className="flex items-center justify-between w-full mb-4">
        <CardTitle className="text-white">
            Add New Project
        </CardTitle>
            <Button
                variant="outline"
                size="sm"
                onClick={() => { 
                  setisEdit(prev => !prev);
                  {isEdit && setTimeout(() => {
                    window.location.reload();
                  }, 500);}
                }
                }
                className={`border ${
                  isEdit
                    ? 'text-red-400 border-red-400 hover:bg-red-400/10'
                    : 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
                }`}
              >
                <Pencil className="w-4 h-4 mr-0.5" />
                {isEdit ? "Cancel" : "Edit"}
              </Button>
          
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Title</label>
            <Input
              disabled={!isEdit}
              value={newProject.title}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Project title"
            />
          </div>
          
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Description</label>
            <Textarea
               disabled={!isEdit}
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Project description"
              rows={3}
            />
          </div>

          {(newProject.description.length>20 && suggestedTechsAi.length=== 0) && <Button onClick={()=>fetchSugg(newProject.title,newProject.description)}
              variant="outline"
              size="lg"
              className="h-8 border border-blue-400/50 text-blue-400 text-xs px-2 py-1 rounded-full hover:bg-blue-400/10 transition-all duration-300 transform hover:scale-105"
              >
              <Code className="w-2 h-1" />
              Get Suggestions
            </Button>}

          <div className="mb-4">
          {isLoading  && <p className="text-sm font-medium text-muted-foreground mb-2">Common Technologies</p>}
            <div className="flex flex-wrap gap-2">
            {isLoading && 
               <p className="text-sm text-muted-foreground mb-2 animate-pulse">
                 Generating suggestions...
               </p>
             }
              {isLoading1 && suggestedTechsAi.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
                    onClick={() => handleTechClick(tech)}
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-300 cursor-pointer"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
          



          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Technologies</label>
            <Input
               disabled={!isEdit}
                value={techString}
                onChange={(e) => setTechString(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/80 text-sm font-medium mb-2 block">Live URL</label>
              <Input
                 disabled={!isEdit}
                value={newProject.demo}
                onChange={ (e) => {
                  setNewProject({...newProject, demo: e.target.value});
                }}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="text-white/80 text-sm font-medium mb-2 block">GitHub URL</label>
              <Input
                 disabled={!isEdit}
                value={newProject.github}
                onChange={(e) => setNewProject({...newProject, github: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>


          { thumbLod && 
         
            <Button onClick={()=>fetchThumbnail()}
              variant="outline"
              size="lg"
              className="h-9 border border-blue-400/50 text-blue-400 text-xs px-3 py-1 rounded-full hover:bg-blue-400/10 transition-all duration-300 transform hover:scale-105"
              >
              <Code className="w-2 h-1" />
              Get Thumbnail
            </Button>
            }

           { orLoading && newProject.demo.length>20 && <p className='text-white'>OR</p>}

          {isLoading2 ? (
             <p className="text-sm text-muted-foreground">Fetching thumbnail...</p>
           ) : newProject.thumbnail ?(
             <div className="my-2">
               <p className="text-sm text-muted-foreground mb-1">Fetched Thumbnail:</p>
               <img
                 src={newProject.thumbnail}
                 alt="Fetched thumbnail"
                 style={{ width: '100%', height: 'auto' }}
                 className="w-32 h-auto rounded shadow"
               />
             </div>
           ) : newProject.demo.length>20 && (
            <div className="my-2 w-full max-w-[200px]">
               <label htmlFor="manualThumbnail" className="text-sm text-muted-foreground block mb-1">
                 Upload Thumbnail:
               </label>
               <Input
                 type="file"
                 accept="image/*"
                 id="manualThumbnail"
                 onChange={(e) =>
                   setNewProject({ ...newProject, thumbnail: e.target.files[0] })
                 }
                 className="text-sm file:text-sm file:py-0.5 file:px-2 file:border-gray-300"
               />
             </div>
           )}
             
             
             
             <div className="flex items-center space-x-2 my-2">
               <input
                 disabled={!isEdit}
                 type="checkbox"
                 id="featured"
                 checked={newProject.featured}
                 onChange={(e) =>
                   setNewProject({ ...newProject, featured: e.target.checked })
                 }
                 className="h-4 w-4 accent-blue-500"
               />
               <label htmlFor="featured" className="text-white/80 text-sm">
                 Featured Project
               </label>
             </div>
             
          {newProject.demo.length>20 && <div className="flex gap-2">
            <Button  id="confettiBtn"
              onClick={() => {isEdit ? handleUpdateProject(editP.toString()) : handleAddProject();
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? 'Update Project' :'Add Project'}
            </Button>
            
          </div>}
        </CardContent>
      </Card>



        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Your Projects</CardTitle>
          <CardDescription className="text-white/70">
            Manage your portfolio projects
          </CardDescription>
          {!projects.length && <button
             onClick={() => fetchProjects("")}
             className="mx-auto mt-3 text-sm font-medium bg-transparent border border-blue-400/50 text-blue-400 hover:bg-blue-400/10 py-2 px-4 rounded flex items-center gap-2"
           >
             View Projects
           </button>}
        </CardHeader>

        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-white/5 rounded-lg border border-white/10 mb-10">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold">{project.title}</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {handleEditProject(project._id);
                        setTechString(project.technologies.join(','))
                      }}
                      className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProject(project._id)}
                      className="border-red-400/50 text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {project.featured && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-2">
                    Featured
                  </Badge>
                )}
                <p className="text-white/70 text-sm mb-2">{project.description}</p>
                {project.technologies.map((tech: string, index: number) => (
                    <Badge
                      key={`${tech}-${index}`}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-300 text-xs mr-2 mb-2"
                    >
                      {tech}
                    </Badge>
                  ))}

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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      );

};

export default Projects
