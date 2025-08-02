import { useState , useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus,Pencil,Save,CodeXml,Trash2} from 'lucide-react';
import axios from 'axios';
import party  from 'party-js';


const Skills = () => {

   const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    
  const [suggestedTechsAi, setSuggestedTechsAi] = useState([]);
  const [isEdit,setisEdit] = useState(false)
  const [isDelete,setisDelete] = useState(false)
  const [disabled, setDisabled] = useState(true);
  const [isCheck,setisCheck] = useState(false)
  const [isbtn,setisbtn] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [techString,setTechString] = useState('')
  const [activeCard, setActiveCard] = useState("");
  const [activeBtn, setActiveBtn] = useState("");
  const [addC,setAddC] = useState(false);
  const [btn,setBtn]  = useState(false);
  const [update,setUpdate] = useState(true)


  const [newSkills,setNewSkills] = useState({
    category:'',
    skills:[]
  })


    const [skills, setSkills] = useState([]);

    const handleClick = () => {
      const btn = document.getElementById('confettiBtn');
      if (btn && techString.length>2) {
        party.confetti(btn, {
          count: party.variation.range(40, 60),
          spread: 70,
          speed: party.variation.range(500, 800),
        });
      }
    };
    

const fetchSugg = async (category:string) => {
  try {

    setIsLoading(true)
    setisbtn(false)

    const response = await axios.post(`${baseUrl}/api/tech-sugg?cat=${category}`)

    if(response.status == 200){
      setSuggestedTechsAi(response.data.Category);
      setActiveCard(category)
    } else {
      console.log("Not received suggestions");
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error,error.message);
  }  finally{
    setIsLoading(false)
    // setisCheck(false)
    setIsLoading1(true)
  }

};

const handleTechClick = (tech) => {
  const current = techString.split(',').map(t => t.trim());

  if (current.includes(tech)) return;

  const updated = [...current, tech].filter(Boolean).join(', ');
  setTechString(updated);
};




const handleAddSkills = async (category:string) => {
  if (!techString) {
    toast({
      title: "Error",
      description: "Please add some skills",
      variant: "destructive"
    });
    return;
  };

 try {
  const skillsArray = techString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const dataToSend = {
      category: category,
      skills: skillsArray,
    };
  const response = await axios.post(`${baseUrl}/api/add-skills`,dataToSend)
  if (response.status == 201){
    console.log("Project added",response.data.data)

    toast({
      title: "Skills Added",
      description: "Your new Skill has been added successfully.",
    });

    handleClick();

    setNewSkills({
      category:'',
      skills:[]
    })

    setIsLoading1(false)

     setTimeout(() => {
       window.location.reload();
     }, 1500);

   } else {
      console.log("Error adding skills")

  }

} catch (error) {
        console.log({error})

        toast({
          title: "SKills Does Not Added",
          description:error.response.data.message,
        });

       }
};




     useEffect(()=>{
       getSkills()
     },[])

const getSkills = async () => {

  try{
  const response = await axios.get(`${baseUrl}/api/get-skills`);
     if(response.status == 200){
       setSkills(response.data.Skills)
     } else {
       console.log("Skills Not Found");
     }
  } catch (error) {
    console.error("Error fetching skills:", error);
    toast({
      title: "No Skills Available",
      description: "Please add Skills to Fetch",
    });
  }
};



  const handleEditSkills = async (category:string) => {
    if (!techString) {
      toast({
        title: "Error",
        description: "Please add some skills",
        variant: "destructive"
      });
      return;
    };


  try {

    const skillsArray = techString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const dataToSend = {
      category: category,
      skills: skillsArray,
    };


  const response = await axios.put(`${baseUrl}/api/edit-skills`,dataToSend);
  if(response.status == 200){
    console.log("Skills Updated : ",response.data.Skills)
    toast({
      title: "Skills Updated",
      description: "The skills has been Updated Successfully.",
    });

    handleClick();
   
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
};



const handleDeleteSkills = async (category:string) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/del-skills`,{data:{category}})

    if(response.status == 200) {
      console.log("Skill Deleted",response.data.Ski)

      toast({
        title: "Skill Deleted",
        description: "The Skill has been removed from your portfolio.",
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
}

return(

 <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
       <CardHeader>
       <div className="flex items-center justify-between gap-5">
      <CardTitle className="text-white">Skills Management</CardTitle>
       <Button
         variant="outline"
         size="sm"
         onClick={() => {setisEdit(prev => !prev);
                        setActiveCard("");
                        setisCheck(false);
                        setAddC(false)
                        setDisabled(false);
                        setisDelete(false);
                        {isEdit && setTimeout(() => {
                          window.location.reload();
                        }, 500);}
                        }
                        }
         className={`border px-2 py-1 text-md ml-auto max-w-[100px] ${
           isEdit
             ? 'text-red-400 border-red-400 hover:bg-red-400/10'
             : 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
         }`}
       >
         <Pencil className="w-4 h-4 mr-1" />
         {isEdit ? "Cancel" : "Edit"}
       </Button>

       <Button
        size="sm"
        variant="outline"
        onClick={() => {setisDelete(prev => !prev);
                        setisEdit(false);
                        {isDelete && setTimeout(() => {
                          window.location.reload();
                        }, 500);}
                }}
        className="border-red-400/50 text-red-400 hover:bg-red-400/10"
      >
        <Trash2 className="w-3 h-3" />
        {isDelete ? "cancel": ""}
      </Button>
     </div>         

    <CardDescription className="text-white/70">
           Organize your skills by category
    </CardDescription>
   </CardHeader>

       <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {skills.map((skillCategory, index) => (
    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 ">

      <div className='flex items-center justify-between'>
      <h4 className="text-white font-semibold mb-3">{skillCategory.category}</h4>
      <input
          className="mr-5 w-4 h-4 rounded-full appearance-none border border-white/50 outline-none bg-transparent checked:bg-purple-500"
          disabled={disabled}
          type="checkbox"
          onChange={(e)=>{setActiveBtn(skillCategory.category);
                          setisCheck(e.target.checked);
                          setTechString(skillCategory.skills.join(', '));
                          setisbtn(true);
                        }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {skillCategory.skills.map((skill, skillIndex) => (
          <Badge key={skillIndex} variant="secondary" className="bg-blue-500/20 text-blue-300">
            {skill}
          </Badge>
        ))}
      </div>

     
       <div className="flex gap-2">
         <Input disabled={!isEdit}
            value={activeBtn === skillCategory.category && isCheck ? techString : ''}
            onChange={(e) => setTechString(e.target.value)}
             placeholder="Add new skill"
             className="bg-white/10 border-white/20 text-white text-sm"
           />
           <Button id='confettiBtn'
           disabled={!isEdit} onClick={()=>{update ? handleEditSkills(skillCategory.category) : 
                  handleAddSkills(skillCategory.category); }}
              size="sm" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
             <Plus className="w-3 h-3" />
           </Button>
         </div>

    <div className='flex flex-wrap gap-2 mt-5'>
    { activeBtn === skillCategory.category && isbtn && !isDelete && <Button onClick={()=>{fetchSugg(skillCategory.category)}}
     variant="outline"
     size="lg"
     className="h-7 mb-5 border border-blue-400/50 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-400/10 transition-all duration-300 transform hover:scale-105"
     >
     <CodeXml className="w-2 h-1" />
     Suggest
   </Button>}

      {activeBtn === skillCategory.category && isCheck && isDelete && <button
         className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-xl shadow-md transition duration-200"
         onClick={()=>handleDeleteSkills(activeBtn)}
       >
         Delete
       </button>}

   {isLoading && 
      <p className="text-sm text-muted-foreground mb-2 animate-pulse">
        Generating suggestions...
      </p>
    }
       {activeCard === skillCategory.category && isCheck && suggestedTechsAi.map((tech, index) => (
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
     ))}
   </div>

   {!addC && <Button 
    disabled={!isEdit}
     onClick={ () => {
       setAddC(true);
       setTechString('');  
     }
     }
     className="mt-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
   >
     <Save className="w-4 h-4 mr-2" />
     Add Category
   </Button>}

     {  addC && isEdit &&
      
      <div className='ml-1 mt-5'>
       <select className='rounded-xl bg-transparent border border-purple-300 text-white-800 px-4 py-2 pr-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
       onChange={(e) => {
        setNewSkills({ ...newSkills, category: e.target.value })
        setBtn(true)
        }}>
        <option className="bg-transparent text-purple-800">Category</option>
         <option className="bg-transparent text-purple-800">Frontend</option>
          <option className="bg-transparent text-purple-800">Backend</option>
          <option className="bg-transparent text-purple-800">Database</option>
          <option className="bg-transparent text-purple-800">Tools</option>
          <option className="bg-transparent text-purple-800">Other</option>
        </select>
       </div> 
      }

      { btn && 
        <Button onClick={()=>{fetchSugg(newSkills.category)}}
        variant="outline"
        size="lg"
        className="h-7 mt-5 border border-blue-400/50 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-400/10 transition-all duration-300 transform hover:scale-105"
        >
        <CodeXml className="w-2 h-1" />
        Suggest
      </Button>}

      {btn && <div className="flex gap-2 mt-5">
         <Input disabled={!isEdit}
            value={techString}
            onChange={(e) => setTechString(e.target.value)}
             placeholder="Add new skill"
             className="bg-white/10 border-white/20 text-white text-sm"
           />
           <Button  id="confettiBtn"
           disabled={!isEdit} onClick={()=>{
            handleAddSkills(newSkills.category);
           
            }}
              size="sm" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
             <Plus className="w-3 h-3" />
           </Button>
         </div>
        }

      {isLoading && 
      <p className="text-sm text-muted-foreground mb-2 animate-pulse">
        Generating suggestions...
      </p>
      }
      <div className="flex gap-2 mt-5 flex-wrap">
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
            className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-300 cursor-pointer w-max"
          >
            {tech}
          </Badge>
        </motion.div>
      ))}
      </div>

    
   

 </CardContent>
</Card>
);
};

export default Skills
