import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Code,Pencil, Edit, Trash2, Save} from 'lucide-react';
import axios from 'axios';
import party from 'party-js'


const Experience = () => {

const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
  const [suggestedTechsAi, setSuggestedTechsAi] = useState([]);
  const [isEdit,setisEdit] = useState(false)
  const [isEdit1,setisEdit1] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [techString,setTechString] = useState('')
  const [achievements,setAchievements] = useState('')
  const [editP,seteditP] = useState('')


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


  const [newExperience,setNewExperience] = useState({
    post:'',
    company:'',
    period:[],
    location:'',
    description:'',
    achievements:[],
    technologies:[]
  })
    const [experiences, setExperiences] = useState([]);

    const sorted = experiences.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const fetchSugg = async (post:string) => {
      try {

        setIsLoading(true)

        const response = await axios.post(`${baseUrl}/api/tech-sugg`,{post})
  
        if(response.status == 200){
          setSuggestedTechsAi(response.data.JobTech.technologies);
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

    const handleTechClick = (tech:string) => {
      const current = techString.split(',').map(t => t.trim());
    
      if (current.includes(tech)) return;
    
      const updated = [...current, tech].filter(Boolean).join(', ');
      setTechString(updated);
    };



      const handleAddExperince = async () => {
        if (!newExperience.post || !newExperience.description) {
          toast({
            title: "Error",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }
    
       try {

        const achieve = achievements.split(',').map(t=>t.trim()).filter(Boolean)
        const tech = techString.split(',').map(t=>t.trim()).filter(Boolean)

        const payload = {
          ...newExperience,
          achievements: achieve,
          technologies: tech
        };

        const response = await axios.post(`${baseUrl}/api/add-experience`,payload)
        if (response.status == 201){
          console.log("Experience added",response.data.data)

          toast({
            title: "Experience Added",
            description: "Your new Experience has been added successfully.",
          });

          handleClick();

          setNewExperience({
            post: '',
            description: '',
            achievements: [],
            location:'',
            period:[],
            company:'',
            technologies:[]
          });

          setIsLoading1(false)

          setTimeout(() => {
            window.location.reload();
          }, 1500);

        } else {
          console.log("Error adding Experience")

          toast({
            title: "Experience Does Not Added",
            description: "Your new Experience has not been added.",
          });

        }
       } catch (error) {
        console.log({error})
       }
};



      const fetchExperience = async (id:string) => {
        try {

          if(id.length>0) {
            const response = await axios.get(`${baseUrl}/api/get-experience?id=${id}`);
            if(response.status == 200){
              console.log("id",response.data.data)
              setNewExperience(response.data.data)
              seteditP(response.data.data._id)
              setisEdit(true)
             
            }
            
          } else {
            const response = await axios.get(`${baseUrl}/api/get-experience`);
             if(response.status == 200){
               setExperiences(response.data.data)
               console.log(response.data.data)
             } else {
               console.log("Experiences Not Found");
             }
          }
        } catch (error) {
          console.error("Error fetching Experiences:", error);
          toast({
            title: "No Experiences Available",
            description: "Please add Experiences to Fetch",
          });
        }
      };

      const handleEditExperience = async (id:string) => {
        fetchExperience(id)
      };

      const handleUpdateExperience = async (id:string) => {
        try {

          const achieve = achievements.split(',').map(t=>t.trim()).filter(Boolean)
        const tech = techString.split(',').map(t=>t.trim()).filter(Boolean)

        const payload = {
          ...newExperience,
          achievements: achieve,
          technologies: tech
        };

          const response = await axios.put(`${baseUrl}/api/edit-experience/${id}`,payload);

        if(response.status == 200){
          console.log("Experience Updated : ",response.data.data)
          toast({
            title: "Experience Updated",
            description: "The Experience has been Updated Successfully.",
          });

          handleClick();

          setNewExperience({
            post: '',
            description: '',
            achievements: [],
            location:'',
            period:[],
            company:'',
            technologies:[]
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

      const handleDeleteExperience = async (id: number) => {
        try {
          const response = await axios.delete(`${baseUrl}/api/del-experience/${id}`)

          if(response.status == 200) {
            console.log("Experience Deleted",response.data.project)

            toast({
              title: "Experience Deleted",
              description: "The Experience has been removed from your portfolio.",
            });
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
          else {
            console.log("Not Deleted, Something went wrong")
          }

        } catch (error) {
          console.log("Error",error.message)
        }
       
      };


      return(
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
          <CardTitle className="text-white">            
            {isEdit1 ? 'Update your Experience':'Add New Experience'}
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
          <CardDescription className="text-white/70">
            Manage your professional experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Post</label>
            <Input
            disabled={!isEdit}
              value={newExperience.post}
              onChange={(e) => setNewExperience({...newExperience, post: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Company</label>
            <Input
            disabled={!isEdit}
              value={newExperience.company}
              onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Company name"
            />
          </div>

          <div className='w-[500px]'>
            <label className="text-white/80 text-sm font-medium mb-2 block">Period</label>
            <div className='flex gap-40'>
            <p className='ml-5 text-white/80 text-sm font-medium mb-2 block'>From</p>
            <p className='ml-5 text-white/80 text-sm font-medium mb-2 block'>To</p>
            </div>
            <div className='flex'>
            <Input
            disabled={!isEdit}
              type='date'
              value={newExperience.period[0] || ""}
              onChange={(e) => setNewExperience({...newExperience, period: [e.target.value,newExperience.period[1]]})}
              className="ml-5 bg-white/10 border-white/20 text-white w-[150px]"
            />
            <Input
            disabled={!isEdit}
              type='text'
              value={newExperience.period[1] || ""}
              onChange={(e) => setNewExperience({...newExperience, period:[newExperience.period[0]||"",e.target.value]})}
              className="ml-5 ml-10 bg-white/10 border-white/20 text-white w-[172px]"
              placeholder='mm/dd/yyyy or Present'
            />
            </div>
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Location</label>
            <Input
            disabled={!isEdit}
              value={newExperience.location}
              onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Job Location"
            />
          </div>

          
          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Description</label>
            <Textarea
            disabled={!isEdit}
              value={newExperience.description}
              onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Job description"
              rows={3}
            />
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium mb-2 block">Achievements</label>
            <Textarea
            disabled={!isEdit}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Job Achievements"
              rows={3}
            />
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



          {(newExperience.description.length>20 && suggestedTechsAi.length=== 0) && 
          <Button onClick={()=>fetchSugg(newExperience.post)}
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

            
            {newExperience.description.length>10 && <div className="flex gap-2">
            <Button  id="confettiBtn"
              onClick={() => {isEdit1 ? handleUpdateExperience(editP.toString()) : handleAddExperince();
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEdit1 ? 'Update Experience' :'Add New Experience'}
            </Button>
            
          </div>}

           
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Your Experiences</CardTitle>
          <CardDescription className="text-white/70">
            Manage your portfolio experiences
          </CardDescription>

          {!experiences.length && <button
             onClick={() => fetchExperience("")}
             className="mx-auto mt-3 text-sm font-medium bg-transparent border border-blue-400/50 text-blue-400 hover:bg-blue-400/10 py-2 px-4 rounded flex items-center gap-2"
           >
             View Experience
           </button>}
        </CardHeader>

        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
          {sorted.map((experience) => (
              <div key={experience.id} className="p-6 bg-white/5 rounded-lg border border-white/10 mb-10">
                <div className="flex items-start justify-between mb-4">
                  <div className='w-[1000px]'>
                    <div className='flex'>
                    <h4 className="text-white font-semibold text-lg flex-grow">{experience.post}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {handleEditExperience(experience._id);setisEdit1(true);
                        setAchievements(experience.achievements.join(','))
                        setTechString(experience.technologies.join(','))
                      }}
                      className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 mr-5"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteExperience(experience._id)}
                      className="border-red-400/50 text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                     </div>
                    <p className="text-blue-400 font-medium mb-3">{experience.company}</p>
                    <p className="text-white/60 text-sm"><span className='mr-2'>{experience.period[0]} - {experience.period[1]}</span> • <span className='ml-2'> {experience.location}</span></p>
                  </div>
              </div>
              <p className='mt-5 mb-1 text-white'>Description:</p>
                <p className="text-white/70 mb-3">{experience.description}</p>
                <div className="space-y-1">
                <p className='mt-5 mb-3 text-white'>Achievements:</p>
                  {experience.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start text-white/60 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {achievement}
                    </div>
                  ))}
                </div>
                <p className='mt-5 mb-3 text-white'>Technologies:</p>
                {experience.technologies.map((tech: string, index: number) => (
                    <Badge
                      key={`${tech}-${index}`}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-300 text-xs mr-2 mb-2"
                    >
                      {tech}
                    </Badge>
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
      
      
    );
};

export default Experience
