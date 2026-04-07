import { useState , useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Pencil,Save,Plus,Trash2,XSquareIcon} from 'lucide-react';
import axios from 'axios';
import party from 'party-js'


const Profile = () => {

  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  
  const [isEdit,setisEdit] = useState(false);
  const [fields, setFields] = useState([{ title: '', value: '' ,icon:''}]);
  const [facts, setFacts] = useState([{fact:''}]);


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




  const handleAddField = (id:number) => {
    if (id===1) setFields([...fields, { title: '', value: '' ,icon:''}]);
    else setFacts([...facts,{fact:''}])
  };

  const handleRemoveField = (indexToRemove:number,id:number) => {
    let updatedFields;

    if ( id===1) {
      updatedFields = fields.filter((_, idx) => idx !== indexToRemove);
    setFields(updatedFields);
    } else {
    updatedFields = facts.filter((_, idx) => idx !== indexToRemove);
    setFacts(updatedFields);
    }
  };

  const handleChange = (index:number, key:string, val:string) => {
    const newFields = [...fields];
    newFields[index][key] = val;
    setFields(newFields);
  };


  useEffect(()=>{
    fetchAdmin();
  },[])


  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/getAdminDetails`)
      if (response.status == 200) {
        setProfileData(response.data.Admin)
        setFacts(response.data.Admin.facts.map(t=>({fact:t})))
        setFields(response.data.Admin.features)
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  const MAX_SIZE = 2 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
  toast({
    title: "Invalid file",
    description: "Only image files are allowed",
    variant: "destructive",
  });
  return;
}

  if (file.size > MAX_SIZE) {
    toast({
      title: "Image too large",
      description: "Please upload an image smaller than 2MB",
      variant: "destructive",
    });
    return;
  }

  const reader = new FileReader();

   reader.onloadend = () => {
    if (typeof reader.result === "string") {
      setProfileData((prev) => ({
        ...prev,
        profilePic: reader.result as string,
      }));
    }
  };

  reader.readAsDataURL(file);

  e.target.value = "";
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
    insta: '',
    profilePic:''
  });

  const handleProfileUpdate = async () => {

    const data = {
      ...profileData,
      features: fields,
      facts: facts.map(t => t.fact),
    };

    try {
      const response = await axios.post(`${baseUrl}/api/admin` , data);
        if (response.status == 201) {
          toast({
            title: "Profile Updated",
            description: "Your profile information has been saved successfully.",
          });

          handleClick();

          console.log(response.data.data)

          setTimeout(() => {
            window.location.reload()
          }, 500);
        }
    } catch (error) {

      toast({
        title: "Profile not Updated",
        description: "Your profile information has not been saved, try again!",
      });

      console.error('Error during update:', error);
      if (error.response) {
        console.error('Server Response:', error.response.data);
    }
  }

  setProfileData({
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
    insta: '',
    profilePic:''
  })
  
};


return(

    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">

            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-white text-3xl mb-5">Personal Information</CardTitle>
                <CardDescription className="text-white/70 text-1xl">
                  Update your personal details and contact information
                </CardDescription>
              </div>
            
              <Button
                variant="outline"
                size="sm"
                onClick={() => { 
                  setisEdit(prev => !prev);
                  fetchAdmin();
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
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">Name</label>
                    <Input
                      disabled={!isEdit}
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">Profession</label>
                    <Input
                      disabled={!isEdit}
                      value={profileData.profession}
                      onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-white/80 text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    disabled={!isEdit}
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium mb-2 block">About</label>
                  <Textarea
                    disabled={!isEdit}
                    value={profileData.about}
                    onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium mb-2 block">Journey</label>
                  <Textarea
                    disabled={!isEdit}
                    value={profileData.journey}
                    onChange={(e) => setProfileData({...profileData, journey: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>

        <div className="space-y-4">
        <label className="text-white/80 text-sm font-medium mb-2 block">Features</label>
            {fields.map((field, index) => (
              <div key={index} className="flex space-x-4">
               <Input
                 disabled={!isEdit}
                 value={field.title}
                 placeholder='Title'
                 onChange={(e) => handleChange(index,'title',e.target.value)}
                 className="bg-white/10 border-white/20 text-white"
                    />
                <Input
                 disabled={!isEdit}
                 value={field.value}
                 placeholder='value'
                 onChange={(e) => handleChange(index,'value',e.target.value)}
                 className="bg-white/10 border-white/20 text-white"
                    />

                <Input
                 disabled={!isEdit}
                 value={field.icon}
                 placeholder='Icon'
                 onChange={(e) => handleChange(index,'icon',e.target.value)}
                 className="bg-white/10 border-white/20 text-white w-[75px]"
                    />

            {fields.length > 1 && (
             <Button
             disabled={!isEdit}
             size="sm"
             variant="outline"
             onClick={() => {
                      handleRemoveField(index,1)
                     }}
             className="border-red-400/50 text-red-400 hover:bg-red-400/10"
           >
             <Trash2 className="w-3 h-3" />
           </Button>
          )}
              </div>
            ))}
      
                  <Button
                  disabled={!isEdit}
                  onClick={ () => {
                    handleAddField(1) ;
                  }
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus></Plus>
                  ADD
                </Button>

          </div>



          <div className="space-y-4">
        <label className="text-white/80 text-sm font-medium mb-2 block">Quick Facts</label>
            {facts.map((fact, index) => (
              <div key={index} className="flex space-x-4">
               <Input
                 disabled={!isEdit}
                 value={fact.fact}
                 placeholder='Title'
                 onChange={(e) => {
                  const updatedFacts = [...facts];
                 updatedFacts[index].fact = e.target.value;
                 setFacts(updatedFacts);
                          }}
                 className="bg-white/10 border-white/20 text-white"
                    />

            {facts.length > 1 && (
             <Button
             disabled={!isEdit}
             size="sm"
             variant="outline"
             onClick={() => {
                      handleRemoveField(index,0)
                     }}
             className="border-red-400/50 text-red-400 hover:bg-red-400/10"
           >
             <Trash2 className="w-3 h-3" />
           </Button>
          )}
              </div>
            ))}
      
                  <Button
                  disabled={!isEdit}
                  onClick={ () => {
                    handleAddField(0) ;
                  }
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus></Plus>
                  ADD
                </Button>

          </div>

            <p className="text-white/80 text-md font-medium mb-2 block">Socials</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">Email</label>
                    <Input
                      disabled={!isEdit}
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">Contact</label>
                    <Input
                      disabled={!isEdit}
                      value={profileData.contact}
                      onChange={(e) => setProfileData({...profileData, contact: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium mb-2 block">Location</label>
                  <Input
                    disabled={!isEdit}
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">GitHub</label>
                    <Input
                      disabled={!isEdit}
                      value={profileData.github}
                      onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">LinkedIn</label>
                    <Input
                      disabled={!isEdit}
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">Instagram</label>
                    <Input
                      disabled={!isEdit}
                      value={profileData.insta}
                      onChange={(e) => setProfileData({...profileData, insta: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">Profile Picture</label>
                   <Input
                  type="file"
                  disabled={!isEdit}
                  onChange={handleFileChange}
                  className="bg-white/10 border-white/20 text-white"
                />
                  </div>
                </div>
                 <div>
                    {profileData.profilePic && (
                    <div className="relative w-64 h-64 rounded-xl overflow-hidden border border-white/20 bg-white/5">
                      <img
                        src={profileData.profilePic}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    <button
                    disabled={!isEdit}
                       type="button"
                       onClick={() =>
                         setProfileData((prev) => ({
                           ...prev,
                           profilePic: "",
                         }))
                       }
                       className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md shadow-md pointer:cursor"
                     >
                        <XSquareIcon className="w-3 h-3" />
                     </button>
                    </div>
                  )}
                  </div>

                <Button  id="confettiBtn"
                  disabled={!isEdit}
                  onClick={ () => {
                    handleProfileUpdate() ;
                    setisEdit(false);
                  }
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
);
};


export default Profile;
